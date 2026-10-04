// src/components/common/LoadingState.jsx
import React from 'react'
import { Loader2 } from 'lucide-react'

export function LoadingState({ message = 'Loading institutional data...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Loader2 className="h-7 w-7 animate-spin text-blue-600 mb-2.5" />
      <p className="text-xs text-slate-500 font-medium">{message}</p>
    </div>
  )
}
