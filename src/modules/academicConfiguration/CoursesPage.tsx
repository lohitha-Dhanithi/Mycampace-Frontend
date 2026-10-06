// src/modules/academicConfiguration/CoursesPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Trash2,
  Layers,
  GraduationCap,
  Building2,
  RotateCcw,
} from 'lucide-react'
import { AcademicConfigurationHeader } from './components/AcademicConfigurationHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { courseService } from './services/courseService'
import { departmentService } from './services/departmentService'
import { programService } from './services/programService'

export function CoursesPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [courses, setCourses] = useState([])
  const [departments, setDepartments] = useState([])
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [toast, setToast] = useState(location.state?.toast || '')

  const loadData = async () => {
    try {
      setLoading(true)
      const [crs, depts, progs] = await Promise.all([
        courseService.getCourses(),
        departmentService.getDepartments(),
        programService.getPrograms(),
      ])
      setCourses(crs)
      setDepartments(depts)
      setPrograms(progs)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Failed to load courses')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (course) => {
    if (!window.confirm(`Delete course "${course.name}"?`)) return
    try {
      await courseService.deleteCourse(course.id)
      await loadData()
      setToast(`Course "${course.name}" removed.`)
      setTimeout(() => setToast(''), 4000)
    } catch (err) {
      alert(err.message)
    }
  }

  const getDeptName = (deptId) => {
    const d = departments.find((dept) => dept.id === deptId)
    return d ? d.code : deptId
  }

  const getProgName = (progId) => {
    const p = programs.find((prog) => prog.id === progId)
    return p ? p.code : progId
  }

  const filteredCourses = useMemo(() => {
    return courses.filter((c) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)

      const matchesDept = departmentFilter === 'ALL' || c.departmentId === departmentFilter
      const matchesType = typeFilter === 'ALL' || c.type === typeFilter
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter

      return matchesSearch && matchesDept && matchesType && matchesStatus
    })
  }, [courses, searchQuery, departmentFilter, typeFilter, statusFilter])

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast('')}
            className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs"
          >
            Dismiss
          </button>
        </div>
      )}

      <AcademicConfigurationHeader
        title="Courses"
        subtitle="Term-level courses and syllabi mapped under degrees and host departments."
        actions={
          <Link to="/academic-configuration/courses/new">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Course
            </Button>
          </Link>
        }
      />

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search courses by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="ALL">All Departments</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="ALL">All Types</option>
            <option value="Core">Core</option>
            <option value="Elective">Elective</option>
            <option value="Optional">Optional</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {(searchQuery || departmentFilter !== 'ALL' || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setDepartmentFilter('ALL')
                setTypeFilter('ALL')
                setStatusFilter('ALL')
              }}
              className="h-9 text-xs text-slate-600 hover:text-slate-900"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {filteredCourses.length === 0 ? (
          <div className="p-12 text-center">
            <BookOpen className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No courses match filters</p>
            <p className="text-xs text-slate-500 mt-1">Adjust search options or create a new course.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Course Name & Code</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Program</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Credits & Type</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{c.name}</span>
                        <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-semibold inline-block mt-0.5">
                          {c.code}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {getDeptName(c.departmentId)}
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {getProgName(c.programId)}
                    </td>

                    <td className="py-3 px-4 text-slate-700">{c.duration}</td>

                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{c.credits} Cr</span>
                        <span className="text-slate-300">•</span>
                        <Badge variant="outline" className="text-[10px]">
                          {c.type}
                        </Badge>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        className={
                          c.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }
                      >
                        {c.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(c)}
                        className="h-8 text-xs text-rose-600 hover:bg-rose-50 px-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
