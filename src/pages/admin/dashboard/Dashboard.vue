<template>
  <div>
    <!--VaAlert
      v-if="store?.error"
      color="danger"
      border="top"
      class="mb-6"
      closeable
    >
      {{ store.error }}
    </VaAlert-->

    <div class="tabs-container">
      <!-- Tabs -->
      <VaTabs v-model="value" class="tabs-left">
        <template #tabs>
          <VaTab v-for="tab in tabs" :key="tab" :name="tab">{{ tab }}</VaTab>
        </template>
      </VaTabs>

      <!-- Tab Content -->
      <div v-if="value === 'Sentiment'" class="tab-content" outlined>
        <CnnSentiment />
      </div>
      <div v-if="value === 'Investments'" class="tab-content" outlined>
        <InvestmentsSentiment />
      </div>
      <div v-if="value === 'Shiller'" class="tab-content" outlined>
        <ShillerSentiment />
      </div>
      <div v-if="value === 'Buffet'" class="tab-content" outlined>
        <BuffetSentiment />
      </div>
      <div v-if="value === 'Metals'" class="tab-content" outlined>
        <MetalsSentiment />
      </div>
      <div v-if="value === 'UK Rates'" class="tab-content" outlined>
        <UKRateSentiment />
      </div>
      <div v-if="value === 'Money'" class="tab-content" outlined>
        <MoneySentiment />
      </div>
      <div v-if="value === 'Oil/Gas'" class="tab-content" outlined>
        <OilGasSentiment />
      </div>
      <div v-if="value === 'Resources'" class="tab-content" outlined>
        <Resources />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CnnSentiment from './cards/CnnSentiment.vue'
import MetalsSentiment from './cards/MetalsSentiment.vue'
import MoneySentiment from './cards/MoneySentiment.vue'
import UKRateSentiment from './cards/UKRateSentiment.vue'
import OilGasSentiment from './cards/OilGasSentiment.vue'
import ShillerSentiment from './cards/ShillerSentiment.vue'
import Resources from './cards/Resources.vue'
import InvestmentsSentiment from './cards/InvestmentsSentiment.vue'
import BuffetSentiment from './cards/BuffetSentiment.vue'

const tabs = ['Sentiment', 'Investments', 'Shiller', 'Buffet', 'Metals', 'UK Rates', 'Money', 'Oil/Gas', 'Resources']
const value = ref('Sentiment')
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
