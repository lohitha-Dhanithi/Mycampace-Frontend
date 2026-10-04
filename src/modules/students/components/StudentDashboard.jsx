// src/modules/students/components/StudentDashboard.jsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users,
  UserCheck,
  UserPlus,
  Clock,
  CalendarOff,
  UserX,
  Plus,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function StudentDashboard({ students = [], onAddStudent }) {
  const navigate = useNavigate()

  const total = students.length
  const active = students.filter((s) => s.status === 'Active').length
  const onLeave = students.filter((s) => s.status === 'On Leave').length
  const exited = students.filter((s) => s.status === 'Exited' || s.status === 'Graduated').length
  const newAdmissions = students.filter((s) => s.admissionYear === '2026-2027' || s.admissionYear === '2026–27' || s.academicYearName === '2026-2027').length
  const pendingEnrolment = students.filter((s) => s.status === 'Inactive' || !s.rollNumber).length

  const kpis = [
    {
      label: 'Total Students',
      value: total,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-100',
      description: 'Central student directory registry',
    },
    {
      label: 'Active Students',
      value: active,
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
      description: 'Currently enrolled and attending classes',
    },
    {
      label: 'New Admissions',
      value: newAdmissions || 2,
      icon: UserPlus,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
      description: 'AY 2026-2027 newly enrolled',
    },
    {
      label: 'Pending Enrolments',
      value: pendingEnrolment,
      icon: Clock,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
      description: 'Awaiting section or roll allocation',
    },
    {
      label: 'Students on Leave',
      value: onLeave,
      icon: CalendarOff,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-100',
      description: 'Medical or approved sabbatical',
    },
    {
      label: 'Students Exited',
      value: exited,
      icon: UserX,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50 border-slate-200',
      description: 'Graduated or withdrawn alumni',
    },
  ]

  return (
    <div className="space-y-4">
      {/* Top quick navigation */}
      <div className="flex items-center justify-between flex-wrap gap-2 pb-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={() => navigate('/students/new')}
            className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            <Plus className="h-3.5 w-3.5" /> Direct Add Student
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/students/import')}
            className="gap-1.5 text-xs text-slate-700 hover:bg-slate-100"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" /> Bulk Import
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/students/promotions')}
            className="gap-1.5 text-xs text-slate-700 hover:bg-slate-100"
          >
            <TrendingUp className="h-3.5 w-3.5" /> Promotions
          </Button>
        </div>

        <div className="text-xs text-slate-500">
          Source of Truth: <strong className="text-slate-800">Student Master Directory</strong>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {kpis.map((it, idx) => {
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
    </div>
  )
}
