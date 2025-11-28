<template>
  <div class="lw-chart-wrap">
    <div ref="chartContainer" class="lw-chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, shallowRef, nextTick, defineOptions } from 'vue'

import {
  createChart,
  LineSeries,
  AreaSeries,
  BarSeries,
  HistogramSeries,
  BaselineSeries,
  type ISeriesApi,
  type MouseEventParams,
  type LogicalRange,
} from 'lightweight-charts'

import { useMfStore } from '@/stores/mf'

defineOptions({ name: 'LightweightChartMfMulti' })

type AnySeries =
  | ISeriesApi<'Line'>
  | ISeriesApi<'Area'>
  | ISeriesApi<'Histogram'>
  | ISeriesApi<'Candlestick'>
  | ISeriesApi<'Baseline'>

// ---------- Props & Emits ----------
const props = defineProps<{
  tickers: string[]
  type?: 'line' | 'area' | 'bar' | 'histogram' | 'baseline'
  height?: number
}>()

const emit = defineEmits<{
  (e: 'zoom-changed', payload: { from: any; to: any } | null): void
  (e: 'visible-logical-range', payload: LogicalRange | null): void
}>()

const chartType = props.type ?? 'line'
const chartHeight = props.height ?? 600

// ---------- Pinia store ----------
const store = useMfStore()

// helper to map tickers -> store item
function itemFor(ticker: string) {
  return store.getByTicker(ticker)
}

// ---------- DOM & chart references ----------
const chartContainer = ref<HTMLElement | null>(null)
const chart = shallowRef<any>(null)
const seriesMap = reactive(new Map<string, { instance: AnySeries | null; opts: any; visible: boolean }>())
let resizeObserver: ResizeObserver | null = null
let subCrosshairUnsub: (() => void) | null = null
let subVisibleRangeUnsub: (() => void) | null = null

// ---------- Series factory ----------
const SERIES_TYPE_MAP: Record<string, any> = {
  line: LineSeries,
  area: AreaSeries,
  bar: BarSeries,
  histogram: HistogramSeries,
  baseline: BaselineSeries,
}

function seriesDef(type: string) {
  return SERIES_TYPE_MAP[type] || LineSeries
}

// deterministic color generator
function colorFor(ticker: string) {
  let hash = 0
  for (let i = 0; i < ticker.length; i++) hash = (hash << 5) - hash + ticker.charCodeAt(i)
  const hue = Math.abs(hash) % 360
  return `hsl(${hue}, 65%, 45%)`
}

// displayName: prefer store.name, fallback to ticker
function displayName(ticker: string) {
  const it = itemFor(ticker)
  return it?.name ?? ticker
}

// hover values per ticker (updated from subscribeCrosshairMove)
const hoverValues = reactive<Record<string, string | null>>({})

function hoverValueDisplay(ticker: string) {
  return hoverValues[ticker] ?? '—'
}

// create & add a series for a ticker (keeps opts for toggling)
function addSeriesForTicker(ticker: string) {
  if (!chart.value) return
  if (seriesMap.has(ticker) && seriesMap.get(ticker)!.visible) return

  const SeriesClass = seriesDef(chartType)
  const opts: any = {
    title: displayName(ticker),
    color: colorFor(ticker),
    lineWidth: 1,
    priceFormat: { type: 'price', precision: 2 },
  }

  const instance = chart.value.addSeries(SeriesClass, opts)
  // initial data if present
  const item = itemFor(ticker)
  if (item?.data && item.data.length) {
    instance.setData(item.data)
  }
  seriesMap.set(ticker, { instance, opts, visible: true })
}

// remove a series for a ticker (keeps opts/data)
function removeSeriesForTicker(ticker: string) {
  const rec = seriesMap.get(ticker)
  if (!rec || !rec.instance) return
  try {
    chart.value.removeSeries(rec.instance)
  } catch (e) {
    // ignore
  }
  rec.instance = null
  rec.visible = false
  seriesMap.set(ticker, rec)
}

// toggle visibility (remove/add)
function toggleVisibility(ticker: string) {
  const rec = seriesMap.get(ticker)
  if (!rec) {
    // not created yet -> add
    addSeriesForTicker(ticker)
    return
  }
  if (rec.visible) {
    // store instance and remove
    // also cache data from store to allow re-adding
    removeSeriesForTicker(ticker)
  } else {
    // re-add series using saved opts
    const SeriesClass = seriesDef(chartType)
    const instance = chart.value.addSeries(SeriesClass, rec.opts)
    // restore data if available in store
    const item = itemFor(ticker)
    if (item?.data && item.data.length) instance.setData(item.data)
    rec.instance = instance
    rec.visible = true
    seriesMap.set(ticker, rec)
  }
}

