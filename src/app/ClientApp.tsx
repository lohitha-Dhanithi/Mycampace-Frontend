'use client'

import React from 'react'
import dynamic from 'next/dynamic'

const App = dynamic(() => import('@/App'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-xs font-semibold text-slate-500 tracking-wide uppercase">
          Initializing MyCampace OS...
        </span>
      </div>
    </div>
  ),
})

export default function ClientApp() {
  return <App />
}
