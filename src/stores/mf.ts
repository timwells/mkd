import { defineStore } from 'pinia'

interface DataPoint {
  time: string
  value: number
}

interface DataItem {
  name: string
  ticker: string
  data: DataPoint[]
}

const GFC = import.meta.env.VITE_GCF_URL
const TTL_MS = 12 * 60 * 60 * 1000 // 12 hours

interface CacheEntry {
  timestamp: number
  item: DataItem
}

export const useMfStore = defineStore('mf', {
  state: () => ({
    loading: false,
    error: null as string | null,

    // Only store ONE dataset -> the cache
    cache: {} as Record<string, CacheEntry>,
  }),

  getters: {
    isLoading: (state): boolean => state.loading,
    getError: (state): string | null => state.error,

    getByTicker:
      (state) =>
      (ticker: string): DataItem | undefined =>
        state.cache[ticker]?.item,
  },

  actions: {
    async getHistoricalSeries(ticker: string): Promise<void> {
      this.loading = true
      this.error = null

      const now = Date.now()
      const cached = this.cache[ticker]

      // ✔ Cache hit
      if (cached && now - cached.timestamp < TTL_MS) {
        this.loading = false
        return
      }

      // ✔ Fetch from API
      try {
        // exchange=LSE&symbol=RNWH&precision=Day&period=Max
        const response = await fetch(
          `${GFC}/fool/historical/values?exchange=LSE&symbol=${ticker}&precision=Day&period=Max`,
        )
        if (!response.ok) throw new Error(`Failed to fetch: ${ticker}`)

        const item: DataItem = await response.json()

        // ✔ Update cache only (no dup licate elsewhere)
        this.cache[ticker] = {
          timestamp: now,
          item,
        }
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
  },
})
