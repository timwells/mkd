import { defineStore } from 'pinia'
import moment from 'moment'

// const apiKey = import.meta.env.VITE_API_KEY
const GFC = import.meta.env.VITE_GCF_URL
const REQ_AGE_THRESHOLD = 60 * 10

export const useDdStore = defineStore('dd', {
  state: () => ({
    data: [],
    loading: false,
    error: null as string | null,
    nextReq: 0.0 as number,
  }),

  getters: {},

  actions: {
    async getExDividendDates(): Promise<void> {
      const now = moment().valueOf()
      if (this.nextReq === 0.0 || now >= this.nextReq) {
        this.nextReq = moment().add(REQ_AGE_THRESHOLD, 'minutes').valueOf()

        this.loading = true
        this.error = null

        try {
          const response = await fetch(`${GFC}/dd/exdividenddates`)
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
