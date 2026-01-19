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
          :items="t212Store.openOrders2"
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
        <pre>{{ t212Store.dividendHistory }}</pre>
      </VaCardContent>
    </VaCard>
  </div>  
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Header, Item } from 'vue3-easy-data-table'
import { useT212Store } from '@/stores/t212'

const tabs = ['Orders', 'Dividends', 'Other-1', 'Other-2']
const tabSelect = ref('Orders')

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

const t212Store = useT212Store()
onMounted(() => {
  t212Store.getOpenOrders2()
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
</style>
