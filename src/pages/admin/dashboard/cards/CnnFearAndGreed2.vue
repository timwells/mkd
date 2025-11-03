<template>
  <VaCard>
    <VaCardTitle>
      <h1 class="card-title text-tag text-secondary font-bold uppercase">Sentiment</h1>
    </VaCardTitle>
    <VaCardContent>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <DataSectionItem 
          title="Today" 
          :value="store.cnn.fear_and_greed.score"
          changeText="Change" 
          :up="_up" 
          iconBackground="bg-red-500" 
          iconColor="text-white"
        />
        <DataSectionItem 
          title="Last Week" 
          :value="store.cnn.fear_and_greed.previous_1_week"
          changeText="Change" 
          :up="_up" 
          iconBackground="bg-red-500" 
          iconColor="text-white"
        />
        <DataSectionItem 
          title="Last Month" 
          :value="store.cnn.fear_and_greed.previous_1_month"
          changeText="Change" 
          :up="_up" 
          iconBackground="bg-red-500" 
          iconColor="text-white"
        />
        <DataSectionItem 
          title="Last Year" 
          :value="store.cnn.fear_and_greed.previous_1_year"
          changeText="Change" 
          :up="_up" 
          iconBackground="bg-red-500" 
          iconColor="text-white"
        />
      </div>
      <!--pre>{{ store.cnn.fear_and_greed_historical }}</pre-->  
      <!--preCnnFearAndGreedChart /-->
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
import { useCnnStore } from '../../../../stores/cnn-store'
import DataSectionItem from '../DataSectionItem.vue'
// import CnnFearAndGreedChart  from './CnnFearAndGreedChart.vue'

const _up = true
const store = useCnnStore();
store.load();

/*
{
  "score": 53.77,
  "rating": "neutral",
  "timestamp": "2025-10-03T23:59:49+00:00",
  "previous_close": 50.94,
  "previous_1_week": 53.6,
  "previous_1_month": 51.6,
  "previous_1_year": 69.43
}
*/

</script>
