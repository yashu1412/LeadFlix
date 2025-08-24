import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface AuthStore {
  user: User | null
  isAuthenticated: boolean
  setUser: (user: User | null) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        console.log('Auth Store: setUser called with:', user)
        const isAuth = !!user
        console.log('Auth Store: Setting isAuthenticated to:', isAuth)
        
        // Set state immediately
        set({ user, isAuthenticated: isAuth })
        
        // Force persist to localStorage manually
        if (user) {
          const stateToPersist = { user, isAuthenticated: isAuth }
          localStorage.setItem('leadflix-auth', JSON.stringify(stateToPersist))
          console.log('Auth Store: Manually persisted state to localStorage:', stateToPersist)
        }
        
        // Verify the state was set correctly
        setTimeout(() => {
          const currentState = get()
          console.log('Auth Store: State after setUser:', currentState)
        }, 50)
      },
      clearUser: () => {
        console.log('Auth Store: clearUser called')
        set({ user: null, isAuthenticated: false })
        
        // Clear localStorage manually
        localStorage.removeItem('leadflix-auth')
        console.log('Auth Store: Manually cleared localStorage')
        
        // Verify the state was cleared correctly
        setTimeout(() => {
          const currentState = get()
          console.log('Auth Store: State after clearUser:', currentState)
        }, 50)
      },
    }),
    {
      name: 'leadflix-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        console.log('Auth Store: Rehydrating from storage, state:', state)
        
        // Check what's actually in localStorage
        const storedData = localStorage.getItem('leadflix-auth')
        console.log('Auth Store: Raw localStorage data:', storedData)
        
        if (storedData) {
          try {
            const parsed = JSON.parse(storedData)
            console.log('Auth Store: Parsed localStorage data:', parsed)
          } catch (e) {
            console.error('Auth Store: Error parsing localStorage data:', e)
          }
        }
      },
    }
  )
)
