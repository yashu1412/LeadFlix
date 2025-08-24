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
    console.log('Axios Request:', config.method?.toUpperCase(), config.url)
    return config
  },
  (error) => {
    console.error('Axios Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('Axios Response:', response.status, response.config.url)
    return response
  },
  (error) => {
    console.log('Axios Error Response:', error.response?.status, error.config?.url)
    
    // Only handle 401 for non-auth endpoints and when not already on auth page
    if (error.response?.status === 401 && 
        !error.config.url?.includes('/auth') && 
        window.location.pathname !== '/auth') {
      
      console.log('Axios: Handling 401 error, clearing auth state')
      
      // Clear auth state only for actual unauthorized requests
      localStorage.removeItem('leadflix-auth')
      
      // Redirect to auth page
      window.location.replace('/auth')
    }
    return Promise.reject(error)
  }
)

export { api }