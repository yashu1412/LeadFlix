import React from 'react'
import { motion } from 'framer-motion'
import { Shield, Lock, ArrowLeft, Home, TestTube } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Layout } from '@/components/layout/Layout'
import { testApi } from '@/api/test'
import { useToast } from '@/hooks/useToast'

export function Unauthorized() {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleTestUnauthorized = async () => {
    try {
      // This will trigger a 401 response and redirect back to this page
      await testApi.testProtected()
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast({
          title: 'Unauthorized Test',
          description: 'Successfully caught 401 error and redirected to unauthorized page',
          variant: 'success',
        })
      }
    }
  }

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          {/* Error Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto mb-6"
          >
            <div className="relative">
              <div className="h-24 w-24 mx-auto bg-error/20 rounded-full flex items-center justify-center">
                <Shield className="h-12 w-12 text-error" />
              </div>
              <div className="absolute -top-2 -right-2 h-8 w-8 bg-error rounded-full flex items-center justify-center">
                <Lock className="h-4 w-4 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-netflix-white mb-4">
              401
            </h1>
            <h2 className="text-2xl font-semibold text-netflix-white mb-3">
              Unauthorized Access
            </h2>
            <p className="text-netflix-mutedGray text-lg leading-relaxed">
              You don't have permission to access this resource. Please sign in with valid credentials to continue.
            </p>
          </motion.div>

          {/* Error Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-netflix-darkGray/50 border border-netflix-gray rounded-lg p-4 mb-8"
          >
            <div className="text-left space-y-2">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-error rounded-full"></div>
                <span className="text-sm text-netflix-mutedGray">Authentication required</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-error rounded-full"></div>
                <span className="text-sm text-netflix-mutedGray">Valid JWT token missing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-error rounded-full"></div>
                <span className="text-sm text-netflix-mutedGray">Session expired or invalid</span>
              </div>
            </div>
          </motion.div>

          {/* Test Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-6"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={handleTestUnauthorized}
              className="flex items-center gap-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
            >
              <TestTube className="h-4 w-4" />
              Test 401 Response
            </Button>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Button
              variant="netflix"
              size="lg"
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2"
            >
              <Lock className="h-4 w-4" />
              Sign In
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </motion.div>

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6"
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-netflix-mutedGray hover:text-netflix-white"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </Layout>
  )
} 