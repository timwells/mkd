<template>
  <VaCard square outlined class="rounded-xl">
    <VaCardTitle>{{ moneyMarketTickers }}</VaCardTitle>
    <VaCardContent>
      <LightweightChartFTMulti :tickers="moneyMarketTickers" type="line" />
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import LightweightChartFTMulti from '@/components/lw-charts/LightweightChartFTMulti.vue'
const moneyMarketTickers = ['GB00BFYDWM59:GBP', 'GB00B8XYYQ86:GBP', 'GB0033029413:GBP']
</script>

<style scoped></style>
