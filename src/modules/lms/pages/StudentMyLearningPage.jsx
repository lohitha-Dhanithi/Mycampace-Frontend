// src/modules/lms/pages/StudentMyLearningPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Play,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Calendar,
  Search,
} from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { LMSCourseCard } from '../components/LMSCourseCard'
import { CourseProgressBar } from '../components/CourseProgressBar'
import { lmsEnrollmentService } from '../services/lmsEnrollmentService'
import { lmsCourseService } from '../services/lmsCourseService'

export function StudentMyLearningPage() {
  const [courses, setCourses] = useState([])
  const [filter, setFilter] = useState('all') // 'all' | 'in_progress' | 'completed'
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEnrolledCourses()
  }, [])

  const loadEnrolledCourses = async () => {
    setLoading(true)
    try {
      const myCourses = await lmsEnrollmentService.getMyEnrolledCourses('std-001')
      setCourses(myCourses)
    } finally {
      setLoading(false)
    }
  }

  const filteredCourses = courses.filter((c) => {
    const isCompleted = (c.progressPercentage || 0) >= 100
    if (filter === 'in_progress' && isCompleted) return false
    if (filter === 'completed' && !isCompleted) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        c.name?.toLowerCase().includes(q) ||
        c.subjectName?.toLowerCase().includes(q) ||
        c.instructorName?.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      <LMSNavigation />

      {/* Hero Strip */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 shadow-sm border border-blue-800/40">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-2 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="h-4 w-4" />
            <span>Student Learning Portal</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-2">
            My Learning Dashboard
          </h1>
          <p className="text-xs text-blue-200/90 leading-relaxed mb-6">
            Access your course lectures, video masterclasses, submit homework problem sets, and take self-paced assessments.
          </p>

          {/* Quick continue card */}
          {courses.length > 0 && (
            <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20">
              <Link
                to={`/lms/my-learning/${courses[0].id}`}
                className="h-10 w-10 rounded-lg bg-blue-500 hover:bg-blue-400 text-white flex items-center justify-center shadow-md transition-colors"
                title="Continue Learning"
              >
                <Play className="h-5 w-5 fill-current ml-0.5" />
              </Link>
              <div>
                <span className="block text-[11px] text-blue-200 font-medium">Continue Learning:</span>
                <span className="block text-xs font-bold text-white truncate max-w-xs">
                  {courses[0].name}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Tab Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', label: 'All Courses' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filter === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search my courses..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Enrolled Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((c) => (
            <LMSCourseCard
              key={c.id}
              course={c}
              isStudentView={true}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-dashed border-slate-200">
          <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800">You are not enrolled in any courses matching this filter.</h4>
          <p className="text-xs text-slate-500 mt-1">
            Courses mapped to your section will appear here automatically.
          </p>
        </div>
      )}
    </div>
  )
}
