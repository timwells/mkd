<template>
  <div class="tabs-container">
    <!-- Tabs -->
    <VaTabs v-model="tabSelect" class="tabs-left">
      <template #tabs>
        <VaTab v-for="tab in tabs" :key="tab" :name="tab">{{ tab }}</VaTab>
      </template>
    </VaTabs>

    <div v-if="tabSelect === 'Summary'">
      <VaCard v-for="account in accounts" :key="account.id" class="tab-content rounded-xl" outlined>
        <VaCardTitle>Summary - {{ account.id }}</VaCardTitle>
        <VaCardContent v-if="storeFor(account.id).investmentSummary">
          <div class="text-2xl text-blue-600">Total: {{ formatValue(storeFor(account.id).totalValue ?? 0.0) }}</div>
          <VaDivider />
          <div class="text-xl text-blue-600">
            Investments: {{ formatValue(storeFor(account.id).investmentSummary?.currentValue) }}
          </div>
          <div class="text-xl text-blue-600">
            Cost: {{ formatValue(storeFor(account.id).investmentSummary?.totalCost) }}
          </div>

          <VaDivider />
          <div class="text-xl text-blue-600">
            Available: {{ formatValue(storeFor(account.id).cashSummary?.availableToTrade) }}
          </div>

          <div class="text-xl text-blue-600">
            Reserved: {{ formatValue(storeFor(account.id).cashSummary?.reservedForOrders) }}
          </div>
        </VaCardContent>
      </VaCard>
      <VaCard class="tab-content rounded-xl" outlined>
        <VaCardTitle>Grand Total</VaCardTitle>
        <VaCardContent>
          <div class="text-4xl font-bold text-blue-600">
            {{ formatValue(grandTotal) ?? '-.-' }}
          </div>
        </VaCardContent>
      </VaCard>
    </div>
    <div v-if="tabSelect === 'Positions'">
      <VaCard class="tab-content rounded-xl" outlined>
        <VaCardTitle>Positions txw</VaCardTitle>
        <VaCollapse color="#DEE5F2" color-all icon="info">
          <VaCardContent>
            <EasyDataTable
              :headers="positionsSummaryHeader"
              :items="storeFor('txw').positions"
              alternating
              pagination="false"
              :rows-per-page="200"
            />
          </VaCardContent>
        </VaCollapse>
      </VaCard>
      <VaCard class="tab-content rounded-xl" outlined>
        <VaCardTitle>Positions zxt</VaCardTitle>
        <VaCollapse color="#DEE5F2" color-all icon="info">
          <VaCardContent>
            <EasyDataTable
              :headers="positionsSummaryHeader"
              :items="storeFor('zxt').positions"
              alternating
              pagination="false"
              :rows-per-page="200"
            />
          </VaCardContent>
        </VaCollapse>
      </VaCard>
    </div>
    <div v-if="tabSelect === 'Orders'">
      <VaCard class="tab-content rounded-xl" outlined>
        <VaCardTitle>Order txw</VaCardTitle>
        <VaCollapse color="#DEE5F2" color-all icon="info">
          <VaCardContent>
            <EasyDataTable
              :headers="orderSummaryHeader"
              :items="storeFor('txw').openOrders"
              alternating
              pagination="false"
              :rows-per-page="200"
            >
              <template #expand="item">
                <div style="padding: 15px">
                  <VaCard class="rounded-xl">
                    <VaCardContent class="w-full" style="height: auto">
                      <EasyDataTable :headers="ordersHeader" :items="item.orders" alternating>
                        <!--template #item-action="item">
                          <VaButton size="small">Cancel</VaButton>
                        </template-->
                      </EasyDataTable>
                    </VaCardContent>
                  </VaCard>
                </div>
              </template>
            </EasyDataTable>
          </VaCardContent>
        </VaCollapse>
      </VaCard>
      <VaCard class="tab-content rounded-xl" outlined>
        <VaCardTitle>Orders zxt</VaCardTitle>
        <VaCollapse color="#DEE5F2" color-all icon="info">
          <VaCardContent>
            <EasyDataTable
              :headers="orderSummaryHeader"
              :items="storeFor('zxt').openOrders"
              alternating
              pagination="false"
              :rows-per-page="200"
            >
              <template #expand="item">
                <div style="padding: 15px">
                  <VaCard class="rounded-xl">
                    <VaCardContent class="w-full" style="height: auto">
                      <EasyDataTable :headers="ordersHeader" :items="item.orders" alternating>
                        <!--template #item-action="item">
                          <VaButton size="small">Cancel</VaButton>
                        </template-->
                      </EasyDataTable>
                    </VaCardContent>
                  </VaCard>
                </div>
              </template>
            </EasyDataTable>
          </VaCardContent>
        </VaCollapse>
      </VaCard>
    </div>
    <div v-if="tabSelect === 'Dividends'">
      <VaCard class="tab-content rounded-xl" outlined>
        <VaCardTitle>Dividends txw</VaCardTitle>
        <VaCollapse color="#DEE5F2" color-all icon="info">
          <VaCardContent>
            <EasyDataTable
              :headers="dividendHistoryHeader"
              :items="storeFor('txw').dividendHistory"
              pagination="false"
              :rows-per-page="500"
              alternating
            />
          </VaCardContent>
        </VaCollapse>
      </VaCard>
      <VaCard class="tab-content rounded-xl" outlined>
        <VaCardTitle>Dividends zxt</VaCardTitle>
        <VaCollapse color="#DEE5F2" color-all icon="info">
          <VaCardContent>
            <EasyDataTable
              :headers="dividendHistoryHeader"
              :items="storeFor('zxt').dividendHistory"
              pagination="false"
              :rows-per-page="500"
              alternating
            />
          </VaCardContent>
        </VaCollapse>
      </VaCard>
    </div>

    <div v-if="tabSelect === 'Periods'">
      <VaCard class="tab-content rounded-xl" outlined>
        <VaCardTitle>Dividend Periods - txw</VaCardTitle>
        <VaCardContent class="w-full" style="height: 500px">
          <p>
            Grand Total: £{{ storeFor('txw').dividendGrandTotal }} /
            {{ storeFor('txw').dividendHistoryByPeriod.length }} mths
          </p>
          <AgCharts
            :options="dividendHistoryByPeriodChartOptions(storeFor('txw').dividendHistoryByPeriod)"
            style="display: grid; width: 100%; height: 450px"
          />
        </VaCardContent>
      </VaCard>

      <VaCard class="tab-content rounded-xl" outlined>
        <VaCardTitle>Dividend Periods - zxt</VaCardTitle>
        <VaCardContent class="w-full" style="height: 600px">
          <p>
            Grand Total: £{{ storeFor('zxt').dividendGrandTotal }} /
            {{ storeFor('zxt').dividendHistoryByPeriod.length }} mths
          </p>
          <AgCharts
            :options="dividendHistoryByPeriodChartOptions(storeFor('zxt').dividendHistoryByPeriod)"
            style="display: grid; width: 100%; height: 550px"
          />
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createT212Store } from '@/stores/t212.factory'
import { onMounted, ref, computed } from 'vue'
import type { Header, Item } from 'vue3-easy-data-table'
import { AgCharts } from 'ag-charts-vue3'
import type { AgCartesianChartOptions, AgBarSeriesOptions, AgLineSeriesOptions } from 'ag-charts-community'

