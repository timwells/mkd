<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
    <VaCard v-for="fund in fundinfo" :key="fund.ticker" square outlined class="rounded-xl">
      <VaCardTitle>{{ fund.title }}</VaCardTitle>
      <VaCardContent>
        <img :src="makeFundUrl(fund.ticker)" alt="Fund Chart" />
      </VaCardContent>
    </VaCard>
  </div>
</template>

<script setup lang="ts">
const fundinfo = [
  {
    ticker: 'FKSFU',
    title: 'UBS S&P 500 INDEX CLASS C-ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FQCQM',
    title: 'BLACKROCK MYMAP6 CLASS D-ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FQCQK',
    title: 'BLACKROCK MYMAP5 CLASS D-ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FQCQI',
    title: 'BLACKROCK MYMAP4 CLASS D-ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FQCQG',
    title: 'BLACKROCK MYMAP3 CLASS D-ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FR2QB',
    title: 'BLACKROCK MYMAP5 ESG CLASS D-ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FK4VD',
    title: 'LINDS TRAIN UK EQUITY CLASS D-ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FK6WV',
    title: 'LINDS TRAIN GLB EQUITY-DIST CLASS D-INCOME GBP',
    type: 'fund',
  },
  {
    ticker: 'B65TLW2',
    title: 'DIVERSE INCOME TRUST PLC',
    type: 'equity',
  },
  {
    ticker: 'FLGITA',
    title: 'L&G ACTIVE GLOBAL HIGH YIELD CLASS I - ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FJXZ1',
    title: 'Artemis Global INCOME - GBP',
    type: 'fund',
  },
  {
    ticker: 'FQXBQ',
    title: 'L&G Gbl Robotics & Automation Index - ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'BPK4C11',
    title: 'BTC London Company GBP',
    type: 'fund',
  },
  {
    ticker: 'FG18U',
    title: 'HSBC FTSE 100 INDEX CLASS C - ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FM2DN',
    title: 'HSBC FTSE 250 Index CLASS S - ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FKLDQ',
    title: 'HSBC FTSE All-World Idx Class C- ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FBGAMAB',
    title: 'BAILLIE GIFFORD AMERICAN CLASS B - ACCUM GBP',
    type: 'fund',
  },
  {
    ticker: 'FLSX6',
    title: 'Fundsmith Equity CLASS I ACCUM',
    type: 'fund',
  },
  {
    ticker: 'FOA4T',
    title: 'Fundsmith Sustainable Equity CLASS I ACCUM',
    type: 'fund',
  },
  {
    ticker: 'FNCNN',
    title: 'Jupiter India (Class X)',
    type: 'fund',
  },
  {
    ticker: 'FQQTT',
    title: 'Alquity Indian Subcontinent (Class I)',
    type: 'fund',
  },
  {
    ticker: 'FQF1R',
    title: 'Schroder India Equity (Class Z)',
    type: 'fund',
  },
  {
    ticker: 'FW97J',
    title: 'Legal & General Future World ESG Asia Pacific Indx',
    type: 'fund',
  },
  {
    ticker: 'FOVCU',
    title: 'FSSA Indian Subcontinent All-Cap Fund (E)',
    type: 'fund',
  },
  {
    ticker: 'FN924',
    title: 'Liontrust India (Class C)',
    type: 'fund',
  },
  {
    ticker: 'FOS1H',
    title: 'L&G Global Infrastructure Index (C)',
    type: 'fund',
  },
]

const makeFundUrl = (code: string) => {
  const HOST = 'https://webfund6.financialexpress.net'
  const PATH = '/clients/Hargreaves/chartbuilder.aspx'
  const PARAMS = `codes=${code}&color=0047AB&hide=&span=M120&plotSingleAsPrice=true&totalReturn=false&yAxisLabel=_`
  return `${HOST}${PATH}?${PARAMS}`
}
</script>

<style scoped>
.demo-container {
  display: flex;
  gap: 20px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  height: 100vh;
  box-sizing: border-box;
}

.controls {
  flex: 0 0 280px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

h2 {
  margin: 0 0 10px 0;
  font-size: 20px;
  color: #333;
}

h3 {
  margin: 0 0 10px 0;
  font-size: 16px;
  color: #666;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

button {
  padding: 10px 16px;
  background: #2962ff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.2s;
}

button:hover {
  background: #1e4fc2;
}

button:active {
  transform: translateY(1px);
}

label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.series-list {
  border: 1px solid #e1e1e1;
  border-radius: 6px;
  padding: 15px;
  background: #f9f9f9;
}

.series-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  background: white;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 13px;
}

.series-item:last-child {
  margin-bottom: 0;
}

.series-item button {
  padding: 4px 12px;
  font-size: 12px;
  background: #ff5252;
}

.series-item button:hover {
  background: #d32f2f;
}

.chart-wrapper {
  flex: 1;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.lw-chart {
  width: 100%;
  height: 100%;
}
</style>
