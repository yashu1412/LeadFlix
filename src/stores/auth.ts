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
        
        set({ user, isAuthenticated: isAuth })
        
        // Verify the state was set correctly
        setTimeout(() => {
          const currentState = get()
          console.log('Auth Store: State after setUser:', currentState)
        }, 50)
      },
      clearUser: () => {
        console.log('Auth Store: clearUser called')
        set({ user: null, isAuthenticated: false })
        
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
        
        // CRITICAL FIX: Don't rehydrate if we already have valid auth state
        const currentState = get()
        if (currentState.user && currentState.isAuthenticated) {
          console.log('Auth Store: SKIPPING rehydration - user already authenticated!')
          return // Don't override existing auth state
        }
        
        // Only rehydrate if we don't have valid auth state
        if (state && state.user && state.isAuthenticated) {
          console.log('Auth Store: Rehydrating valid state from storage')
        } else {
          console.log('Auth Store: No valid state to rehydrate, keeping current state')
        }
      },
    }
  )
)
