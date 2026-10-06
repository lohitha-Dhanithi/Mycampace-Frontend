// src/modules/admissions/components/AdmissionsKPIs.jsx
import React from 'react'
import {
  Users,
  MessageSquare,
  FileText,
  Clock,
  CheckCircle,
  GraduationCap,
  TrendingUp,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export function AdmissionsKPIs({ kpis = {} }: { kpis?: any }) {
  const items = [
    {
      label: 'Total Leads',
      value: kpis.totalLeads ?? 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-100',
      description: 'Total active prospective candidates',
    },
    {
      label: 'New Enquiries',
      value: kpis.newEnquiries ?? 0,
      icon: MessageSquare,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50 border-sky-100',
      description: 'Qualified incoming enquiries',
    },
    {
      label: 'Active Applications',
      value: kpis.activeApplications ?? 0,
      icon: FileText,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
      description: 'Submitted and progressing',
    },
    {
      label: 'Under Review',
      value: kpis.applicationsUnderReview ?? 0,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
      description: 'Awaiting committee decision',
    },
    {
      label: 'Approved Applications',
      value: kpis.approvedApplications ?? 0,
      icon: CheckCircle,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
      description: 'Ready for admission confirmation',
    },
    {
      label: 'Enrolled Students',
      value: kpis.enrolledStudents ?? 0,
      icon: GraduationCap,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 border-teal-100',
      description: 'Officially matriculated to SIS',
    },
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {items.map((it, idx) => {
          const Icon = it.icon
          return (
            <Card key={idx} className="border-slate-200/80 shadow-xs hover:border-slate-300 transition-all">
              <CardContent className="p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider truncate">
                    {it.label}
                  </span>
                  <div className={`p-1.5 rounded-md border ${it.bgColor}`}>
                    <Icon className={`h-4 w-4 ${it.color}`} />
                  </div>
                </div>
                <div className="text-xl font-bold text-slate-900 tracking-tight">
                  {it.value}
                </div>
                <p className="text-[10px] text-slate-400 truncate">{it.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Conversion Rate & Pending Follow-ups */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-200/60 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">Conversion Rate</div>
              <div className="text-[11px] text-slate-500">Leads transitioned to confirmed admissions</div>
            </div>
          </div>
          <div className="text-xl font-extrabold text-blue-700">{kpis.conversionRate || '31.2%'}</div>
        </div>

        <div className="flex items-center justify-between p-3.5 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent border border-amber-200/60 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-800">Pending Follow-ups</div>
              <div className="text-[11px] text-slate-500">Scheduled calls and reminders requiring attention</div>
            </div>
          </div>
          <div className="text-xl font-extrabold text-amber-700">{kpis.pendingFollowups ?? 9}</div>
        </div>
      </div>
    </div>
  )
}
