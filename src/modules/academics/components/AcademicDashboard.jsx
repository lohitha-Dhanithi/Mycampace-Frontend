// src/modules/academics/components/AcademicDashboard.jsx
import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  GraduationCap,
  BookOpen,
  Layers,
  Users2,
  Bookmark,
  UserCheck,
  Users,
  Calendar,
  ArrowRight,
  Sparkles,
  ClipboardList,
  CalendarDays,
  Gauge,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function AcademicDashboard({ stats = {}, currentAcademicYear = '2026–2027' }) {
  const navigate = useNavigate()

  const structure = stats.structure || {
    programsCount: 4,
    coursesCount: 4,
    classesCount: 6,
    sectionsCount: 5,
    subjectsCount: 6,
  }

  const teaching = stats.teaching || {
    totalFaculty: 28,
    assignedFaculty: 24,
  }

  const students = stats.students || {
    totalStudents: 1420,
  }

  const kpis = [
    {
      label: 'Active Programs',
      value: structure.programsCount,
      icon: GraduationCap,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-100',
      route: '/academics/programs',
    },
    {
      label: 'Active Courses',
      value: structure.coursesCount,
      icon: BookOpen,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50 border-indigo-100',
      route: '/academics/courses',
    },
    {
      label: 'Classes (Grades)',
      value: structure.classesCount,
      icon: Layers,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-100',
      route: '/academics/classes',
    },
    {
      label: 'Sections',
      value: structure.sectionsCount,
      icon: Users2,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50 border-teal-100',
      route: '/academics/sections',
    },
    {
      label: 'Subjects Taught',
      value: structure.subjectsCount,
      icon: Bookmark,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 border-amber-100',
      route: '/academics/subjects',
    },
    {
      label: 'Teaching Faculty',
      value: teaching.totalFaculty,
      icon: UserCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50 border-emerald-100',
      route: '/academics/faculty-assignments',
    },
    {
      label: 'Enrolled Students',
      value: students.totalStudents,
      icon: Users,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50 border-rose-100',
      route: '/academics/enrolments',
    },
    {
      label: 'Academic Year',
      value: currentAcademicYear,
      isText: true,
      icon: Calendar,
      color: 'text-cyan-700',
      bgColor: 'bg-cyan-50 border-cyan-100',
      route: '/academics/academic-calendar',
    },
  ]

  return (
    <div className="space-y-6">
      {/* 8 Primary Operational KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card
              key={kpi.label}
              onClick={() => navigate(kpi.route)}
              className="border-slate-200 shadow-xs hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer bg-white group"
            >
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                    {kpi.label}
                  </span>
                  <div className={`p-2 rounded-lg border ${kpi.bgColor} ${kpi.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <div className={`${kpi.isText ? 'text-lg font-bold' : 'text-2xl font-black'} text-slate-900 group-hover:text-blue-600 transition-colors`}>
                  {kpi.value}
                </div>
                <div className="flex items-center text-[10px] text-slate-400 group-hover:text-blue-600 font-semibold gap-1 pt-1 border-t border-slate-50">
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Action Operations Strip */}
      <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white tracking-wide">
              Academic Operations Quick Navigation
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Rapidly assign educators, schedule calendar milestones, or balance department workloads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/academics/faculty-assignments')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8"
          >
            <UserCheck className="w-3.5 h-3.5 mr-1.5" /> Faculty Assignments
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/academics/academic-calendar')}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs h-8"
          >
            <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-blue-400" /> Academic Calendar
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/academics/workload')}
            className="border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs h-8"
          >
            <Gauge className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> Workload Index
          </Button>
        </div>
      </div>
    </div>
  )
}
