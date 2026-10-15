// src/components/common/StatusBadge.tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface StatusBadgeProps {
  status?: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (!status) return null

  const s = String(status).toLowerCase()

  let dotColor = 'bg-slate-400'
  let textColor = 'text-slate-700'
  let bgColor = 'bg-slate-50 border-slate-200'

  if (['active', 'approved', 'admitted', 'enrolled', 'paid', 'fully paid', 'present', 'open', 'verified'].includes(s)) {
    dotColor = 'bg-emerald-500'
    textColor = 'text-slate-800'
    bgColor = 'bg-emerald-50/50 border-emerald-200/70'
  } else if (['inactive', 'closed', 'absent', 'rejected', 'overdue', 'cancelled'].includes(s)) {
    dotColor = 'bg-rose-500'
    textColor = 'text-slate-800'
    bgColor = 'bg-rose-50/50 border-rose-200/70'
  } else if (['pending', 'under review', 'in progress', 'counselling', 'late', 'late arrivals', 'pre-registration', 'documents required', 'partially paid'].includes(s)) {
    dotColor = 'bg-amber-500'
    textColor = 'text-slate-800'
    bgColor = 'bg-amber-50/50 border-amber-200/70'
  } else if (['enquiry', 'application', 'upcoming', 'new', 'docs uploaded'].includes(s)) {
    dotColor = 'bg-blue-500'
    textColor = 'text-slate-800'
    bgColor = 'bg-blue-50/50 border-blue-200/70'
  } else if (['policy shared', 'policy sent', 'terms accepted'].includes(s)) {
    dotColor = 'bg-indigo-500'
    textColor = 'text-slate-800'
    bgColor = 'bg-indigo-50/50 border-indigo-200/70'
  } else if (['high'].includes(s)) {
    dotColor = 'bg-rose-500'
    textColor = 'text-rose-800'
    bgColor = 'bg-rose-50/50 border-rose-200/70'
  } else if (['medium'].includes(s)) {
    dotColor = 'bg-amber-500'
    textColor = 'text-amber-800'
    bgColor = 'bg-amber-50/50 border-amber-200/70'
  } else if (['low', 'normal'].includes(s)) {
    dotColor = 'bg-slate-400'
    textColor = 'text-slate-700'
    bgColor = 'bg-slate-50 border-slate-200'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap select-none',
        bgColor,
        textColor,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', dotColor)} />
      {status}
    </span>
  )
}
