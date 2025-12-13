<template>
  <div class="tabs-container">
    <!-- Tabs -->
    <VaTabs v-model="value" class="tabs-left">
      <template #tabs>
        <VaTab v-for="tab in tabs" :key="tab" :name="tab">{{ tab }}</VaTab>
      </template>
    </VaTabs>

    <!-- Tab Content -->
    <div v-if="value === 'Gold'" class="tab-content" outlined>
      <VaCard square outlined class="rounded-xl">
        <VaCardTitle>Gold</VaCardTitle>
        <VaCardContent no-padding style="height: 600px">
          <LightweightChartFTMulti :tickers="goldTickers" type="line" />
        </VaCardContent>
      </VaCard>
    </div>

    <div v-if="value === 'Silver'" class="tab-content" outlined>
      <VaCard square outlined class="rounded-xl">
        <VaCardTitle>Silver</VaCardTitle>
        <VaCardContent no-padding style="height: 600px">
          <LightweightChartFTMulti :tickers="silverTickers" type="line" />
        </VaCardContent>
      </VaCard>
    </div>

    <div v-if="value === 'ETFs'" class="tab-content" outlined>
      <VaCard square outlined class="rounded-xl">
        <VaCardTitle>ETFs</VaCardTitle>
        <VaCardContent no-padding style="height: 600px">
          <LightweightChartFTMulti :tickers="metalsEtfTickers" type="line" />
        </VaCardContent>
      </VaCard>
    </div>

    <div v-if="value === 'GVIX'" class="tab-content" outlined>
      <VaCard square outlined class="rounded-xl">
        <VaCardContent no-padding style="height: 600px">
          <iframe src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1iobf" height="600px" width="300%" frameborder="0" scrolling="no"></iframe>
        </VaCardContent>
      </VaCard>
    </div>

  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const tabs = ['Gold', 'Silver', 'ETFs', 'GVIX']
const value = ref('Gold')

import LightweightChartFTMulti from '@/components/lw-charts/LightweightChartFTMulti.vue'
const metalsEtfTickers = ['REGB:LSE:GBP', 'GJGB:LSE:GBP', 'URNG:LSE:GBP', 'NUCG:LSE:GBP', 'GDGB:LSE:GBP']
const goldTickers = ['GC.1:CMX']
const silverTickers = ['US@SI.1:CMX']
</script>

<style scoped>
:deep(.tabs-left) .va-tabs__content {
  display: flex !important;
  justify-content: flex-start !important;
  align-items: center !important;
  gap: 12px;
}

.tab-content {
  margin-top: 1rem;
}
</style>
