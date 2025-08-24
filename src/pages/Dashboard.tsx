import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/hooks/useToast'
import { debounce } from '@/lib/utils'
import { Layout } from '@/components/layout/Layout'
import { Header } from '@/components/dashboard/Header'
import { KPICards } from '@/components/dashboard/KPICards'
import { LeadFilters } from '@/components/dashboard/LeadFilters'
import { LeadsTable } from '@/components/dashboard/LeadsTable'
import { Pagination } from '@/components/dashboard/Pagination'
import { LeadForm } from '@/components/leads/LeadForm'
import { LeadDrawer } from '@/components/leads/LeadDrawer'
import { leadsApi } from '@/api/leads'
import { Lead, LeadFormData, LeadFilters as LeadFiltersType, LeadStats } from '@/types/lead'

export function Dashboard() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  // State
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState<LeadFiltersType>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [isLeadDrawerOpen, setIsLeadDrawerOpen] = useState(false)

  // Debounced search
  const debouncedSetFilters = useMemo(
    () => debounce((newFilters: LeadFiltersType) => {
      setFilters(newFilters)
      setCurrentPage(1)
    }, 500),
    []
  )

  // Update search filters
  React.useEffect(() => {
    if (searchValue) {
      debouncedSetFilters({
        ...filters,
        email: { contains: searchValue }
      })
    } else {
      const newFilters = { ...filters }
      delete newFilters.email
      debouncedSetFilters(newFilters)
    }
  }, [searchValue])

  // Queries
  const { data: leadsData, isLoading: isLeadsLoading } = useQuery({
    queryKey: ['leads', currentPage, pageSize, filters],
    queryFn: () => leadsApi.getLeads({ page: currentPage, limit: pageSize, filters }),
    staleTime: 30000,
  })

  const { data: stats, isLoading: isStatsLoading } = useQuery({
    queryKey: ['leads-stats'],
    queryFn: () => {
      // Calculate stats from leads data
      const leads = leadsData?.data || []
      const total = leads.length
      const qualified = leads.filter(lead => lead.isQualified).length
      const totalScore = leads.reduce((sum, lead) => sum + lead.score, 0)
      const averageScore = total > 0 ? totalScore / total : 0
      const totalValue = leads.reduce((sum, lead) => sum + lead.leadValue, 0)
      
      const statusCounts = leads.reduce((counts, lead) => {
        counts[lead.status] = (counts[lead.status] || 0) + 1
        return counts
      }, {} as Record<Lead['status'], number>)
      
      const sourceCounts = leads.reduce((counts, lead) => {
        counts[lead.source] = (counts[lead.source] || 0) + 1
        return counts
      }, {} as Record<Lead['source'], number>)

      return {
        total,
        qualified,
        averageScore,
        totalValue,
        statusCounts,
        sourceCounts,
      } as LeadStats
    },
    enabled: !!leadsData,
    staleTime: 30000,
  })

  // Mutations
  const createLeadMutation = useMutation({
    mutationFn: leadsApi.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] })
      setIsCreateModalOpen(false)
      toast({
        title: 'Lead Created',
        description: 'Lead has been created successfully.',
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create lead.',
        variant: 'destructive',
      })
    },
  })

  const updateLeadMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<LeadFormData> }) =>
      leadsApi.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] })
      setIsEditModalOpen(false)
      setSelectedLead(null)
      toast({
        title: 'Lead Updated',
        description: 'Lead has been updated successfully.',
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update lead.',
        variant: 'destructive',
      })
    },
  })

  const deleteLeadMutation = useMutation({
    mutationFn: leadsApi.deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['leads-stats'] })
      setIsLeadDrawerOpen(false)
      setSelectedLead(null)
      toast({
        title: 'Lead Deleted',
        description: 'Lead has been deleted successfully.',
        variant: 'success',
      })
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete lead.',
        variant: 'destructive',
      })
    },
  })

  // Event handlers
  const handleCreateLead = (data: LeadFormData) => {
    createLeadMutation.mutate(data)
  }

  const handleUpdateLead = (data: LeadFormData) => {
    if (selectedLead) {
      updateLeadMutation.mutate({ id: selectedLead._id, data })
    }
  }

  const handleDeleteLead = (lead: Lead) => {
    if (confirm(`Are you sure you want to delete ${lead.firstName} ${lead.lastName}?`)) {
      deleteLeadMutation.mutate(lead._id)
    }
  }

  const handleLeadClick = (lead: Lead) => {
    setSelectedLead(lead)
    setIsLeadDrawerOpen(true)
  }

  const handleEditLead = (lead: Lead) => {
    setSelectedLead(lead)
    setIsEditModalOpen(true)
    setIsLeadDrawerOpen(false)
  }

  const handleFiltersChange = (newFilters: LeadFiltersType) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize)
    setCurrentPage(1)
  }

  return (
    <Layout>
      <Header
        searchValue={searchValue}
        onSearchChange={setSearchValue}
      />
      
      <main className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-netflix-white mb-2">
            Lead Management Dashboard
          </h1>
          <p className="text-netflix-mutedGray">
            Manage your sales pipeline with cinematic precision
          </p>
        </motion.div>

        {/* KPI Cards */}
        <KPICards stats={stats} isLoading={isStatsLoading} />

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-xl font-semibold text-netflix-white">
            Leads ({leadsData?.total || 0})
          </h2>
          <Button
            variant="netflix"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Lead
          </Button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <LeadFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </motion.div>

        {/* Leads Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <LeadsTable
            leads={leadsData?.data || []}
            isLoading={isLeadsLoading}
            onLeadClick={handleLeadClick}
            onEditLead={handleEditLead}
            onDeleteLead={handleDeleteLead}
          />
        </motion.div>

        {/* Pagination */}
        {leadsData && leadsData.total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={leadsData.totalPages}
              pageSize={pageSize}
              totalItems={leadsData.total}
              onPageChange={setCurrentPage}
              onPageSizeChange={handlePageSizeChange}
            />
          </motion.div>
        )}

        {/* Create Lead Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Lead</DialogTitle>
            </DialogHeader>
            <LeadForm
              onSubmit={handleCreateLead}
              onCancel={() => setIsCreateModalOpen(false)}
              isLoading={createLeadMutation.isPending}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Lead Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Lead</DialogTitle>
            </DialogHeader>
            {selectedLead && (
              <LeadForm
                lead={selectedLead}
                onSubmit={handleUpdateLead}
                onCancel={() => {
                  setIsEditModalOpen(false)
                  setSelectedLead(null)
                }}
                isLoading={updateLeadMutation.isPending}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Lead Drawer */}
        <LeadDrawer
          lead={selectedLead}
          isOpen={isLeadDrawerOpen}
          onClose={() => {
            setIsLeadDrawerOpen(false)
            setSelectedLead(null)
          }}
          onEdit={handleEditLead}
          onDelete={handleDeleteLead}
        />
      </main>
    </Layout>
  )
}