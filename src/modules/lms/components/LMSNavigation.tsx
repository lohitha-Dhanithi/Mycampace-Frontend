// src/modules/lms/components/LMSNavigation.jsx
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  FolderOpen,
  ClipboardList,
  HelpCircle,
  BarChart3,
  Sparkles,
} from 'lucide-react'

export function LMSNavigation() {
  const location = useLocation()
  const path = location.pathname

  const navItems = [
    { label: 'LMS Command Center', path: '/lms', icon: LayoutDashboard, exact: true },
    { label: 'Course Catalog', path: '/lms/courses', icon: BookOpen },
    { label: 'My Learning (Student)', path: '/lms/my-learning', icon: GraduationCap },
    { label: 'Assignments', path: '/lms/assignments', icon: ClipboardList },
    { label: 'Quizzes', path: '/lms/quizzes', icon: HelpCircle },
    { label: 'Content Library', path: '/lms/content-library', icon: FolderOpen },
    { label: 'LMS Reports', path: '/lms/reports', icon: BarChart3 },
  ]

  const isActive = (item) => {
    if (item.exact) return path === item.path
    return path.startsWith(item.path)
  }

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm -mt-2 -mx-4 md:-mx-8 px-4 md:px-8 mb-6 sticky top-16 z-20">
      <div className="flex items-center justify-between overflow-x-auto py-2.5 scrollbar-none gap-2">
        <div className="flex items-center gap-1.5 min-w-max">
          <div className="hidden lg:flex items-center gap-2 pr-3 mr-2 border-r border-slate-200">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-600 text-white font-bold text-xs shadow-sm">
              LMS
            </span>
            <span className="text-xs font-bold text-slate-800 tracking-wide uppercase">
              Learning System
            </span>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  active
                    ? 'bg-blue-50 text-blue-700 shadow-xs border border-blue-200/80 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${active ? 'text-blue-600' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </div>
      </div>
    </div>
  )
}
