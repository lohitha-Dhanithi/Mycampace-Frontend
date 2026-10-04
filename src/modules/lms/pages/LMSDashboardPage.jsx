// src/modules/lms/pages/LMSDashboardPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock,
  ClipboardList,
  HelpCircle,
  BarChart3,
  Plus,
  Play,
  ArrowRight,
  TrendingUp,
  FolderOpen,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { LMSCourseCard } from '../components/LMSCourseCard'
import { CourseProgressBar } from '../components/CourseProgressBar'
import { lmsCourseService } from '../services/lmsCourseService'
import { lmsEnrollmentService } from '../services/lmsEnrollmentService'
import { lmsAssignmentService } from '../services/lmsAssignmentService'
import { lmsQuizService } from '../services/lmsQuizService'
import { useAuth } from '@/store/AuthContext'

export function LMSDashboardPage() {
  const { user } = useAuth()
  // Allow toggling between roles for demo/preview purposes
  const [activeRoleView, setActiveRoleView] = useState('Administrator')
  const [courses, setCourses] = useState([])
  const [myCourses, setMyCourses] = useState([])
  const [assignments, setAssignments] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoading(true)
    try {
      const [crsList, myCrsList, asgList, qzList] = await Promise.all([
        lmsCourseService.getCourses(),
        lmsEnrollmentService.getMyEnrolledCourses('std-001'),
        lmsAssignmentService.getAllAssignments(),
        lmsQuizService.getAllQuizzes(),
      ])
      setCourses(crsList)
      setMyCourses(myCrsList)
      setAssignments(asgList)
      setQuizzes(qzList)
    } finally {
      setLoading(false)
    }
  }

  const publishedCourses = courses.filter((c) => c.status === 'Published')
  const pendingSubmissions = assignments.reduce((acc, a) => acc + (a.pendingGradingCount || 0), 0)

  return (
    <div className="space-y-6">
      {/* Contextual Sub-navigation */}
      <LMSNavigation />

      {/* Header with Role Persona Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              Education ERP Layer
            </span>
            <span className="text-xs text-slate-400">•</span>
            <span className="text-xs text-slate-500 font-medium">Academic Year 2026-2027</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Learning Management System
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Integrated digital learning environment mapped to academic courses, cohorts, and curricula.
          </p>
        </div>

        {/* Role Persona Switcher Pill */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <span className="text-[11px] font-bold text-slate-500 px-2">Preview Role:</span>
          {['Administrator', 'Faculty', 'Student'].map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => setActiveRoleView(role)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeRoleView === role
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. ADMINISTRATOR / PRINCIPAL DASHBOARD VIEW               */}
      {/* ======================================================== */}
      {activeRoleView === 'Administrator' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Admin KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold text-slate-600">Total LMS Courses</span>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">{courses.length}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                <span className="text-emerald-600 font-semibold">{publishedCourses.length} Published</span> • {courses.length - publishedCourses.length} In Progress
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold text-slate-600">Active Students</span>
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">113</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Enrolled across Class 11 & 12 cohorts
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold text-slate-600">Avg Course Completion</span>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">65%</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Weighted across active modules
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold text-slate-600">Pending Submissions</span>
                <ClipboardList className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-600">{pendingSubmissions}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Awaiting faculty evaluation
              </div>
            </div>
          </div>

          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-xl shadow-sm">
            <div>
              <h3 className="font-bold text-sm">Administrative Learning Governance</h3>
              <p className="text-xs text-blue-200 mt-0.5">
                Oversee academic alignment, syllabus pacing, and student assessment outcomes.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link
                to="/lms/courses/new"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Create LMS Course</span>
              </Link>
              <Link
                to="/lms/reports"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-semibold transition-colors"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                <span>View Reports</span>
              </Link>
            </div>
          </div>

          {/* Courses Overview Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Institutional LMS Courses</h3>
                <p className="text-xs text-slate-500">Live digital courses mapped to campus sections.</p>
              </div>
              <Link
                to="/lms/courses"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View Full Catalog</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.slice(0, 3).map((course) => (
                <LMSCourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. FACULTY / INSTRUCTOR DASHBOARD VIEW                   */}
      {/* ======================================================== */}
      {activeRoleView === 'Faculty' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Faculty KPI Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold text-slate-600">My Assigned Courses</span>
                <BookOpen className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">2</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Class 12-A Physics & Class 11-A Mechanics
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold text-slate-600">Active Students</span>
                <Users className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">38</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Enrolled in Advanced Physics
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold text-slate-600">Pending to Grade</span>
                <ClipboardList className="h-4 w-4 text-amber-600" />
              </div>
              <div className="text-2xl font-black text-amber-600">6</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Problem Set 1 submissions
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-semibold text-slate-600">Avg Score</span>
                <Award className="h-4 w-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">82%</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Cohort assessment performance
              </div>
            </div>
          </div>

          {/* Quick Actions for Faculty */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-2xs">
            <span className="text-xs font-bold text-slate-700">Quick Faculty Actions:</span>
            <Link
              to="/lms/courses/lms-crs-101"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold border border-blue-200 transition-colors"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Manage Advanced Physics Course</span>
            </Link>
            <Link
              to="/lms/assignments/asg-101/submissions"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold border border-amber-200 transition-colors"
            >
              <ClipboardList className="h-3.5 w-3.5" />
              <span>Grade Submissions (6 Pending)</span>
            </Link>
            <Link
              to="/lms/content-library"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-lg text-xs font-semibold border border-slate-200 transition-colors"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              <span>Content Library</span>
            </Link>
          </div>

          {/* My Taught Courses */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Courses You Teach</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {courses.slice(0, 2).map((course) => (
                <LMSCourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. STUDENT DASHBOARD VIEW                                */}
      {/* ======================================================== */}
      {activeRoleView === 'Student' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Prominent Continue Learning Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 md:p-8 shadow-md border border-blue-800/40">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-200 border border-blue-400/30 mb-3">
                <Sparkles className="h-3.5 w-3.5 text-blue-300" />
                Ready to continue your journey
              </span>
              <h2 className="text-xl md:text-2xl font-black tracking-tight mb-2 leading-tight">
                Advanced Physics: Electromagnetism & Wave Optics
              </h2>
              <p className="text-xs text-blue-200/90 mb-6 leading-relaxed">
                Next Lesson: <strong>1.2 Electric Field Lines, Dipoles & Torque Dynamics</strong>. Keep up your learning streak!
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/lms/my-learning/lms-crs-101"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all hover:scale-105"
                >
                  <Play className="h-4 w-4 fill-current" />
                  <span>Continue Learning</span>
                </Link>

                <div className="flex items-center gap-3 text-xs text-blue-200">
                  <div className="w-32">
                    <CourseProgressBar progress={86} showLabel={false} size="sm" />
                  </div>
                  <span className="font-bold">86% Completed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Student Stats Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="block text-xs font-semibold text-slate-500">Enrolled Courses</span>
              <span className="text-2xl font-black text-slate-900 mt-1 block">
                {myCourses.length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="block text-xs font-semibold text-slate-500">In Progress</span>
              <span className="text-2xl font-black text-blue-600 mt-1 block">
                {myCourses.filter((c) => (c.progressPercentage || 0) < 100).length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="block text-xs font-semibold text-slate-500">Completed Courses</span>
              <span className="text-2xl font-black text-emerald-600 mt-1 block">1</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
              <span className="block text-xs font-semibold text-slate-500">Upcoming Tasks</span>
              <span className="text-2xl font-black text-amber-600 mt-1 block">2</span>
            </div>
          </div>

          {/* My Enrolled Course Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">My Enrolled Courses</h3>
                <p className="text-xs text-slate-500">Current active academic subjects and study materials.</p>
              </div>
              <Link
                to="/lms/my-learning"
                className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <span>View All My Courses</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.slice(0, 3).map((course) => (
                <LMSCourseCard
                  key={course.id}
                  course={{
                    ...course,
                    progressPercentage: course.id === 'lms-crs-101' ? 86 : 60,
                    currentLesson: '1.2 Electric Field Lines & Dipoles',
                    lastActivity: 'Yesterday',
                  }}
                  isStudentView={true}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
