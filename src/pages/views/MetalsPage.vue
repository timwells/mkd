<template>
  <div>
    <LightweightChartFTMulti
      :tickers="['GB00BFBFYB71:GBP', 'GB00BFBFYJ57:GBP', 'GB00BFBFYQ25:GBP', 'GB00BFBFZ140:GBP', 'GB00BN090M98:GBP']"
      type="line"
    />

    <!--LightweightChartFT
      ticker="REGB:LSE:GBP"
      type="line"
    /-->
    <!--LightweightChartFT
      ticker="GB00BFBFZ140:GBP"
      type="line"
    /-->
  </div>
</template>

<script setup>
// import LightweightChartFT from'@/components/tradeview/LightweightChartFT.vue'
// GB00BFBFZ140:GBP
import LightweightChartFTMulti from '@/components/tradeview/LightweightChartFTMulti.vue'
</script>
