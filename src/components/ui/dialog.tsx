// src/components/ui/dialog.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
      />
      <div className="relative z-50 w-full max-w-lg bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden animate-in fade-in-0 zoom-in-95">
        {children}
      </div>
    </div>
  )
}

const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex flex-col space-y-1.5 p-5 pb-3 border-b border-slate-100', className)} {...props} />
)

const DialogTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2 ref={ref} className={cn('text-lg font-semibold leading-none text-slate-900', className)} {...props} />
  )
)
DialogTitle.displayName = 'DialogTitle'

const DialogDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-xs text-slate-500', className)} {...props} />
  )
)
DialogDescription.displayName = 'DialogDescription'

const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => (
  <div className={cn('p-5 space-y-4 max-h-[80vh] overflow-y-auto', className)} {...props}>
    {children}
  </div>
)

const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={cn('flex items-center justify-end space-x-2 p-4 bg-slate-50 border-t border-slate-100', className)} {...props} />
)

export { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter }
