import React from 'react'
import { motion } from 'framer-motion'

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-netflix-black relative">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-netflix-black via-netflix-darkGray to-netflix-black z-0" />
      
      {/* Film grain overlay */}
      <div className="fixed inset-0 bg-film-grain opacity-10 z-0" />
      
      {/* Content */}
      <motion.div
        className="relative z-20 w-full h-full min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </div>
  )
}