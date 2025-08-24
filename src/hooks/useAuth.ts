import { useAuthStore } from '@/stores/auth'

export function useAuth() {
  const { user, setUser, clearUser, isAuthenticated } = useAuthStore()

  return {
    user,
    isAuthenticated,
    isLoading: false, // Remove loading state that was causing issues
    error: null,
    setUser,
    clearUser,
  }
}