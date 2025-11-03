import { defineStore } from 'pinia'

/*
  {
    "date_time": "2025-11-03T18:00:00",
    "score_adj": 84,
    "coverage": 57,
    "ticker": "BZ=F",
    "score_label": "Greed",
    "coverage_label": "Neutral",
    "score_change_1d": 23,
    "coverage_change_1d": 27,
    "created_at": "2025-11-03T21:00:32",
    "freq": "3h"
  },
*/

interface DataItem {
  ticker: string;
  [key: string]: any;
}

const apiKey = import.meta.env.VITE_API_KEY
const GFC = import.meta.env.VITE_GCF_URL

export const useAdaStore = defineStore('ada', {
  state: () => ({
    data: [] as DataItem[],
    loading: false,
    error: null as string | null,
    cnn: null as any,
  }),

  getters: {
    getData: (state) => state.data,
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getByTicker: (state) => (ticker: string) => {
      return state.data.find(item => item.ticker === ticker)
    },
  },

  actions: {
    async getSentiment(ticker: string, freq: string) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${GFC}/ada/sentiment?ticker=${ticker}&freq=${freq}`)
        if (!response.ok) throw new Error('Failed to fetch items')
        const data = await response.json()
        const index = this.data.findIndex(item => item.ticker === ticker);
        if (index !== -1) {
          this.data[index] = data; // Update existing object
        } else {
          this.data.push(data); // Add new object
        }
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
  },
})
