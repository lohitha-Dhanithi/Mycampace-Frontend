// src/modules/admissions/components/AdmissionFunnel.jsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowDown, CheckCircle2 } from 'lucide-react'

export function AdmissionFunnel({ funnelData = [] }) {
  const stages = funnelData.length > 0 ? funnelData : [
    { stage: 'Leads', count: 120, conversion: '100%' },
    { stage: 'Enquiries', count: 84, conversion: '70.0%' },
    { stage: 'Counselling', count: 56, conversion: '66.7%' },
    { stage: 'Applications', count: 38, conversion: '67.8%' },
    { stage: 'Approved', count: 24, conversion: '63.1%' },
    { stage: 'Enrolled', count: 18, conversion: '75.0%' },
  ]

  const maxCount = Math.max(...stages.map((s) => s.count || 1))

  return (
    <Card className="border-slate-200/80 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">Admissions Pipeline Funnel</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Progression and step-by-step conversion efficiency from prospective lead to enrolled student
            </CardDescription>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
            Current Academic Year
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        <div className="space-y-2.5">
          {stages.map((st, index) => {
            const widthPct = Math.max(18, Math.round((st.count / maxCount) * 100))
            const isLast = index === stages.length - 1

            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{st.stage}</span>
                    <span className="text-[11px] text-slate-500 font-medium">({st.count} candidates)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {index > 0 && (
                      <span className="text-[11px] text-slate-400">
                        Stage Conv: <strong className="text-slate-700">{st.conversion}</strong>
                      </span>
                    )}
                  </div>
                </div>

                {/* Funnel Bar */}
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden flex">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isLast
                        ? 'bg-emerald-600'
                        : index >= 4
                        ? 'bg-teal-500'
                        : index >= 2
                        ? 'bg-blue-600'
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${widthPct}%` }}
                  />
                </div>

                {!isLast && (
                  <div className="flex justify-center my-0.5 opacity-40">
                    <ArrowDown className="h-3 w-3 text-slate-400" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Overall Funnel Efficiency: <strong>15.0%</strong> (18 / 120)</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="h-3.5 w-3.5" /> High conversion rate in Counselling & Applications
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