// check if visible
function isVisible(ticker: string) {
  const rec = seriesMap.get(ticker)
  return rec ? rec.visible : false
}

// ---------- Chart init ----------
function initChart() {
  if (!chartContainer.value) return

  chart.value = createChart(chartContainer.value, {
    layout: {
      background: { color: '#ffffff' },
      textColor: '#333',
    },
    grid: {
      vertLines: { color: '#eaeaea' },
      horzLines: { color: '#eaeaea' },
    },
    timeScale: {
      rightOffset: 6,
      barSpacing: 8,
    },
  })

  // create series for each ticker
  props.tickers.forEach((t) => {
    addSeriesForTicker(t)
  })

  // subscribe crosshair
  subCrosshairUnsub = chart.value.subscribeCrosshairMove((param: MouseEventParams) => {
    handleCrosshairMove(param)
  })

  // subscribe visible time range change -> emit zoom-changed
  // note: timeScale API has subscribeVisibleTimeRangeChange
  if (chart.value.timeScale && chart.value.timeScale().subscribeVisibleTimeRangeChange) {
    subVisibleRangeUnsub = chart.value.timeScale().subscribeVisibleTimeRangeChange((range: any) => {
      // range is { from: {time}, to: {time} } or null
      emit('zoom-changed', range ? { from: range.from, to: range.to } : null)
      // also emit logical range when available
      try {
        const logical = chart.value.timeScale().getVisibleLogicalRange?.()
        emit('visible-logical-range', logical ?? null)
      } catch (e) {
        /* ignore */
      }
    })
  }

  // initial fit if data present
  nextTick(() => {
    chart.value.timeScale().fitContent()
  })
}

// ---------- Crosshair handler ----------
function handleCrosshairMove(param: MouseEventParams) {
  // param.seriesData is a Map from ISeriesApi -> data item for hovered time (or undefined)
  if (!param) return
  // If crosshair is outside chart, param.point may be undefined or negative
  if (!param.time || !param.point) {
    // clear hover values
    props.tickers.forEach((t) => (hoverValues[t] = null))
    return
  }

  // For each ticker, read seriesData
  props.tickers.forEach((t) => {
    const rec = seriesMap.get(t)
    if (!rec || !rec.visible || !rec.instance) {
      hoverValues[t] = null
      return
    }
    const seriesData = param.seriesData?.get(rec.instance)
    if (!seriesData) {
      hoverValues[t] = '—'
      return
    }

    // read the most useful value depending on series type
    // try common fields
    const v =
      (seriesData as any).value ??
      (seriesData as any).close ??
      (seriesData as any).high ??
      (seriesData as any).average ??
      null

    hoverValues[t] = v !== null && v !== undefined ? formatNumber(v) : '—'
  })
}

// small formatting helper
function formatNumber(x: number | string) {
  if (x === null || x === undefined) return '—'
  if (typeof x !== 'number') {
    const n = Number(x)
    if (Number.isNaN(n)) return String(x)
    x = n
  }
  // choose precision sensibly
  if (Math.abs(x) >= 100) return x.toFixed(0)
  if (Math.abs(x) >= 1) return (x as number).toFixed(2)
  return (x as number).toFixed(4)
}

// ---------- Resize handling ----------
function enableResize() {
  if (!chartContainer.value) return
  resizeObserver = new ResizeObserver((entries) => {
    if (!entries.length || !chart.value) return
    const { width, height } = entries[0].contentRect
    chart.value.resize(width, height)
  })
  resizeObserver.observe(chartContainer.value)

  // set initial height/width
  nextTick(() => {
    if (!chart.value || !chartContainer.value) return
    chartContainer.value.style.height = `${chartHeight}px`
    const rect = chartContainer.value.getBoundingClientRect()
    chart.value.resize(rect.width, rect.height)
  })
}

