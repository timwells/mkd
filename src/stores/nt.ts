import { defineStore } from 'pinia'
import moment from 'moment'

const GFC = import.meta.env.VITE_GCF_URL
const API_KEY = import.meta.env.VITE_API_KEY

const REQ_AGE_THRESHOLD = 60 * 10

export const useNtStore = defineStore('nt', {
  state: () => ({
    data: [],
    loading: false,
    error: null as string | null,
    nextReq: 0.0 as number,
  }),

  getters: {},

  actions: {
    async getTrades(): Promise<void> {
      const now = moment().valueOf()
      if (this.nextReq === 0.0 || now >= this.nextReq) {
        this.nextReq = moment().add(REQ_AGE_THRESHOLD, 'minutes').valueOf()

        this.loading = true
        this.error = null

        try {
          const response = await fetch(`${GFC}/nt/trades`, {
                                          method: "GET",
                                          headers: {"Content-Type": "application/json","x-api-key": API_KEY}
                                        });

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
