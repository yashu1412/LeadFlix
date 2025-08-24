import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Lead, LeadFormData } from '@/types/lead'

const leadSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(1, 'Phone is required'),
  company: z.string().min(1, 'Company is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  source: z.enum(['website', 'facebook_ads', 'google_ads', 'referral', 'events', 'other']),
  status: z.enum(['new', 'contacted', 'qualified', 'lost', 'won']),
  score: z.number().min(0, 'Score must be at least 0').max(100, 'Score cannot exceed 100'),
  leadValue: z.number().min(0, 'Lead value must be at least 0'),
  isQualified: z.boolean(),
  lastActivityAt: z.string().optional(),
})

interface LeadFormProps {
  lead?: Lead
  onSubmit: (data: LeadFormData) => void
  onCancel: () => void
  isLoading: boolean
}

const sourceOptions = [
  { value: 'website', label: 'Website' },
  { value: 'facebook_ads', label: 'Facebook Ads' },
  { value: 'google_ads', label: 'Google Ads' },
  { value: 'referral', label: 'Referral' },
  { value: 'events', label: 'Events' },
  { value: 'other', label: 'Other' },
]

const statusOptions = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'qualified', label: 'Qualified' },
  { value: 'lost', label: 'Lost' },
  { value: 'won', label: 'Won' },
]

export function LeadForm({ lead, onSubmit, onCancel, isLoading }: LeadFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: lead ? {
      firstName: lead.firstName,
      lastName: lead.lastName,
      email: lead.email,
      phone: lead.phone,
      company: lead.company,
      city: lead.city,
      state: lead.state,
      source: lead.source,
      status: lead.status,
      score: lead.score,
      leadValue: lead.leadValue,
      isQualified: lead.isQualified,
      lastActivityAt: lead.lastActivityAt ? new Date(lead.lastActivityAt).toISOString().slice(0, 16) : '',
    } : {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      company: '',
      city: '',
      state: '',
      source: 'website',
      status: 'new',
      score: 0,
      leadValue: 0,
      isQualified: false,
      lastActivityAt: '',
    },
  })

  const sourceValue = watch('source')
  const statusValue = watch('status')
  const isQualifiedValue = watch('isQualified')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            {...register('firstName')}
            className={errors.firstName ? 'border-error' : ''}
          />
          {errors.firstName && (
            <p className="text-error text-sm">{errors.firstName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            {...register('lastName')}
            className={errors.lastName ? 'border-error' : ''}
          />
          {errors.lastName && (
            <p className="text-error text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...register('email')}
            className={errors.email ? 'border-error' : ''}
          />
          {errors.email && (
            <p className="text-error text-sm">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            {...register('phone')}
            className={errors.phone ? 'border-error' : ''}
          />
          {errors.phone && (
            <p className="text-error text-sm">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          {...register('company')}
          className={errors.company ? 'border-error' : ''}
        />
        {errors.company && (
          <p className="text-error text-sm">{errors.company.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            {...register('city')}
            className={errors.city ? 'border-error' : ''}
          />
          {errors.city && (
            <p className="text-error text-sm">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            {...register('state')}
            className={errors.state ? 'border-error' : ''}
          />
          {errors.state && (
            <p className="text-error text-sm">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Source</Label>
          <Select
            value={sourceValue}
            onValueChange={(value: any) => setValue('source', value)}
          >
            <SelectTrigger className={errors.source ? 'border-error' : ''}>
              <SelectValue placeholder="Select source" />
            </SelectTrigger>
            <SelectContent>
              {sourceOptions.map((source) => (
                <SelectItem key={source.value} value={source.value}>
                  {source.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.source && (
            <p className="text-error text-sm">{errors.source.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Status</Label>
          <Select
            value={statusValue}
            onValueChange={(value: any) => setValue('status', value)}
          >
            <SelectTrigger className={errors.status ? 'border-error' : ''}>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-error text-sm">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="score">Score (0-100)</Label>
          <Input
            id="score"
            type="number"
            min="0"
            max="100"
            {...register('score', { valueAsNumber: true })}
            className={errors.score ? 'border-error' : ''}
          />
          {errors.score && (
            <p className="text-error text-sm">{errors.score.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="leadValue">Lead Value (₹)</Label>
          <Input
            id="leadValue"
            type="number"
            min="0"
            {...register('leadValue', { valueAsNumber: true })}
            className={errors.leadValue ? 'border-error' : ''}
          />
          {errors.leadValue && (
            <p className="text-error text-sm">{errors.leadValue.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastActivityAt">Last Activity</Label>
          <Input
            id="lastActivityAt"
            type="datetime-local"
            {...register('lastActivityAt')}
            className={errors.lastActivityAt ? 'border-error' : ''}
          />
          {errors.lastActivityAt && (
            <p className="text-error text-sm">{errors.lastActivityAt.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Qualified</Label>
          <Select
            value={isQualifiedValue.toString()}
            onValueChange={(value) => setValue('isQualified', value === 'true')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">Yes</SelectItem>
              <SelectItem value="false">No</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="netflix" disabled={isLoading}>
          {isLoading ? 'Saving...' : lead ? 'Update Lead' : 'Create Lead'}
        </Button>
      </div>
    </form>
  )
}