// src/modules/academicConfiguration/SectionsPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom'
import {
  Grid,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Calendar,
  Layers,
  Users,
  RotateCcw,
} from 'lucide-react'
import { AcademicConfigurationHeader } from './components/AcademicConfigurationHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { sectionService } from './services/sectionService'
import { classService } from './services/classService'
import { academicYearService } from './services/academicYearService'

export function SectionsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const initialClassId = searchParams.get('classId') || 'ALL'

  const [sections, setSections] = useState([])
  const [classes, setClasses] = useState([])
  const [academicYears, setAcademicYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [classFilter, setClassFilter] = useState(initialClassId)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [toast, setToast] = useState(location.state?.toast || '')

  const loadData = async () => {
    try {
      setLoading(true)
      const [secs, cls, ays] = await Promise.all([
        sectionService.getSections(),
        classService.getClasses(),
        academicYearService.getAcademicYears(),
      ])
      setSections(secs)
      setClasses(cls)
      setAcademicYears(ays)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Failed to load sections')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (sec) => {
    if (!window.confirm(`Delete section "${sec.name}"?`)) return
    try {
      await sectionService.deleteSection(sec.id)
      await loadData()
      setToast(`Section "${sec.name}" deleted.`)
      setTimeout(() => setToast(''), 4000)
    } catch (err) {
      alert(err.message)
    }
  }

  const getClassName = (classId) => {
    const c = classes.find((cls) => cls.id === classId)
    return c ? c.name : classId
  }

  const getYearName = (ayId) => {
    const ay = academicYears.find((y) => y.id === ayId)
    return ay ? ay.name : ayId
  }

  const filteredSections = useMemo(() => {
    return sections.filter((s) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.classTeacher.toLowerCase().includes(q)

      const matchesClass = classFilter === 'ALL' || s.classId === classFilter
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter

      return matchesSearch && matchesClass && matchesStatus
    })
  }, [sections, searchQuery, classFilter, statusFilter])

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
        title="Sections"
        subtitle="Class divisions, classroom allocations, student capacity limits, and designated mentors."
        actions={
          <Link to="/academic-configuration/sections/new">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Section
            </Button>
          </Link>
        }
      />

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search sections by name, code or tutor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="ALL">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
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

          {(searchQuery || classFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setClassFilter('ALL')
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
        {filteredSections.length === 0 ? (
          <div className="p-12 text-center">
            <Grid className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No sections found</p>
            <p className="text-xs text-slate-500 mt-1">Adjust filter settings or create a new section.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Section Name & Code</th>
                  <th className="py-3 px-4">Parent Class</th>
                  <th className="py-3 px-4">Academic Session</th>
                  <th className="py-3 px-4">Class Tutor</th>
                  <th className="py-3 px-4">Capacity Utilization</th>
                  <th className="py-3 px-4">Room</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSections.map((s) => {
                  const pct = Math.round((s.currentStudents / s.studentCapacity) * 100)
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-semibold inline-block mt-0.5">
                            {s.code}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {getClassName(s.classId)}
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {getYearName(s.academicYearId)}
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {s.classTeacher}
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">
                            {s.currentStudents} / {s.studentCapacity}
                          </span>
                          <div className="w-16 h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                            <div
                              className={`h-full rounded-full transition-all ${
                                pct >= 95
                                  ? 'bg-rose-500'
                                  : pct >= 80
                                  ? 'bg-amber-500'
                                  : 'bg-blue-600'
                              }`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-semibold">({pct}%)</span>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-slate-700 font-mono text-[11px]">
                        {s.roomNumber || '—'}
                      </td>

                      <td className="py-3 px-4">
                        <Badge
                          className={
                            s.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }
                        >
                          {s.status}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(s)}
                          className="h-8 text-xs text-rose-600 hover:bg-rose-50 px-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
