<template>
  <VaCard>
    <VaCardTitle class="pb-0!">
      <h1 class="card-title text-secondary font-bold uppercase">Account</h1>
    </VaCardTitle>
    <VaCardContent class="flex flex-row gap-1">
      <pre>{{ account }}</pre>
    </VaCardContent>
  </VaCard>
  <VaCard class="mt-4">
    <VaCardTitle class="pb-0!">
      <h1 class="card-title text-secondary font-bold uppercase">Products</h1>
    </VaCardTitle>
    <VaCardContent class="flex flex-row gap-1">
      <EasyDataTable
        :headers="headers"
        :items="products.results || []"
        alternating
        :loading="store.loading"
        :rows-per-page="5000"
        pagination="false"
      ></EasyDataTable>
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Header } from 'vue3-easy-data-table'
import { useOctopusStore } from '@/stores/octopus'

const headers: Header[] = [
  { text: 'Code', value: 'code' },
  { text: 'Name', value: 'full_name' },
  { text: 'Is Variable', value: 'is_variable' },
  { text: 'Term', value: 'term' },
  { text: 'Target', value: 'target' },
  { text: 'Available From', value: 'available_from' },
]

const store = useOctopusStore()
/*
results": [
    {
      "code": "AGILE-24-10-01",
      "direction": "IMPORT",
      "full_name": "Agile Octopus October 2024 v1",
      "display_name": "Agile Octopus",
      "description": "With Agile Octopus, you get access to half-hourly energy prices, tied to wholesale prices and updated daily.  The unit rate is capped at 100p/kWh (including VAT).",
      "is_variable": true,
      "is_green": true,
      "is_tracker": false,
      "is_prepay": false,
      "is_business": false,
      "is_restricted": false,
      "term": 12,
      "available_from": "2024-10-01T00:00:00+01:00",
      "available_to": null,
      "links": [
        {
          "href": "https://api.octopus.energy/v1/products/AGILE-24-10-01/",
          "method": "GET",
          "rel": "self"
        }
      ],
      "brand": "OCTOPUS_ENERGY"
    },
*/

const account = computed(() => {
  return store.account
})
const electricityConsumption = computed(() => {
  return store.electricityConsumption
})
const products = computed(() => {
  return store.products
})

store.getAccount()
store.getElectricityConsumption()
store.getProducts()
</script>
