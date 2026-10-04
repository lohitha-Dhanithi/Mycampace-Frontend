// src/components/ui/badge.jsx
import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-blue-600 text-white shadow hover:bg-blue-700',
        secondary: 'border-transparent bg-slate-100 text-slate-800 hover:bg-slate-200',
        destructive: 'border-transparent bg-red-100 text-red-800 border-red-200',
        outline: 'text-slate-800 border-slate-300',
        success: 'border-transparent bg-emerald-50 text-emerald-700 border border-emerald-200',
        warning: 'border-transparent bg-amber-50 text-amber-700 border border-amber-200',
        info: 'border-transparent bg-blue-50 text-blue-700 border border-blue-200',
        purple: 'border-transparent bg-purple-50 text-purple-700 border border-purple-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
