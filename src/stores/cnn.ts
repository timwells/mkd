import { defineStore } from 'pinia'

const GFC = import.meta.env.VITE_GCF_URL

// 60 minutes in milliseconds:
const REQ_AGE_THRESHOLD = 60 * 60 * 1000

// -----------------
// Types
// -----------------
export type TimeDataPair = [number, number]

export interface FearAndGreedData {
  score: number
  rating: string
  timestamp: string // ISO 8601
  previous_close: number
  previous_1_week: number
  previous_1_month: number
  previous_1_year: number
}

export interface FearAndGreedHistorical {
  timestamp: number
  score: number
  rating: string
  data: TimeDataPair[]
}

export interface MarketVolatilityHistorical {
  timestamp: number
  score: number
  rating: string
  data: TimeDataPair[]
}

function isTimeDataPairArray(value: any): value is TimeDataPair[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) => Array.isArray(item) && item.length === 2 && typeof item[0] === 'number' && typeof item[1] === 'number',
    )
  )
}

function isFearAndGreedHistorical(value: any): value is FearAndGreedHistorical {
  return (
    typeof value === 'object' &&
    typeof value?.timestamp === 'number' &&
    typeof value?.score === 'number' &&
    typeof value?.rating === 'string' &&
    isTimeDataPairArray(value?.data)
  )
}

function isMarketVolatilityHistorical(value: any): value is MarketVolatilityHistorical {
  return (
    typeof value === 'object' &&
    typeof value?.timestamp === 'number' &&
    typeof value?.score === 'number' &&
    typeof value?.rating === 'string' &&
    isTimeDataPairArray(value?.data)
  )
}

// -----------------
// Store
// -----------------
export const useCnnStore = defineStore('cnn', {
  state: () => ({
    // data: null as any | null,
    // fearAndGreedData: null as FearAndGreedData | null,
    fearAndGreedHistorical: null as FearAndGreedHistorical | null,
    marketVolatilityHistorical: null as MarketVolatilityHistorical | null,
    loading: false,
    error: null as string | null,
    nextReq: 0 as number, // timestamp (ms)
  }),

  actions: {
    async getMarketSentiment(): Promise<void> {
      const now = Date.now()

      // Check cooldown window before API call
      if (now < this.nextReq) return

      // Set next allowable request time
      this.nextReq = now + REQ_AGE_THRESHOLD

      this.loading = true
      this.error = null

      try {
        const response = await fetch(`${GFC}/cnn/marketsentiment`)
        if (!response.ok) throw new Error('Failed to fetch market sentiment')

        const json = (await response.json()) as unknown

        // Runtime type checks
        if (isFearAndGreedHistorical((json as any)?.fear_and_greed_historical)) {
          this.fearAndGreedHistorical = (json as any).fear_and_greed_historical
        } else {
          this.fearAndGreedHistorical = null
        }

        if (isMarketVolatilityHistorical((json as any)?.market_volatility_vix)) {
          this.marketVolatilityHistorical = (json as any).market_volatility_vix
        } else {
          this.marketVolatilityHistorical = null
        }
      } catch (err: any) {
        this.error = err.message ?? 'Unknown error'
      } finally {
        this.loading = false
      }
    },
  },
})
