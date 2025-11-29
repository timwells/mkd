<template>
  <EasyDataTable :headers="headers" :items="items" alternating :loading="store.loading">
    <template #expand="item">
      <div style="padding: 15px">
        <VaCard class="rounded-xl">
          <VaCardTitle>{{ item.stock }}</VaCardTitle>
          <VaCardContent class="w-full" style="height: 600px">
            <LightweightChartMfMulti :tickers="[item.epic]" type="line" class="w-full h-full" />
          </VaCardContent>
        </VaCard>
      </div>
    </template>
  </EasyDataTable>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Header } from 'vue3-easy-data-table'
import { useNtStore } from '@/stores/nt'
import LightweightChartMfMulti from '@/components/tradeview/LightweightChartMfMulti.vue'

const headers: Header[] = [
  { text: 'Stock', value: 'stock' },
  { text: 'Epic', value: 'epic' },
  { text: 'Qty', value: 'qty' },
  { text: 'Price', value: 'price' },
  { text: 'Target', value: 'target' },
  { text: 'Stop', value: 'stop' },
  { text: 'Buy Date', value: 'buydate' },
  { text: 'Sell', value: 'sell' },
  { text: 'Sell Date', value: 'selldate' },
  { text: 'P/L', value: 'pl' },
  { text: 'TC', value: 'tc' },
  { text: 'PD', value: 'pd' },
  { text: 'CP', value: 'cp' },
  { text: 'XP', value: 'xp' },
  { text: 'XPD', value: 'xpd' },
  { text: 'DOPN', value: 'dopn' },
]
const store = useNtStore()

const items = computed(() => {
  const d = (store as any).data
  if (Array.isArray(d)) return d
  if (d && Array.isArray(d.allTrades)) return d.allTrades
  return []
})

store.getTrades()
</script>
