import { defineStore } from 'pinia'
import moment from 'moment'
const GFC = import.meta.env.VITE_GCF_URL
const API_KEY = import.meta.env.VITE_API_KEY
const REQ_AGE_THRESHOLD = 12 * 60 * 60 * 1000 // 12 hours
export interface PremiumBondHolderResults {
  lastSixMonthWins: number
  currentMonthWins: number
  lastMonthWins: number
  percentageChangeFromLastMonth: number
  percentageChangeFromLastMonthDirection: number
  prizes: Array<{
    prize: number
    bond: string
    shortDate: string
  }>
}
export interface PremiumBondsNextDrawDate {
  text: string
}

export interface PremiumBondNationalWinners {
  period: string
  winners: Array<{
    prize: number
    bondNumber: string
    holdings: number
    area: string
    purchaseDate: string
  }>
}

export const usePbStore = defineStore('pb', {
  state: () => ({
    results: [] as PremiumBondHolderResults[],
    nextDrawDate: null as PremiumBondsNextDrawDate | null,
    nationalWinners: null as PremiumBondNationalWinners | null,
    loadingResults: false,
    loadingWinners: false,
    error: null as string | null,
    nextReq: 0.0 as number,
  }),

  getters: {
    isLoadingResults(state): boolean {
      return state.loadingResults
    },
    isLoadingWinners(state): boolean {
      return state.loadingWinners
    },
    getError(state): string | null {
      return state.error
    },
    getResults(state): any[] {
      return state.results
    },
    getHolderNames(state): any[] {
      return state.results.map((holder: any) => holder.name)
    },
  },

  actions: {
    async getNextDrawDate(): Promise<void> {
      try {
        const response = await fetch(`${GFC}/pb/nextdraw`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        })

        if (!response.ok) throw new Error('Failed to fetch items')
        this.nextDrawDate = (await response.json()) as PremiumBondsNextDrawDate
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loadingResults = false
      }
    },
    async getAllResults(holders: string): Promise<void> {
      const now = moment().valueOf()
      if (this.nextReq === 0.0 || now >= this.nextReq) {
        this.nextReq = moment().add(REQ_AGE_THRESHOLD, 'minutes').valueOf()

        try {
          this.error = null
          this.loadingResults = true
          const response = await fetch(`${GFC}/pb/results?holders=${holders}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
          })

          if (!response.ok) throw new Error('Failed to fetch items')
          this.results = (await response.json()) as PremiumBondHolderResults[]
        } catch (err: any) {
          this.error = err.message || 'Unknown error'
        } finally {
          this.loadingResults = false
        }
      }
    },

    async getNationalWinners(): Promise<void> {
      try {
        this.loadingWinners = true
        const response = await fetch(`${GFC}/pb/winners`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
        })

        if (!response.ok) throw new Error('Failed to fetch items')
        this.nationalWinners = (await response.json()) as PremiumBondNationalWinners
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loadingWinners = false
      }
    },
  },
})
