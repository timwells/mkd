import { defineStore } from 'pinia'

const GFC = import.meta.env.VITE_GCF_URL
const API_KEY = import.meta.env.VITE_API_KEY

export const useGkStore = defineStore('gk', {
  state: () => ({
    prompt: 'Why did the gold crash on 30th Jan 2026?',
    content: '',

    loading: false,
    error: null as string | null,
  }),

  actions: {
    async postRequest(): Promise<void> {
      this.loading = true
      this.error = null

      try {
        const response = await fetch(`${GFC}/gk/ai`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY },
          body: JSON.stringify({ prompt: this.prompt }),
        })

        if (!response.ok) throw new Error('Failed to fetch items')

        const reader = response.body?.getReader()
        if (!reader) throw new Error('Response body is not readable')

        const decoder = new TextDecoder()
        let result = ''

        let spin = true
        while (spin) {
          const { done, value } = await reader.read()
          if (done) {
            spin = false
          }
          result += decoder.decode(value, { stream: true })
          this.content = result
        }

        this.loading = false
      } catch (err: any) {
        this.error = err.message || 'Unknown error'
      } finally {
        this.loading = false
      }
    },
  },
})
