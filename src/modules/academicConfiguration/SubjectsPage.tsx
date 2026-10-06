// src/modules/academicConfiguration/SubjectsPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FileSpreadsheet,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Edit,
  Power,
  RotateCcw,
  FlaskConical,
  BookOpen,
  Languages,
  Activity,
} from 'lucide-react'
import { AcademicConfigurationHeader } from './components/AcademicConfigurationHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { subjectService } from './services/subjectService'
import { departmentService } from './services/departmentService'

const TYPE_COLOR = {
  Core: 'bg-blue-50 text-blue-700 border-blue-200',
  Elective: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Practical: 'bg-amber-50 text-amber-700 border-amber-200',
  Language: 'bg-violet-50 text-violet-700 border-violet-200',
  Activity: 'bg-teal-50 text-teal-700 border-teal-200',
}

const TYPES = ['Core', 'Elective', 'Practical', 'Language', 'Activity']

export function SubjectsPage() {
  const location = useLocation()

  const [subjects, setSubjects] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [deptFilter, setDeptFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [toast, setToast] = useState(location.state?.toast || '')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [subs, depts] = await Promise.all([
        subjectService.getSubjects(),
        departmentService.getDepartments(),
      ])
      setSubjects(subs)
      setDepartments(depts)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Failed to load subjects')
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const getDepartmentName = (deptId) => {
    const d = departments.find((d) => d.id === deptId)
    return d ? d.name : deptId
  }

  const handleToggleStatus = async (sub) => {
    const nextStatus = sub.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await subjectService.updateSubjectStatus(sub.id, nextStatus)
      await loadData()
      showToast(`Subject "${sub.name}" set to ${nextStatus}.`)
    } catch (err) { alert(err.message) }
  }

  const handleDelete = async (sub) => {
    if (!window.confirm(`Delete subject "${sub.name}"?`)) return
    try {
      await subjectService.deleteSubject(sub.id)
      await loadData()
      showToast(`Subject "${sub.name}" deleted.`)
    } catch (err) { alert(err.message) }
  }

  const filteredSubjects = useMemo(() => {
    return subjects.filter((s) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = searchQuery === '' ||
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
      const matchesDept = deptFilter === 'ALL' || s.departmentId === deptFilter
      const matchesType = typeFilter === 'ALL' || s.type === typeFilter
      const matchesStatus = statusFilter === 'ALL' || s.status === statusFilter
      return matchesSearch && matchesDept && matchesType && matchesStatus
    })
  }, [subjects, searchQuery, deptFilter, typeFilter, statusFilter])

  const isFiltered = searchQuery || deptFilter !== 'ALL' || typeFilter !== 'ALL' || statusFilter !== 'ALL'

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
          <button type="button" onClick={() => setToast('')} className="text-emerald-700 hover:text-emerald-900 font-semibold text-xs">Dismiss</button>
        </div>
      )}

      <AcademicConfigurationHeader
        title="Subjects"
        subtitle="Academic subjects: core modules, electives, practicals, language courses, and activity-based learning units."
        actions={
          <Link to="/academic-configuration/subjects/new">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs">
              <Plus className="h-4 w-4 mr-1.5" />Add Subject
            </Button>
          </Link>
        }
      />

      {/* Quick type filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTypeFilter('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${typeFilter === 'ALL' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}
        >
          All ({subjects.length})
        </button>
        {TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t === typeFilter ? 'ALL' : t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${typeFilter === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300'}`}
          >
            {t} ({subjects.filter((s) => s.type === t).length})
          </button>
        ))}
      </div>

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search subjects by name, code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white">
            <option value="ALL">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white">
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setDeptFilter('ALL'); setTypeFilter('ALL'); setStatusFilter('ALL') }} className="h-9 text-xs text-slate-600 hover:text-slate-900">
              <RotateCcw className="h-3.5 w-3.5 mr-1" />Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {filteredSubjects.length === 0 ? (
          <div className="p-12 text-center">
            <FileSpreadsheet className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No subjects found</p>
            <p className="text-xs text-slate-500 mt-1">Add a subject or adjust your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Subject Name & Code</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Credits</th>
                  <th className="py-3 px-4">Contact Hours</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredSubjects.map((s) => {
                  const typeColor = TYPE_COLOR[s.type] || 'bg-slate-100 text-slate-600 border-slate-200'
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-3 px-4">
                        <div>
                          <span className="font-bold text-slate-900 block">{s.name}</span>
                          <span className="font-mono text-[10px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-semibold inline-block mt-0.5">
                            {s.code}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${typeColor}`}>
                          {s.type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">{getDepartmentName(s.departmentId)}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{s.credits}</span>
                        <span className="text-slate-500 ml-1">cr</span>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        <span className="font-semibold">{s.lectureHours}h</span>
                        <span className="text-slate-400 mx-1">lec</span>
                        {s.labHours > 0 && (
                          <><span className="font-semibold">{s.labHours}h</span><span className="text-slate-400 ml-1">lab</span></>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                          {s.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link to={`/academic-configuration/subjects/${s.id}/edit`}>
                            <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-600 hover:bg-slate-100 px-2">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleToggleStatus(s)}
                            className={`h-8 text-xs px-2 ${s.status === 'Active' ? 'text-slate-500 hover:bg-slate-100' : 'text-emerald-600 hover:bg-emerald-50'}`}
                            title={s.status === 'Active' ? 'Deactivate' : 'Activate'}>
                            <Power className="h-3.5 w-3.5" />
                          </Button>
                          <Button type="button" variant="ghost" size="sm" onClick={() => handleDelete(s)} className="h-8 text-xs text-rose-600 hover:bg-rose-50 px-2" title="Delete">
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500 text-right">Showing {filteredSubjects.length} of {subjects.length} subjects</p>
    </div>
  )
}
