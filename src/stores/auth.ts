import { create } from 'zustand'

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

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  
  setUser: (user) => {
    console.log('Auth Store: setUser called with:', user)
    const isAuth = !!user
    console.log('Auth Store: Setting isAuthenticated to:', isAuth)
    
    // Set state immediately
    set({ user, isAuthenticated: isAuth })
    
    // Manually persist to localStorage
    if (user) {
      const stateToPersist = { user, isAuthenticated: isAuth }
      localStorage.setItem('leadflix-auth', JSON.stringify(stateToPersist))
      console.log('Auth Store: Manually persisted state to localStorage:', stateToPersist)
    } else {
      localStorage.removeItem('leadflix-auth')
      console.log('Auth Store: Manually cleared localStorage')
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
}))

// Initialize state from localStorage on app startup
const initializeAuthState = () => {
  try {
    const storedData = localStorage.getItem('leadflix-auth')
    if (storedData) {
      const parsed = JSON.parse(storedData)
      console.log('Auth Store: Initializing from localStorage:', parsed)
      
      if (parsed.user && parsed.isAuthenticated) {
        useAuthStore.getState().setUser(parsed.user)
        console.log('Auth Store: Successfully restored user from localStorage')
      }
    }
  } catch (error) {
    console.error('Auth Store: Error initializing from localStorage:', error)
    localStorage.removeItem('leadflix-auth')
  }
}

// Call initialization when the store is first imported
initializeAuthState()
