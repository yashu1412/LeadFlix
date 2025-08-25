import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  rememberMe: boolean
  setUser: (user: User | null, token?: string | null, rememberMe?: boolean) => void
  clearUser: () => void
}


// ✅ two storages: localStorage (remember) vs sessionStorage (no remember)
const storageType = (rememberMe?: boolean) =>
  createJSONStorage(() => (rememberMe ? localStorage : sessionStorage))
export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      rememberMe: false,
      setUser: (user, token, rememberMe = false) => {
        console.log('Auth Store: setUser called with:', user, 'token:', token, 'rememberMe:', rememberMe)
        set({
          user,
          token: token || get().token,
          isAuthenticated: !!user && !!(token || get().token),
          rememberMe,
        })

        setTimeout(() => {
          console.log('Auth Store: State after setUser:', get())
        }, 50)
      },
      clearUser: () => {
        console.log('Auth Store: clearUser called')
        set({ user: null, token: null, isAuthenticated: false, rememberMe: false })
        setTimeout(() => {
          console.log('Auth Store: State after clearUser:', get())
        }, 50)
      },
    }),
    {
      name: 'leadflix-auth',
      partialize: (state) =>
        state.rememberMe
          ? { user: state.user, token: state.token, isAuthenticated: state.isAuthenticated, rememberMe: state.rememberMe }
          : {}, // if not rememberMe, don't persist anything
      onRehydrateStorage: () => (state) => {
        console.log('Auth Store: Rehydrating from storage, state:', state)
      },
    }
  )
)
