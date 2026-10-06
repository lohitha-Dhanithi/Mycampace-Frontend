// src/modules/academicConfiguration/ProgramsPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  GraduationCap,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  RotateCcw,
  BookOpen,
} from 'lucide-react'
import { AcademicConfigurationHeader } from './components/AcademicConfigurationHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { programService } from './services/programService'
import { departmentService } from './services/departmentService'
import { PROGRAM_LEVEL_OPTIONS } from './data/programMockData'

export function ProgramsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [programs, setPrograms] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('ALL')
  const [levelFilter, setLevelFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const [toast, setToast] = useState(location.state?.toast || '')

  const loadData = async () => {
    try {
      setLoading(true)
      const [progs, depts] = await Promise.all([
        programService.getPrograms(),
        departmentService.getDepartments(),
      ])
      setPrograms(progs)
      setDepartments(depts)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Failed to load programs')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = async (prog) => {
    if (!window.confirm(`Are you sure you want to delete program "${prog.name}"?`)) return
    try {
      await programService.deleteProgram(prog.id)
      await loadData()
      setToast(`Program "${prog.name}" deleted.`)
      setTimeout(() => setToast(''), 4000)
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)

      const matchesDept = departmentFilter === 'ALL' || p.departmentId === departmentFilter
      const matchesLevel = levelFilter === 'ALL' || p.level === levelFilter
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter

      return matchesSearch && matchesDept && matchesLevel && matchesStatus
    })
  }, [programs, searchQuery, departmentFilter, levelFilter, statusFilter])

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  const getDeptName = (deptId) => {
    const d = departments.find((dept) => dept.id === deptId)
    return d ? d.name : deptId
  }

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
        title="Programs"
        subtitle="Major institutional degrees, graduation trajectories, and academic qualifications."
        actions={
          <Link to="/academic-configuration/programs/new">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Program
            </Button>
          </Link>
        }
      />

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search programs by name, code, description..."
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
                {d.code} - {d.name}
              </option>
            ))}
          </select>

          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="ALL">All Levels</option>
            {PROGRAM_LEVEL_OPTIONS.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
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

          {(searchQuery || departmentFilter !== 'ALL' || levelFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setDepartmentFilter('ALL')
                setLevelFilter('ALL')
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
        {filteredPrograms.length === 0 ? (
          <div className="p-12 text-center">
            <GraduationCap className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No programs match criteria</p>
            <p className="text-xs text-slate-500 mt-1">Adjust search parameters or create a new degree offering.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Program Name & Code</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Level</th>
                  <th className="py-3 px-4">Duration</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPrograms.map((prog) => (
                  <tr key={prog.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4">
                      <div>
                        <Link
                          to={`/academic-configuration/programs/${prog.id}`}
                          className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                        >
                          {prog.name}
                        </Link>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-semibold">
                            {prog.code}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            · {prog.totalCredits} credits
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {getDeptName(prog.departmentId)}
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {prog.level}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {prog.duration} {prog.durationUnit}
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {prog.mode}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        className={
                          prog.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }
                      >
                        {prog.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/academic-configuration/programs/${prog.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-blue-600 hover:bg-blue-50 px-2">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </Link>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(prog)}
                          className="h-8 text-xs text-rose-600 hover:bg-rose-50 px-2"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
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
