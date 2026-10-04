// src/components/ui/avatar.jsx
import * as React from 'react'
import { cn } from '@/lib/utils'

const Avatar = ({ src, alt, fallback, size = 'md', className }) => {
  const [hasError, setHasError] = React.useState(!src)

  const sizeClasses = {
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base font-medium',
    xl: 'h-16 w-16 text-xl font-medium',
  }

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden bg-slate-100 border border-slate-200 text-slate-700 font-semibold uppercase select-none',
        sizeClasses[size] || sizeClasses.md,
        className
      )}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt || ''}
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{fallback || (alt ? alt.substring(0, 2) : 'MC')}</span>
      )}
    </div>
  )
}

export { Avatar }
