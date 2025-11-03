<script lang="ts" setup>
// import RevenueUpdates from './cards/RevenueReport.vue'
// import ProjectTable from './cards/ProjectTable.vue'
// import RevenueByLocationMap from './cards/RevenueByLocationMap.vue'
// import DataSection from './DataSection.vue'
// import YearlyBreakup from './cards/YearlyBreakup.vue'
//import MonthlyEarnings from './cards/MonthlyEarnings.vue'
//import CnnFearAndGreed2 from './cards/CnnFearAndGreed2.vue'
//import RegionRevenue from './cards/RegionRevenue.vue'

import AdaSentiment from './cards/AdaSentiment.vue'

// import Timeline from './cards/Timeline.vue'

import { ref } from 'vue'
const selectedTab = ref('Sentiment')
</script>


<template>
  <VaTabs v-model="selectedTab">
    <VaTab name="Sentiment">Sentiment</VaTab>
    <VaTab name="RegionRevenue">Region Revenue</VaTab>
    <VaTab name="MonthlyEarnings">Monthly Earnings</VaTab>
    <VaTab name="AdaSentiment">Ada Sentiment</VaTab>
  </VaTabs>

  <div v-if="selectedTab === 'Sentiment'">
    <!--CnnFearAndGreed2 /-->
  </div>
  <div v-else-if="selectedTab === 'RegionRevenue'">
    <!--RegionRevenue /-->
  </div>
  <div v-else-if="selectedTab === 'MonthlyEarnings'">
    <!--MonthlyEarnings /-->
  </div>

  <div v-else-if="selectedTab === 'AdaSentiment'">
    <AdaSentiment />
  </div>

</template>