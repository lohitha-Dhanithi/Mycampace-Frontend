// src/modules/users/components/UserAvatar.jsx
import React from 'react'
import { cn } from '@/lib/utils'

const COLORS = [
  'bg-blue-600', 'bg-violet-600', 'bg-emerald-600', 'bg-rose-600',
  'bg-amber-600', 'bg-cyan-600', 'bg-indigo-600', 'bg-teal-600',
]

function getColor(name = '') {
  const idx = name.charCodeAt(0) % COLORS.length
  return COLORS[idx]
}

function getInitials(name = '') {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

const SIZE_MAP = {
  xs: 'h-6 w-6 text-[10px]',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
}

export function UserAvatar({ name = '', src, size = 'md', className }) {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md
  const color = getColor(name)
  const initials = getInitials(name)

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover ring-2 ring-white', sizeClass, className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-bold text-white ring-2 ring-white shrink-0',
        color,
        sizeClass,
        className
      )}
      title={name}
    >
      {initials}
    </div>
  )
}
