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
        <VaCardContent> </VaCardContent>
      </VaCard>
    </div>

    <div v-if="value === 'ETFs'" class="tab-content" outlined>
      <VaCard square outlined class="rounded-xl">
        <VaCardTitle>ETFs</VaCardTitle>
        <VaCardContent>
          <LightweightChartFTMulti :tickers="metalsEtfTickers" type="line" />
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
const tabs = ['Gold', 'ETFs']
const value = ref('ETFs')

import LightweightChartFTMulti from '@/components/lw-charts/LightweightChartFTMulti.vue'
const metalsEtfTickers = ['REGB:LSE:GBP', 'GJGB:LSE:GBP', 'URNG:LSE:GBP', 'NUCG:LSE:GBP', 'GDGB:LSE:GBP']
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
