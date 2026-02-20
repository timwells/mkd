import { defineStore } from 'pinia'

const API_KEY = import.meta.env.VITE_OCTOPUS_API_KEY
const ACCOUNT_NUMBER = import.meta.env.VITE_OCTOPUS_ACCOUNT_NUMBER
const OCTOPUS_HOST = import.meta.env.VITE_OCTOPUS_HOST
const VERSION = 'v1'
const MPAN = import.meta.env.VITE_OCTOPUS_MPAN
const MPAN_SERIAL_NUMBER1 = import.meta.env.VITE_OCTOPUS_MPAN_SERIAL_NUMBER1

const MPRN = import.meta.env.VITE_OCTOPUS_MPRN
const MPRN_SERIAL_NUMBER1 = import.meta.env.VITE_OCTOPUS_MPRN_SERIAL_NUMBER1

export const useOctopusStore = defineStore('octopus', {
  state: () => ({
    account: null as any,
    electricityConsumption: null as any,
    products: null as any,
    data: [],
    loading: false,
    error: null as string | null,
  }),

  getters: {},

  actions: {
    async getAccount(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        if (!API_KEY || !ACCOUNT_NUMBER) {
          throw new Error('Missing API credentials')
        }
        const response = await fetch(`${OCTOPUS_HOST}/${VERSION}/accounts/${ACCOUNT_NUMBER}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`${API_KEY}:`)}`,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch items')
        this.account = await response.json()
        this.loading = false
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
    async getProducts(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        if (!API_KEY || !ACCOUNT_NUMBER) {
          throw new Error('Missing API credentials')
        }
        const response = await fetch(`${OCTOPUS_HOST}/${VERSION}/products/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Basic ${btoa(`${API_KEY}:`)}`,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch items')
        this.products = await response.json()
        this.loading = false
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
    //   /v1/electricity-meter-points/{mpan}/meters/{serial_number}/consumption/
    async getElectricityConsumption(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        if (!API_KEY || !ACCOUNT_NUMBER) {
          throw new Error('Missing API credentials')
        }
        //VITE_OCTOPUS_MPAN=1610012321130
        //VITE_OCTOPUS_MPAN_SERIAL_NUMBER1=A09M01799

        const response = await fetch(
          `${OCTOPUS_HOST}/${VERSION}/electricity-meter-points/${MPAN}/meters/${MPAN_SERIAL_NUMBER1}/consumption`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Basic ${btoa(`${API_KEY}:`)}`,
            },
          },
        )

        if (!response.ok) throw new Error('Failed to fetch items')
        this.electricityConsumption = await response.json()
        this.loading = false
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
  },
})
