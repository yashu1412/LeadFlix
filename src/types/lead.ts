export interface Lead {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  city: string
  state: string
  source: 'website' | 'facebook_ads' | 'google_ads' | 'referral' | 'events' | 'other'
  status: 'new' | 'contacted' | 'qualified' | 'lost' | 'won'
  score: number
  leadValue: number
  lastActivityAt: string | null
  isQualified: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

export interface LeadFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  city: string
  state: string
  source: Lead['source']
  status: Lead['status']
  score: number
  leadValue: number
  lastActivityAt?: string
  isQualified: boolean
}

export interface LeadFilters {
  email?: {
    equals?: string
    contains?: string
  }
  company?: {
    equals?: string
    contains?: string
  }
  city?: {
    equals?: string
    contains?: string
  }
  status?: {
    equals?: Lead['status']
    in?: Lead['status'][]
  }
  source?: {
    equals?: Lead['source']
    in?: Lead['source'][]
  }
  score?: {
    equals?: number
    gt?: number
    lt?: number
    between?: [number, number]
  }
  leadValue?: {
    equals?: number
    gt?: number
    lt?: number
    between?: [number, number]
  }
  createdAt?: {
    on?: string
    before?: string
    after?: string
    between?: [string, string]
  }
  lastActivityAt?: {
    on?: string
    before?: string
    after?: string
    between?: [string, string]
  }
  isQualified?: {
    equals?: boolean
  }
}

export interface LeadsResponse {
  data: Lead[]
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface LeadStats {
  total: number
  qualified: number
  averageScore: number
  totalValue: number
  statusCounts: Record<Lead['status'], number>
  sourceCounts: Record<Lead['source'], number>
}