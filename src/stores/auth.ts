import { defineStore } from 'pinia'
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, type User } from 'firebase/auth'

import { app } from '@/firebase/firebase'

// We use getAuth(app) instead of getAuth() to ensure it's tied to your initialized app
const auth = getAuth(app)

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null, // Firebase User object or null
    loading: false as boolean,
    keepLoggedIn: false as boolean,
  }),

  getters: {
    isAuthenticated: (state) => {
      const user = sessionStorage.getItem('user')
      return user ? JSON.parse(user).status === 'success' : !!state.user
    },
    uid: (state) => state.user?.uid,
    email: (state) => state.user?.email,
    displayName: (state) => state.user?.displayName,
  },

  actions: {
    async signIn(email: string, password: string, keepLoggedIn: boolean): Promise<void> {
      this.loading = true
      const loginAttempt = { email, timestamp: new Date().toISOString() }
      console.log('signIn: attempting with', loginAttempt)

      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        this.user = userCredential.user
        console.log('Signed in successfully:', { email: this.user.email, uid: this.user.uid })
        this.keepLoggedIn = keepLoggedIn
        if (keepLoggedIn) {
          const successLog = {
            email: this.user.email,
            timestamp: new Date().toISOString(),
            status: 'success',
            loginTime: Date.now(),
          }
          sessionStorage.setItem('user', JSON.stringify(successLog))
        } else {
          sessionStorage.removeItem('user')
        }
      } catch (error: any) {
        const errorLog = { email, timestamp: new Date().toISOString(), status: 'failed', error: error.code }
        console.error('Sign in failed:', errorLog)
        sessionStorage.removeItem('user')
        throw error
      } finally {
        this.loading = false
      }
    },

    async signOut(): Promise<void> {
      this.loading = true
      try {
        await signOut(auth)
        this.user = null
        sessionStorage.removeItem('user')
        console.log('Signed out successfully')
      } catch (error: any) {
        console.error('Sign out failed:', error)
        throw error
      } finally {
        this.loading = false
      }
    },
    // Initialize auth state listener (call this once in main.ts or App.vue)
    initAuth() {
      onAuthStateChanged(auth, (user) => {
        this.user = user
        console.log('Auth state changed:', user ? user.email : 'logged out')
      })
    },
  },
})
