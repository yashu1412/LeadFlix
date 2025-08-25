// AuthPage.tsx
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import axios from 'axios'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/useToast'
import { Layout } from '@/components/layout/Layout'

/* ------------------------- API CONFIG ------------------------- */
const api = axios.create({
  baseURL: 'https://leadflix.onrender.com/api/auth',
})

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
  token?: string
}

export interface AuthResponse {
  message: string
  user: User
  token?: string
}

export const authApi = {
  register: (data: RegisterData): Promise<AuthResponse> =>
    api.post('/register', data).then(res => res.data),

  login: (data: LoginData): Promise<AuthResponse> =>
    api.post('/login', data).then(res => res.data),

  logout: (): Promise<{ message: string }> =>
    api.post('/logout').then(res => res.data),

  me: (): Promise<{ user: User }> =>
    api.get('/me').then(res => res.data),
}

/* ------------------------- ZUSTAND STORE ------------------------- */
interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  rememberMe: boolean
  setUser: (user: User | null, token?: string | null, rememberMe?: boolean) => void
  clearUser: () => void
}

// Storage selector
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
        console.log('Auth Store: setUser called with:', user, token, rememberMe)

        set({
          user,
          token: token || get().token,
          isAuthenticated: !!user && !!(token || get().token),
          rememberMe,
        })

        // Dynamically update storage
        useAuthStore.persist.setOptions({
          storage: storageType(rememberMe),
        })

        // Force save into chosen storage
        useAuthStore.persist.persist?.()
      },

      clearUser: () => {
        console.log('Auth Store: clearUser called')
        set({ user: null, token: null, isAuthenticated: false, rememberMe: false })

        useAuthStore.persist.setOptions({
          storage: storageType(false),
        })

        useAuthStore.persist.clearStorage?.()
      },
    }),
    {
      name: 'leadflix-auth',
      storage: storageType(false), // default sessionStorage
      partialize: (state) =>
        state.rememberMe
          ? { user: state.user, token: state.token, isAuthenticated: state.isAuthenticated, rememberMe: state.rememberMe }
          : {},
    }
  )
)

/* ------------------------- AUTH PAGE ------------------------- */
interface FormData {
  email: string
  password: string
  firstName?: string
  lastName?: string
  confirmPassword?: string
}

export function AuthPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const setUser = useAuthStore(state => state.setUser)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    confirmPassword: '',
  })
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

const loginMutation = useMutation({
  mutationFn: authApi.login,
  onSuccess: (data) => {
    console.log('Login Success:', data)

    // FIX: use data.token, not data.user.token
    setUser(data.user, data.token, rememberMe)

    toast({
      title: 'Welcome back!',
      description: `Signed in as ${data.user.firstName}`,
      variant: 'success',
    })

    console.log("Navigating to dashboard...")
    navigate('/dashboard')
  },
  onError: (error: any) => {
    toast({
      title: 'Sign In Failed',
      description: error.response?.data?.message || 'Check your credentials and try again.',
      variant: 'destructive',
    })
  },
})


  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setUser(data.user, data.user.token, rememberMe)
      toast({ title: 'Account Created!', description: `Welcome, ${data.user.firstName}!`, variant: 'success' })
      navigate('/dashboard')
    },
    onError: (error: any) => {
      toast({
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Please check your info and try again.',
        variant: 'destructive',
      })
    },
  })

  const validateForm = (isRegister: boolean) => {
    const newErrors: Record<string, string> = {}
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters'
    if (isRegister) {
      if (!formData.firstName) newErrors.firstName = 'First name required'
      if (!formData.lastName) newErrors.lastName = 'Last name required'
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm your password'
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (isRegister: boolean) => {
    if (!validateForm(isRegister)) return
    if (isRegister) {
      registerMutation.mutate({ email: formData.email, password: formData.password, firstName: formData.firstName!, lastName: formData.lastName! })
    } else {
      loginMutation.mutate({ email: formData.email, password: formData.password })
    }
  }

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }


  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4 relative z-30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md relative z-30"
        >
          {/* Logo */}
          <motion.div
            className="text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 
              className="text-4xl font-bold text-white mb-2"
              style={{
                textShadow: '0 0 15px rgba(229, 9, 20, 0.5)',
              }}
            >
              LeadFlix
            </h1>
            <p className="text-netflix-mutedGray">
              Sign in to your cinematic CRM experience
            </p>
          </motion.div>

          <Card className="border-netflix-gray bg-netflix-darkGray/90 backdrop-blur-sm shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="text-center text-netflix-white text-xl">
                Welcome Back
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="signin" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="signin" className="text-sm">
                    Sign In
                  </TabsTrigger>
                  <TabsTrigger value="signup" className="text-sm">
                    Create Account
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signin" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email" className="text-netflix-lightGray">
                      Email
                    </Label>
                    <Input
                      id="signin-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={errors.email ? 'border-error' : ''}
                    />
                    {errors.email && (
                      <p className="text-error text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signin-password" className="text-netflix-lightGray">
                      Password
                    </Label>
                    <Input
                      id="signin-password"
                      type="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className={errors.password ? 'border-error' : ''}
                    />
                    {errors.password && (
                      <p className="text-error text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-netflix-gray bg-netflix-darkGray"
                    />
                    <Label htmlFor="remember" className="text-sm text-netflix-mutedGray">
                      Remember me
                    </Label>
                  </div>

                  <Button
                    variant="netflix"
                    size="lg"
                    className="w-full"
                    onClick={() => handleSubmit(false)}
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? 'Signing In...' : 'Sign In'}
                  </Button>
                </TabsContent>

                <TabsContent value="signup" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-firstname" className="text-netflix-lightGray">
                        First Name
                      </Label>
                      <Input
                        id="signup-firstname"
                        placeholder="First name"
                        value={formData.firstName}
                        onChange={(e) => updateField('firstName', e.target.value)}
                        className={errors.firstName ? 'border-error' : ''}
                      />
                      {errors.firstName && (
                        <p className="text-error text-sm">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-lastname" className="text-netflix-lightGray">
                        Last Name
                      </Label>
                      <Input
                        id="signup-lastname"
                        placeholder="Last name"
                        value={formData.lastName}
                        onChange={(e) => updateField('lastName', e.target.value)}
                        className={errors.lastName ? 'border-error' : ''}
                      />
                      {errors.lastName && (
                        <p className="text-error text-sm">{errors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-netflix-lightGray">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className={errors.email ? 'border-error' : ''}
                    />
                    {errors.email && (
                      <p className="text-error text-sm">{errors.email}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-netflix-lightGray">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      className={errors.password ? 'border-error' : ''}
                    />
                    {errors.password && (
                      <p className="text-error text-sm">{errors.password}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm" className="text-netflix-lightGray">
                      Confirm Password
                    </Label>
                    <Input
                      id="signup-confirm"
                      type="password"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => updateField('confirmPassword', e.target.value)}
                      className={errors.confirmPassword ? 'border-error' : ''}
                    />
                    {errors.confirmPassword && (
                      <p className="text-error text-sm">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <Button
                    variant="netflix"
                    size="lg"
                    className="w-full"
                    onClick={() => handleSubmit(true)}
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  )
}
