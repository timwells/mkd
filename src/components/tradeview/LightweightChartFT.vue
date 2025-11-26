<template>
  <div class="lw-chart" ref="chartContainer"></div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, shallowRef, nextTick, computed } from 'vue'
import {
  createChart,
  LineSeries,
  AreaSeries,
  BarSeries,
  HistogramSeries,
  BaselineSeries,
} from 'lightweight-charts'
import { useFtStore } from '@/stores/ft'

// -------- PROPS --------
const props = defineProps<{
  ticker: string
  type: 'line' | 'area' | 'bar' | 'histogram' | 'baseline'
}>()

// -------- STORE --------
const store = useFtStore()
const storeData = computed(() => store.getByTicker(props.ticker))

// DOM & chart refs
const chartContainer = ref<HTMLElement | null>(null)
const chart = shallowRef<any>(null)
const series = shallowRef<any>(null)
let resizeObserver: ResizeObserver | null = null

// Series map
const SERIES_TYPE_MAP = {
  line: LineSeries,
  area: AreaSeries,
  bar: BarSeries,
  histogram: HistogramSeries,
  baseline: BaselineSeries,
}

// Chart options
const chartOptions = {
  layout: {
    background: { color: '#ffffff' },
    textColor: '#333',
  },
  grid: {
    vertLines: { color: '#e1e1e1' },
    horzLines: { color: '#e1e1e1' },
  },
  width: 800,
  height: 600,
}

// -------- INITIALISE CHART --------
function initChart() {
  if (!chartContainer.value) return

  chart.value = createChart(chartContainer.value, chartOptions)

  const SeriesDef = SERIES_TYPE_MAP[props.type] || LineSeries
  series.value = chart.value.addSeries(SeriesDef, 
  {
    title: props.ticker,
    lineWidth: 1,
    priceFormat: { type: 'price', precision: 2 },
  })
}

// -------- APPLY DATA TO CHART --------
function updateChart() {

  if (!series.value || !storeData.value) return
  if (!storeData.value.data || storeData.value.data.length === 0) return

  series.value.setData(storeData.value.data)
  series.value.applyOptions({ title:  storeData.value.name })
  chart.value.timeScale().fitContent()
}

// -------- RESIZING --------
function enableResize() {
  if (!chartContainer.value) return

  resizeObserver = new ResizeObserver((entries) => {
    if (!entries.length || !chart.value) return
    const { width, height } = entries[0].contentRect
    chart.value.resize(width, height)
  })

  resizeObserver.observe(chartContainer.value)

  nextTick(() => {
    if (!chart.value || !chartContainer.value) return
    const rect = chartContainer.value.getBoundingClientRect()
    chart.value.resize(rect.width, rect.height)
  })
}

// -------- WATCH STORE DATA --------
watch(storeData, () => updateChart(), { deep: true })

// -------- LIFECYCLE --------
onMounted(async () => {
  initChart()
  enableResize()
  await store.getHistoricalSeries(props.ticker)
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
  chart.value?.remove()
})
</script>

<style scoped>
.lw-chart {
  width: 100%;
  height: 600px;
}
</style>
