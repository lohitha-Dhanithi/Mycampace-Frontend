// src/components/charts/StatCard.tsx
import React from 'react'
import { TrendingUp, TrendingDown, type LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export interface StatCardProps {
  title?: React.ReactNode;
  label?: React.ReactNode;
  value?: React.ReactNode;
  change?: React.ReactNode;
  trend?: 'up' | 'down' | string;
  subtitle?: React.ReactNode;
  sub?: React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  color?: string;
  className?: string;
}

export function StatCard({
  title,
  label,
  value,
  change,
  trend = 'up',
  subtitle,
  sub,
  icon: Icon,
  color = 'blue',
  className,
}: StatCardProps) {
  const isUp = trend === 'up'
  const displayTitle = title || label
  const displaySubtitle = subtitle || sub

  const colorStyles: Record<string, string> = {
    blue: 'border-l-blue-600 text-blue-600 bg-blue-50/70',
    indigo: 'border-l-indigo-600 text-indigo-600 bg-indigo-50/70',
    emerald: 'border-l-emerald-600 text-emerald-600 bg-emerald-50/70',
    teal: 'border-l-teal-600 text-teal-600 bg-teal-50/70',
    amber: 'border-l-amber-600 text-amber-600 bg-amber-50/70',
    slate: 'border-l-slate-600 text-slate-600 bg-slate-100',
    purple: 'border-l-purple-600 text-purple-600 bg-purple-50/70',
    rose: 'border-l-rose-600 text-rose-600 bg-rose-50/70',
  }

  return (
    <Card className={`border border-slate-200 shadow-xs hover:shadow-sm transition-shadow ${className || ''}`}>
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{displayTitle}</p>
          {Icon && (
            <div className={`p-2 rounded-md ${colorStyles[color] || colorStyles.blue}`}>
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>

        <div className="mt-2.5 flex items-baseline justify-between">
          <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
          {change && (
            <span
              className={`inline-flex items-center text-xs font-semibold px-1.5 py-0.5 rounded ${
                isUp ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
              }`}
            >
              {isUp ? (
                <TrendingUp className="h-3 w-3 mr-1 stroke-[2.5]" />
              ) : (
                <TrendingDown className="h-3 w-3 mr-1 stroke-[2.5]" />
              )}
              {change}
            </span>
          )}
        </div>

        {displaySubtitle && <p className="text-[11px] text-slate-500 mt-1">{displaySubtitle}</p>}
      </CardContent>
    </Card>
  )
}
