// src/modules/academicConfiguration/DepartmentsPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Building2,
  Plus,
  Search,
  CheckCircle2,
  Edit,
  Trash2,
  Users,
  GraduationCap,
  Mail,
  Phone,
  Power,
  RotateCcw,
} from 'lucide-react'
import { AcademicConfigurationHeader } from './components/AcademicConfigurationHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { departmentService } from './services/departmentService'

export function DepartmentsPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [toast, setToast] = useState(location.state?.toast || '')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await departmentService.getDepartments()
      setDepartments(data)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Failed to load departments')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleStatus = async (dept) => {
    try {
      const updated = await departmentService.toggleDepartmentStatus(dept.id)
      await loadData()
      showToast(`Department "${dept.name}" status switched to ${updated.status}.`)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (dept) => {
    if (!window.confirm(`Delete department "${dept.name}"?`)) return
    try {
      await departmentService.deleteDepartment(dept.id)
      await loadData()
      showToast(`Department "${dept.name}" deleted.`)
    } catch (err) {
      alert(err.message)
    }
  }

  const filteredDepts = useMemo(() => {
    return departments.filter((d) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        d.name.toLowerCase().includes(q) ||
        d.code.toLowerCase().includes(q) ||
        d.head.toLowerCase().includes(q)

      const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [departments, searchQuery, statusFilter])

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
        title="Departments"
        subtitle="Academic faculties, instructional divisions, department heads, and faculty allocations."
        actions={
          <Link to="/academic-configuration/departments/new">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Department
            </Button>
          </Link>
        }
      />

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search departments by name, code or HOD..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          {(searchQuery || statusFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('')
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
        {filteredDepts.length === 0 ? (
          <div className="p-12 text-center">
            <Building2 className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No departments found</p>
            <p className="text-xs text-slate-500 mt-1">Add an academic department or reset filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Department Name & Code</th>
                  <th className="py-3 px-4">Head of Department</th>
                  <th className="py-3 px-4">Programs Offered</th>
                  <th className="py-3 px-4">Faculty Count</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDepts.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{d.name}</span>
                          <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200 font-semibold">
                            {d.code}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-800 font-medium">
                      <div>{d.head}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{d.contactEmail}</div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                        <GraduationCap className="h-3.5 w-3.5 text-slate-400" />
                        {d.programsCount} programs
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-800">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {d.facultyCount} faculty
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        className={
                          d.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }
                      >
                        {d.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(d)}
                          className={`h-8 text-xs px-2 ${
                            d.status === 'Active'
                              ? 'text-slate-500 hover:bg-slate-100'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={d.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </Button>

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(d)}
                          className="h-8 text-xs text-rose-600 hover:bg-rose-50 px-2"
                          title="Delete Department"
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
