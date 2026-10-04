// src/modules/academicConfiguration/CurriculumPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Workflow,
  Plus,
  Search,
  CheckCircle2,
  Trash2,
  Eye,
  RotateCcw,
  BookOpen,
  Layers,
} from 'lucide-react'
import { AcademicConfigurationHeader } from './components/AcademicConfigurationHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { curriculumService } from './services/curriculumService'
import { programService } from './services/programService'
import { academicYearService } from './services/academicYearService'

export function CurriculumPage() {
  const location = useLocation()

  const [curriculums, setCurriculums] = useState([])
  const [programs, setPrograms] = useState([])
  const [academicYears, setAcademicYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [programFilter, setProgramFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [toast, setToast] = useState(location.state?.toast || '')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [currs, progs, ays] = await Promise.all([
        curriculumService.getCurriculum(),
        programService.getPrograms(),
        academicYearService.getAcademicYears(),
      ])
      setCurriculums(currs)
      setPrograms(progs)
      setAcademicYears(ays)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Failed to load curriculum')
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  const getProgramName = (progId) => {
    const p = programs.find((p) => p.id === progId)
    return p ? p.name : progId
  }

  const getYearName = (ayId) => {
    const ay = academicYears.find((y) => y.id === ayId)
    return ay ? ay.name : ayId
  }

  const filteredCurriculums = useMemo(() => {
    return curriculums.filter((c) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = searchQuery === '' || c.name.toLowerCase().includes(q)
      const matchesProgram = programFilter === 'ALL' || c.programId === programFilter
      const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter
      return matchesSearch && matchesProgram && matchesStatus
    })
  }, [curriculums, searchQuery, programFilter, statusFilter])

  const isFiltered = searchQuery || programFilter !== 'ALL' || statusFilter !== 'ALL'

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
        title="Curriculum"
        subtitle="Semester-by-semester course frameworks, subject mappings, and credit distribution schemas per program."
        actions={
          <Link to="/academic-configuration/curriculum/new">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs">
              <Plus className="h-4 w-4 mr-1.5" />Create Curriculum
            </Button>
          </Link>
        }
      />

      {/* Filter toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search curriculum by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <select value={programFilter} onChange={(e) => setProgramFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white">
            <option value="ALL">All Programs</option>
            {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white">
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Draft">Draft</option>
            <option value="Inactive">Inactive</option>
          </select>
          {isFiltered && (
            <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setProgramFilter('ALL'); setStatusFilter('ALL') }} className="h-9 text-xs text-slate-600 hover:text-slate-900">
              <RotateCcw className="h-3.5 w-3.5 mr-1" />Reset
            </Button>
          )}
        </div>
      </div>

      {/* Cards grid */}
      {filteredCurriculums.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <Workflow className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-800">No curriculum frameworks found</p>
          <p className="text-xs text-slate-500 mt-1">Create a curriculum framework to begin subject mapping.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCurriculums.map((c) => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition-all hover:shadow-md">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                    <Workflow className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">{c.name}</h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{getYearName(c.academicYearId)}</p>
                  </div>
                </div>
                <Badge className={c.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : c.status === 'Draft' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
                  {c.status}
                </Badge>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3">
                  <span className="font-semibold text-slate-800">{getProgramName(c.programId)}</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="font-bold text-lg text-slate-900">{c.semesters?.length || 0}</div>
                    <div className="text-[10px] text-slate-500">Semesters</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="font-bold text-lg text-slate-900">{c.totalSubjects}</div>
                    <div className="text-[10px] text-slate-500">Subjects</div>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="font-bold text-lg text-slate-900">{c.totalCredits}</div>
                    <div className="text-[10px] text-slate-500">Credits</div>
                  </div>
                </div>
              </div>

              {/* Semester breakdown */}
              <div className="mt-3 space-y-2">
                {c.semesters?.map((sem) => (
                  <div key={sem.semester} className="flex items-center justify-between py-1.5 px-3 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <Layers className="h-3 w-3 text-slate-400" />
                      <span className="text-xs font-medium text-slate-700">{sem.title}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {sem.subjects.length} subjects
                      </span>
                      <span className="font-semibold text-blue-700">
                        {sem.subjects.reduce((sum, s) => sum + (s.credits || 0), 0)} cr
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Link to={`/academic-configuration/curriculum/${c.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full h-8 text-xs border-slate-200 text-slate-700 hover:bg-slate-50">
                    <Eye className="h-3.5 w-3.5 mr-1.5" />View & Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
