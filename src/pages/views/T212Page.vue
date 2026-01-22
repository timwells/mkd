<template>
  <div class="tabs-container">
    <!-- Tabs -->
    <VaTabs v-model="tabSelect" class="tabs-left">
      <template #tabs>
        <VaTab v-for="tab in tabs" :key="tab" :name="tab">
          {{ tab }}
        </VaTab>
      </template>
    </VaTabs>

    <!-- Tab Content -->
    <div v-if="tabSelect === 'Summary' && t212Store.accountSummary" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <VaCard square outlined class="rounded-xl">
        <VaCardTitle>Investment</VaCardTitle>
        <VaCardContent>
          <div class="text-xl mb-2">Total Value: {{ formatValue(t212Store.accountSummary?.totalValue) }}</div>
        </VaCardContent>
      </VaCard>
      <VaCard square outlined class="rounded-xl">
        <VaCardTitle>Tradeable</VaCardTitle>
        <VaCardContent>
          <div class="text-xl mb-2">Available: {{ formatValue(t212Store.accountSummary?.cash?.availableToTrade ) }}</div>
          <div class="text-xl mb-2">Reserved: {{ formatValue(t212Store.accountSummary?.cash?.reservedForOrders) }}</div>
        </VaCardContent>
      </VaCard>
      <VaCard square outlined class="rounded-xl">
        <VaCardContent>
          <pre>{{ t212Store.accountSummary?.investments }}</pre>
        </VaCardContent>
      </VaCard>
    </div>
    <VaCard v-if="tabSelect === 'Orders'" class="tab-content rounded-xl" outlined>
      <VaCardTitle>Open Orders</VaCardTitle>
      <VaCardContent>
        <EasyDataTable
          :headers="orderSummaryHeader"
          :items="t212Store.openOrders"
          alternating
          :loading="t212Store.loading"
          pagination="false"
          :rows-per-page="200"
        >
          <template #expand="item">
            <div style="padding: 15px">
              <VaCard class="rounded-xl">
                <VaCardContent class="w-full" style="height: auto">
                  <EasyDataTable :headers="ordersHeader" :items="item.orders" alternating>
                    <!--template #item-action="item">
                      <VaButton size="small" @click="t212Store.cancelOrder(item.id, item.ticker)">Cancel</VaButton>
                    </template-->
                  </EasyDataTable>
                </VaCardContent>
              </VaCard>
            </div>
          </template>
        </EasyDataTable>
      </VaCardContent>
    </VaCard>

    <VaCard v-if="tabSelect === 'Dividends'" class="tab-content rounded-xl" outlined>
      <VaCardTitle>Dividends</VaCardTitle>
      <VaCardContent>
        <EasyDataTable
          :headers="dividendHistoryHeader"
          :items="t212Store.dividendHistory"
          pagination="false"
          :rows-per-page="500"
          alternating
        />
      </VaCardContent>
    </VaCard>

    <VaCard v-if="tabSelect === 'Periods'" class="tab-content rounded-xl" outlined>
      <VaCardTitle>Dividend Periods</VaCardTitle>
      <VaCardContent class="w-full" style="height: 600px">
        <p>Grand Total: £{{ t212Store.dividendGrandTotal }} / {{ t212Store.dividendHistoryByPeriod.length }} mths</p>
        <AgCharts :options="dividendHistoryByPeriodChartOptions" style="display: grid; width: 100%; height: 550px" />
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Header, Item } from 'vue3-easy-data-table'
import { AgCharts } from 'ag-charts-vue3'
import type { AgCartesianChartOptions, AgBarSeriesOptions, AgLineSeriesOptions } from 'ag-charts-community'

import type { T212AccountSummary, T212CashSummary, T212InvestmentSummary } from '@/stores/t212'

import { useT212Store } from '@/stores/t212'

const tabs = ['Summary', 'Orders', 'Dividends', 'Periods']
const tabSelect = ref('Summary')

// ----------------------------
// Helpers
// ----------------------------
// const toXY = (arr: [number, number][]) => arr.map(([x, y]) => ({ x, y }))

const orderSummaryHeader: Header[] = [
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Epic', value: 'ticker', sortable: true },
  { text: 'Total Quantity', value: 'totalQuantity', sortable: true },
  { text: 'Total Value', value: 'totalValue', sortable: true },
  { text: 'Orders Count', value: 'ordersCount', sortable: true },
]

