// src/modules/academics/components/AcademicOverview.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { AcademicStructure } from './AcademicStructure'
import { UserCheck, Users, BookOpen, Layers, CheckCircle2, AlertCircle } from 'lucide-react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts'

export function AcademicOverview({ overviewData }) {
  const structure = overviewData?.structure || {
    programsCount: 4,
    coursesCount: 4,
    classesCount: 6,
    sectionsCount: 5,
    subjectsCount: 6,
  }

  const teaching = overviewData?.teaching || {
    totalFaculty: 28,
    assignedFaculty: 24,
    unassignedFaculty: 4,
    assignedSubjects: 5,
    unassignedSubjects: 1,
  }

  const students = overviewData?.students || {
    totalStudents: 1420,
    byProgram: [
      { name: 'Senior Sec', count: 665, color: '#3b82f6' },
      { name: 'Secondary', count: 755, color: '#6366f1' },
    ],
    byClass: [
      { name: 'Cls 12', count: 320 },
      { name: 'Cls 11', count: 345 },
      { name: 'Cls 10', count: 410 },
      { name: 'Cls 9', count: 395 },
    ],
    bySection: [
      { name: '12-A', count: 38 },
      { name: '12-B', count: 36 },
      { name: '11-A', count: 39 },
      { name: '10-A', count: 42 },
      { name: '10-B', count: 41 },
    ],
  }

  const COLORS = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ec4899']

  return (
    <div className="space-y-6">
      {/* 1. Academic Hierarchy Pipeline */}
      <AcademicStructure counts={structure} />

      {/* 2. Teaching & Student Operational Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Teaching Overview Card */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                Teaching Faculty & Allocation Health
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Staff distribution against curriculum subjects and homeroom leadership.
              </p>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Total Teaching Staff</span>
                  <div className="text-2xl font-black text-slate-900 mt-1">{teaching.totalFaculty}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Verified faculty profiles</div>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <span className="text-[10px] text-emerald-700 uppercase font-bold tracking-wider">Active Assignments</span>
                  <div className="text-2xl font-black text-emerald-700 mt-1">{teaching.assignedFaculty}</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Engaged in classroom delivery</div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <span className="text-[10px] text-blue-700 uppercase font-bold tracking-wider">Subjects Covered</span>
                  <div className="text-2xl font-black text-blue-700 mt-1">{teaching.assignedSubjects} / {structure.subjectsCount}</div>
                  <div className="text-[10px] text-blue-600 mt-0.5">Assigned to educator</div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="text-[10px] text-amber-700 uppercase font-bold tracking-wider">Pending Subject Lead</span>
                  <div className="text-2xl font-black text-amber-700 mt-1">{teaching.unassignedSubjects}</div>
                  <div className="text-[10px] text-amber-600 mt-0.5">Requiring faculty allocation</div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Educator Deployment Rate</span>
                <span className="font-bold text-emerald-700 font-mono">
                  {Math.round((teaching.assignedFaculty / (teaching.totalFaculty || 1)) * 100)}%
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Enrollment Distribution Card */}
        <div className="lg:col-span-6 space-y-6">
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-600" />
                  Student Cohort Allocation Breakdown
                </CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enrollment density distributed across active grade classes.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {students.totalStudents} Students
              </span>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {/* Mini Chart */}
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={students.byClass} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Section Density Badges */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2">
                  Key Section Strength
                </span>
                <div className="flex flex-wrap gap-2">
                  {students.bySection?.map((sec) => (
                    <div key={sec.name} className="px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs">
                      <span className="font-semibold text-slate-700">{sec.name}: </span>
                      <span className="font-bold text-blue-700">{sec.count} students</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
