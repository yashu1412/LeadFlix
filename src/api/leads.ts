import { api } from '@/lib/axios'
import { Lead, LeadFormData, LeadFilters, LeadsResponse, LeadStats } from '@/types/lead'

export interface LeadsParams {
  page?: number
  limit?: number
  filters?: LeadFilters
}

export const leadsApi = {
  getLeads: ({ page = 1, limit = 20, filters }: LeadsParams = {}): Promise<LeadsResponse> =>
    api.get('/api/leads', {
      params: {
        page,
        limit,
        filters: filters ? JSON.stringify(filters) : undefined,
      },
    }).then(res => res.data),
  
  getLead: (id: string): Promise<Lead> =>
    api.get(`/api/leads/${id}`).then(res => res.data),
  
  createLead: (data: LeadFormData): Promise<Lead> =>
    api.post('/api/leads', data).then(res => res.data),
  
  updateLead: (id: string, data: Partial<LeadFormData>): Promise<Lead> =>
    api.put(`/api/leads/${id}`, data).then(res => res.data),
  
  deleteLead: (id: string): Promise<{ message: string }> =>
    api.delete(`/api/leads/${id}`).then(res => res.data),
  
  getStats: (): Promise<LeadStats> =>
    api.get('/api/leads/stats').then(res => res.data),
}