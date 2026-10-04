// src/modules/lms/pages/StudentCoursePlayerPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Menu,
  X,
  Play,
  FileText,
  File,
  HelpCircle,
  ClipboardList,
  Sparkles,
} from 'lucide-react'
import { LessonPlayer } from '../components/LessonPlayer'
import { CourseProgressBar } from '../components/CourseProgressBar'
import { lmsCourseService } from '../services/lmsCourseService'
import { lmsModuleService } from '../services/lmsModuleService'
import { lmsLessonService } from '../services/lmsLessonService'
import { lmsProgressService } from '../services/lmsProgressService'

export function StudentCoursePlayerPage() {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [lessons, setLessons] = useState([])
  const [activeLesson, setActiveLesson] = useState(null)
  const [completedLessonIds, setCompletedLessonIds] = useState([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCoursePlayer()
  }, [courseId])

  const loadCoursePlayer = async () => {
    setLoading(true)
    try {
      const [crs, mods, lsns, progress] = await Promise.all([
        lmsCourseService.getCourseById(courseId),
        lmsModuleService.getModules(courseId),
        lmsLessonService.getLessonsByCourse(courseId),
        lmsProgressService.getStudentCourseProgress(courseId, 'std-001'),
      ])

      setCourse(crs)
      setModules(mods)
      setLessons(lsns)

      const completedIds = progress?.completedLessonIds?.map((item) => item.lessonId) || []
      setCompletedLessonIds(completedIds)

      // Set first incomplete lesson or first lesson
      if (lsns.length > 0) {
        const firstIncomplete = lsns.find((l) => !completedIds.includes(l.id))
        setActiveLesson(firstIncomplete || lsns[0])
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async (lesson) => {
    await lmsProgressService.markLessonComplete(courseId, 'std-001', lesson.id, lesson.title)
    setCompletedLessonIds((prev) => [...prev, lesson.id])
  }

  const currentIdx = lessons.findIndex((l) => l.id === activeLesson?.id)
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null

  const calculateProgress = () => {
    if (lessons.length === 0) return 0
    return Math.round((completedLessonIds.length / lessons.length) * 100)
  }

  if (loading || !course) {
    return (
      <div className="flex items-center justify-center min-h-[600px] text-xs text-slate-500 animate-pulse">
        Initializing interactive course player...
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100 -m-4 md:-m-8">
      {/* Top Header Bar */}
      <header className="h-16 px-4 md:px-8 border-b border-slate-800 bg-slate-950 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/lms/my-learning"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0"
            title="Exit Player"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors lg:hidden shrink-0"
            title="Toggle Curriculum Drawer"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest block truncate">
              {course.subjectName} • {course.courseCode}
            </span>
            <h1 className="text-xs md:text-sm font-bold text-white truncate max-w-xl">
              {course.name}
            </h1>
          </div>
        </div>

        {/* Header Progress Counter */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[11px] text-slate-400">
              Completed {completedLessonIds.length} of {lessons.length} lessons
            </span>
            <div className="w-28 mt-1">
              <CourseProgressBar progress={calculateProgress()} showLabel={false} size="sm" />
            </div>
          </div>
          <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            {calculateProgress()}%
          </span>
        </div>
      </header>

      {/* Main Player Workspace: Split Sidebar + Content */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Curriculum Sidebar */}
        <aside
          className={`fixed lg:static inset-y-16 left-0 z-30 w-80 bg-slate-950 border-r border-slate-800 flex flex-col transition-transform duration-300 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-80'
          }`}
        >
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Course Syllabus
            </h3>
            <button
              type="button"
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1 text-slate-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {modules.map((mod) => {
              const moduleLessons = lessons.filter((l) => l.moduleId === mod.id)
              return (
                <div key={mod.id} className="rounded-xl bg-slate-900/60 border border-slate-800/80 overflow-hidden">
                  <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span className="truncate">{mod.name}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {moduleLessons.length}
                    </span>
                  </div>

                  <div className="p-1 space-y-1">
                    {moduleLessons.map((les) => {
                      const isDone = completedLessonIds.includes(les.id)
                      const isActive = activeLesson?.id === les.id
                      return (
                        <button
                          key={les.id}
                          type="button"
                          onClick={() => {
                            setActiveLesson(les)
                            if (window.innerWidth < 1024) setIsSidebarOpen(false)
                          }}
                          className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-left text-xs transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white font-bold'
                              : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                          }`}
                        >
                          <div className="shrink-0">
                            {isDone ? (
                              <CheckCircle2 className={`h-4 w-4 ${isActive ? 'text-white' : 'text-emerald-500'}`} />
                            ) : (
                              <div className={`h-4 w-4 rounded-full border ${isActive ? 'border-white' : 'border-slate-600'}`} />
                            )}
                          </div>
                          <span className="truncate flex-1">{les.title}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </aside>

        {/* Central Lesson Workspace */}
        <main className="flex-1 p-4 md:p-8 bg-slate-900 overflow-y-auto max-w-5xl mx-auto w-full">
          <LessonPlayer
            lesson={activeLesson}
            isCompleted={completedLessonIds.includes(activeLesson?.id)}
            onMarkComplete={handleMarkComplete}
            hasPrevious={!!prevLesson}
            hasNext={!!nextLesson}
            onPrevious={() => prevLesson && setActiveLesson(prevLesson)}
            onNext={() => nextLesson && setActiveLesson(nextLesson)}
          />
        </main>
      </div>
    </div>
  )
}
