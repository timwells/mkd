<template>
  <EasyDataTable :headers="headers" :items="items" alternating :loading="store.loading">
    <template #expand="item">
      <div style="padding: 15px">Expanded content for {{ item.epic }} -> {{ item.href }}</div>
    </template>
  </EasyDataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Header } from 'vue3-easy-data-table'
import { useDdStore } from '../../stores/dd'

const headers: Header[] = [
  { text: 'Name', value: 'name' },
  { text: 'Stock', value: 'epic' },
  { text: 'Market', value: 'market' },
  { text: 'ExDate', value: 'exDate' },
  { text: 'Amount', value: 'amount' },
  { text: 'PayDate', value: 'payDate' },
  { text: 'DaysToGo', value: 'daysToGo' },
]

const store = useDdStore()

// compute items in a type-safe way: support either an array in store.data
// or an object with an allTrades array to avoid "never[]" typing errors.
const items = computed(() => {
  const d = (store as any).data
  if (Array.isArray(d)) return d
  if (d && Array.isArray(d.data)) return d.data
  return []
})

store.getExDividendDates()
</script>
