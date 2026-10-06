// src/modules/lms/pages/CourseLessonDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2, CheckCircle2 } from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { LessonPlayer } from '../components/LessonPlayer'
import { LessonEditorDialog } from '../components/LessonEditorDialog'
import { lmsLessonService } from '../services/lmsLessonService'
import { lmsCourseService } from '../services/lmsCourseService'
import { lmsProgressService } from '../services/lmsProgressService'

export function CourseLessonDetailPage() {
  const { id: courseId, lessonId } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [allLessons, setAllLessons] = useState([])
  const [isCompleted, setIsCompleted] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [courseId, lessonId])

  const loadData = async () => {
    setLoading(true)
    try {
      const [crs, lsn, lsns] = await Promise.all([
        lmsCourseService.getCourseById(courseId),
        lmsLessonService.getLessonById(lessonId),
        lmsLessonService.getLessonsByCourse(courseId),
      ])
      setCourse(crs)
      setLesson(lsn)
      setAllLessons(lsns)

      if (lsn) {
        const completed = await lmsProgressService.isLessonCompleted(courseId, 'std-001', lsn.id)
        setIsCompleted(completed)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async () => {
    if (!lesson) return
    await lmsProgressService.markLessonComplete(courseId, 'std-001', lesson.id, lesson.title)
    setIsCompleted(true)
  }

  const currentIdx = allLessons.findIndex((l) => l.id === lessonId)
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
        Loading lesson workspace...
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <LMSNavigation />

      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div>
          <Link
            to={`/lms/courses/${courseId}?tab=content`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Course Content</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {course?.courseCode}
            </span>
            <span className="text-xs text-slate-500">{course?.name}</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditDialogOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
        >
          <Edit2 className="h-3.5 w-3.5" />
          <span>Edit Lesson</span>
        </button>
      </div>

      {/* Lesson Player */}
      <LessonPlayer
        lesson={lesson}
        isCompleted={isCompleted}
        onMarkComplete={handleMarkComplete}
        hasPrevious={!!prevLesson}
        hasNext={!!nextLesson}
        onPrevious={() => prevLesson && navigate(`/lms/courses/${courseId}/lessons/${prevLesson.id}`)}
        onNext={() => nextLesson && navigate(`/lms/courses/${courseId}/lessons/${nextLesson.id}`)}
      />

      {/* Edit Modal */}
      {isEditDialogOpen && (
        <LessonEditorDialog
          isOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          lesson={lesson}
          moduleId={lesson?.moduleId}
          courseId={courseId}
          onSubmit={async (data) => {
            await lmsLessonService.updateLesson(lesson.id, data)
            loadData()
          }}
        />
      )}
    </div>
  )
}
