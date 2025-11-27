<template>
  <div ref="chartContainer" class="lw-chart"></div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick, shallowRef } from 'vue'
import {
  createChart,
  LineSeries,
  AreaSeries,
  BarSeries,
  CandlestickSeries,
  HistogramSeries,
  BaselineSeries,
} from 'lightweight-charts'

// Props
const props = defineProps({
  type: { type: String, default: 'line' },
  data: { type: Array, required: true },
  autosize: { type: Boolean, default: true },
  chartOptions: { type: Object, default: () => ({}) },
  seriesOptions: { type: Object, default: () => ({}) },
  timeScaleOptions: { type: Object, default: () => ({}) },
  priceScaleOptions: { type: Object, default: () => ({}) },
})

// Refs - use shallowRef for chart objects to avoid deep reactivity overhead
const chartContainer = ref(null)
const chart = shallowRef(null)
const series = shallowRef(null)
const resizeObserver = shallowRef(null)

// Series type mapping
const SERIES_TYPE_MAP = {
  line: LineSeries,
  area: AreaSeries,
  bar: BarSeries,
  candlestick: CandlestickSeries,
  histogram: HistogramSeries,
  baseline: BaselineSeries,
}

function getSeriesDefinition(type) {
  return SERIES_TYPE_MAP[type.toLowerCase()] || LineSeries
}

// Chart initialization
function createChartInstance() {
  if (!chartContainer.value) {
    console.warn('Chart container not available')
    return
  }

  try {
    chart.value = createChart(chartContainer.value, props.chartOptions)
    createSeries()
    chart.value.timeScale().fitContent()
  } catch (error) {
    console.error('Failed to create chart:', error)
  }
}

// Series management
function createSeries() {
  if (!chart.value) return

  try {
    // Remove existing series if present
    if (series.value) {
      chart.value.removeSeries(series.value)
      series.value = null
    }

    // Create new series
    const SeriesDef = getSeriesDefinition(props.type)
    series.value = chart.value.addSeries(SeriesDef, props.seriesOptions)
    series.value.setData(props.data)

    // Apply scale options
    if (Object.keys(props.priceScaleOptions).length > 0) {
      chart.value.priceScale().applyOptions(props.priceScaleOptions)
    }
    if (Object.keys(props.timeScaleOptions).length > 0) {
      chart.value.timeScale().applyOptions(props.timeScaleOptions)
    }
  } catch (error) {
    console.error('Failed to create series:', error)
  }
}

// Resize handling with ResizeObserver (more efficient than window resize)
function enableResize() {
  if (!chartContainer.value || resizeObserver.value) return

  try {
    resizeObserver.value = new ResizeObserver((entries) => {
      if (!chart.value || !entries.length) return

      const { width, height } = entries[0].contentRect
      chart.value.resize(width, height)
    })

    resizeObserver.value.observe(chartContainer.value)

    // Initial resize
    nextTick(() => {
      if (chart.value && chartContainer.value) {
        const rect = chartContainer.value.getBoundingClientRect()
        chart.value.resize(rect.width, rect.height)
      }
    })
  } catch (error) {
    console.error('Failed to enable resize observer:', error)
  }
}

function disableResize() {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
    resizeObserver.value = null
  }
}

// Cleanup
function cleanup() {
  disableResize()

  if (series.value) {
    series.value = null
  }

  if (chart.value) {
    chart.value.remove()
    chart.value = null
  }
}

// Lifecycle hooks
onMounted(() => {
  createChartInstance()
  if (props.autosize) {
    enableResize()
  }
})

onBeforeUnmount(() => {
  cleanup()
})

// Watchers with deep option where needed
watch(
  () => props.autosize,
  (shouldAutosize) => {
    shouldAutosize ? enableResize() : disableResize()
  },
)

watch(
  () => props.type,
  () => {
    createSeries()
  },
)

watch(
  () => props.data,
  (newData) => {
    if (series.value && Array.isArray(newData)) {
      try {
        series.value.setData(newData)
      } catch (error) {
        console.error('Failed to update series data:', error)
      }
    }
  },
  { deep: true },
)

watch(
  () => props.chartOptions,
  (newOptions) => {
    if (chart.value && newOptions) {
      try {
        chart.value.applyOptions(newOptions)
      } catch (error) {
        console.error('Failed to apply chart options:', error)
      }
    }
  },
  { deep: true },
)

watch(
  () => props.seriesOptions,
  (newOptions) => {
    if (series.value && newOptions) {
      try {
        series.value.applyOptions(newOptions)
      } catch (error) {
        console.error('Failed to apply series options:', error)
      }
    }
  },
  { deep: true },
)

watch(
  () => props.priceScaleOptions,
  (newOptions) => {
    if (chart.value && newOptions) {
      try {
        chart.value.priceScale().applyOptions(newOptions)
      } catch (error) {
        console.error('Failed to apply price scale options:', error)
      }
    }
  },
  { deep: true },
)

watch(
  () => props.timeScaleOptions,
  (newOptions) => {
    if (chart.value && newOptions) {
      try {
        chart.value.timeScale().applyOptions(newOptions)
      } catch (error) {
        console.error('Failed to apply time scale options:', error)
      }
    }
  },
  { deep: true },
)

// Exposed API
defineExpose({
  fitContent: () => {
    try {
      chart.value?.timeScale().fitContent()
    } catch (error) {
      console.error('Failed to fit content:', error)
    }
  },
  getChart: () => chart.value,
  getSeries: () => series.value,
  updateData: (data) => {
    if (series.value && Array.isArray(data)) {
      try {
        series.value.setData(data)
      } catch (error) {
        console.error('Failed to update data:', error)
      }
    }
  },
})
</script>

<style scoped>
.lw-chart {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
