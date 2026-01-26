<template>
  <div class="tabs-container">
    <!-- Tabs -->
    <VaTabs v-model="tabSelect" class="tabs-left">
      <template #tabs>
        <VaTab v-for="tab in tabs" :key="tab" :name="tab">{{ tab }}</VaTab>
      </template>
    </VaTabs>

    <div v-if="tabSelect === 'Summary'">
      <VaCard class="tab-content rounded-xl" outlined>
        <VaCardTitle>Summary</VaCardTitle>
        <VaCardContent>
          <div v-for="account in accounts":key="account.id"
            class="bg-white shadow-md rounded-xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <h2 class="text-xl font-semibold mb-4 text-gray-800">
              {{ account.name }} <span class="text-sm text-gray-500">({{ account.id }})</span>
            </h2>

            <div v-if="storeFor(account.id).accountSummary" class="text-3xl font-bold text-blue-700">
              {{ formatValue(storeFor(account.id).accountSummary.totalValue?.toFixed(2)) ?? '0.00' }}
            </div>
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
                        <template #item-action="item">
                          <VaButton size="small">Cancel</VaButton>
                        </template>
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
                          <template #item-action="item">
                            <VaButton size="small">Cancel</VaButton>
                          </template>
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
              alternating/>
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
              alternating/>
          </VaCardContent>
        </VaCollapse>
      </VaCard>
    </div>
    <div v-if="tabSelect === 'Periods'">
      <VaCard class="tab-content rounded-xl" outlined>
        <VaCardTitle>Periods</VaCardTitle>
        <VaCardContent>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createT212Store } from '@/stores/t212.factory'
import { onMounted, ref, computed } from 'vue'
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
  { text: 'Paid', value: 'paid' },
  { text: 'Period', value: 'period', sortable: true },
]

// ── Config: add as many accounts as you want here ────────────────────────
const accounts = ref([
  { id: 'txw', name: 'T-Account',    t212Key: import.meta.env.VITE_T212_KEY_T },
  { id: 'zxt', name: 'Z-Account',    t212Key: import.meta.env.VITE_T212_KEY_Z },
])

// Store instances map
const t212Stores = ref(new Map<string, ReturnType<typeof createT212Store>>())

// Helper: get or lazily create store + ensure it's initialized
const getOrCreateStore = (accountId: string) => {
  if (!t212Stores.value.has(accountId)) {
    const account = accounts.value.find(a => a.id === accountId)
    if (!account) throw new Error(`Account config not found: ${accountId}`)

    const useStore = createT212Store(account.id)
    t212Stores.value.set(accountId, useStore)
  }
  return t212Stores.value.get(accountId)!
}

// Convenience: store for a given id
const storeFor = (id: string) => getOrCreateStore(id)

// Loading state per account
const loading = ref<Record<string, boolean>>({})

// Combined total (reactive)
const combinedTotal = computed(() => {
  return accounts.value.reduce((sum:any, acc:any) => {
    const value = storeFor(acc.id).accountSummary?.totalValue ?? 0
    return sum + value
  }, 0)
})

// Any account still loading?
const isAnyLoading = computed(() => 
  Object.values(loading.value).some(isLoading => isLoading)
)

// Load summaries for ALL accounts in parallel
const loadAllSummaries = async () => {
  await Promise.all(
    accounts.value.map(async (account) => {
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
    })
  )
}

// Generic loader function
const loadDataForAllAccounts = async (
  loader: (store: any, key: string) => Promise<void>,
  checkCache: (store: any) => boolean
) => {
  await Promise.all(
    accounts.value.map(async (account) => {
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
    })
  )
}

onMounted(async () => {
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
  
  await loadAllSummaries()
  await delay(900)
  await loadDataForAllAccounts(
    (store, key) => store.getPositions(key),
    (store) => store.positions.length > 0
  )
  await delay(900)
  await loadDataForAllAccounts(
    (store, key) => store.getOpenOrders(key),
    (store) => store.openOrders.length > 0
  )
  await delay(900)
  await loadDataForAllAccounts(
    (store, key) => store.getDividendHistory(key),
    (store) => store.dividendHistory.length > 0
  )
})

const formatValue = (value: string | number) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value
  return '£' + numValue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

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
