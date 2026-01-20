import { delay } from 'medium-editor'
import { defineStore } from 'pinia'
const T212_KEY = import.meta.env.VITE_T212_KEY
const GFC = import.meta.env.VITE_GCF_URL
const API_KEY = import.meta.env.VITE_API_KEY

// https://docs.trading212.com/api/section/general-information
export const useT212Store = defineStore('t212', {
  state: () => ({
    openOrders: [],
    dividendHistory: [],
    dividendHistoryByPeriod: [],

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
    async cancelOrder(orderId: string, ticker: string): Promise<void> {
      this.error = null
      // this.loading = true

      const apiUrl = `${GFC}/t212/equity/orders/${orderId}`
      console.log(`Cancelling order ${orderId} for ticker ${ticker} @ ${apiUrl}`)
      try {
        const response = await fetch(apiUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'x-t212-key': T212_KEY,
          },
        })

        if (!response.ok) throw new Error('Failed to cancel order')
        console.log(`Order ${orderId} cancellation requested.${response.json}`)
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }

      // find orders by ticker
      /*const tickerIndex = this.openOrders2.findIndex((id: any) => id.ticker === ticker)  
      if (tickerIndex !== -1) {
        // console.log(`Found ${tickerIndex} for ticker ${ticker}, removing from openOrders`)
        const orderIndex = this.openOrders2[tickerIndex].orders.findIndex((order: any) => order.id === orderId)  
        // console.log(`Found ${orderIndex} for ticker ${ticker}, removing from openOrders`)
        this.openOrders2[tickerIndex].orders.splice(orderIndex, 1)
        this.openOrders2[tickerIndex].ordersCount -= 1;
      }*/
    },
    async getDividendHistory(): Promise<void> {
      this.error = null
      this.loading = true

      try {
        const response = await fetch(`${GFC}/t212/equity/history/dividends`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'x-t212-key': T212_KEY,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch items')
        const data = await response.json()
        this.dividendHistory = data.dividends
        this.dividendHistoryByPeriod = data.periodTotals

        this.loading = false
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
  },
})
