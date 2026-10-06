// src/modules/lms/pages/CourseDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  Rocket,
  Archive,
  Users,
  Eye,
  BookOpen,
  ClipboardList,
  HelpCircle,
  BarChart3,
  Bell,
  MessageSquare,
  Settings,
  History,
  Plus,
  Clock,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Share2,
} from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { CourseContentTree } from '../components/CourseContentTree'
import { CourseProgressBar } from '../components/CourseProgressBar'
import { ModuleEditorDialog } from '../components/ModuleEditorDialog'
import { LessonEditorDialog } from '../components/LessonEditorDialog'
import { AssignmentCard } from '../components/AssignmentCard'
import { QuizBuilder } from '../components/QuizBuilder'
import { ProgressOverview } from '../components/ProgressOverview'
import { StudentProgressTable } from '../components/StudentProgressTable'
import { AnnouncementCard } from '../components/AnnouncementCard'
import { AnnouncementEditorDialog } from '../components/AnnouncementEditorDialog'
import { DiscussionThread } from '../components/DiscussionThread'
import { CoursePublishDialog } from '../components/CoursePublishDialog'

import { lmsCourseService } from '../services/lmsCourseService'
import { lmsModuleService } from '../services/lmsModuleService'
import { lmsLessonService } from '../services/lmsLessonService'
import { lmsAssignmentService } from '../services/lmsAssignmentService'
import { lmsQuizService } from '../services/lmsQuizService'
import { lmsEnrollmentService } from '../services/lmsEnrollmentService'
import { lmsAnnouncementService } from '../services/lmsAnnouncementService'
import { lmsDiscussionService } from '../services/lmsDiscussionService'
import { lmsProgressService } from '../services/lmsProgressService'
import { lmsActivityService } from '../services/lmsActivityService'
import { COURSE_STATUS_CONFIG } from '../config/lmsConfig'

