<template>
  <div>
    <AgCharts :options="fgOptions" />
    <AgCharts :options="vixOptions" />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { AgCharts } from 'ag-charts-vue3'
import type { AgChartOptions, AgLineSeriesOptions, AgTimeAxisOptions, AgNumberAxisOptions } from 'ag-charts-community'

import { useCnnStore } from '@/stores/cnn'
const store = useCnnStore()
store.getMarketSentiment()

// ----------------------------
// Helpers
// ----------------------------

const toXY = (arr: [number, number][]) => arr.map(([x, y]) => ({ x, y }))

const formatDate = (x: number) =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: '2-digit',
    timeZone: 'UTC',
  }).format(new Date(x))

const makeMainSeries = (yName = 'Value'): AgLineSeriesOptions => ({
  type: 'line',
  xKey: 'x',
  yKey: 'y',
  yName,
  stroke: '#57C3E6',
  strokeWidth: 2,
  interpolation: { type: 'smooth' },
  marker: { enabled: false },

  tooltip: {
    enabled: true,
    renderer: ({ datum }: { datum: { x: number; y: number } }) => `${formatDate(datum.x)}: ${datum.y}`,
  },
})

const makeHorizontalLine = (data: { x: number }[], y: number, color: string): AgLineSeriesOptions => ({
  type: 'line',
  data: data.map((d) => ({ x: d.x, y })),
  xKey: 'x',
  yKey: 'y',
  stroke: color,
  strokeWidth: 3,
  lineDash: [2, 2],
  marker: { enabled: false },
  tooltip: { enabled: false },
})

// Axis definitions (reused)
const timeAxis: AgTimeAxisOptions = {
  type: 'time',
  position: 'bottom',
}

const numberAxis = (min: number, max: number): AgNumberAxisOptions => ({
  type: 'number',
  position: 'left',
  min,
  max,
})

// ----------------------------
// Data
// ----------------------------

const fgData = computed(() => toXY(store.fearAndGreedHistorical?.data ?? []))
const vixData = computed(() => toXY(store.marketVolatilityHistorical?.data ?? []))

// ----------------------------
// Chart Options
// ----------------------------

const buildChartOptions = (
  data: { x: number; y: number }[],
  minAxis: number,
  maxAxis: number,
  upperLimit: number,
  upperLimitColor: string,
  lowerLimit: number,
  lowerLimitColor: string,
  title: string,
): AgChartOptions => ({
  data,
  title: { text: title },
  series: [
    makeMainSeries(title),
    makeHorizontalLine(data, upperLimit, upperLimitColor),
    makeHorizontalLine(data, lowerLimit, lowerLimitColor),
  ],
  axes: [timeAxis, numberAxis(minAxis, maxAxis)],
  legend: { enabled: false },
})

const RED = '#ef4444'
const GREEN = '#10b981'

const fgOptions = computed(() => buildChartOptions(fgData.value, 0, 100, 85, GREEN, 15, RED, 'Fear & Greed Index 1'))
const vixOptions = computed(() => buildChartOptions(vixData.value, 0, 50, 35, RED, 10, GREEN, 'VIX Index'))
</script>
