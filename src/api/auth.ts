import { api } from '@/lib/axios'

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface LoginData {
  email: string
  password: string
}

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  token: string // token always exists inside user object
}

export interface AuthResponse {
  message: string
  user: User
}

export const authApi = {
  register: (data: RegisterData): Promise<AuthResponse> =>
    api
      .post('https://leadflix.onrender.com/api/auth/register', data)
      .then(res => res.data),

  login: (data: LoginData): Promise<AuthResponse> =>
    api
      .post('https://leadflix.onrender.com/api/auth/login', data)
      .then(res => res.data),

  logout: (): Promise<{ message: string }> =>
    api
      .post('https://leadflix.onrender.com/api/auth/logout')
      .then(res => res.data),

  me: (): Promise<{ user: User }> =>
    api
      .get('https://leadflix.onrender.com/api/auth/me')
      .then(res => res.data),
}