export function CourseDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'overview'

  const [activeTab, setActiveTab] = useState(initialTab)
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [lessons, setLessons] = useState([])
  const [assignments, setAssignments] = useState([])
  const [quizzes, setQuizzes] = useState([])
  const [enrollments, setEnrollments] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [discussions, setDiscussions] = useState([])
  const [activities, setActivities] = useState([])
  const [progressStats, setProgressStats] = useState(null)
  const [loading, setLoading] = useState(true)

  // Modals state
  const [publishModalOpen, setPublishModalOpen] = useState(false)
  const [moduleModal, setModuleModal] = useState({ isOpen: false, module: null })
  const [lessonModal, setLessonModal] = useState({ isOpen: false, lesson: null, moduleId: null })
  const [announcementModalOpen, setAnnouncementModalOpen] = useState(false)

  // New Assignment Modal state
  const [isAddingAssignment, setIsAddingAssignment] = useState(false)
  const [newAssignmentData, setNewAssignmentData] = useState({
    title: '',
    instructions: '',
    maxMarks: 25,
    dueDate: '2026-10-30T23:59:00',
    submissionType: 'File Upload',
  })

  // New Quiz Modal state
  const [isAddingQuiz, setIsAddingQuiz] = useState(false)
  const [newQuizData, setNewQuizData] = useState({
    name: '',
    description: '',
    duration: 30,
    passingScore: 70,
  })

  useEffect(() => {
    loadCourseFullData()
  }, [id])

  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true })
  }, [activeTab])

  const loadCourseFullData = async () => {
    setLoading(true)
    try {
      const crs = await lmsCourseService.getCourseById(id)
      if (!crs) {
        navigate('/lms/courses')
        return
      }
      setCourse(crs)

      const [mods, lsns, asgs, qzs, enrs, ancs, dscs, acts, prg] = await Promise.all([
        lmsModuleService.getModules(id),
        lmsLessonService.getLessonsByCourse(id),
        lmsAssignmentService.getAssignments(id),
        lmsQuizService.getQuizzes(id),
        lmsEnrollmentService.getEnrollments(id),
        lmsAnnouncementService.getAnnouncements(id),
        lmsDiscussionService.getDiscussions(id),
        lmsActivityService.getActivities({ courseId: id }),
        lmsProgressService.getCourseProgressOverview(id),
      ])

      setModules(mods)
      setLessons(lsns)
      setAssignments(asgs)
      setQuizzes(qzs)
      setEnrollments(enrs)
      setAnnouncements(ancs)
      setDiscussions(dscs)
      setActivities(acts)
      setProgressStats(prg)
    } finally {
      setLoading(false)
    }
  }

  // Handlers for Module & Lesson
  const handleSaveModule = async (data) => {
    if (moduleModal.module) {
      await lmsModuleService.updateModule(moduleModal.module.id, data)
    } else {
      await lmsModuleService.createModule(id, data)
    }
    loadCourseFullData()
  }

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Delete this module and all contained lessons?')) {
      await lmsModuleService.deleteModule(moduleId)
      loadCourseFullData()
    }
  }

  const handleSaveLesson = async (data) => {
    if (lessonModal.lesson) {
      await lmsLessonService.updateLesson(lessonModal.lesson.id, data)
    } else {
      await lmsLessonService.createLesson(data.moduleId || lessonModal.moduleId, data)
    }
    loadCourseFullData()
  }

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Delete this lesson?')) {
      await lmsLessonService.deleteLesson(lessonId)
      loadCourseFullData()
    }
  }

  // Handlers for Assignment & Quiz
  const handleCreateAssignment = async (e) => {
    e.preventDefault()
    await lmsAssignmentService.createAssignment({
      courseId: id,
      ...newAssignmentData,
      maxMarks: Number(newAssignmentData.maxMarks),
    })
    setIsAddingAssignment(false)
    setNewAssignmentData({
      title: '',
      instructions: '',
      maxMarks: 25,
      dueDate: '2026-10-30T23:59:00',
      submissionType: 'File Upload',
    })
    loadCourseFullData()
  }

  const handleCreateQuiz = async (e) => {
    e.preventDefault()
    await lmsQuizService.createQuiz({
      courseId: id,
      ...newQuizData,
      duration: Number(newQuizData.duration),
      passingScore: Number(newQuizData.passingScore),
    })
    setIsAddingQuiz(false)
    setNewQuizData({
      name: '',
      description: '',
      duration: 30,
      passingScore: 70,
    })
    loadCourseFullData()
  }

  // Handlers for Announcement & Discussion
  const handleSaveAnnouncement = async (data) => {
    await lmsAnnouncementService.createAnnouncement(data)
    loadCourseFullData()
  }

  const handleDeleteAnnouncement = async (ancId) => {
    await lmsAnnouncementService.deleteAnnouncement(ancId)
    loadCourseFullData()
  }

  const handleReplyDiscussion = async (discId, replyData) => {
    await lmsDiscussionService.addReply(discId, replyData)
    loadCourseFullData()
  }

  const handleTogglePinDiscussion = async (discId) => {
    await lmsDiscussionService.togglePinDiscussion(discId)
    loadCourseFullData()
  }

  if (loading || !course) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
        Loading LMS Course details...
      </div>
    )
  }

  const statusConfig = COURSE_STATUS_CONFIG[course.status] || {
    color: 'text-slate-600 bg-slate-100 border-slate-200',
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BookOpen },
    { id: 'content', label: `Content (${lessons.length})`, icon: Layers },
    { id: 'students', label: `Students (${enrollments.length})`, icon: Users },
    { id: 'assignments', label: `Assignments (${assignments.length})`, icon: ClipboardList },
    { id: 'quizzes', label: `Quizzes (${quizzes.length})`, icon: HelpCircle },
    { id: 'progress', label: 'Progress & Analytics', icon: BarChart3 },
    { id: 'announcements', label: `Announcements (${announcements.length})`, icon: Bell },
    { id: 'discussions', label: `Discussions (${discussions.length})`, icon: MessageSquare },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'activity', label: 'Activity Audit', icon: History },
  ]

  return (
    <div className="space-y-6">
      <LMSNavigation />

      {/* Top Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Link
                to="/lms/courses"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>All Courses</span>
              </Link>
              <span className="text-slate-300">•</span>
              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                {course.courseCode}
              </span>
              <span className="text-xs text-slate-500 font-semibold">{course.subjectName}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">
                {course.className} ({course.sectionName || 'All Sections'})
              </span>
            </div>

            <h1 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
              {course.name}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
              <span>Instructor: <strong className="text-slate-800">{course.instructorName}</strong></span>
              <span>•</span>
              <span>Academic Year: <strong className="text-slate-800">{course.academicYearName}</strong></span>
              <span>•</span>
              <span>Campus: <strong className="text-slate-800">{course.campusName}</strong></span>
            </div>
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border ${statusConfig.color}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {course.status}
            </span>

            {course.status !== 'Published' && (
              <button
                type="button"
                onClick={() => setPublishModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <Rocket className="h-3.5 w-3.5" />
                <span>Publish Course</span>
              </button>
            )}

            <Link
              to={`/lms/my-learning/${course.id}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Preview Player</span>
            </Link>

            <Link
              to={`/lms/courses/${course.id}/edit`}
              className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg"
              title="Edit Course Metadata"
            >
              <Edit2 className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* 10 Navigation Tabs */}
        <div className="flex items-center overflow-x-auto gap-1 pt-3 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: OVERVIEW                                          */}
      {/* ======================================================== */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          {/* Left Column: Course Details & Stats */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Course Description & Objectives
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line mb-6">
                {course.description}
              </p>

              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Key Curriculum Metrics
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="block text-[11px] text-slate-400">Modules</span>
                  <span className="text-base font-bold text-slate-900">{modules.length}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="block text-[11px] text-slate-400">Lessons</span>
                  <span className="text-base font-bold text-slate-900">{lessons.length}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="block text-[11px] text-slate-400">Assignments</span>
                  <span className="text-base font-bold text-slate-900">{assignments.length}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="block text-[11px] text-slate-400">Quizzes</span>
                  <span className="text-base font-bold text-slate-900">{quizzes.length}</span>
                </div>
              </div>
            </div>

            {/* Recent Course Activity Feed */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
                Recent Course Activity
              </h3>
              <div className="space-y-3">
                {activities.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-start gap-3 text-xs py-2 border-b border-slate-100 last:border-0">
                    <div className="h-2 w-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <div className="flex-1">
                      <p className="font-semibold text-slate-800">{act.title}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">{act.description}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{act.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Instructor Profile & Completion Rate */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                Lead Educator Profile
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-700 font-black text-base flex items-center justify-center">
                  {course.instructorName?.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{course.instructorName}</h4>
                  <span className="text-xs text-slate-500">{course.instructorEmail}</span>
                  <span className="block text-[11px] text-blue-600 font-semibold mt-0.5">Senior Science Dept</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Enrolled Students:</span>
                  <strong className="text-slate-900">{enrollments.length}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Total Hours:</span>
                  <strong className="text-slate-900">{course.duration}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Start Date:</span>
                  <strong className="text-slate-900">{course.startDate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>End Date:</span>
                  <strong className="text-slate-900">{course.endDate}</strong>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                Cohort Completion Rate
              </h3>
              <CourseProgressBar progress={course.completionRate} size="lg" />
              <p className="text-[11px] text-slate-400 mt-2">
                Based on submitted problem sets and mandatory lesson viewings.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: CONTENT (MODULES & LESSONS)                       */}
      {/* ======================================================== */}
      {activeTab === 'content' && (
        <div className="animate-in fade-in">
          <CourseContentTree
            modules={modules}
            lessons={lessons}
            onAddModule={() => setModuleModal({ isOpen: true, module: null })}
            onEditModule={(mod) => setModuleModal({ isOpen: true, module: mod })}
            onDeleteModule={handleDeleteModule}
            onAddLesson={(modId) => setLessonModal({ isOpen: true, lesson: null, moduleId: modId })}
            onEditLesson={(les) => setLessonModal({ isOpen: true, lesson: les, moduleId: les.moduleId })}
            onDeleteLesson={handleDeleteLesson}
            onSelectLesson={(les) => navigate(`/lms/courses/${course.id}/lessons/${les.id}`)}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: STUDENTS                                          */}
      {/* ======================================================== */}
      {activeTab === 'students' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Enrolled Students Roster</h3>
              <p className="text-xs text-slate-500">
                Cohorts automatically enrolled via Academic Configuration mapping.
              </p>
            </div>
            <button
              type="button"
              onClick={() => alert('Student roster is automatically synchronized with Class 12 Section A.')}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold"
            >
              Sync Roster
            </button>
          </div>
          <StudentProgressTable enrollments={enrollments} />
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 4: ASSIGNMENTS                                       */}
      {/* ======================================================== */}
      {activeTab === 'assignments' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Course Assignments</h3>
              <p className="text-xs text-slate-500">
                Weekly problem sets, laboratory write-ups, and theoretical tasks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingAssignment(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Assignment</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {assignments.map((asg) => (
              <AssignmentCard key={asg.id} assignment={asg} />
            ))}
          </div>

          {/* New Assignment Modal */}
          {isAddingAssignment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-base">Create New Assignment</h3>
                  <button type="button" onClick={() => setIsAddingAssignment(false)}>✕</button>
                </div>
                <form onSubmit={handleCreateAssignment} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={newAssignmentData.title}
                      onChange={(e) => setNewAssignmentData({ ...newAssignmentData, title: e.target.value })}
                      placeholder="e.g. Problem Set 2: Electric Potential"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Instructions</label>
                    <textarea
                      rows={3}
                      value={newAssignmentData.instructions}
                      onChange={(e) => setNewAssignmentData({ ...newAssignmentData, instructions: e.target.value })}
                      placeholder="Specify requirements and accepted formats..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Maximum Marks</label>
                      <input
                        type="number"
                        value={newAssignmentData.maxMarks}
                        onChange={(e) => setNewAssignmentData({ ...newAssignmentData, maxMarks: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={newAssignmentData.dueDate.split('T')[0]}
                        onChange={(e) => setNewAssignmentData({ ...newAssignmentData, dueDate: e.target.value + 'T23:59:00' })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddingAssignment(false)}
                      className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Publish Assignment
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 5: QUIZZES                                           */}
      {/* ======================================================== */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Quizzes & Online Assessments</h3>
              <p className="text-xs text-slate-500">
                Diagnostic and graded tests with automatic evaluation and question banks.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsAddingQuiz(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Quiz</span>
            </button>
          </div>

          {quizzes.map((quiz) => (
            <div key={quiz.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-base text-slate-900">{quiz.name}</h4>
                  <p className="text-xs text-slate-500">{quiz.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-600 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {quiz.duration} mins
                  </span>
                  <Link
                    to={`/lms/quizzes/${quiz.id}/attempts`}
                    className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-bold transition-colors"
                  >
                    View Attempts & Player
                  </Link>
                </div>
              </div>

              {/* Embedded Question Builder */}
              <QuizBuilder
                quiz={quiz}
                questions={quiz.questions || []}
                onAddQuestion={async (qId, qData) => {
                  await lmsQuizService.addQuestion(qId, qData)
                  loadCourseFullData()
                }}
                onUpdateQuestion={async (qId, questionId, updates) => {
                  await lmsQuizService.updateQuestion(qId, questionId, updates)
                  loadCourseFullData()
                }}
                onDeleteQuestion={async (qId, questionId) => {
                  await lmsQuizService.deleteQuestion(qId, questionId)
                  loadCourseFullData()
                }}
              />
            </div>
          ))}

          {/* New Quiz Modal */}
          {isAddingQuiz && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
              <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-900 text-base">Create Assessment Quiz</h3>
                  <button type="button" onClick={() => setIsAddingQuiz(false)}>✕</button>
                </div>
                <form onSubmit={handleCreateQuiz} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Quiz Title</label>
                    <input
                      type="text"
                      value={newQuizData.name}
                      onChange={(e) => setNewQuizData({ ...newQuizData, name: e.target.value })}
                      placeholder="e.g. Electrostatic Potential Speed Quiz"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={newQuizData.description}
                      onChange={(e) => setNewQuizData({ ...newQuizData, description: e.target.value })}
                      placeholder="Instructions for students..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Mins)</label>
                      <input
                        type="number"
                        value={newQuizData.duration}
                        onChange={(e) => setNewQuizData({ ...newQuizData, duration: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Passing Score (%)</label>
                      <input
                        type="number"
                        value={newQuizData.passingScore}
                        onChange={(e) => setNewQuizData({ ...newQuizData, passingScore: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsAddingQuiz(false)}
                      className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
                    >
                      Create Quiz
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 6: PROGRESS                                          */}
      {/* ======================================================== */}
      {activeTab === 'progress' && (
        <div className="space-y-6 animate-in fade-in">
          <ProgressOverview stats={progressStats} />
          <StudentProgressTable enrollments={enrollments} />
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 7: ANNOUNCEMENTS                                     */}
      {/* ======================================================== */}
      {activeTab === 'announcements' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Course Broadcast Announcements</h3>
              <p className="text-xs text-slate-500">
                Official notices broadcasted to enrolled students in this course.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAnnouncementModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>New Announcement</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((anc) => (
              <AnnouncementCard
                key={anc.id}
                announcement={anc}
                onDelete={handleDeleteAnnouncement}
              />
            ))}
          </div>

          <AnnouncementEditorDialog
            isOpen={announcementModalOpen}
            onClose={() => setAnnouncementModalOpen(false)}
            onSubmit={handleSaveAnnouncement}
            courseId={id}
          />
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 8: DISCUSSIONS                                       */}
      {/* ======================================================== */}
      {activeTab === 'discussions' && (
        <div className="space-y-5 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Discussion Forum</h3>
              <p className="text-xs text-slate-500">
                Peer discussions and instructor-verified question resolution.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {discussions.map((disc) => (
              <DiscussionThread
                key={disc.id}
                discussion={disc}
                onReply={handleReplyDiscussion}
                onTogglePin={handleTogglePinDiscussion}
              />
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 9: SETTINGS                                          */}
      {/* ======================================================== */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs max-w-2xl space-y-6 animate-in fade-in">
          <div>
            <h3 className="text-base font-bold text-slate-900">Course Configuration & Archival</h3>
            <p className="text-xs text-slate-500">
              Manage course visibility, lifecycle status, and enrollment permissions.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Enrollment Mode</span>
                <span className="text-slate-500">{course.enrollmentMode} Cohort Sync</span>
              </div>
              <span className="font-semibold text-blue-600">Active</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <span className="font-bold text-slate-900 block">Completion Certificate</span>
                <span className="text-slate-500">{course.certificateEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <h4 className="font-bold text-amber-900 text-xs">Archive Course</h4>
              <p className="text-[11px] text-amber-700">
                Archiving will make this course read-only. Student historical learning records will remain safely preserved.
              </p>
              <button
                type="button"
                onClick={async () => {
                  if (window.confirm('Archive this course?')) {
                    await lmsCourseService.archiveCourse(course.id)
                    loadCourseFullData()
                  }
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold"
              >
                Archive Course
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 10: ACTIVITY AUDIT                                   */}
      {/* ======================================================== */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs animate-in fade-in">
          <h3 className="text-base font-bold text-slate-900 mb-1">Course Audit Log</h3>
          <p className="text-xs text-slate-500 mb-6">
            Chronological record of publishing, lesson updates, student enrollments, and grading events.
          </p>

          <div className="space-y-4">
            {activities.map((act) => (
              <div key={act.id} className="flex items-start gap-3.5 pb-4 border-b border-slate-100 last:border-0 text-xs">
                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0 font-bold">
                  {act.actorName?.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{act.title}</span>
                    <span className="text-[11px] text-slate-400">{act.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{act.description}</p>
                  <span className="text-[10px] text-slate-400 font-semibold block mt-1">
                    Actor: {act.actorName} ({act.actorRole})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <CoursePublishDialog
        isOpen={publishModalOpen}
        onClose={() => setPublishModalOpen(false)}
        courseId={id}
        courseName={course.name}
        onPublishSuccess={() => loadCourseFullData()}
      />

      <ModuleEditorDialog
        isOpen={moduleModal.isOpen}
        onClose={() => setModuleModal({ isOpen: false, module: null })}
        module={moduleModal.module}
        onSubmit={handleSaveModule}
        courseId={id}
      />

      <LessonEditorDialog
        isOpen={lessonModal.isOpen}
        onClose={() => setLessonModal({ isOpen: false, lesson: null, moduleId: null })}
        lesson={lessonModal.lesson}
        moduleId={lessonModal.moduleId}
        courseId={id}
        onSubmit={handleSaveLesson}
      />
    </div>
  )
}
