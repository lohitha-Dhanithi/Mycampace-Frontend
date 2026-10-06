// src/modules/academics/components/AcademicStructure.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  BookOpen,
  GraduationCap,
  Layers,
  Users2,
  Bookmark,
  ArrowRight,
  ChevronRight,
  TrendingDown,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface AcademicStructureProps {
  counts?: any
}

export function AcademicStructure({ counts = {} }: AcademicStructureProps) {
  const navigate = useNavigate()

  const levels = [
    {
      level: 1,
      title: 'Programs',
      count: counts.programsCount || 4,
      desc: 'Institutional degree & certificate frameworks',
      route: '/academics/programs',
      icon: GraduationCap,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      level: 2,
      title: 'Courses',
      count: counts.coursesCount || 4,
      desc: 'Academic streams & elective curriculum sets',
      route: '/academics/courses',
      icon: BookOpen,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    },
    {
      level: 3,
      title: 'Classes',
      count: counts.classesCount || 6,
      desc: 'Standard cohort grades (Grade 7 – Grade 12)',
      route: '/academics/classes',
      icon: Layers,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
    {
      level: 4,
      title: 'Sections',
      count: counts.sectionsCount || 5,
      desc: 'Classroom units, homerooms & laboratory groups',
      route: '/academics/sections',
      icon: Users2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      level: 5,
      title: 'Subjects',
      count: counts.subjectsCount || 6,
      desc: 'Curriculum delivery units & syllabus topics',
      route: '/academics/subjects',
      icon: Bookmark,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
  ]

  return (
    <Card className="border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-blue-600" />
              Hierarchical Academic Delivery Structure
            </CardTitle>
            <p className="text-xs text-slate-500 mt-0.5">
              Top-down organizational pipeline mapping curriculum frameworks to active classroom sessions.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
            5 Tier Architecture
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative">
          {levels.map((lvl, index) => {
            const Icon = lvl.icon
            return (
              <div
                key={lvl.title}
                onClick={() => navigate(lvl.route)}
                className="group relative p-4 rounded-xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition-all cursor-pointer bg-slate-50/40 hover:bg-white flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`p-2 rounded-lg border ${lvl.color}`}>
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {lvl.count}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {lvl.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                    {lvl.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[10px] font-semibold text-slate-400 group-hover:text-blue-600">
                  <span>Manage {lvl.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
