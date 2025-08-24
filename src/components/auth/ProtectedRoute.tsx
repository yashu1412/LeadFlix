import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  // If authentication is required and user is not authenticated
  if (requireAuth && !isAuthenticated) {
    // Redirect to auth page instead of unauthorized
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  // If authentication is NOT required and user IS authenticated
  if (!requireAuth && isAuthenticated) {
    // Redirect to dashboard (e.g., if user tries to access auth page while logged in)
    return <Navigate to="/dashboard" replace />
  }

  // User is authorized, render the protected content
  return <>{children}</>
} 