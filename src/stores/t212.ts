import { defineStore } from 'pinia'
const T212_KEY = import.meta.env.VITE_T212_KEY
const GFC = import.meta.env.VITE_GCF_URL
const API_KEY = import.meta.env.VITE_API_KEY

// https://docs.trading212.com/api/section/general-information
export const useT212Store = defineStore('t212', {
  state: () => ({
    openOrders: [],
    openOrders2: [],
    loading: false,
    error: null as string | null,
    nextReq: 0.0 as number,
  }),

  getters: {},

  actions: {
    async getOpenOrders(): Promise<void> {
      this.error = null
      this.loading = true

      try {
        const response = await fetch(`${GFC}/t212/equity/orders`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'x-t212-key': T212_KEY,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch items')
        this.openOrders = await response.json()
        this.loading = false
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
    async getOpenOrders2(): Promise<void> {
      this.error = null
      this.loading = true

      try {
        const response = await fetch(`${GFC}/t212/equity/orders2`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'x-t212-key': T212_KEY,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch items')
        this.openOrders2 = await response.json()
        this.loading = false
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
  },
})
