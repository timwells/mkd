<template>
  <div class="tabs-container">
    <!-- Tabs -->
    <VaTabs v-model="value" class="tabs-left">
      <template #tabs>
        <VaTab v-for="tab in tabs" :key="tab" :name="tab">
          {{ tab }}
        </VaTab>
      </template>
    </VaTabs>

    <!-- Tab Content -->
    <VaCard v-if="value === 'BTC F&G'" class="tab-content" outlined>
      <VaCardTitle>Fear & Greed</VaCardTitle>
      <VaCardContent>
        <iframe src="https://charts.bgeometrics.com/graphics/fear_greed.html" height="700" width="100%" />
      </VaCardContent>
    </VaCard>

    <VaCard v-else-if="value === 'M2 Global'" class="tab-content" outlined>
      <VaCardTitle>M2 Global</VaCardTitle>
      <VaCardContent>
        <iframe src="https://charts.bgeometrics.com/graphics/m2_global.html" height="700" width="100%" />
      </VaCardContent>
    </VaCard>

    <VaCard v-else-if="value === 'BTC MA'" class="tab-content" outlined>
      <VaCardTitle>BTC MA</VaCardTitle>
      <VaCardContent>
        <iframe src="https://charts.bgeometrics.com/graphics/moving_average.html" height="700" width="100%" />
      </VaCardContent>
    </VaCard>

    <VaCard v-else-if="value === 'SP500/Gold'" class="tab-content" outlined>
      <VaCardTitle>SP500/Gold</VaCardTitle>
      <VaCardContent>
        <iframe src="https://charts.bgeometrics.com/graphics/sp500_gold.html" height="700" width="100%" />
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const tabs = ['BTC F&G', 'M2 Global', 'BTC MA', 'SP500/Gold']
const value = ref('BTC F&G')
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
