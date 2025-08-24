import React from 'react'
import { motion } from 'framer-motion'
import { Eye, Edit2, Trash2, Mail, Phone } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency, formatRelativeDate } from '@/lib/utils'
import { Lead } from '@/types/lead'

interface LeadsTableProps {
  leads: Lead[]
  isLoading: boolean
  onLeadClick: (lead: Lead) => void
  onEditLead: (lead: Lead) => void
  onDeleteLead: (lead: Lead) => void
}

const statusVariants = {
  new: 'new',
  contacted: 'contacted',
  qualified: 'qualified', 
  lost: 'lost',
  won: 'won',
} as const

export function LeadsTable({ 
  leads, 
  isLoading, 
  onLeadClick, 
  onEditLead, 
  onDeleteLead 
}: LeadsTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="rounded-2xl border border-netflix-gray bg-netflix-darkGray p-6">
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-[250px] shimmer" />
                  <Skeleton className="h-4 w-[200px] shimmer" />
                </div>
                <Skeleton className="h-4 w-[100px] shimmer" />
                <Skeleton className="h-4 w-[80px] shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (leads.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 bg-netflix-darkGray rounded-2xl border border-netflix-gray"
      >
        <div className="mx-auto max-w-md">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
            <Eye className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-netflix-white">No leads found</h3>
          <p className="mt-2 text-netflix-mutedGray">
            Try adjusting your search criteria or filters to find leads.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl border border-netflix-gray bg-netflix-darkGray overflow-hidden"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-netflix-lightGray">Name</TableHead>
            <TableHead className="text-netflix-lightGray">Company</TableHead>
            <TableHead className="text-netflix-lightGray">Status</TableHead>
            <TableHead className="text-netflix-lightGray">Score</TableHead>
            <TableHead className="text-netflix-lightGray">Value</TableHead>
            <TableHead className="text-netflix-lightGray">Last Activity</TableHead>
            <TableHead className="text-netflix-lightGray">Qualified</TableHead>
            <TableHead className="text-netflix-lightGray text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <motion.tr
              key={lead._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                transition: { duration: 0.2 }
              }}
              className="cursor-pointer transition-colors"
              onClick={() => onLeadClick(lead)}
            >
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-netflix-white">
                    {lead.firstName} {lead.lastName}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-netflix-mutedGray">
                    <Mail className="h-3 w-3" />
                    <span>{lead.email}</span>
                  </div>
                  {lead.phone && (
                    <div className="flex items-center space-x-2 text-sm text-netflix-mutedGray">
                      <Phone className="h-3 w-3" />
                      <span>{lead.phone}</span>
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium text-netflix-white">{lead.company}</div>
                  <div className="text-sm text-netflix-mutedGray">
                    {lead.city}, {lead.state}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={statusVariants[lead.status]} className="capitalize">
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <div className="w-12 bg-netflix-gray rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${lead.score}%` }}
                    />
                  </div>
                  <span className="text-sm text-netflix-white">{lead.score}</span>
                </div>
              </TableCell>
              <TableCell className="text-netflix-white">
                {formatCurrency(lead.leadValue)}
              </TableCell>
              <TableCell className="text-netflix-mutedGray">
                {lead.lastActivityAt ? formatRelativeDate(lead.lastActivityAt) : 'Never'}
              </TableCell>
              <TableCell>
                <Badge variant={lead.isQualified ? 'success' : 'secondary'}>
                  {lead.isQualified ? 'Yes' : 'No'}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-netflix-mutedGray hover:text-netflix-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      onLeadClick(lead)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-netflix-mutedGray hover:text-netflix-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditLead(lead)
                    }}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-netflix-mutedGray hover:text-error"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteLead(lead)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>
    </motion.div>
  )
}