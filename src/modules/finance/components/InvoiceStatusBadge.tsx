// src/modules/finance/components/InvoiceStatusBadge.jsx
import React from 'react'
import { Badge } from '@/components/ui/badge'

export function InvoiceStatusBadge({ status }) {
  if (!status) return null

  const s = String(status).toLowerCase()

  let variant = 'secondary'
  if (['paid'].includes(s)) variant = 'success'
  else if (['partially paid'].includes(s)) variant = 'warning'
  else if (['issued'].includes(s)) variant = 'info'
  else if (['overdue'].includes(s)) variant = 'destructive'
  else if (['draft', 'cancelled'].includes(s)) variant = 'secondary'

  return (
    <Badge variant={variant} className="capitalize text-[11px] font-medium tracking-wide">
      <span className="h-1.5 w-1.5 rounded-full mr-1.5 inline-block shrink-0 bg-current opacity-80" />
      {status}
    </Badge>
  )
}
