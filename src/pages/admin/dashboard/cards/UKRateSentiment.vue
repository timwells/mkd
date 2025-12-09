<template>
  <VaCard square outlined class="rounded-xl">
    <VaCardTitle>{{ UKRateMarketTickers }}</VaCardTitle>
    <VaCardContent class="w-full" style="height: 600px">
      <LightweightChartCnbcMulti :tickers="UKRateMarketTickers" type="line" />
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import LightweightChartCnbcMulti from '@/components/lw-charts/LightweightChartCnbcMulti.vue'
const UKRateMarketTickers = ['UK2Y-GB', 'UK5Y-GB', 'UK10Y-GB', 'UK30Y-GB']
</script>

<style scoped></style>
