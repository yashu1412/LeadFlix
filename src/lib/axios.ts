import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored user data and redirect to unauthorized page
      // Clear localStorage/auth state
      localStorage.removeItem('leadflix-auth')
      
      // Only redirect if not already on unauthorized page
      if (window.location.pathname !== '/unauthorized') {
        // Use replace to avoid adding to browser history
        window.location.replace('/unauthorized')
      }
    }
    return Promise.reject(error)
  }
)

export { api }