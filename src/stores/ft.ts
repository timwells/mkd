import { defineStore } from 'pinia'

/*
{
  "name": "VanEck Rare Earth and Strategic Metals UCITS ETF A USD Acc",
  "ticker": "REGB:LSE:GBP",
  "data": [
      {
          "time": "2021-09-29",
          "value": 13.709
      }
    ]
}
*/

interface DataItem {
  name: string
  ticker: string
  data: any[]
}

// const apiKey = import.meta.env.VITE_API_KEY
const GFC = import.meta.env.VITE_GCF_URL

export const useFtStore = defineStore('ft', {
  state: () => ({
    data: [] as DataItem[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isLoading: (state): boolean => state.loading,
    getError: (state): string | null => state.error,
    getByTicker:
      (state) =>
      (ticker: string): DataItem | undefined =>
        state.data.find((item) => item.ticker === ticker),
  },

  actions: {
    async getHistoricalSeries(ticker: string): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${GFC}/ft/historical/series?ticker=${ticker}`)
        if (!response.ok) throw new Error('Failed to fetch items')
        const data = await response.json()

        const index = this.data.findIndex((item) => item.ticker === ticker)
        if (index !== -1) {
          this.data[index] = data // Update existing object
        } else {
          this.data.push(data) // Add new object
        }
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
  },
})
