import { defineStore } from 'pinia'

const apiKey = import.meta.env.VITE_API_KEY;

interface Item {
    userId: number
    id: number
    title: string
    completed: boolean
}

export const useMkStore = defineStore('mk', {
    state: () => ({
        items: [] as Item[],
        loading: false,
        error: null as string | null,
        cnn: null as any
    }),

    actions: {
        async getItems() {
            this.loading = true
            this.error = null
            try {
                const response = await fetch('https://jsonplaceholder.typicode.com/todos')
                if (!response.ok) throw new Error('Failed to fetch items')
                const data: Item[] = await response.json()
                this.items = data
                console.log(this.items)
            } catch (err: any) {
                this.error = err.message || 'Unknown error'
            } finally {
                this.loading = false
            }
        },

        async getCNN() {
            const APP_FINTECH_HEADERS = {
                'x-api-key': apiKey,
                'Content-Type': 'application/json'
            }

            this.loading = true
            this.error = null
            try {
                const response = await fetch(
                    'https://us-central1-mk-d-b59f2.cloudfunctions.net/cnn/marketsentiment',
                    { headers: APP_FINTECH_HEADERS }
                )
                if (!response.ok) throw new Error('Failed to fetch items')
                    const data = await response.json()
                    this.cnn = data
                    console.log(this.cnn)
            } catch (err: any) {
                    this.error = err.message || 'Unknown error'
            } finally {
                    this.loading = false
            }
        }
    }
})
