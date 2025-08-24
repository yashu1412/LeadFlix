import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Edit2, Trash2, User, Building2, MapPin, Calendar } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatDate, formatRelativeDate } from '@/lib/utils'
import { Lead } from '@/types/lead'

interface LeadDrawerProps {
  lead: Lead | null
  isOpen: boolean
  onClose: () => void
  onEdit: (lead: Lead) => void
  onDelete: (lead: Lead) => void
}

const statusVariants = {
  new: 'new',
  contacted: 'contacted',
  qualified: 'qualified',
  lost: 'lost',
  won: 'won',
} as const

const sourceLabels = {
  website: 'Website',
  facebook_ads: 'Facebook Ads',
  google_ads: 'Google Ads',
  referral: 'Referral',
  events: 'Events',
  other: 'Other',
}

export function LeadDrawer({ lead, isOpen, onClose, onEdit, onDelete }: LeadDrawerProps) {
  if (!lead) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-netflix-white">
                      {lead.firstName} {lead.lastName}
                    </h2>
                    <p className="text-netflix-mutedGray">{lead.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(lead)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDelete(lead)}
                    className="text-error hover:text-error"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="edit">Quick Edit</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Contact Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-netflix-white flex items-center">
                      <User className="h-5 w-5 mr-2 text-primary" />
                      Contact Information
                    </h3>
                    <div className="space-y-3 bg-netflix-darkGray/50 p-4 rounded-lg">
                      <div>
                        <label className="text-sm text-netflix-mutedGray">Email</label>
                        <p className="text-netflix-white">{lead.email}</p>
                      </div>
                      <div>
                        <label className="text-sm text-netflix-mutedGray">Phone</label>
                        <p className="text-netflix-white">{lead.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-netflix-white flex items-center">
                      <Building2 className="h-5 w-5 mr-2 text-primary" />
                      Company Information
                    </h3>
                    <div className="space-y-3 bg-netflix-darkGray/50 p-4 rounded-lg">
                      <div>
                        <label className="text-sm text-netflix-mutedGray">Company</label>
                        <p className="text-netflix-white">{lead.company}</p>
                      </div>
                      <div>
                        <label className="text-sm text-netflix-mutedGray">Location</label>
                        <p className="text-netflix-white flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {lead.city}, {lead.state}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Lead Metrics */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-netflix-white">Lead Metrics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-netflix-darkGray/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-netflix-mutedGray">Status</p>
                      <Badge variant={statusVariants[lead.status]} className="mt-1">
                        {lead.status}
                      </Badge>
                    </div>
                    <div className="bg-netflix-darkGray/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-netflix-mutedGray">Score</p>
                      <div className="mt-2">
                        <div className="text-lg font-semibold text-netflix-white">{lead.score}/100</div>
                        <div className="w-full bg-netflix-gray rounded-full h-2 mt-1">
                          <div
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: `${lead.score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-netflix-darkGray/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-netflix-mutedGray">Value</p>
                      <p className="text-lg font-semibold text-netflix-white mt-1">
                        {formatCurrency(lead.leadValue)}
                      </p>
                    </div>
                    <div className="bg-netflix-darkGray/50 p-4 rounded-lg text-center">
                      <p className="text-sm text-netflix-mutedGray">Qualified</p>
                      <Badge variant={lead.isQualified ? 'success' : 'secondary'} className="mt-1">
                        {lead.isQualified ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </motion.div>

                {/* Additional Information */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-semibold text-netflix-white">Additional Information</h3>
                  <div className="bg-netflix-darkGray/50 p-4 rounded-lg space-y-3">
                    <div>
                      <label className="text-sm text-netflix-mutedGray">Source</label>
                      <p className="text-netflix-white">{sourceLabels[lead.source]}</p>
                    </div>
                    <div>
                      <label className="text-sm text-netflix-mutedGray">Created</label>
                      <p className="text-netflix-white flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(lead.createdAt)} ({formatRelativeDate(lead.createdAt)})
                      </p>
                    </div>
                    {lead.lastActivityAt && (
                      <div>
                        <label className="text-sm text-netflix-mutedGray">Last Activity</label>
                        <p className="text-netflix-white flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(lead.lastActivityAt)} ({formatRelativeDate(lead.lastActivityAt)})
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Calendar className="h-12 w-12 mx-auto text-netflix-mutedGray mb-4" />
                  <h3 className="text-lg font-semibold text-netflix-white mb-2">Activity Timeline</h3>
                  <p className="text-netflix-mutedGray">
                    Activity tracking is coming soon. You'll be able to see all interactions and touchpoints with this lead.
                  </p>
                </motion.div>
              </TabsContent>

              <TabsContent value="edit" className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <Edit2 className="h-12 w-12 mx-auto text-netflix-mutedGray mb-4" />
                  <h3 className="text-lg font-semibold text-netflix-white mb-2">Quick Edit</h3>
                  <p className="text-netflix-mutedGray mb-4">
                    Use the Edit button above to make changes to this lead, or implement inline editing here.
                  </p>
                  <Button variant="netflix" onClick={() => onEdit(lead)}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit Lead
                  </Button>
                </motion.div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}