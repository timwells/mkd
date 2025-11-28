<template>
  <div class="tabs-container">

    <!-- Tabs -->
    <VaTabs v-model="value" class="tabs-left">
      <template #tabs>
        <VaTab v-for="tab in tabs" :key="tab" :name="tab">{{ tab }}</VaTab>
      </template>
    </VaTabs>

    <!-- Tab Content -->
    <div v-if="value === 'Sentiment'" class="tab-content" outlined>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VaCard class="rounded-xl">
          <VaCardContent>
            <AgCharts :options="fgOptions" />
          </VaCardContent>
        </VaCard>
        <VaCard class="rounded-xl">
          <VaCardContent>
            <AgCharts :options="sp500Options" />
          </VaCardContent>
        </VaCard>
        <VaCard class="rounded-xl">
          <VaCardContent>
            <AgCharts :options="vixOptions" />
          </VaCardContent>
        </VaCard>
        <VaCard class="rounded-xl">
          <VaCardContent>
            <iframe
              src="https://cdn.jmbullion.com/fearandgreed/fearandgreed.html"
              class="w-full"
              style="height: 400px; border: 0"
              loading="lazy"
            ></iframe>
          </VaCardContent>
        </VaCard>
      </div>
    </div>

    <div v-if="value === 'Metals'" class="tab-content" outlined>
      <VaCard class="rounded-xl">
        <VaCardTitle>ETFs</VaCardTitle>
        <VaCardContent>
          <LightweightChartFTMulti
            :tickers="metalsEtfTickers"
            type="line"
          />
        </VaCardContent>
      </VaCard>
    </div>

    <div v-if="value === 'Oil & Gas'" class="tab-content" outlined>
      <VaCard class="rounded-xl">
        <VaCardTitle>Stocks</VaCardTitle>
        <VaCardContent>
          <LightweightChartMfMulti
            :tickers="oilGasStockTickers"
            type="line"
          />
        </VaCardContent>
      </VaCard>
    </div>

    <div v-else-if="value === 'Money'" class="tab-content" outlined>
      <VaCard class="rounded-xl">
        <VaCardTitle>Money Markets</VaCardTitle>
        <VaCardContent>
          <LightweightChartFTMulti 
            :tickers="moneyMarketTickers"
            type="line" 
          />
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { AgCharts } from 'ag-charts-vue3'
import type { AgChartOptions, AgLineSeriesOptions, AgTimeAxisOptions, AgNumberAxisOptions } from 'ag-charts-community'
import { useCnnStore } from '@/stores/cnn'

import LightweightChartFTMulti from '@/components/tradeview/LightweightChartFTMulti.vue'
import LightweightChartMfMulti from '@/components/tradeview/LightweightChartMfMulti.vue'

const tabs = ['Sentiment', 'Metals', 'Money' , 'Oil & Gas']
const value = ref('Sentiment')
const store = useCnnStore()
store.getMarketSentiment()

// ----------------------------
// Helpers
// ----------------------------
const toXY = (arr: [number, number][]) => arr.map(([x, y]) => ({ x, y }))
const getMinY = (data: [number, number][]): number => (data.length === 0 ? 0 : Math.min(...data.map(([, y]) => y)))
const getMaxY = (data: [number, number][]): number => (data.length === 0 ? 0 : Math.max(...data.map(([, y]) => y)))

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

const metalsEtfTickers = ['REGB:LSE:GBP', 'GJGB:LSE:GBP', 'URNG:LSE:GBP', 'NUCG:LSE:GBP', 'GDGB:LSE:GBP'];
const oilGasStockTickers = ['BP.', 'SHEL', 'HBR', 'SQZ', 'RKH' ];
const moneyMarketTickers = ['GB00BFYDWM59:GBP', 'GB00B8XYYQ86:GBP', 'GB0033029413:GBP']; 


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
  buildChartOptions(fgData.value, 0, 100, BLUE, 85, GREEN, 15, RED, 'Fear & Greed Index: SP500'),
)
const vixOptions = computed(() => buildChartOptions(vixData.value, 0, 50, BLUE, 35, RED, 10, GREEN, 'VIX Index'))
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
</script>

<style scoped>
:deep(.tabs-left) .va-tabs__content {
  display: flex !important;
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 12px;
}

.tab-content {
  margin-top: 1rem;
}
</style>
