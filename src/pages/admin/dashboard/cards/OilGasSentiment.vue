<template>
  <VaCard square outlined class="rounded-xl">
    <VaCardTitle>{{ oilGasStockTickers }}</VaCardTitle>
    <VaCardContent class="w-full" style="height: 600px">
      <LightweightChartMfMulti :tickers="oilGasStockTickers" type="line" />
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import LightweightChartMfMulti from '@/components/lw-charts/LightweightChartMfMulti.vue'
const oilGasStockTickers = ['BP.', 'SHEL', 'HBR', 'SQZ', 'RKH']
</script>

<style scoped></style>
