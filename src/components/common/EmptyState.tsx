// src/components/common/EmptyState.tsx
import React from 'react'
import { FolderOpen, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface EmptyStateProps {
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  action?: React.ReactNode;
}

export function EmptyState({
  icon: Icon = FolderOpen,
  title = 'No records found',
  description = 'There is currently no data matching your filters or search criteria.',
  actionLabel,
  onAction,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-slate-200 rounded-lg bg-slate-50/50 my-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
        <Icon className="h-6 w-6 stroke-[1.5]" />
      </div>
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mt-1 mb-4">{description}</p>
      {action ? (
        action
      ) : actionLabel && onAction ? (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
