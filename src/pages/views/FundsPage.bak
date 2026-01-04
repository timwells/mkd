<template>
  <div class="demo-container">
    <div class="controls">
      <h2>Lightweight Chart Demo</h2>

      <div class="control-group">
        <button @click="addRandomSeries">Add Random Series</button>
        <button @click="addRealtimeSeries">Start Realtime Series</button>
        <button @click="stopRealtime">Stop Realtime</button>
        <button @click="clearAll">Clear All Series</button>
      </div>

      <div class="control-group">
        <label>
          Series Type:
          <select v-model="newSeriesType">
            <option value="line">Line</option>
            <option value="area">Area</option>
            <option value="bar">Bar</option>
            <option value="histogram">Histogram</option>
            <option value="baseline">Baseline</option>
          </select>
        </label>
      </div>

      <div class="series-list">
        <h3>Active Series ({{ seriesCount }})</h3>
        <div v-for="id in activeSeries" :key="id" class="series-item">
          <span>{{ id }}</span>
          <button @click="removeSeries(id)">Remove</button>
        </div>
      </div>
    </div>

    <div class="chart-wrapper">
      <div ref="chartContainer" class="lw-chart"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, shallowRef } from 'vue'
import { createChart, LineSeries, AreaSeries, BarSeries, HistogramSeries, BaselineSeries } from 'lightweight-charts'

// State
const chartContainer = ref(null)
const chart = shallowRef(null)
const seriesMap = shallowRef(new Map())
const resizeObserver = shallowRef(null)
const seriesCount = ref(0)
const activeSeries = ref([])
const newSeriesType = ref('line')
const realtimeInterval = ref(null)

// Series type mapping
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
  height: 400,
}

// Initialize chart
function initChart() {
  if (!chartContainer.value) return

  chart.value = createChart(chartContainer.value, chartOptions)

  // Add initial series
  addSeries({
    id: 'initial-line',
    type: 'line',
    data: [
      { time: '2023-01-01', value: 100 },
      { time: '2023-01-02', value: 105 },
      { time: '2023-01-03', value: 103 },
      { time: '2023-01-04', value: 108 },
      { time: '2023-01-05', value: 112 },
    ],
    options: {
      color: '#2962FF',
      lineWidth: 2,
    },
  })

  chart.value.timeScale().fitContent()
  updateSeriesList()
}

// Add series
function addSeries(config) {
  if (!chart.value) return null

  const { id, type = 'line', data = [], options = {} } = config

  if (seriesMap.value.has(id)) {
    console.warn(`Series "${id}" already exists`)
    return null
  }

  try {
    const SeriesDef = SERIES_TYPE_MAP[type.toLowerCase()] || LineSeries
    const seriesInstance = chart.value.addSeries(SeriesDef, options)

    if (data.length > 0) {
      seriesInstance.setData(data)
    }

    seriesMap.value.set(id, {
      instance: seriesInstance,
      type,
    })

    updateSeriesList()
    return seriesInstance
  } catch (error) {
    console.error(`Failed to add series "${id}":`, error)
    return null
  }
}

// Remove series
function removeSeries(id) {
  if (!chart.value || !seriesMap.value.has(id)) {
    console.warn(`Series "${id}" not found`)
    return
  }

  const seriesData = seriesMap.value.get(id)
  chart.value.removeSeries(seriesData.instance)
  seriesMap.value.delete(id)
  updateSeriesList()
}

// Append data point
function appendSeriesData(id, dataPoint) {
  const seriesData = seriesMap.value.get(id)
  if (!seriesData) {
    console.warn(`Series "${id}" not found`)
    return
  }

  try {
    seriesData.instance.update(dataPoint)
  } catch (error) {
    console.error(`Failed to append to series "${id}":`, error)
  }
}

// Update series list
function updateSeriesList() {
  activeSeries.value = Array.from(seriesMap.value.keys())
  seriesCount.value = activeSeries.value.length
}

// Generate random data
function generateRandomData(days = 20) {
  const data = []
  let value = Math.random() * 100 + 50
  const today = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const timeStr = date.toISOString().split('T')[0]

    value += (Math.random() - 0.5) * 10
    value = Math.max(10, value)

    data.push({
      time: timeStr,
      value: Math.round(value * 100) / 100,
    })
  }

  return data
}

// Random color
function randomColor() {
  const colors = ['#2962FF', '#FF6D00', '#00C853', '#AA00FF', '#00B8D4', '#FF5252', '#FFD600', '#00BFA5']
  return colors[Math.floor(Math.random() * colors.length)]
}

// Add random series
function addRandomSeries() {
  const seriesId = `series-${Date.now()}`
  const data = generateRandomData()

  addSeries({
    id: seriesId,
    type: newSeriesType.value,
    data: data,
    options: {
      color: randomColor(),
      lineWidth: 2,
    },
  })
}

// Start realtime series
function addRealtimeSeries() {
  if (realtimeInterval.value) return

  const seriesId = 'realtime-series'
  const startDate = new Date()
  let counter = 0
  let value = 100

  // Remove if exists
  if (seriesMap.value.has(seriesId)) {
    removeSeries(seriesId)
  }

  // Add initial series
  addSeries({
    id: seriesId,
    type: 'line',
    data: [
      {
        time: startDate.toISOString().split('T')[0],
        value: value,
      },
    ],
    options: {
      color: '#FF6D00',
      lineWidth: 3,
    },
  })

  // Update every second
  realtimeInterval.value = setInterval(() => {
    counter++
    value += (Math.random() - 0.5) * 5

    const date = new Date(startDate)
    date.setDate(date.getDate() + counter)

    appendSeriesData(seriesId, {
      time: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
    })
  }, 1000)
}

// Stop realtime
function stopRealtime() {
  if (realtimeInterval.value) {
    clearInterval(realtimeInterval.value)
    realtimeInterval.value = null
  }
}

// Clear all
function clearAll() {
  stopRealtime()
  const ids = Array.from(seriesMap.value.keys())
  ids.forEach((id) => removeSeries(id))
}

// Resize handling
function enableResize() {
  if (!chartContainer.value) return

  resizeObserver.value = new ResizeObserver((entries) => {
    if (!chart.value || !entries.length) return
    const { width, height } = entries[0].contentRect
    chart.value.resize(width, height)
  })

  resizeObserver.value.observe(chartContainer.value)

  nextTick(() => {
    if (chart.value && chartContainer.value) {
      const rect = chartContainer.value.getBoundingClientRect()
      chart.value.resize(rect.width, rect.height)
    }
  })
}

// Cleanup
function cleanup() {
  stopRealtime()

  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }

  if (chart.value) {
    chart.value.remove()
  }
}

// Lifecycle
onMounted(() => {
  initChart()
  enableResize()
})

onBeforeUnmount(() => {
  cleanup()
})
</script>

<style scoped>
.demo-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  height: 100vh;
  box-sizing: border-box;
}

.controls {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h2 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #333;
}

h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #666;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  padding: 10px 16px;
  background: #2962ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

button:hover {
  background: #1e4fc2;
}

button:active {
  transform: translateY(1px);
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.series-list {
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  padding: 15px;
  background: #f9f9f9;
}

.series-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 13px;
}

.series-item:last-child {
  margin-bottom: 0;
}

.series-item button {
  padding: 4px 12px;
  font-size: 12px;
  background: #ff5252;
}

.series-item button:hover {
  background: #d32f2f;
}

.chart-wrapper {
  flex: 1;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.lw-chart {
  width: 100%;
  height: 100%;
}
</style>
