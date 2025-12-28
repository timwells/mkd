<template>
  <div class="tabs-container">
    <!-- Tabs -->
    <VaTabs v-model="value" class="tabs-left">
      <template #tabs>
        <VaTab v-for="tab in store.getHolderNames" :key="tab" :name="tab">{{ tab }}</VaTab>
      </template>
    </VaTabs>
    <!-- Tab Content -->
    <div class="tab-content" outlined>
      <section class="flex flex-col gap-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="w-full sm:w-[20%]" >
            <VaCard square outlined class="rounded-xl">
              <VaCardTitle>
                <h1 class="card-title text-tag text-secondary font-bold uppercase">This Month Winnings</h1>
              </VaCardTitle>
              <VaCardContent>
                <div class="p-1 bg-black rounded absolute right-4 top-4">
                  <VaIcon name="mso-attach_money" color="#fff" size="large" />
                </div>
                <section>
                  <div class="text-xl font-bold mb-2">£ {{ currentTabData?.currentMonthWins }}
                    <span :class="['text-xs', {
                      'text-success': currentTabData?.percentageChangeFromLastMonthDirection > 0,
                      'text-info': currentTabData?.percentageChangeFromLastMonthDirection === 0,
                      'text-danger': currentTabData?.percentageChangeFromLastMonthDirection < 0,
                      }]">
                      <VaIcon :name="currentTabData?.percentageChangeFromLastMonthDirection > 0 ? 
                        'arrow_upward' : currentTabData?.percentageChangeFromLastMonthDirection === 0 ? 
                        'arrow_outward' : 
                        'arrow_downward'" />
                      {{ currentTabData?.percentageChangeFromLastMonth }} %</span>  
                  </div>
                </section>
                <div class="w-full flex items-center"></div>
              </VaCardContent>
            </VaCard>
            <VaCard square outlined class="rounded-xl">
              <VaCardTitle>
                <h1 class="card-title text-tag text-secondary font-bold uppercase">Last Month Winnings</h1>
              </VaCardTitle>
              <VaCardContent>
                <div class="p-1 bg-black rounded absolute right-4 top-4">
                  <VaIcon name="mso-attach_money" color="#fff" size="large" />
                </div>
                <section>
                  <div class="text-xl font-bold mb-2">£ {{ currentTabData?.lastMonthWins }}</div>
                  <!--p class="text-xs text-success">
                    <VaIcon name="arrow_upward" />
                    25.36%
                    <span class="text-secondary"> current month</span>
                  </p-->
                </section>
                <div class="w-full flex items-center"></div>
              </VaCardContent>
            </VaCard>

            <VaCard square outlined class="rounded-xl">
              <VaCardTitle>
                <h1 class="card-title text-tag text-secondary font-bold uppercase">6 Month Winnings</h1>
              </VaCardTitle>
              <VaCardContent>
                <div class="p-1 bg-black rounded absolute right-4 top-4">
                  <VaIcon name="mso-attach_money" color="#fff" size="large" />
                </div>
                <section>
                  <div class="text-xl font-bold mb-2">£ {{ currentTabData?.lastSixMonthWins }}</div>
                  <!-- p class="text-xs text-success">
                    <VaIcon name="arrow_upward" />
                    25.36%
                    <span class="text-secondary"> last month</span>
                  </p-->
                </section>
                <div class="w-full flex items-center">
                </div>
              </VaCardContent>
            </VaCard>
          </div>

          <!-- data table-->
          <div class="flex flex-col gap-4 w-full sm:w-[80%]">
            <VaCard square outlined class="rounded-xl">
              <EasyDataTable 
                :headers="headers" 
                :items="currentTabData?.prizes ?? []" 
                alternating 
                :loading="store.loading"/>
            </VaCard>
          </div>
        </div>
      </section>
    </div> 
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Header } from 'vue3-easy-data-table'
import { usePbStore } from '@/stores/pb'
const PREMIUM_BOND_HOLDERS = import.meta.env.VITE_PREMIUM_BOND_HOLDERS

const store = usePbStore()
const value = ref(store.getHolderNames[0] || 'Tim')

const headers: Header[] = [
  { text: 'Prize', value: 'prize' },
  { text: 'Bond', value: 'bond' },
  { text: 'Date', value: 'shortDate' },
]

// Define the shape of your data
interface PremiumBondsResponse {
  results: Array<{
    prize: number
    bond: string
    shortDate: string
  }>
}

const currentTabData = computed(
  () => store.data[store.getHolderNames.indexOf(value.value)] ?? null,
) as any as PremiumBondsResponse | null

store.getResults(PREMIUM_BOND_HOLDERS)
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
