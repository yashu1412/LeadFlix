import React from 'react'
import { motion } from 'framer-motion'
import { Search, User, LogOut, Settings } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuthStore } from '@/stores/auth'
import { useMutation } from '@tanstack/react-query'
import { authApi } from '@/api/auth'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/useToast'
import { getInitials } from '@/lib/utils'

interface HeaderProps {
  searchValue: string
  onSearchChange: (value: string) => void
}

export function Header({ searchValue, onSearchChange }: HeaderProps) {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, clearUser } = useAuthStore()

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      clearUser()
      toast({
        title: 'Signed Out',
        description: 'Successfully signed out of LeadFlix',
      })
      navigate('/auth')
    },
    onError: () => {
      // Even if the request fails, clear local state
      clearUser()
      navigate('/auth')
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <motion.header
      className="sticky top-0 z-40 bg-netflix-black/80 backdrop-blur-sm border-b border-netflix-gray"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h1 
            className="text-2xl font-bold text-white cursor-pointer"
            style={{
              textShadow: '0 0 10px rgba(229, 9, 20, 0.5)',
            }}
            onClick={() => navigate('/dashboard')}
          >
            LeadFlix
          </h1>
        </motion.div>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-netflix-mutedGray h-4 w-4" />
            <Input
              placeholder="Search leads..."
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-netflix-darkGray/50 border-netflix-gray focus:border-primary"
            />
          </div>
        </div>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-10 w-10 rounded-full bg-primary text-white hover:bg-primary/90"
            >
              {user ? getInitials(user.firstName, user.lastName) : <User className="h-4 w-4" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user && (
                  <>
                    <p className="font-medium text-netflix-white">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-netflix-mutedGray">{user.email}</p>
                  </>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="cursor-pointer text-error focus:text-error"
              onClick={handleLogout}
              disabled={logoutMutation.isPending}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{logoutMutation.isPending ? 'Signing out...' : 'Sign out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}