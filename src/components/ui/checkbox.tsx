// src/components/ui/checkbox.tsx
import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, onChange, onCheckedChange, disabled, id, ...props }, ref) => {
    const handleChange = () => {
      const next = !checked
      if (onChange) onChange(next)
      if (onCheckedChange) onCheckedChange(next)
    }

    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        id={id}
        ref={ref}
        disabled={disabled}
        onClick={handleChange}
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
  }
)
Checkbox.displayName = 'Checkbox'

export { Checkbox }
