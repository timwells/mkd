<template>
  <div class="lw-chart-wrap">
    <div ref="chartContainer" class="lw-chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted, onBeforeUnmount, shallowRef, nextTick } from 'vue'
import { createChart, LineSeries, type ISeriesApi, type MouseEventParams, type LogicalRange } from 'lightweight-charts'
import { useMtplStore } from '@/stores/mtpl'

defineOptions({ name: 'LightweightChartMtplMulti' })

type LineSeriesApi = ISeriesApi<'Line'>

const props = defineProps<{
  tickers: string[]
  type?: 'line' | 'area'
  height?: number
}>()

const emit = defineEmits<{
  (e: 'zoom-changed', payload: { from: any; to: any } | null): void
  (e: 'visible-logical-range', payload: LogicalRange | null): void
}>()

const chartHeight = props.height ?? 600
const store = useMtplStore()

function itemFor(ticker: string) {
  return store.getByTicker(ticker)
}

// ---------- Refs ----------
const chartContainer = ref<HTMLElement | null>(null)
const chart = shallowRef<any>(null)

const seriesMap = reactive(
  new Map<
    string,
    {
      main?: LineSeriesApi
      ma50?: LineSeriesApi
      ma100?: LineSeriesApi
      ma200?: LineSeriesApi
      visible: boolean
    }
  >(),
)

let resizeObserver: ResizeObserver | null = null
let subCrosshairUnsub: (() => void) | null = null
let subVisibleRangeUnsub: (() => void) | null = null

// ---------- Styling ----------
function colorFor(ticker: string, type: 'main' | 'ma50' | 'ma100' | 'ma200' = 'main') {
  let hash = 0
  for (let i = 0; i < ticker.length; i++) hash = (hash << 5) - hash + ticker.charCodeAt(i)
  const hue = Math.abs(hash) % 360

  const variants = {
    main: `hsl(${hue}, 70%, 50%)`,
    ma50: `hsl(${hue}, 70%, 40%)`,
    ma100: `hsl(${hue}, 70%, 55%)`,
    ma200: `hsl(${hue}, 70%, 65%)`,
  }
  return variants[type] || variants.main
}

function displayName(ticker: string, suffix = '') {
  const item = itemFor(ticker)
  const base = item?.name ?? ticker
  return suffix ? `${base} (${suffix})` : base
}

// ---------- Series Management ----------
function addSeriesForTicker(ticker: string) {
  if (!chart.value || seriesMap.has(ticker)) return

  const item = itemFor(ticker)
  if (!item) return

  const entry = {
    visible: true,
    main: null,
    ma50: null,
    ma100: null,
    ma200: null,
  }

  seriesMap.set(ticker, entry as any)

  // Main Series
  const mainSeries = chart.value.addSeries(LineSeries, {
    title: displayName(ticker),
    color: colorFor(ticker, 'main'),
    lineWidth: 2,
    priceFormat: { type: 'price', precision: 2 },
    lastValueVisible: true,
    priceLineVisible: true,
  })
  mainSeries.setData(item.data || [])
  entry.main = mainSeries

  // MA50
  if (item.MA50?.data?.length) {
    const ma50 = chart.value.addSeries(LineSeries, {
      title: displayName(ticker, 'MA50'),
      color: colorFor(ticker, 'ma50'),
      lineWidth: 1.5,
      lineStyle: 2, // dashed
      priceLineVisible: false,
      lastValueVisible: false,
    })
    ma50.setData(item.MA50.data.filter((d: any) => d.value !== null))
    entry.ma50 = ma50
  }

  // MA100
  if (item.MA100?.data?.length) {
    const ma100 = chart.value.addSeries(LineSeries, {
      title: displayName(ticker, 'MA100'),
      color: colorFor(ticker, 'ma100'),
      lineWidth: 1.5,
      lineStyle: 2,
      priceLineVisible: false,
      lastValueVisible: false,
    })
    ma100.setData(item.MA100.data.filter((d: any) => d.value !== null))
    entry.ma100 = ma100
  }

  // MA200 (prominent)
  if (item.MA200?.data?.length) {
    const ma200 = chart.value.addSeries(LineSeries, {
      title: displayName(ticker, 'MA200'),
      color: colorFor(ticker, 'ma200'),
      lineWidth: 1.5,
      lineStyle: 2, // dash
      priceLineVisible: true,
      lastValueVisible: true,
    })
    ma200.setData(item.MA200.data.filter((d: any) => d.value !== null))
    entry.ma200 = ma200
  }
}

