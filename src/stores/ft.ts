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

import { defineStore } from 'pinia'

interface DataItem {
  name: string
  ticker: string
  data: any[]
}

const GFC = import.meta.env.VITE_GCF_URL
const TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

interface CacheEntry {
  timestamp: number
  item: DataItem
}

export const useFtStore = defineStore('ft', {
  state: () => ({
    data: [] as DataItem[],
    loading: false,
    error: null as string | null,

    // --- In-memory cache only ---
    cache: {} as Record<string, CacheEntry>,
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

      // --- IN-MEMORY CACHE CHECK ---
      const cached = this.cache[ticker]
      const now = Date.now()

      if (cached && (now - cached.timestamp) < TTL_MS) {
        // Cache hit → ensure it's in `state.data`
        const index = this.data.findIndex(i => i.ticker === ticker)
        if (index === -1) {
          this.data.push(cached.item)
        }
        this.loading = false
        return
      }

      // --- FETCH FROM API ---
      try {
        const response = await fetch(`${GFC}/ft/historical/series?ticker=${ticker}`)
        if (!response.ok) throw new Error(`Failed to fetch: ${ticker}`)

        const data: DataItem = await response.json()

        // Update state
        const index = this.data.findIndex(item => item.ticker === ticker)
        if (index !== -1) {
          this.data[index] = data
        } else {
          this.data.push(data)
        }

        // Update in-memory cache
        this.cache[ticker] = {
          timestamp: now,
          item: data
        }

      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
  },
})


