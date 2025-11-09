import { defineStore } from 'pinia'
// const apiKey = import.meta.env.VITE_API_KEY
const GFC = import.meta.env.VITE_GCF_URL

export const useNtStore = defineStore('nt', {
  state: () => ({
    data: [],
    loading: false,
    error: null as string | null,
  }),

  getters: {},

  actions: {
    async getTrades(): Promise<void> {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${GFC}/nt/trades`)
        if (!response.ok) throw new Error('Failed to fetch items')
        this.data = await response.json()
        this.loading = false
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
  },
})
