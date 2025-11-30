<template>
  <VaCard square outlined class="rounded-xl">
    <VaCardTitle>Stocks</VaCardTitle>
    <VaCardContent>
      <LightweightChartMfMulti :tickers="oilGasStockTickers" type="line" />
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import LightweightChartMfMulti from '@/components/lw-charts/LightweightChartMfMulti.vue'
const oilGasStockTickers = ['BP.', 'SHEL', 'HBR', 'SQZ', 'RKH']
</script>

<style scoped>
</style>


