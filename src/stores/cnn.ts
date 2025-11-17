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
export interface MarketHistorical {
  timestamp: number
  score: number
  rating: string
  data: TimeDataPair[]
}

export type FearAndGreedHistorical = MarketHistorical
export type MarketVolatilityHistorical = MarketHistorical
export type MarketMomentumSp500Historical = MarketHistorical
export type MarketMomentumSp500MA200 = TimeDataPair
export type MarketMomentumSp500MA100 = TimeDataPair
export type MarketMomentumSp500MA50 = TimeDataPair

function isTimeDataPairArray(value: any): value is TimeDataPair[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) => Array.isArray(item) && item.length === 2 && typeof item[0] === 'number' && typeof item[1] === 'number',
    )
  )
}
/*
function isFearAndGreedHistorical(value: any): value is FearAndGreedHistorical {
  return (
    typeof value === 'object' &&
    typeof value?.timestamp === 'number' &&
    typeof value?.score === 'number' &&
    typeof value?.rating === 'string' &&
    isTimeDataPairArray(value?.data)
  )
}
*/
function isMarketHistorical(value: any): value is MarketHistorical {
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
    marketMomentumSp500Historical: null as MarketVolatilityHistorical | null,
    marketMomentumSp500MA200: null as any | null,
    marketMomentumSp500MA100: null as any | null,
    marketMomentumSp500MA50: null as any | null,
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
        if (isMarketHistorical((json as any)?.fear_and_greed_historical)) {
          this.fearAndGreedHistorical = (json as any).fear_and_greed_historical
        } else {
          this.fearAndGreedHistorical = null
        }

        if (isMarketHistorical((json as any)?.market_volatility_vix)) {
          this.marketVolatilityHistorical = (json as any).market_volatility_vix
        } else {
          this.marketVolatilityHistorical = null
        }

        this.marketMomentumSp500Historical = (json as any).market_momentum_sp500
        this.marketMomentumSp500MA200 = (json as any).market_momentum_sp500_MA200
        this.marketMomentumSp500MA100 = (json as any).market_momentum_sp500_MA100
        this.marketMomentumSp500MA50 = (json as any).market_momentum_sp500_MA50
      } catch (err: any) {
        this.error = err.message ?? 'Unknown Error'
      } finally {
        this.loading = false
      }
    },
  },
})
