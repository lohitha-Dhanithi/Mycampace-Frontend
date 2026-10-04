// src/modules/academicConfiguration/ClassesPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Layers,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Calendar,
  GraduationCap,
  Grid,
  RotateCcw,
} from 'lucide-react'
import { AcademicConfigurationHeader } from './components/AcademicConfigurationHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { classService } from './services/classService'
import { academicYearService } from './services/academicYearService'
import { programService } from './services/programService'

export function ClassesPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [classes, setClasses] = useState([])
  const [academicYears, setAcademicYears] = useState([])
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [yearFilter, setYearFilter] = useState('ALL')
  const [programFilter, setProgramFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [toast, setToast] = useState(location.state?.toast || '')

  const loadData = async () => {
    try {
      setLoading(true)
      const [cls, ays, progs] = await Promise.all([
        classService.getClasses(),
        academicYearService.getAcademicYears(),
        programService.getPrograms(),
      ])
      setClasses(cls)
      setAcademicYears(ays)
      setPrograms(progs)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Failed to load classes')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete class "${c.name}"?`)) return
    try {
      await classService.deleteClass(c.id)
      await loadData()
      setToast(`Class "${c.name}" deleted.`)
      setTimeout(() => setToast(''), 4000)
    } catch (err) {
      alert(err.message)
    }
  }

  const getYearName = (ayId) => {
    const ay = academicYears.find((y) => y.id === ayId)
    return ay ? ay.name : ayId
  }

  const getProgName = (progId) => {
    const p = programs.find((prog) => prog.id === progId)
    return p ? p.code : progId
  }

  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.classTeacher.toLowerCase().includes(q)

      const matchesYear = yearFilter === 'ALL' || c.academicYearId === yearFilter
      const matchesProg = programFilter === 'ALL' || c.programId === programFilter
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter

      return matchesSearch && matchesYear && matchesProg && matchesStatus
    })
  }, [classes, searchQuery, yearFilter, programFilter, statusFilter])

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
        title="Classes"
        subtitle="Cohort-level academic classes linked to academic years and degree programs."
        actions={
          <Link to="/academic-configuration/classes/new">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Class
            </Button>
          </Link>
        }
      />

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search classes by name, code or teacher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="ALL">All Academic Sessions</option>
            {academicYears.map((ay) => (
              <option key={ay.id} value={ay.id}>
                {ay.name}
              </option>
            ))}
          </select>

          <select
            value={programFilter}
            onChange={(e) => setProgramFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="ALL">All Programs</option>
            {programs.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
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

          {(searchQuery || yearFilter !== 'ALL' || programFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setYearFilter('ALL')
                setProgramFilter('ALL')
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
        {filteredClasses.length === 0 ? (
          <div className="p-12 text-center">
            <Layers className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No classes match criteria</p>
            <p className="text-xs text-slate-500 mt-1">Adjust search filters or add a new cohort class.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Class Name & Code</th>
                  <th className="py-3 px-4">Academic Session</th>
                  <th className="py-3 px-4">Degree Program</th>
                  <th className="py-3 px-4">Class Teacher</th>
                  <th className="py-3 px-4">Sections</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredClasses.map((c) => (
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
                      {getYearName(c.academicYearId)}
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {getProgName(c.programId)}
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {c.classTeacher}
                    </td>

                    <td className="py-3 px-4">
                      <Link
                        to={`/academic-configuration/sections?classId=${c.id}`}
                        className="inline-flex items-center gap-1 font-semibold text-blue-700 hover:underline"
                      >
                        <Grid className="h-3 w-3" />
                        {c.sectionCount} sections
                      </Link>
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
                        title="Delete Class"
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
