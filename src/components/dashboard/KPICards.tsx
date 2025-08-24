import React from 'react'
import { motion } from 'framer-motion'
import { Users, CheckCircle, Target, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import { LeadStats } from '@/types/lead'

interface KPICardsProps {
  stats: LeadStats | undefined
  isLoading: boolean
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

export function KPICards({ stats, isLoading }: KPICardsProps) {
  const kpis = [
    {
      title: 'Total Leads',
      value: stats?.total || 0,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      format: (value: number) => value.toLocaleString(),
    },
    {
      title: 'Qualified Rate',
      value: stats ? ((stats.qualified / stats.total) * 100) : 0,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      format: (value: number) => `${value.toFixed(1)}%`,
    },
    {
      title: 'Average Score',
      value: stats?.averageScore || 0,
      icon: Target,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
      format: (value: number) => value.toFixed(1),
    },
    {
      title: 'Pipeline Value',
      value: stats?.totalValue || 0,
      icon: DollarSign,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      format: (value: number) => formatCurrency(value),
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {kpis.map((kpi, index) => (
        <motion.div
          key={kpi.title}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ 
            scale: 1.02,
            transition: { type: "spring", stiffness: 300 }
          }}
        >
          <Card className="glass border-netflix-gray netflix-hover cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-netflix-lightGray">
                {kpi.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-netflix-gray animate-pulse rounded shimmer" />
                  <div className="h-4 bg-netflix-gray animate-pulse rounded shimmer w-16" />
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-netflix-white">
                    {kpi.format(kpi.value)}
                  </div>
                  <p className="text-xs text-netflix-mutedGray">
                    vs last month
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}