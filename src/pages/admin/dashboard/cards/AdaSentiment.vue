<template>
  <VaCard>
    <VaCardTitle>
      <h1 class="card-title text-tag text-secondary font-bold uppercase">Sentiment</h1>
    </VaCardTitle>
    <VaCardContent>
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <DataSectionItem 
          :title="store.getByTicker('BZ=F')?.name ?? _waiting" 
          :value="store.getByTicker('BZ=F')?.score_label.toString() ?? _waiting"
          :changeText="Math.abs(Number(store.getByTicker('BZ=F')?.score_change_1d ?? 0)).toString() + '%'"
          :up="store.getByTicker('BZ=F')?.score_change_1d > 0"
          period="than yesterday"
          iconBackground="bg-red-500" 
          iconColor="text-white"
        />
        <DataSectionItem 
          :title="store.getByTicker('GLD')?.name ?? _waiting" 
          :value="store.getByTicker('GLD')?.score_label.toString() ?? _waiting"
          :changeText="Math.abs(Number(store.getByTicker('GLD')?.score_change_1d ?? 0)).toString() + '%'"
          :up="store.getByTicker('GLD')?.score_change_1d > 0"
          period="than yesterday"
          iconBackground="bg-red-500" 
          iconColor="text-white"
        />
        <DataSectionItem 
          :title="store.getByTicker('GEORISK')?.name ?? _waiting" 
          :value="store.getByTicker('GEORISK')?.score_label.toString() ?? _waiting"
          :changeText="Math.abs(Number(store.getByTicker('GEORISK')?.score_change_1d ?? 0)).toString() + '%'"
          :up="store.getByTicker('GEORISK')?.score_change_1d > 0"
          period="than yesterday"
          iconBackground="bg-red-500" 
          iconColor="text-white"
        />
        <DataSectionItem 
          :title="store.getByTicker('XHB')?.name ?? _waiting" 
          :value="store.getByTicker('XHB')?.score_label.toString() ?? _waiting"
          :changeText="Math.abs(Number(store.getByTicker('XHB')?.score_change_1d ?? 0)).toString() + '%'"
          :up="store.getByTicker('XHB')?.score_change_1d > 0"
          period="than yesterday"
          iconBackground="bg-red-500" 
          iconColor="text-white"
        />

      </div>
      <!--pre>{{ store.data }}</pre-->  
    </VaCardContent>
  </VaCard>
</template>

<script setup lang="ts">
/* Removed redundant export default block */


import { useAdaStore } from '../../../../stores/ada'
import DataSectionItem from '../DataSectionItem.vue'

const _up = true
const _waiting = '-'

const store = useAdaStore();
store.getSentiment('GLD', '1h','GOLD');
store.getSentiment('BZ=F', '1h','OIL');
store.getSentiment('GEORISK', '1d','Geopolitical Risk');
store.getSentiment('XHB', '1d','Real Estate');
</script>
