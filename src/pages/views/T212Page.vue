<template>
  <VaCard square outlined class="rounded-xl">
    <VaCardTitle>
      <h1 class="card-title">Trading 212 Open Orders</h1>
    </VaCardTitle>
    <VaCardContent>
      <EasyDataTable
        :headers="headers2"
        :items="store.openOrders2"
        alternating
        :loading="store.loading"
        pagination="false"
      >
        <template #expand="item">
          <div style="padding: 15px">
            <VaCard class="rounded-xl">
              <VaCardContent class="w-full" style="height: auto">
                <EasyDataTable :headers="ordersHeaders" :items="item.orders" alternating> </EasyDataTable>
              </VaCardContent>
            </VaCard>
          </div>
        </template>
      </EasyDataTable>
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
// import { computed } from 'vue'
import { Header } from 'vue3-easy-data-table'
import { useT212Store } from '@/stores/t212'

const ordersHeaders: Header[] = [
  { text: 'Epic', value: 'ticker' },
  { text: 'Type', value: 'type' },
  { text: 'Limit Price', value: 'limitPrice' },
  { text: 'Currency', value: 'currency' },
  { text: 'Quantity', value: 'quantity' },
  { text: 'Date', value: 'createdAt' },
]

const headers2: Header[] = [
  { text: 'Name', value: 'name', sortable: true },
  { text: 'Epic', value: 'ticker', sortable: true },
  { text: 'Total Quantity', value: 'totalQuantity', sortable: true },
  { text: 'Total Value', value: 'totalValue', sortable: true },
  { text: 'Orders Count', value: 'ordersCount', sortable: true },
]

const store = useT212Store()
// store.getOpenOrders()
store.getOpenOrders2()
</script>
