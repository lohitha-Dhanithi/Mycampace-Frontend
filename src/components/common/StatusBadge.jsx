// src/components/common/StatusBadge.jsx
import React from 'react'
import { Badge } from '@/components/ui/badge'

export function StatusBadge({ status, className }) {
  if (!status) return null

  const s = String(status).toLowerCase()

  let variant = 'secondary'
  let label = status

  if (['active', 'approved', 'enrolled', 'paid', 'fully paid', 'present', 'open'].includes(s)) {
    variant = 'success'
  } else if (['inactive', 'closed', 'absent', 'rejected', 'overdue', 'cancelled'].includes(s)) {
    variant = 'destructive'
  } else if (['pending', 'under review', 'in progress', 'counselling', 'late', 'late arrivals', 'pre-registration'].includes(s)) {
    variant = 'warning'
  } else if (['enquiry', 'application', 'upcoming', 'new'].includes(s)) {
    variant = 'info'
  } else if (['high'].includes(s)) {
    variant = 'destructive'
  } else if (['medium'].includes(s)) {
    variant = 'warning'
  } else if (['low', 'normal'].includes(s)) {
    variant = 'secondary'
  }

  return (
    <Badge variant={variant} className={className}>
      <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block shrink-0 bg-current opacity-75" />
      {label}
    </Badge>
  )
}
