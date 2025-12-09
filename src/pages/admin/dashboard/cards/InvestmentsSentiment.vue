<template>
  <VaCard square outlined class="rounded-xl">
    <VaCardTitle>{{ investmentMarketTickers }}</VaCardTitle>
    <VaCardContent class="w-full" style="height: 600px">
      <LightweightChartFTMulti :tickers="investmentMarketTickers" type="line" />
    </VaCardContent>
  </VaCard>
</template>

<script lang="ts" setup>
import LightweightChartFTMulti from '@/components/lw-charts/LightweightChartFTMulti.vue'
const investmentMarketTickers = [
  'GB00BFBFYB71:GBP',
  'GB00BFBFYJ57:GBP',
  'GB00BFBFYQ25:GBP',
  'GB00BFBFYX91:GBP',
  'GB00BFBFZ140:GBP',
  'GB00BN090M98:GBP',
  //'GB00B18B9X76:GBP',
  'IE00B3NS4D25:GBP',
]

/*
GB00BFBFYB71:GBP
GB00BFBFYJ57:GBP
GB00BFBFYQ25:GBP
GB00BFBFYX91:GBP
GB00BFBFZ140:GBP
GB00BN090M98:GBP
GB00B18B9X76:GBP
IE00B3NS4D25:GBP

const FT_MY_MAPX_FUND_SYMBOLS = [
    {name: "MyMap 3 Fund D Acc", symbol: "543012729", scale: 100.0},
    {name: "MyMap 4 Fund D Acc", symbol: "542997798", scale: 100.0},
    {name: "MyMap 5 Select ESG Fund D Acc", symbol: "604977373", scale: 100.0},
    {name: "MyMap 6 Fund D Acc", symbol: "542990218", scale: 100.0},
    {name: "MyMap 7 Select ESG Fund D Acc", symbol: "722345773", scale: 100.0},
    {name: "Lindsell Train UK EqtyFund D Acc", symbol: "72625433", scale: 1.0}
*/
</script>

<style scoped></style>
