// src/components/charts/ChartCard.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

export function ChartCard({ title, subtitle, action, children, className }) {
  return (
    <Card className={`border border-slate-200 shadow-xs ${className || ''}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4 pb-2 border-b border-slate-100">
        <div>
          <CardTitle className="text-sm font-semibold text-slate-900">{title}</CardTitle>
          {subtitle && <CardDescription className="text-xs text-slate-500 mt-0.5">{subtitle}</CardDescription>}
        </div>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="p-4">{children}</CardContent>
    </Card>
  )
}
