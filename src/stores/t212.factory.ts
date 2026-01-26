// stores/t212.factory.ts
import { defineStore } from 'pinia'

import type { T212CashSummary, T212InvestmentSummary, T212AccountSummary } from '@/types/t212.ts' // adjust path if needed

// Reusable factory — call this function with a unique key to get a store instance
export const createT212Store = (apiKeyId: string) => {
  const storeId = `t212-${apiKeyId}` // unique per key → t212-key1, t212-alice, etc.

  return defineStore(storeId, {
    state: () => ({
      accountSummary: null as T212AccountSummary | null,

      totalValue: 0.0 as number,
      investmentSummary: null as T212InvestmentSummary | null,
      cashSummary: null as T212CashSummary | null,
      openOrders: [] as any[], // add proper type when known
      positions: [] as any[],
      dividendHistory: [] as any[],
      dividendHistoryByPeriod: [] as any[],
      dividendGrandTotal: 0.0,

      loading: false,
      error: null as string | null,
      nextReq: 0.0,
    }),

    actions: {
      // Helper to get headers — we pass the specific T212_KEY here
      getHeaders(t212Key: string) {
        return {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY, // your backend key — shared
          'x-t212-key': t212Key, // per-account key
        }
      },
      async getAccountSummary(t212Key: string): Promise<void> {
        this.error = null
        this.loading = true

        try {
          const response = await fetch(`${import.meta.env.VITE_GCF_URL}/t212/equity/account/summary`, {
            method: 'GET',
            headers: this.getHeaders(t212Key),
          })
          if (!response.ok) throw new Error(`Failed: ${response.statusText}`)
          const data = await response.json()
          this.totalValue = data.totalValue
          this.cashSummary = data.cash
          this.investmentSummary = data.investments
        } catch (err: any) {
          this.error = err.message || 'Unknown error'
        } finally {
          this.loading = false
        }
      },
      async getOpenOrders(t212Key: string): Promise<void> {
        this.error = null
        this.loading = true
        try {
          const response = await fetch(`${import.meta.env.VITE_GCF_URL}/t212/equity/orders`, {
            method: 'GET',
            headers: this.getHeaders(t212Key),
          })
          if (!response.ok) throw new Error(`Failed: ${response.statusText}`)
          this.openOrders = await response.json()
        } catch (err: any) {
          this.error = err.message || 'Unknown error'
        } finally {
          this.loading = false
        }
      },
      async getDividendHistory(t212Key: string): Promise<void> {
        this.error = null
        this.loading = true
        try {
          const response = await fetch(`${import.meta.env.VITE_GCF_URL}/t212/equity/history/dividends`, {
            method: 'GET',
            headers: this.getHeaders(t212Key),
          })
          if (!response.ok) throw new Error(`Failed: ${response.statusText}`)
          const data = await response.json()
          this.dividendHistory = data.dividends ?? []
          this.dividendHistoryByPeriod = data.periodTotals ?? []
          this.dividendGrandTotal = data.grandDividendTotal ?? 0.0
        } catch (err: any) {
          this.error = err.message || 'Unknown error'
        } finally {
          this.loading = false
        }
      },

      // cancelOrder would also take t212Key + orderId + ticker
      async cancelOrder(t212Key: string, orderId: string, ticker: string): Promise<void> {
        // ... same pattern, use getHeaders(t212Key)
      },
      async getPositions(t212Key: string): Promise<void> {
        this.error = null
        this.loading = true
        try {
          const response = await fetch(`${import.meta.env.VITE_GCF_URL}/t212/equity/positions`, {
            method: 'GET',
            headers: this.getHeaders(t212Key),
          })

          if (!response.ok) throw new Error('Failed to fetch items')
          const data = await response.json()
          this.positions = data.allPositions
          this.loading = false
        } catch (err: any) {
          this.error = err.message || 'Unknown error'
        } finally {
          this.loading = false
        }
      },
      // Add reset/clear if needed
      clear() {
        this.accountSummary = null
        this.openOrders = []
        this.positions = []
        this.dividendHistory = []
        this.dividendHistoryByPeriod = []
        this.dividendGrandTotal = 0
        this.error = null
      },
    },
  })() // ← immediate invocation → returns the useStore function
}