// ---------- Watch store data and props.tickers ----------
watch(
  () => props.tickers,
  async (newTickers, oldTickers) => {
    // ensure store has data for each ticker, create series for new tickers
    for (const t of newTickers) {
      if (!itemFor(t)) {
        await store.getHistoricalSeries(t)
      }
      if (!seriesMap.has(t)) addSeriesForTicker(t)
    }

    // remove series no longer in tickers
    if (oldTickers) {
      for (const t of oldTickers) {
        if (!newTickers.includes(t) && seriesMap.has(t)) {
          const rec = seriesMap.get(t)
          if (rec?.instance) {
            try {
              chart.value.removeSeries(rec.instance)
            } catch (e) {
              console.log(e)
            }
          }
          seriesMap.delete(t)
          delete hoverValues[t]
        }
      }
    }

    // after add/remove, fit content
    chart.value?.timeScale()?.fitContent?.()
  },
  { immediate: true },
)

// watch store updates for each ticker and update series data
watch(
  () => props.tickers.map((t) => store.getByTicker(t)),
  (items) => {
    items.forEach((item, idx) => {
      const t = props.tickers[idx]
      const rec = seriesMap.get(t)
      if (!rec) return
      // update title if name changed
      if (rec.instance && item?.name) {
        rec.instance.applyOptions?.({ title: item.name })
      }
      // update data if present
      if (rec.instance && item?.data) {
        rec.instance.setData(item.data)
      }
    })
    chart.value?.timeScale()?.fitContent?.()
  },
  { deep: true },
)

function clearHoverRow(_ticker: string) {
  // no-op for now
}

// ---------- utility to show hover value if present else latest data ----------
function determineCurrentDisplayValue(ticker: string) {
  // prefer hover value
  if (hoverValues[ticker]) return hoverValues[ticker]
  const it = itemFor(ticker)
  const last = it?.data?.length ? it.data[it.data.length - 1] : null
  if (!last) return '—'
  const v = last.value ?? last.close ?? last
  return v !== undefined ? formatNumber(v) : '—'
}

function hoverValueDisplayFallback(ticker: string) {
  return determineCurrentDisplayValue(ticker)
}

// wrapper used by template
//function hoverValueDisplay(ticker: string) {
// show hovered if present, otherwise last data point
//  return hoverValues[ticker] ?? hoverValueDisplayFallback(ticker)
//}

// choose display name properly
function displayNameFallback(ticker: string) {
  return displayName(ticker)
}

// ---------- Lifecycle ----------
onMounted(async () => {
  initChart()
  enableResize()

  // ensure store has data for all tickers
  for (const t of props.tickers) {
    if (!itemFor(t)) {
      // fetch if missing
      // don't await serially to keep UX snappy; but do await so chart updates when data arrives
      // we await to avoid racing addSeriesForTicker -> setData when not present
      // if many tickers, you can parallelise with Promise.all
      // keeping serial for stability
      // eslint-disable-next-line no-await-in-loop
      await store.getHistoricalSeries(t)
    }
    // ensure series exists and has initial data
    const rec = seriesMap.get(t)
    if (rec?.instance && itemFor(t)?.data) {
      rec.instance.setData(itemFor(t)!.data)
    }
  }

  // initial fit
  chart.value?.timeScale()?.fitContent?.()
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  if (subCrosshairUnsub && typeof subCrosshairUnsub === 'function') {
    try {
      chart.value.unsubscribeCrosshairMove?.(subCrosshairUnsub)
    } catch (e) {
      console.log(e)
    }
  }
  if (subVisibleRangeUnsub && typeof subVisibleRangeUnsub === 'function') {
    try {
      chart.value.timeScale()?.unsubscribeVisibleTimeRangeChange?.(subVisibleRangeUnsub)
    } catch (e) {
      console.log(e)
    }
  }
  try {
    chart.value?.remove()
  } catch (e) {
    console.log(e)
  }
})
</script>

<style scoped>
.lw-chart-wrap {
  position: relative;
  width: 100%;
  height: 400px;
  user-select: none;
}

.lw-chart {
  width: 100%;
  height: 400px;
}

/* Floating legend */
.legend.floating-legend {
  position: absolute;
  z-index: 5;
  top: 8px;
  left: 8px;
  background: rgba(255, 255, 255, 0.92);
  border-radius: 8px;
  padding: 6px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  max-width: 360px;
  backdrop-filter: blur(4px);
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 6px;
  transition: background 0.12s;
}
.legend-row:hover {
  background: rgba(0, 0, 0, 0.03);
}

.eye {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.color-swatch {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.18) inset;
}

.meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.title {
  font-weight: 600;
  font-size: 13px;
  line-height: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 220px;
}
.sub {
  display: flex;
  gap: 12px;
  align-items: center;
  font-size: 12px;
  color: #666;
}
.ticker {
  font-family: Menlo, Monaco, monospace;
}
.value {
  font-weight: 700;
}
</style>
