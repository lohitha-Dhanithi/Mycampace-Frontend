// src/modules/admissions/components/AdmissionsDashboard.jsx
import React, { useState, useEffect } from 'react'
import { AdmissionsKPIs } from './AdmissionsKPIs'
import { AdmissionFunnel } from './AdmissionFunnel'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  INITIAL_ADMISSIONS_KPIS,
  INITIAL_ADMISSION_FUNNEL,
  INITIAL_ADMISSIONS_ACTIVITIES,
} from '../data/admissionsDashboardMockData'
import {
  Clock,
  ArrowRight,
  Plus,
  FileText,
  UserPlus,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AdmissionsDashboard() {
  const navigate = useNavigate()
  const [kpis, setKpis] = useState(INITIAL_ADMISSIONS_KPIS)
  const [funnel, setFunnel] = useState(INITIAL_ADMISSION_FUNNEL)
  const [activities, setActivities] = useState(INITIAL_ADMISSIONS_ACTIVITIES)

  return (
    <div className="space-y-6">
      {/* Quick Action Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={() => navigate('/admissions/leads/new')}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <UserPlus className="h-3.5 w-3.5" /> + New Lead
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/admissions/applications/new')}
            className="gap-1.5 text-xs text-slate-700 hover:bg-slate-100"
          >
            <FileText className="h-3.5 w-3.5" /> + Create Application
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/admissions/counselling/new')}
            className="gap-1.5 text-xs text-slate-700 hover:bg-slate-100"
          >
            <Calendar className="h-3.5 w-3.5" /> + Schedule Counselling
          </Button>
        </div>

        <div className="text-xs text-slate-500">
          Intake Period: <strong className="text-slate-800">2026-2027 Academic Cycle</strong>
        </div>
      </div>

      {/* KPI Cards */}
      <AdmissionsKPIs kpis={kpis} />

      {/* Visual Pipeline Funnel */}
      <AdmissionFunnel funnelData={funnel} />

      {/* Recent Admissions Activity Stream */}
      <Card className="border-slate-200/80 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900">Recent Admissions Activity</CardTitle>
            <p className="text-xs text-slate-500">Real-time prospective student and application milestones</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admissions/applications')}
            className="text-xs text-blue-600 hover:text-blue-700 gap-1 h-7"
          >
            View All Applications <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {activities.map((act) => (
              <div key={act.id} className="relative group">
                <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-blue-600 border-2 border-white ring-1 ring-blue-200" />
                <div className="p-3 bg-slate-50/70 hover:bg-slate-100/70 transition-colors rounded-lg border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-slate-900">{act.activity}</span>
                      <span className="text-slate-400">•</span>
                      <span className="font-semibold text-blue-700">{act.applicant}</span>
                      <StatusBadge status={act.status} />
                    </div>
                    <p className="text-slate-600 text-[11px]">{act.details}</p>
                    <div className="text-[10px] text-slate-400">By: {act.user}</div>
                  </div>
                  <div className="text-[11px] text-slate-400 shrink-0 flex items-center gap-1 self-start sm:self-auto">
                    <Clock className="h-3 w-3" /> {act.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
