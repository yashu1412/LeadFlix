import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LeadFilters as LeadFiltersType } from '@/types/lead'

interface LeadFiltersProps {
  filters: LeadFiltersType
  onFiltersChange: (filters: LeadFiltersType) => void
}

const statusOptions = [
  { value: 'new', label: 'New', variant: 'new' as const },
  { value: 'contacted', label: 'Contacted', variant: 'contacted' as const },
  { value: 'qualified', label: 'Qualified', variant: 'qualified' as const },
  { value: 'lost', label: 'Lost', variant: 'lost' as const },
  { value: 'won', label: 'Won', variant: 'won' as const },
]

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'facebook_ads', label: 'Facebook Ads' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'referral', label: 'Referral' },
  { value: 'events', label: 'Events' },
  { value: 'other', label: 'Other' },
]

export function LeadFilters({ filters, onFiltersChange }: LeadFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState<Partial<LeadFiltersType>>(filters)

  const applyFilters = () => {
    onFiltersChange(localFilters as LeadFiltersType)
    setIsOpen(false)
  }

  const clearFilters = () => {
    setLocalFilters({})
    onFiltersChange({})
  }

  const updateFilter = (key: keyof LeadFiltersType, value: any) => {
    setLocalFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const activeFiltersCount = Object.keys(filters).length

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-netflix-white">Filters</h3>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {/* Quick Filter Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {statusOptions.map((status) => (
          <Badge
            key={status.value}
            variant={filters.status?.equals === status.value ? status.variant : 'outline'}
            className="cursor-pointer"
            onClick={() => {
              if (filters.status?.equals === status.value) {
                const newFilters = { ...filters }
                delete newFilters.status
                onFiltersChange(newFilters)
              } else {
                onFiltersChange({
                  ...filters,
                  status: { equals: status.value as any }
                })
              }
            }}
          >
            {status.label}
          </Badge>
        ))}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass border-netflix-gray">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Advanced Filters</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-netflix-mutedGray hover:text-netflix-white"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Email Search */}
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      placeholder="Search by email..."
                      value={localFilters.email?.contains || ''}
                      onChange={(e) => updateFilter('email', 
                        e.target.value ? { contains: e.target.value } : undefined
                      )}
                    />
                  </div>

                  {/* Company Search */}
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input
                      placeholder="Search by company..."
                      value={localFilters.company?.contains || ''}
                      onChange={(e) => updateFilter('company', 
                        e.target.value ? { contains: e.target.value } : undefined
                      )}
                    />
                  </div>

                  {/* City Search */}
                  <div className="space-y-2">
                    <Label>City</Label>
                    <Input
                      placeholder="Search by city..."
                      value={localFilters.city?.contains || ''}
                      onChange={(e) => updateFilter('city', 
                        e.target.value ? { contains: e.target.value } : undefined
                      )}
                    />
                  </div>

                  {/* Source */}
                  <div className="space-y-2">
                    <Label>Source</Label>
                    <Select
                      value={localFilters.source?.equals || ''}
                      onValueChange={(value) => updateFilter('source', 
                        value ? { equals: value as any } : undefined
                      )}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select source..." />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceOptions.map((source) => (
                          <SelectItem key={source.value} value={source.value}>
                            {source.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Score Range */}
                  <div className="space-y-2">
                    <Label>Score Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min"
                        min="0"
                        max="100"
                        value={localFilters.score?.between?.[0] || ''}
                        onChange={(e) => {
                          const min = e.target.value ? parseInt(e.target.value) : undefined
                          const max = localFilters.score?.between?.[1]
                          updateFilter('score', 
                            min !== undefined || max !== undefined ? 
                              { between: [min || 0, max || 100] } : undefined
                          )
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Max"
                        min="0"
                        max="100"
                        value={localFilters.score?.between?.[1] || ''}
                        onChange={(e) => {
                          const max = e.target.value ? parseInt(e.target.value) : undefined
                          const min = localFilters.score?.between?.[0]
                          updateFilter('score', 
                            min !== undefined || max !== undefined ? 
                              { between: [min || 0, max || 100] } : undefined
                          )
                        }}
                      />
                    </div>
                  </div>

                  {/* Lead Value Range */}
                  <div className="space-y-2">
                    <Label>Lead Value Range</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Min value"
                        min="0"
                        value={localFilters.leadValue?.between?.[0] || ''}
                        onChange={(e) => {
                          const min = e.target.value ? parseInt(e.target.value) : undefined
                          const max = localFilters.leadValue?.between?.[1]
                          updateFilter('leadValue', 
                            min !== undefined || max !== undefined ? 
                              { between: [min || 0, max || 1000000] } : undefined
                          )
                        }}
                      />
                      <Input
                        type="number"
                        placeholder="Max value"
                        min="0"
                        value={localFilters.leadValue?.between?.[1] || ''}
                        onChange={(e) => {
                          const max = e.target.value ? parseInt(e.target.value) : undefined
                          const min = localFilters.leadValue?.between?.[0]
                          updateFilter('leadValue', 
                            min !== undefined || max !== undefined ? 
                              { between: [min || 0, max || 1000000] } : undefined
                          )
                        }}
                      />
                    </div>
                  </div>

                  {/* Qualified Toggle */}
                  <div className="space-y-2">
                    <Label>Qualified Status</Label>
                    <Select
                      value={localFilters.isQualified?.equals?.toString() || ''}
                      onValueChange={(value) => updateFilter('isQualified', 
                        value ? { equals: value === 'true' } : undefined
                      )}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Qualified</SelectItem>
                        <SelectItem value="false">Not Qualified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="netflix" onClick={applyFilters}>
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}