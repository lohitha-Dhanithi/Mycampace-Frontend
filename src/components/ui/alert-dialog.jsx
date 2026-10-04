// src/components/ui/alert-dialog.jsx
import * as React from 'react'
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

const AlertDialog = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange && onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-md bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in-0 zoom-in-95">
        {children}
      </div>
    </div>
  )
}

const AlertDialogHeader = ({ className, ...props }) => (
  <div className={cn('p-5 pb-3', className)} {...props} />
)

const AlertDialogTitle = React.forwardRef(({ className, children, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-base font-semibold leading-none text-slate-900 flex items-center gap-2', className)} {...props}>
    {children}
  </h3>
))
AlertDialogTitle.displayName = 'AlertDialogTitle'

const AlertDialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs text-slate-600 mt-2 leading-relaxed', className)} {...props} />
))
AlertDialogDescription.displayName = 'AlertDialogDescription'

const AlertDialogContent = ({ className, children, ...props }) => (
  <div className={cn('px-5 py-2 space-y-3', className)} {...props}>
    {children}
  </div>
)

const AlertDialogFooter = ({ className, ...props }) => (
  <div className={cn('flex items-center justify-end space-x-2 p-4 bg-slate-50 border-t border-slate-100', className)} {...props} />
)

const AlertDialogAction = React.forwardRef(({ className, variant = 'default', children, ...props }, ref) => (
  <Button ref={ref} variant={variant} size="sm" className={cn('text-xs font-semibold', className)} {...props}>
    {children}
  </Button>
))
AlertDialogAction.displayName = 'AlertDialogAction'

const AlertDialogCancel = React.forwardRef(({ className, children = 'Cancel', ...props }, ref) => (
  <Button ref={ref} variant="outline" size="sm" className={cn('text-xs', className)} {...props}>
    {children}
  </Button>
))
AlertDialogCancel.displayName = 'AlertDialogCancel'

export {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
}
