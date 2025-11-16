<template>
  <div>
    <ag-charts :options="fgOptions"/>
    <ag-charts :options="vixOptions"/>
    <!--pre>{{ store.data.fear_and_greed_historical }}</pre-->
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { AgCharts } from "ag-charts-vue3";
import { useCnnStore } from '@/stores/cnn'

const store = useCnnStore()
store.getMarketSentiment()

const fgOptions = ref({
  data: store.data.fear_and_greed_historical.data,
  title: { text: 'Fear & Greed Index' },
  series: [
    {
      type: 'line',
      xKey: '0',
      yKey: '1',
      yName: 'F&G',          // <-- series name
      stroke: '#57C3E6',
      strokeWidth: 2,
      interpolation: { type: 'smooth' },
      marker: { enabled: false },
      tooltip: {
        enabled: true,
        renderer: (params:any) => {
          const ts = params.datum[0]           // <-- number
          const dateObj = new Date(ts)         // <-- convert to Date
          const date = new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            timeZone: 'UTC',
          }).format(dateObj)

          // content: `${date}\n${params.yValue}`
          return { content: `hello`}
        }
      }    
    },
    { // ---- Horizontal line at 85 ----
      type: 'line',
      data: store.data.fear_and_greed_historical.data.map(d => ({ x: d['0'], y: 85 })),
      xKey: 'x',
      yKey: 'y',
      stroke: '#10b981',
      strokeWidth: 3,
      lineDash: [2, 2],
      tooltip: { enabled: false },
      marker: { enabled: false}
    },
    { // ---- Horizontal line at 15 ----
      type: 'line',
      data: store.data.fear_and_greed_historical.data.map(d => ({ x: d['0'], y: 15 })),
      xKey: 'x',
      yKey: 'y',
      stroke: '#ef4444',
      strokeWidth: 3,
      lineDash: [2, 2],
      tooltip: { enabled: false },
      marker: { enabled: false},
    }
  ],
  axes: [
    { type: 'time', position: 'bottom' },
    { type: 'number', position: 'left', min: 0, max: 100 },
  ],
  legend: {enabled: false}
})
const vixOptions = ref({
  data: store.data.market_volatility_vix.data,
  title: { text: 'VIX Index' },
  series: [
    {
      type: 'line',
      xKey: '0',
      yKey: '1',
      stroke: '#57C3E6',
      strokeWidth: 2,
      interpolation: { type: 'smooth' },
      marker: { enabled: false},
    },
    { // ---- Horizontal line at 35 ----
      type: 'line',
      data: store.data.market_volatility_vix.data.map(d => ({ x: d['0'], y: 35 })),
      xKey: 'x',
      yKey: 'y',
      stroke: '#ef4444',
      strokeWidth: 3,
      lineDash: [2, 2],
      tooltip: { enabled: false },
      marker: { enabled: false}
    },
    { // ---- Horizontal line at 10 ----
      type: 'line',
      data: store.data.market_volatility_vix.data.map(d => ({ x: d['0'], y: 10 })),
      xKey: 'x',
      yKey: 'y',
      stroke: '#10b981',
      strokeWidth: 3,
      lineDash: [2, 2],
      tooltip: { enabled: false },
      marker: { enabled: false},
    }
  ],
  axes: [
    { type: 'time', position: 'bottom' },
    { type: 'number', position: 'left', min: 0, max: 60 },
  ],
  legend: {enabled: false}
})

</script>
