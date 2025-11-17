<template>
  <div>
    <AgCharts :options="fgOptions" />
    <AgCharts :options="vixOptions" />
    <AgCharts :options="sp500Options" />

    <!--pre>{{ store.marketMomentumSp500Historical }}</pre>
    <pre>{{ store.market_momentum_sp500_MA200 }}</pre>
    <pre>{{ store.market_momentum_sp500_MA100 }}</pre>
    <pre>{{ store.market_momentum_sp500_MA50 }}</pre-->
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
const getMinY = (data: [number, number][]): number => (data.length === 0 ? 0 : Math.min(...data.map(([, y]) => y)))

const getMaxY = (data: [number, number][]): number => (data.length === 0 ? 0 : Math.max(...data.map(([, y]) => y)))

const formatDate = (x: number) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', timeZone: 'UTC' }).format(new Date(x))

const makeMainSeries = (yName = 'Value', colour: string): AgLineSeriesOptions => ({
  type: 'line',
  xKey: 'x',
  yKey: 'y',
  yName,
  stroke: colour,
  strokeWidth: 3,
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

const makeSecondaryLine = (data: { x: number; y: number }[], color: string): AgLineSeriesOptions => ({
  type: 'line',
  data: data,
  xKey: 'x',
  yKey: 'y',
  stroke: color,
  strokeWidth: 2,
  //lineDash: [4, 2],
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
const sp500Data = computed(() => toXY(store.marketMomentumSp500Historical?.data ?? []))
const sp500MA50Data = computed(() => toXY(store.marketMomentumSp500MA50?.data ?? []))
const sp500MA100Data = computed(() => toXY(store.marketMomentumSp500MA100?.data ?? []))
const sp500MA200Data = computed(() => toXY(store.marketMomentumSp500MA200?.data ?? []))

// ----------------------------
// Chart Options
// ----------------------------

const buildChartOptions = (
  data: { x: number; y: number }[],
  minAxis: number,
  maxAxis: number,
  seriesColor: string,
  upperLimit: number,
  upperLimitColor: string,
  lowerLimit: number,
  lowerLimitColor: string,
  title: string,
): AgChartOptions => ({
  data,
  title: { text: title },
  series: [
    makeMainSeries(title, seriesColor),
    makeHorizontalLine(data, upperLimit, upperLimitColor),
    makeHorizontalLine(data, lowerLimit, lowerLimitColor),
  ],
  axes: [timeAxis, numberAxis(minAxis, maxAxis)],

  legend: { enabled: false },
})
/*
axes: [
    {
      type: 'time',
      position: 'bottom',
      tick: {
        interval: { months: 1 },   // Every single month
      },
      label: {
        autoRotate: true,
        formatter: ({ value }) => {
          const d = new Date(value)
          const month = d.toLocaleDateString('en-GB', { month: 'short' })
          const year = d.getFullYear()
          return d.getMonth() === 0 ? `${month} ${year}` : month
        },
      },
    },
    {
      type: 'number',
      position: 'left',
    },
  ],
*/

const buildChartOptions2 = (
  data: { x: number; y: number }[],
  dataMA50: { x: number; y: number }[],
  dataMA100: { x: number; y: number }[],
  dataMA200: { x: number; y: number }[],
  minAxis: number,
  maxAxis: number,
  seriesColor: string,
  title: string,
): AgChartOptions => ({
  data,
  title: { text: title },
  series: [
    makeMainSeries(title, seriesColor),
    makeSecondaryLine(dataMA50, RED),
    makeSecondaryLine(dataMA100, ORANGE),
    makeSecondaryLine(dataMA200, GREEN),
  ],
  axes: [timeAxis, numberAxis(minAxis, maxAxis)],
  legend: { enabled: false },
})

const BLUE = '#57C3E6'
const RED = '#ef4444'
const GREEN = '#10b981'
const ORANGE = '#ffcc00'

const fgOptions = computed(() =>
  buildChartOptions(fgData.value, 0, 100, BLUE, 85, GREEN, 15, RED, 'Fear & Greed Index'),
)
const vixOptions = computed(() => buildChartOptions(vixData.value, 0, 50, BLUE, 35, RED, 10, GREEN, 'VIX Index'))

//     axes: [timeAxis, numberAxis(Math.floor(minY * 0.98), Math.ceil(maxY * 1.02))],

const sp500Options = computed(() =>
  buildChartOptions2(
    sp500Data.value,
    sp500MA50Data.value,
    sp500MA100Data.value,
    sp500MA200Data.value,
    5200,
    7000,
    //Math.floor(getMinY(sp500Data.value)*0.98),
    //Math.floor(getMaxY(sp500Data.value)*1.02),
    BLUE,
    'SP500',
  ),
)
</script>
