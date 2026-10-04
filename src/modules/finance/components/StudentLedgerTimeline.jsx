// src/modules/finance/components/StudentLedgerTimeline.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { FileText, CreditCard, Receipt, RotateCcw, Tag, History } from 'lucide-react'
import { formatCurrency } from '../config/financeConfig'

export function StudentLedgerTimeline({ events = [] }) {
  if (!events || events.length === 0) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-6 text-center text-xs text-slate-500">
          No financial activity recorded yet for this student.
        </CardContent>
      </Card>
    )
  }

  const getIcon = (type) => {
    switch (type) {
      case 'invoice':
        return <FileText className="h-4 w-4 text-blue-600" />
      case 'payment':
        return <CreditCard className="h-4 w-4 text-emerald-600" />
      case 'receipt':
        return <Receipt className="h-4 w-4 text-purple-600" />
      case 'refund':
        return <RotateCcw className="h-4 w-4 text-rose-600" />
      default:
        return <Tag className="h-4 w-4 text-amber-600" />
    }
  }

  const getBadgeColor = (type) => {
    switch (type) {
      case 'invoice':
        return 'bg-blue-100 text-blue-800'
      case 'payment':
        return 'bg-emerald-100 text-emerald-800'
      case 'receipt':
        return 'bg-purple-100 text-purple-800'
      case 'refund':
        return 'bg-rose-100 text-rose-800'
      default:
        return 'bg-amber-100 text-amber-800'
    }
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3 border-b border-slate-100">
        <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <History className="h-4 w-4 text-blue-600" />
          Financial Transaction Timeline
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {events.map((event) => (
            <div key={event.id} className="relative group">
              <div className="absolute -left-[1.85rem] mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white border-2 border-slate-300 group-hover:border-blue-500 transition-colors shadow-xs">
                {getIcon(event.type)}
              </div>
              <div className="bg-slate-50/70 hover:bg-slate-50 rounded-lg p-3 border border-slate-200/80 transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider ${getBadgeColor(event.type)}`}>
                      {event.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 mt-1">{event.title}</h4>
                  </div>
                  {event.amount && (
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatCurrency(event.amount)}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 mt-1">{event.description}</p>
                <div className="text-[10px] text-slate-400 mt-2 font-mono">
                  {new Date(event.date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
