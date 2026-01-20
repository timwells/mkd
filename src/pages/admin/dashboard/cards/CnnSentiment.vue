<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <VaCard square outlined class="rounded-xl">
      <VaCardContent>
        <AgCharts :options="sp500Options" />
      </VaCardContent>
    </VaCard>
    <VaCard square outlined class="rounded-xl">
      <VaCardContent>
        <AgCharts :options="fgOptions" />
      </VaCardContent>
    </VaCard>
    <VaCard square outlined class="rounded-xl">
      <VaCardContent>
        <AgCharts :options="vixOptions" />
      </VaCardContent>
    </VaCard>
    <VaCard square outlined class="rounded-xl">
      <VaCardContent>
        <AgCharts :options="goldFearAndGreedOptions" />
      </VaCardContent>
    </VaCard>
  </div>
  <div class="grid grid-cols-1 lg:grid-cols-1 gap-4">
    <VaCard square outlined class="rounded-xl">
      <VaCardContent>
        <img
          src="https://cdn.prod.website-files.com/650486dd4239644e595569c1/68bfeb76070cae95cf0b15c9_smart-money-img.png"
          alt="Smart Money"
        />
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue'
import { AgCharts } from 'ag-charts-vue3'
import type { AgChartOptions, AgLineSeriesOptions, AgTimeAxisOptions, AgNumberAxisOptions } from 'ag-charts-community'
import { useCnnStore } from '@/stores/cnn'

const store = useCnnStore()
onMounted(async () => {
  store.getMarketSentiment()
})

// ----------------------------
// Helpers
// ----------------------------
const toXY = (arr: [number, number][]) => arr.map(([x, y]) => ({ x, y }))

const formatDate = (x: number) =>
  new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit', timeZone: 'UTC' }).format(
    new Date(x),
  )

const makeMainSeries = (yName = 'Value', colour: string): AgLineSeriesOptions => ({
  type: 'line',
  xKey: 'x',
  yKey: 'y',
  yName,
  stroke: colour,
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
  strokeWidth: 2,
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
const fgData = computed(() => toXY(store.marketFearAndGreedHistorical?.data ?? []))
const vixData = computed(() => toXY(store.marketVolatilityHistorical?.data ?? []))
const sp500Data = computed(() => toXY(store.marketMomentumSp500Historical?.data ?? []))
const sp500MA50Data = computed(() => toXY(store.marketMomentumSp500MA50?.data ?? []))
const sp500MA100Data = computed(() => toXY(store.marketMomentumSp500MA100?.data ?? []))
const sp500MA200Data = computed(() => toXY(store.marketMomentumSp500MA200?.data ?? []))
const goldFearAndGreedData = computed(() => toXY(store.goldFearAndGreed?.data ?? []))

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
  buildChartOptions(fgData.value, 0, 100, BLUE, 85, GREEN, 15, RED, 'SP500: Fear & Greed Index'),
)
const vixOptions = computed(() => buildChartOptions(vixData.value, 0, 50, BLUE, 35, RED, 10, GREEN, 'VIX: Index'))
const sp500Options = computed(() =>
  buildChartOptions2(
    sp500Data.value,
    sp500MA50Data.value,
    sp500MA100Data.value,
    sp500MA200Data.value,
    5200,
    7000,
    // Math.floor(getMinY(sp500Data.value)*0.96),
    // Math.floor(getMaxY(sp500Data.value)*1.04),
    BLUE,
    'SP500',
  ),
)

const goldFearAndGreedOptions = computed(() =>
  buildChartOptions(goldFearAndGreedData.value, 20, 100, BLUE, 85, GREEN, 25, RED, 'Gold: Fear & Greed Index'),
)
</script>

<style></style>