// import type { T212AccountSummary, T212CashSummary, T212InvestmentSummary } from '@/stores/t212.ts'

const tabs = ['Summary', 'Positions', 'Orders', 'Dividends', 'Periods']
const tabSelect = ref('Summary')

const positionsSummaryHeader: Header[] = [
  { text: 'Created', value: 'createdAt', sortable: true },
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Ticker', value: 'ticker', sortable: true },
  { text: 'Current Price', value: 'currentPrice', sortable: true },
  { text: 'Ave.Price Paid', value: 'averagePricePaid', sortable: true },
  { text: 'Total Cost', value: 'totalCost', sortable: true },
  { text: 'Current Value', value: 'currentValue', sortable: true },
  { text: 'Unrealized Profit Loss', value: 'unrealizedProfitLoss', sortable: true },
]

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
  { text: 'Paid', value: 'paid', sortable: true },
  { text: 'Period', value: 'period', sortable: true },
]

// ── Config: add as many accounts as you want here ────────────────────────
const accounts = ref([
  { id: 'txw', name: 'T-Acc', t212Key: import.meta.env.VITE_T212_KEY_T },
  { id: 'zxt', name: 'Z-Acc', t212Key: import.meta.env.VITE_T212_KEY_Z },
])

// Store instances map
const t212Stores = ref(new Map<string, ReturnType<typeof createT212Store>>())

