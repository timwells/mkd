import { defineStore } from 'pinia'
import moment from 'moment'

const GFC = import.meta.env.VITE_GCF_URL
const API_KEY = import.meta.env.VITE_API_KEY
const REQ_AGE_THRESHOLD = 12 * 60 * 60 * 1000 // 12 hours

export const usePbStore = defineStore('pb', {
  state: () => ({
    data: [],
    loading: false,
    error: null as string | null,
    nextReq: 0.0 as number,
  }),

  // [{"name": "na"}, {"name": "nb"}, {"name": "nc"}, {"name": "nd"}],

  getters: {
    isLoading(state): boolean {
      return state.loading
    },
    getError(state): string | null {
      return state.error
    },
    getData(state): any[] {
      return state.data
    },
    getHolderNames(state): any[] {
      return state.data.map((holder: any) => holder.name)
    },
  },

  actions: {
    async getResults(holders: string): Promise<void> {
      const now = moment().valueOf()
      if (this.nextReq === 0.0 || now >= this.nextReq) {
        this.nextReq = moment().add(REQ_AGE_THRESHOLD, 'minutes').valueOf()

        this.loading = true
        this.error = null

        try {
          const response = await fetch(`${GFC}/pb/results?holders=${holders}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
          })

          if (!response.ok) throw new Error('Failed to fetch items')
          this.data = await response.json()
          this.loading = false
        } catch (err: any) {
          this.error = err.message || 'Unknown error'
        } finally {
          this.loading = false
        }
      }
    },
  },
})
