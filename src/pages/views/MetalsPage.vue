<template>
  <div>
    <!--LightweightChartFTMulti
      :tickers="['GB00BFBFYB71:GBP', 'GB00BFBFYJ57:GBP', 'GB00BFBFYQ25:GBP', 'GB00BFBFZ140:GBP', 'GB00BN090M98:GBP']"
      type="line"
    /-->

    <LightweightChartMfMulti
      :tickers="['BP.', 'SHEL', 'HBR', 'SQZ', 'RKH' ]"
      type="line"
    />
  </div>
</template>
RNWH
<script setup>
//import LightweightChartFTMulti from '@/components/tradeview/LightweightChartFTMulti.vue'
import LightweightChartMfMulti from '@/components/tradeview/LightweightChartMfMulti.vue';
</script>
