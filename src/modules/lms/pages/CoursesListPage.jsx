// src/modules/lms/pages/CoursesListPage.jsx
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  BookOpen,
  Users,
  Copy,
  Archive,
  Rocket,
  Edit2,
  Trash2,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { LMSCourseCard } from '../components/LMSCourseCard'
import { CourseProgressBar } from '../components/CourseProgressBar'
import { CoursePublishDialog } from '../components/CoursePublishDialog'
import { lmsCourseService } from '../services/lmsCourseService'
import { COURSE_STATUS_CONFIG } from '../config/lmsConfig'

export function CoursesListPage() {
  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('table') // 'table' | 'grid'
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [classFilter, setClassFilter] = useState('all')

  // Publish modal state
  const [publishModal, setPublishModal] = useState({ isOpen: false, course: null })

  useEffect(() => {
    loadCourses()
  }, [])

  const loadCourses = async () => {
    setLoading(true)
    try {
      const data = await lmsCourseService.getCourses()
      setCourses(data)
    } finally {
      setLoading(false)
    }
  }

  const handleDuplicate = async (id) => {
    if (window.confirm('Duplicate this LMS course and create a draft copy?')) {
      await lmsCourseService.duplicateCourse(id)
      loadCourses()
    }
  }

  const handleArchive = async (id) => {
    if (window.confirm('Archive this course? It will become read-only.')) {
      await lmsCourseService.archiveCourse(id)
      loadCourses()
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this course?')) {
      await lmsCourseService.deleteCourse(id)
      loadCourses()
    }
  }

  const filteredCourses = courses.filter((c) => {
    if (statusFilter !== 'all' && c.status.toLowerCase() !== statusFilter.toLowerCase()) {
      return false
    }
    if (classFilter !== 'all' && c.classId !== classFilter) {
      return false
    }
    if (search) {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.courseCode.toLowerCase().includes(q) ||
        c.subjectName.toLowerCase().includes(q) ||
        c.instructorName.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      <LMSNavigation />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              LMS Course Management
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Academic LMS Courses
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage digital courses mapped to curriculum subjects, classes, and sections.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${
                viewMode === 'table' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <TableIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>

          <Link
            to="/lms/courses/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Create Course</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by course name, subject, faculty or course ID..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white font-medium"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="under review">Under Review</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Class Filter */}
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-700 bg-white font-medium"
          >
            <option value="all">All Classes</option>
            <option value="cls-12">Class 12</option>
            <option value="cls-11">Class 11</option>
            <option value="cls-10">Class 10</option>
          </select>
        </div>
      </div>

      {/* Courses Display (Table or Grid) */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((course) => (
            <LMSCourseCard
              key={course.id}
              course={course}
              onPublish={() => setPublishModal({ isOpen: true, course })}
              onArchive={() => handleArchive(course.id)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">Course ID & Title</th>
                  <th className="py-3.5 px-4">Academic Mapping</th>
                  <th className="py-3.5 px-4">Instructor</th>
                  <th className="py-3.5 px-4 text-center">Students</th>
                  <th className="py-3.5 px-4 text-center">Modules</th>
                  <th className="py-3.5 px-4 w-32">Completion</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((c) => {
                  const statusInfo = COURSE_STATUS_CONFIG[c.status] || {
                    color: 'text-slate-600 bg-slate-100 border-slate-200',
                  }
                  return (
                    <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4">
                        <Link
                          to={`/lms/courses/${c.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors block text-xs"
                        >
                          {c.name}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[11px] text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                            {c.courseCode}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {c.subjectName}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        <div>{c.className} • {c.sectionName || 'All Sections'}</div>
                        <span className="text-[11px] text-slate-400 block">{c.programName}</span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800">{c.instructorName}</div>
                        <span className="text-[11px] text-slate-400">{c.instructorEmail}</span>
                      </td>

                      <td className="py-3.5 px-4 text-center font-bold text-slate-800">
                        {c.studentCount}
                      </td>

                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                        {c.modulesCount}
                      </td>

                      <td className="py-3.5 px-4">
                        <CourseProgressBar progress={c.completionRate} size="sm" />
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold border ${statusInfo.color}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {c.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/lms/courses/${c.id}`}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded text-xs font-semibold text-slate-700 transition-colors"
                          >
                            Manage
                          </Link>

                          {c.status !== 'Published' && (
                            <button
                              type="button"
                              onClick={() => setPublishModal({ isOpen: true, course: c })}
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded"
                              title="Publish Course"
                            >
                              <Rocket className="h-3.5 w-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDuplicate(c.id)}
                            className="p-1 text-slate-400 hover:text-blue-600 rounded"
                            title="Duplicate Course"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </button>

                          {c.status !== 'Archived' && (
                            <button
                              type="button"
                              onClick={() => handleArchive(c.id)}
                              className="p-1 text-slate-400 hover:text-amber-600 rounded"
                              title="Archive Course"
                            >
                              <Archive className="h-3.5 w-3.5" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => handleDelete(c.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded"
                            title="Delete Course"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Publish Readiness Dialog */}
      {publishModal.isOpen && publishModal.course && (
        <CoursePublishDialog
          isOpen={publishModal.isOpen}
          onClose={() => setPublishModal({ isOpen: false, course: null })}
          courseId={publishModal.course.id}
          courseName={publishModal.course.name}
          onPublishSuccess={() => loadCourses()}
        />
      )}
    </div>
  )
}
