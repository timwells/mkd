<template>
  <div>
    <!--LightweightChartMtplMulti :tickers="['shiller-pe&mas=50,100,200']" type="line" /-->
    <LightweightChartFTMulti :tickers="['UK10YG']" type="line" />
  </div>
</template>
RNWH
<script setup>
import LightweightChartFTMulti from '@/components/lw-charts/LightweightChartFTMulti.vue'
//import LightweightChartMfMulti from '@/components/lw-charts/LightweightChartMfMulti.vue'
import LightweightChartMtplMulti from '@/components/lw-charts/LightweightChartMtplMulti.vue'
</script>
