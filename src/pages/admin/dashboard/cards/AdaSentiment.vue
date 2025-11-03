<template>
  <VaCard>
    <VaCardTitle>
      <h1 class="card-title text-tag text-secondary font-bold uppercase">ADA Sentiment</h1>
    </VaCardTitle>
    <VaCardContent>
      <!--div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
      </div-->
      <pre>{{ store.data }}</pre>  
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
/* Removed redundant export default block */


import { useAdaStore } from '../../../../stores/ada'
// import DataSectionItem from '../DataSectionItem.vue'

const store = useAdaStore();
store.getSentiment('GLD', '1h');
store.getSentiment('BZ=F', '1h');
store.getSentiment('GEORISK', '1d');

</script>
