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
          <LightweightChartFTMultiMA :tickers="goldTickers" type="line" />
        </VaCardContent>
      </VaCard>
    </div>

    <div v-if="value === 'Silver'" class="tab-content" outlined>
      <VaCard square outlined class="rounded-xl">
        <VaCardTitle>Silver</VaCardTitle>
        <VaCardContent no-padding style="height: 600px">
          <LightweightChartFTMultiMA :tickers="silverTickers" type="line" />
        </VaCardContent>
      </VaCard>
    </div>

    <div v-if="value === 'ETFs'" class="tab-content" outlined>
      <VaCard square outlined class="rounded-xl">
        <VaCardTitle>ETFs</VaCardTitle>
        <VaCardContent no-padding style="height: 600px">
          <LightweightChartFTMultiMA :tickers="metalsEtfTickers" type="line" />
        </VaCardContent>
      </VaCard>
    </div>

    <div v-if="value === 'Equities'" class="tab-content" outlined>
      <VaCard square outlined class="rounded-xl">
        <VaCardTitle>Equities</VaCardTitle>
        <VaCardContent no-padding style="height: 600px">
          <LightweightChartFTMultiMA :tickers="equityTickers" type="line" />
        </VaCardContent>
      </VaCard>
    </div>

    <div v-if="value === 'GVIX'" class="tab-content" outlined>
      <VaCard square outlined class="rounded-xl">
        <VaCardContent no-padding style="height: 600px">
          <iframe
            src="https://fred.stlouisfed.org/graph/graph-landing.php?g=1iobf"
            height="600px"
            width="300%"
            frameborder="0"
            scrolling="no"
          ></iframe>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// import LightweightChartFTMulti from '@/components/lw-charts/LightweightChartFTMulti.vue'
import LightweightChartFTMultiMA from '@/components/lw-charts/LightweightChartFTMultiMA.vue'

const tabs = ['Gold', 'Silver', 'ETFs', 'GVIX','Equities']
const value = ref('Gold')
const metalsEtfTickers = [
  'REGB:LSE:GBP&mas=50,100,200',
  'GJGB:LSE:GBP&mas=50,100,200',
  'URNG:LSE:GBP&mas=50,100,200',
  'NUCG:LSE:GBP&mas=50,100,200',
  'GDGB:LSE:GBP&mas=50,100,200',
]
const goldTickers = ['GC.1:CMX&mas=50,100,200']
const silverTickers = ['US@SI.1:CMX&mas=50,100,200']
const equityTickers = ['SLP&mas=50,100,200']

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
