<template>
  <VaCard square outlined class="rounded-xl">
    <VaCardTitle>{{ moneyMarketTickers }}</VaCardTitle>
    <VaCardContent class="w-full" style="height: 600px">
      <LightweightChartFTMultiMA :tickers="moneyMarketTickers" type="line" />
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import LightweightChartFTMultiMA from '@/components/lw-charts/LightweightChartFTMultiMA.vue'

const moneyMarketTickers = [
  // 'GB00BFYDWM59:GBP&mas=50,100,200', 
  'GB00BFYDWM59:GBP', 
  'GB00B8XYYQ86:GBP', 
  // 'GB0033029413:GBP&mas=50,100,200'
  'GB0033029413:GBP'
]
</script>

<style scoped></style>
