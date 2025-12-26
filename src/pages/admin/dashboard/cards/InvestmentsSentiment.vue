<template>
  <VaCard square outlined class="rounded-xl">
    <VaCardTitle>{{ myMapInvestmentMarketTickers }}</VaCardTitle>
    <VaCardContent class="w-full" style="height: 600px">
      <LightweightChartFTMultiMA :tickers="myMapInvestmentMarketTickers" type="line" />
    </VaCardContent>
  </VaCard>
  <VaCard square outlined class="rounded-xl">
    <VaCardTitle>{{ moneyInvestmentMarketTickers }}</VaCardTitle>
    <VaCardContent class="w-full" style="height: 600px">
      <LightweightChartFTMultiMA :tickers="moneyInvestmentMarketTickers" type="line" />
    </VaCardContent>
  </VaCard>
  <VaCard square outlined class="rounded-xl">
    <VaCardTitle>{{ mgInvestmentMarketTickers }}</VaCardTitle>
    <VaCardContent class="w-full" style="height: 600px">
      <LightweightChartFTMultiMA :tickers="mgInvestmentMarketTickers" type="line" />
    </VaCardContent>
  </VaCard>
  <!--VaCard square outlined class="rounded-xl">
    <VaCardTitle>{{ avivaInvestmentMarketTickers }}</VaCardTitle>
    <VaCardContent class="w-full" style="height: 600px">
      <LightweightChartFTMulti :tickers="avivaInvestmentMarketTickers" type="line" />
    </VaCardContent>
  </VaCard-->
</template>

<script lang="ts" setup>
// import LightweightChartFTMulti from '@/components/lw-charts/LightweightChartFTMulti.vue'
import LightweightChartFTMultiMA from '@/components/lw-charts/LightweightChartFTMultiMA.vue'

const myMapInvestmentMarketTickers = [
  'GB00BFBFYB71:GBP&mas=50,100,200',
  'GB00BFBFYJ57:GBP&mas=50,100,200',
  'GB00BFBFYQ25:GBP&mas=50,100,200',
  'GB00BFBFYX91:GBP&mas=50,100,200',
  'GB00BFBFZ140:GBP&mas=50,100,200',
  'GB00BN090M98:GBP&mas=50,100,200',
]

const moneyInvestmentMarketTickers = [
  'GB0007832602:GBP&mas=50,100,200', 
  'GB0007832487:GBP&mas=50,100,200', 
  'GB0007832826:GBP&mas=50,100,200'
]

const mgInvestmentMarketTickers = [
  //"GB0007832826:GBP",
  //"GB00B9GRH067:GBX",
  //"GB00B935C537:GBP",
  'GB00B6QQDK47:GBP&mas=50,100,200',
  'GB0030927700:GBP&mas=50,100,200',
  'DIVI:LSE&mas=50,100,200',
  //"GB00B18B9X76:GBP",
  //"IE00B3NS4D25:GBP"
  //'GB00B18B9X76:GBP',
  //'IE00B3NS4D25:GBP',
]

const avivaInvestmentMarketTickers = [
  //"GB0007832826:GBP",
  'GB00B9GRH067:GBX&mas=50,100,200',
  'GB00B935C537:GBP&mas=50,100,200',
  //"GB00B6QQDK47:GBP",
  //"GB0030927700:GBP",
  //"GB00B18B9X76:GBP",
  //"IE00B3NS4D25:GBP"
  //'GB00B18B9X76:GBP',
  //'IE00B3NS4D25:GBP',
]
</script>

<style scoped></style>
