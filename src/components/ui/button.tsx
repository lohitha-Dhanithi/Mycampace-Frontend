// src/components/ui/button.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow hover:bg-primary/90 bg-blue-600 hover:bg-blue-700 text-white',
        destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-700',
        outline: 'border border-slate-200 bg-white shadow-sm hover:bg-slate-50 text-slate-700',
        secondary: 'bg-slate-100 text-slate-900 shadow-sm hover:bg-slate-200',
        ghost: 'hover:bg-slate-100 hover:text-slate-900 text-slate-700',
        link: 'text-blue-600 underline-offset-4 hover:underline',
        success: 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-6 text-base',
        icon: 'h-9 w-9 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  variant?: VariantProps<typeof buttonVariants>['variant'] | (string & {}) | any;
  size?: VariantProps<typeof buttonVariants>['size'] | (string & {}) | any;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant: variant as any, size: size as any, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
