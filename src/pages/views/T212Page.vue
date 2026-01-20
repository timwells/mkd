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
        <p>Grand Total: £{{t212Store.dividendGrandTotal}}</p>
        <AgCharts :options="dividendHistoryByPeriodChartOptions" style="display: grid; width: 100%; height: 550px" />
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Header, Item } from 'vue3-easy-data-table'
import { AgCharts } from 'ag-charts-vue3'
import type { AgCartesianChartOptions, AgBarSeriesOptions } from 'ag-charts-community'

import { useT212Store } from '@/stores/t212'

const tabs = ['Orders', 'Dividends', 'Periods', 'Other-2']
const tabSelect = ref('Orders')

// ----------------------------
// Helpers
// ----------------------------
const toXY = (arr: [number, number][]) => arr.map(([x, y]) => ({ x, y }))

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
  { text: 'Date', value: 'date', sortable: true },
  { text: 'Paid', value: 'paid' },
  { text: 'Period', value: 'period', sortable: true },
]

// Transform data for better chart labels (optional but recommended)
const dividendHistoryByPeriodChartData = computed(() => {
  return t212Store.dividendHistoryByPeriod.map((item: any) => ({
    period: formatPeriod(item.period),
    total: item.total,
  }))
})

function formatPeriod(periodStr: string): string {
  const year = periodStr.slice(2, 4)
  const month = String(Number(periodStr.slice(4, 6))).padStart(2, '0')
  return `${month}-${year}`
}

// AG Charts configuration
const dividendHistoryByPeriodChartOptions = computed<AgCartesianChartOptions>(() => ({
  data: dividendHistoryByPeriodChartData.value,
  title: { text: 'Monthly Totals' },
  // subtitle: {
  //  text: 'Dividend payments received per month (£)',
  //  fontSize: 13,
  //  fontWeight: 'normal',
  //  color: '#555',           // slightly muted vs title
  //},
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
        fontWeight: 'normal',     // or 'bold'
        color: '#333',            // dark gray — good contrast on light bars
        placement: 'outside-end',
        formatter: (params:any) => {
          return '£' + params.value.toFixed(2);
        },
      },
      tooltip: {
        renderer: ({ datum }) => ({
          content: `${datum.period}: <b>${datum.total.toFixed(2)}</b>`,
        }),
      },
    } as AgBarSeriesOptions,
  ],

  axes: [
    {
      type: 'category',
      position: 'bottom',
      title: { text: 'Period' },
      label: {
        rotation: 0,
        formatter: (params: any) => params.value, // already formatted
      },
    },
    {
      type: 'number',
      position: 'left',
      title: { text: '£ Totals' },
      label: {
        formatter: (params: any) => params.value.toFixed(2),
      },
    },
  ],

  legend: {
    enabled: false, // only one series, no need for legend
  },
  background: {
    //fill: '#f8f9fa',
    fill: '#ffffff',
  },
}))

const t212Store = useT212Store()
onMounted(async () => {
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
