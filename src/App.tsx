import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Intro } from '@/components/intro/Intro'
import { AuthPage } from '@/components/auth/AuthPage'
import { Dashboard } from '@/pages/Dashboard'
import { Unauthorized } from '@/pages/Unauthorized'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Toaster } from '@/components/ui/toaster'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Intro />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route 
        path="/auth" 
        element={
          <ProtectedRoute requireAuth={false}>
            <AuthPage />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute requireAuth={true}>
            <Dashboard />
          </ProtectedRoute>
        } 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  return (
    <Router>
      <AppRoutes />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </Router>
  )
}

export default App