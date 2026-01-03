<template>
  <div class="tabs-container">
    <!-- Tabs -->
    <VaTabs v-model="selectedTab" class="tabs-left">
      <template #tabs>
        <VaTab v-for="mtab in mainTabs" :key="mtab" :name="mtab">
          {{ mtab }}
        </VaTab>
      </template>
    </VaTabs>

    <div v-if="selectedTab === mainTab1" class="tab-content" outlined>
      <VaCard square outlined class="rounded-xl">
        <VaCardTitle>
          <h1 class="font-bold uppercase">{{ pbStore.nationalWinners?.period }}</h1>
        </VaCardTitle>
        <EasyDataTable
          :headers="nationalWinnersHeader"
          :items="pbStore.nationalWinners?.winners ?? []"
          alternating
          :loading="isLoading"
          :rows-per-page="5000"
          pagination="false"
        />
      </VaCard>
    </div>

    <div v-if="selectedTab === mainTab2" class="tab-content" outlined>
      <VaCard square outlined class="rounded-xl">
        <VaCardTitle>
          <h1 class="font-bold uppercase">Holders</h1>
        </VaCardTitle>
        <VaCardContent>
          <div class="tabs-container">
            <VaTabs v-model="holderSelectedTab" class="tabs-left">
              <template #tabs>
                <VaTab v-for="holderTab in getHolderNames" :key="holderTab" :name="holderTab">{{ holderTab }}</VaTab>
              </template>
            </VaTabs>
            <div class="tab-content" outlined>
              <section class="flex flex-col gap-4">
                <div class="flex flex-col sm:flex-row gap-4">
                  <div class="w-full sm:w-[20%]">
                    <VaCard square outlined class="rounded-xl">
                      <VaCardTitle>
                        <h1 class="card-title text-tag text-secondary font-bold uppercase">Next Draw Date</h1>
                      </VaCardTitle>
                      <VaCardContent>
                        <!--div class="p-1 bg-black rounded absolute right-4 top-4">
                          <VaIcon name="event" color="#fff" size="large" />
                        </div-->
                        <div class="text-xs mb-2">
                          {{ nextDrawDate2?.text || 'No draw date available' }}
                        </div>
                        <div class="w-full flex items-center"></div>
                      </VaCardContent>
                    </VaCard>
                    <VaCard square outlined class="rounded-xl">
                      <VaCardTitle>
                        <h1 class="card-title text-tag text-secondary font-bold uppercase">This Month Winnings</h1>
                      </VaCardTitle>
                      <VaCardContent>
                        <div class="p-1 bg-black rounded absolute right-4 top-4">
                          <VaIcon name="mso-currency_pound" color="#FFF" size="large" />
                        </div>
                        <section>
                          <div class="text-xl font-bold mb-2">
                            £ {{ currentTabData?.currentMonthWins }}
                            <span
                              :class="[
                                'text-xs',
                                {
                                  'text-success': currentTabData?.percentageChangeFromLastMonthDirection > 0,
                                  'text-info': currentTabData?.percentageChangeFromLastMonthDirection === 0,
                                  'text-danger': currentTabData?.percentageChangeFromLastMonthDirection < 0,
                                },
                              ]"
                            >
                              <VaIcon
                                :name="
                                  currentTabData?.percentageChangeFromLastMonthDirection > 0
                                    ? 'arrow_upward'
                                    : currentTabData?.percentageChangeFromLastMonthDirection === 0
                                      ? 'arrow_outward'
                                      : 'arrow_downward'
                                "
                              />
                              {{ currentTabData?.percentageChangeFromLastMonth }} %</span
                            >
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
                          <VaIcon name="mso-currency_pound" color="#FFF" size="large" />
                        </div>
                        <section>
                          <div class="text-xl font-bold mb-2">£ {{ currentTabData?.lastMonthWins }}</div>
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
                          <VaIcon name="mso-currency_pound" color="#FFF" size="large" />
                        </div>
                        <section>
                          <div class="text-xl font-bold mb-2">£ {{ currentTabData?.lastSixMonthWins }}</div>
                        </section>
                        <div class="w-full flex items-center"></div>
                      </VaCardContent>
                    </VaCard>
                  </div>

                  <div class="flex flex-col gap-4 w-full sm:w-[80%]">
                    <VaCard square outlined class="rounded-xl">
                      <EasyDataTable
                        :headers="prizeHeader"
                        :items="currentTabData?.prizes ?? []"
                        alternating
                        :loading="isLoading"
                        :rows-per-page="200"
                        :pagination="false"
                      />
                    </VaCard>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </VaCardContent>
      </VaCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { usePbStore } from '@/stores/pb'
import { Header } from 'vue3-easy-data-table'

import type { PremiumBondHolderResults, PremiumBondsNextDrawDate } from '@/stores/pb'
const PREMIUM_BOND_HOLDERS = import.meta.env.VITE_PREMIUM_BOND_HOLDERS
const pbStore = usePbStore()

const mainTab1 = 'National Winners'
const mainTab2 = 'Holder Results'
const mainTabs = [mainTab1, mainTab2]
const selectedTab = ref(mainTab1)

// Reactive refs from the store (recommended pattern)
const { isLoading, getHolderNames } = storeToRefs(pbStore)

const holderSelectedTab = ref(pbStore.getHolderNames[0] || 'Tim')

const prizeHeader: Header[] = [
  { text: 'Prize', value: 'prize' },
  { text: 'Bond', value: 'bond' },
  { text: 'Date', value: 'shortDate' },
]

const nationalWinnersHeader: Header[] = [
  { text: 'Prize', value: 'prize', sortable: true },
  { text: 'Holdings', value: 'holdings', sortable: true },
  { text: 'Area', value: 'area', sortable: true },
  { text: 'Holdings', value: 'holdings', sortable: true },
  { text: 'Purchase Date', value: 'purchaseDate' },
]

const currentTabData = computed(
  () => pbStore.results[pbStore.getHolderNames.indexOf(holderSelectedTab.value)] ?? null,
) as any as PremiumBondHolderResults

const nextDrawDate2 = computed(() => pbStore.nextDrawDate) as any as PremiumBondsNextDrawDate

onMounted(() => {
  pbStore.getNationalWinners()
  pbStore.getAllResults(PREMIUM_BOND_HOLDERS)
  pbStore.getNextDrawDate()
})
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
