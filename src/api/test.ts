import { api } from '@/lib/axios'

export const testApi = {
  // Test endpoint that requires authentication
  testProtected: (): Promise<any> =>
    api.get('/api/test/protected').then(res => res.data),
  
  // Test endpoint that doesn't require authentication
  testPublic: (): Promise<any> =>
    api.get('/api/test/public').then(res => res.data),
} 