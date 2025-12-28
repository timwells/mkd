<template>
  <div class="tabs-container">
    <!-- Tabs -->
    <VaTabs v-model="value" class="tabs-left">
      <template #tabs>
        <VaTab v-for="tab in store.getHolderNames" :key="tab" :name="tab">{{ tab }}</VaTab>
      </template>
    </VaTabs>

    <!-- Tab Content -->
    <div class="tab-content" outlined>
      <EasyDataTable :headers="headers" :items="currentTabData?.results ?? []" alternating :loading="store.loading">
      </EasyDataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Header } from 'vue3-easy-data-table'
import { usePbStore } from '@/stores/pb'
const PREMIUM_BOND_HOLDERS = import.meta.env.VITE_PREMIUM_BOND_HOLDERS

const store = usePbStore()
const value = ref(store.getHolderNames[0] || 'Tim')

const headers: Header[] = [
  { text: 'Prize', value: 'prize' },
  { text: 'Bond Number', value: 'bond_number' },
  { text: 'Date', value: 'date' },
]

// Define the shape of your data
interface PremiumBondsResponse {
  results: Array<{
    prize: string
    bond_number: string
    date: string
  }>
}

const currentTabData = computed(
  () => store.data[store.getHolderNames.indexOf(value.value)] ?? null,
) as any as PremiumBondsResponse | null

store.getResults(PREMIUM_BOND_HOLDERS)
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