const ordersHeader: Header[] = [
  { text: 'ID', value: 'id' },
  { text: 'Epic', value: 'ticker' },
  { text: 'Side', value: 'side' },
  { text: 'Type', value: 'type' },
  { text: 'Limit Price', value: 'limitPrice' },
  { text: 'Currency', value: 'currency' },
  { text: 'Quantity', value: 'quantity' },
  { text: 'Date', value: 'createdAt' },
  { text: 'Actions', value: 'action' },
]

const dividendHistoryHeader: Header[] = [
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Ticker', value: 'ticker', sortable: true },
  { text: 'Amount', value: 'amount' },
  { text: 'Currency', value: 'currency' },
  { text: 'Type', value: 'type', sortable: true },
  { text: 'Paid', value: 'paid' },
  { text: 'Period', value: 'period', sortable: true },
]

// Transform data for better chart labels (optional but recommended)
const dividendHistoryByPeriodChartData = computed(() => {
  return t212Store.dividendHistoryByPeriod.map((item: any) => ({
    period: formatPeriod(item.period),
    total: item.total,
    runningTotal: item.runningTotal,
  }))
})

function formatPeriod(periodStr: string): string {
  const year = periodStr.slice(2, 4)
  const month = String(Number(periodStr.slice(4, 6))).padStart(2, '0')
  return `${month}-${year}`
}

function formatValue(value: number): string {
  return '£' + value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// AG Charts configuration
const dividendHistoryByPeriodChartOptions = computed<AgCartesianChartOptions>(() => ({
  data: dividendHistoryByPeriodChartData.value,
  title: { text: 'Monthly Dividend Totals' },
  subtitle: {
    text: 'Payments / month + Cumulative Total',
    fontSize: 13,
    color: '#555',
  },
  series: [
    {
      type: 'bar',
      xKey: 'period',
      yKey: 'total',
      yName: 'Total',
      fill: '#4e79a7', // nice blue
      stroke: '#2c4f7c',
      strokeWidth: 1,
      cornerRadius: 6,
      label: {
        enabled: true,
        fontSize: 14,
        fontWeight: 'normal', // or 'bold'
        color: '#333', // dark gray — good contrast on light bars
        placement: 'outside-end',
        formatter: (params: any) => {
          return '£' + params.value.toFixed(2)
        },
      },
      tooltip: {
        renderer: ({ datum }) => ({
          content: `${datum.period}: <b>${datum.total.toFixed(2)}</b>`,
        }),
      },
    } as AgBarSeriesOptions,
    {
      type: 'line',
      xKey: 'period',
      yKey: 'runningTotal',
      yName: 'Running Total',
      stroke: '#f28e2b', // nice contrasting orange
      strokeWidth: 2,
      marker: {
        enabled: true,
        shape: 'circle',
        size: 7,
        fill: '#f28e2b',
        stroke: '#c15d00',
      },
      label: {
        enabled: true,
        fontSize: 14,
        color: '#c15d00',
        // placement: 'outside-end',
        formatter: (p: any) => '£' + p.value.toFixed(2), // whole pounds for cumulative
      },
      tooltip: {
        renderer: ({ datum }) => ({
          content: `${datum.period}<br>Monthly: £${datum.total.toFixed(
            2,
          )}<br><b>Cumulative: £${datum.runningTotal.toFixed(2)}</b>`,
        }),
      },
    } as AgLineSeriesOptions,
  ],
  axes: [
    {
      type: 'category',
      position: 'bottom',
      title: { text: 'Period' },
      label: {
        rotation: 0,
        formatter: (p: any) => p.value, // already formatted
      },
    },
    {
      // Primary left axis (for bars / monthly values)
      type: 'number',
      position: 'left',
      title: { text: 'Monthly £' },
      label: {
        formatter: (p: any) => '£' + p.value.toFixed(0),
      },
      keys: ['total'], // explicitly bind bar series to this axis (optional but clearer)
    },
    {
      // Secondary right axis (for cumulative line – different scale)
      type: 'number',
      position: 'right',
      title: { text: 'Cumulative £' },
      label: { formatter: (p: any) => '£' + p.value.toFixed(0) },
      keys: ['runningTotal'], // bind line to this axis
    },
  ],
  legend: {
    enabled: true,
    position: 'bottom',
    item: {
      marker: { shape: 'square' }, // or 'line' for the cumulative
    },
  },
  background: {
    //fill: '#f8f9fa',
    fill: '#ffffff',
  },
}))

const t212Store = useT212Store()
onMounted(async () => {
  t212Store.getAccountSummary()
  await new Promise((resolve) => setTimeout(resolve, 900))
  t212Store.getOpenOrders()
  await new Promise((resolve) => setTimeout(resolve, 900))
  t212Store.getDividendHistory()
})
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

.chart-container {
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}
</style>