function removeSeriesForTicker(ticker: string) {
  const entry = seriesMap.get(ticker)
  if (!entry || !chart.value) return
  ;[entry.main, entry.ma50, entry.ma100, entry.ma200].forEach((series) => {
    if (series) {
      try {
        chart.value.removeSeries(series)
      } catch (e) {
        console.error(e)
      }
    }
  })

  seriesMap.delete(ticker)
}

// ---------- Crosshair & Hover ----------
const hoverValues = reactive<Record<string, string | null>>({})

function handleCrosshairMove(param: MouseEventParams) {
  if (!param?.time || !param.point) {
    props.tickers.forEach((t) => {
      hoverValues[t] = null
    })
    return
  }

  props.tickers.forEach((ticker) => {
    const entry = seriesMap.get(ticker)
    if (!entry?.visible) {
      hoverValues[ticker] = null
      return
    }

    const value: number | null = null
    const candidates = [entry.main, entry.ma50, entry.ma100, entry.ma200].filter(Boolean)

    //for (const series of candidates) {
    //const data = param.seriesData?.get(series!)
    //if (data && typeof data?.value === 'number') {
    // value = data?.value
    //  break
    //}
    //}

    // hoverValues[ticker] = value !== null ? value.toFixed(2) : '—'
    hoverValues[ticker] = value !== null ? value : '—'
  })
}

// ---------- Chart Setup ----------
function initChart() {
  if (!chartContainer.value) return

  chart.value = createChart(chartContainer.value, {
    layout: { background: { color: '#ffffff' }, textColor: '#333' },
    grid: { vertLines: { color: '#eaeaea' }, horzLines: { color: '#eaeaea' } },
    crosshair: { mode: 1 },
    timeScale: { rightOffset: 12, barSpacing: 6 },
    handleScroll: { vertTouchDrag: false },
    width: chartContainer.value.clientWidth,
    height: chartHeight,
  })

  props.tickers.forEach((t) => addSeriesForTicker(t))

  subCrosshairUnsub = chart.value.subscribeCrosshairMove(handleCrosshairMove)
  subVisibleRangeUnsub = chart.value.timeScale().subscribeVisibleTimeRangeChange((range: any) => {
    emit('zoom-changed', range ? { from: range.from, to: range.to } : null)
    emit('visible-logical-range', chart.value.timeScale().getVisibleLogicalRange())
  })

  nextTick(() => chart.value.timeScale().fitContent())
}

function enableResize() {
  if (!chartContainer.value) return
  resizeObserver = new ResizeObserver(() => {
    if (chart.value && chartContainer.value) {
      chart.value.resize(chartContainer.value.clientWidth, chartHeight)
    }
  })
  resizeObserver.observe(chartContainer.value)
  chartContainer.value.style.height = `${chartHeight}px`
}

// ---------- Watchers ----------
watch(
  () => props.tickers,
  async (newTickers, oldTickers = []) => {
    const toAdd = newTickers.filter((t) => !seriesMap.has(t))
    const toRemove = oldTickers.filter((t) => !newTickers.includes(t))

    for (const t of toAdd) {
      if (!itemFor(t)) await store.getHistoricalSeries(t)
      addSeriesForTicker(t)
    }
    for (const t of toRemove) removeSeriesForTicker(t)

    nextTick(() => chart.value?.timeScale()?.fitContent())
  },
  { immediate: true },
)

watch(
  () => props.tickers.map((t) => store.getByTicker(t)),
  (items) => {
    items.forEach((item, i) => {
      const ticker = props.tickers[i]
      if (!item || !seriesMap.has(ticker)) return

      const entry = seriesMap.get(ticker)!
      entry.main?.setData(item.data || [])
      entry.ma50?.setData(item.MA50?.data?.filter((d: any) => d.value !== null) || [])
      entry.ma100?.setData(item.MA100?.data?.filter((d: any) => d.value !== null) || [])
      entry.ma200?.setData(item.MA200?.data?.filter((d: any) => d.value !== null) || [])
    })
    nextTick(() => chart.value?.timeScale()?.fitContent())
  },
  { deep: true },
)

// ---------- Lifecycle ----------
onMounted(() => {
  initChart()
  enableResize()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  subCrosshairUnsub?.()
  subVisibleRangeUnsub?.()
  chart.value?.remove()
  chart.value = null
})
</script>

<style scoped>
.lw-chart-wrap {
  position: relative;
  width: 100%;
  height: v-bind(chartHeight + 'px');
}
.lw-chart {
  width: 100%;
  height: 100%;
}
</style>
