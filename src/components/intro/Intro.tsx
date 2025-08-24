import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/stores/auth'

export function Intro() {
  const navigate = useNavigate()
  const isAuthenticated = useAuthStore(state => state.isAuthenticated)
  const [canSkip, setCanSkip] = useState(false)
  
  useEffect(() => {
    // Allow skipping after 0.5 seconds
    const timer = setTimeout(() => setCanSkip(true), 500)
    
    // Auto-navigate after animation completes
    const autoNavigateTimer = setTimeout(() => {
      navigate(isAuthenticated ? '/dashboard' : '/auth')
    }, 1800)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(autoNavigateTimer)
    }
  }, [navigate, isAuthenticated])
  
  const handleSkip = () => {
    if (canSkip) {
      navigate(isAuthenticated ? '/dashboard' : '/auth')
    }
  }
  
  useEffect(() => {
    const handleKeyPress = () => handleSkip()
    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [canSkip])
  
  return (
    <div 
      className="fixed inset-0 bg-gradient-to-br from-netflix-black via-netflix-darkGray to-netflix-black flex items-center justify-center cursor-pointer"
      onClick={handleSkip}
    >
      {/* Film grain */}
      <div className="absolute inset-0 bg-film-grain opacity-10" />
      
      {/* Red ribbon sweep */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ 
          duration: 0.8, 
          ease: "easeOut",
          delay: 0.2
        }}
      />
      
      {/* Logo reveal */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          duration: 0.6, 
          ease: "easeOut",
          delay: 0.8
        }}
      >
        <motion.h1 
          className="text-6xl md:text-8xl font-bold text-white text-center"
          style={{
            textShadow: '0 0 20px rgba(229, 9, 20, 0.5), 0 0 40px rgba(229, 9, 20, 0.3)',
            filter: 'drop-shadow(0 0 10px rgba(229, 9, 20, 0.8))'
          }}
          initial={{ letterSpacing: '-0.1em' }}
          animate={{ letterSpacing: '0em' }}
          transition={{ duration: 0.4, delay: 1.0 }}
        >
          LeadFlix
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-netflix-lightGray text-center mt-4 font-light"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          Your Cinematic Lead Management Experience
        </motion.p>
      </motion.div>
      
      {/* Skip indicator */}
      {canSkip && (
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          <p className="text-netflix-mutedGray text-sm">
            Press any key or click to continue
          </p>
        </motion.div>
      )}
    </div>
  )
}