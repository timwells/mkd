<template>
  <div>
    <!--LightweightChartMtplMulti :tickers="['shiller-pe&mas=50,100,200']" type="line" /-->
    <!--LightweightChartFTMulti :tickers="['UK10YG']" type="line" /-->
    <LightweightChartCnbcMulti :tickers="['UK2Y-GB','UK5Y-GB','UK10Y-GB','UK30Y-GB']" type="line" />

  </div>
</template>

<script setup>
//import LightweightChartFTMulti from '@/components/lw-charts/LightweightChartFTMulti.vue'
//import LightweightChartMfMulti from '@/components/lw-charts/LightweightChartMfMulti.vue'
//import LightweightChartMtplMulti from '@/components/lw-charts/LightweightChartCnbcMulti.vue'
import LightweightChartCnbcMulti from '@/components/lw-charts/LightweightChartCnbcMulti.vue';
</script>
