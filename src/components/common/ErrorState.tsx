// src/components/common/ErrorState.tsx
import React from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Unable to load information',
  message = 'An unexpected error occurred while retrieving data from the institutional server.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border border-red-200 rounded-lg bg-red-50/40 my-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-3">
        <AlertCircle className="h-6 w-6 stroke-[2]" />
      </div>
      <h4 className="text-sm font-semibold text-red-950">{title}</h4>
      <p className="text-xs text-red-700/80 max-w-sm mt-1 mb-4">{message}</p>
      {onRetry && (
        <Button size="sm" variant="outline" onClick={onRetry} className="border-red-200 bg-white text-red-800 hover:bg-red-50">
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Retry
        </Button>
      )}
    </div>
  )
}