// Helper: get or lazily create store + ensure it's initialized
const getOrCreateStore = (accountId: string) => {
  if (!t212Stores.value.has(accountId)) {
    const account = accounts.value.find((a: any) => a.id === accountId)
    if (!account) throw new Error(`Account config not found: ${accountId}`)

    const useStore = createT212Store(account.id)
    t212Stores.value.set(accountId, useStore)
  }
  return t212Stores.value.get(accountId)!
}

// Convenience: store for a given id
const storeFor = (id: string) => getOrCreateStore(id) as any

// Loading state per account
const loading = ref<Record<string, boolean>>({})

// Combined total (reactive)
const grandTotal = computed(() => {
  return accounts.value.reduce((sum: any, acc: any) => {
    const value = storeFor(acc.id).totalValue ?? 0.0
    return sum + value
  }, 0)
})

const formatValue = (numValue: number) => {
  return '£' + numValue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

// Any account still loading?
const isAnyLoading = computed(() => Object.values(loading.value).some((isLoading) => isLoading))

// Load summaries for ALL accounts in parallel
const loadAllSummaries = async () => {
  await Promise.all(
    accounts.value.map(async (account: any) => {
      const store = storeFor(account.id)
      if (store.accountSummary) return

      loading.value[account.id] = true
      try {
        await store.getAccountSummary(account.t212Key)
      } catch (err) {
        console.error(`Failed to load ${account.id}:`, err)
      } finally {
        loading.value[account.id] = false
      }
    }),
  )
}

// Generic loader function
const loadDataForAllAccounts = async (
  loader: (store: any, key: string) => Promise<void>,
  checkCache: (store: any) => boolean,
) => {
  await Promise.all(
    accounts.value.map(async (account: any) => {
      const store = storeFor(account.id)
      if (checkCache(store)) return

      loading.value[account.id] = true
      try {
        await loader(store, account.t212Key)
      } catch (err) {
        console.error(`Failed to load ${account.id}:`, err)
      } finally {
        loading.value[account.id] = false
      }
    }),
  )
}

onMounted(async () => {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  await loadAllSummaries()
  await delay(900)
  await loadDataForAllAccounts(
    (store, key) => store.getPositions(key),
    (store) => store.positions.length > 0,
  )
  await delay(900)
  await loadDataForAllAccounts(
    (store, key) => store.getOpenOrders(key),
    (store) => store.openOrders.length > 0,
  )
  await delay(900)
  await loadDataForAllAccounts(
    (store, key) => store.getDividendHistory(key),
    (store) => store.dividendHistory.length > 0,
  )
})

// AG Charts configuration
const dividendHistoryByPeriodChartOptions = (dividendHistoryByPeriod: any): AgCartesianChartOptions => ({
  data: dividendHistoryByPeriod,
  title: { text: 'Monthly Dividend Totals' },
  /* subtitle: {
    text: 'Payments / month + Cumulative Total',
    fontSize: 13,
    color: '#555',
  },*/
  series: [
    {
      type: 'bar',
      xKey: 'period',
      yKey: 'total',
      yName: 'Total',
      fill: '#7eade0', // nice blue
      stroke: '#2c4f7c',
      strokeWidth: 1,
      cornerRadius: 6,
      label: {
        enabled: true,
        fontSize: 14,
        fontWeight: 'normal', // or 'bold'
        color: '#333', // dark gray — good contrast on light bars
        placement: 'outside-end',
        formatter: (params: any) => '£' + params.value.toFixed(2),
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
        formatter: (p: any) => p.value.slice(2).replace(/(\d{2})(\d{2})/, '$1-$2'), // already formatted
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
    fill: '#ffffff',
  },
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
</style>
