// src/modules/users/components/UserStatusBadge.tsx
import React from 'react'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { dot: string; text: string; bg: string }> = {
  Active: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' },
  Inactive: { dot: 'bg-slate-400', text: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' },
  Invited: { dot: 'bg-blue-500 animate-pulse', text: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  Suspended: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50 border-red-200' },
}

export interface UserStatusBadgeProps {
  status?: string;
  className?: string;
}

export function UserStatusBadge({ status = 'Active', className }: UserStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['Inactive']
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full shrink-0', config.dot)} />
      {status}
    </span>
  )
}
