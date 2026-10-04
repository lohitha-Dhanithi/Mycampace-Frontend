// src/components/ui/checkbox.jsx
import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

const Checkbox = React.forwardRef(({ className, checked, onChange, disabled, id, ...props }, ref) => {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      id={id}
      ref={ref}
      disabled={disabled}
      onClick={() => onChange && onChange(!checked)}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded border border-slate-300 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center',
        checked ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white hover:border-slate-400',
        className
      )}
      {...props}
    >
      {checked && <Check className="h-3 w-3 stroke-[3]" />}
    </button>
  )
})
Checkbox.displayName = 'Checkbox'

export { Checkbox }
