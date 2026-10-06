// src/modules/academicConfiguration/CurriculumDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, BookOpen, CheckCircle2, Layers } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { curriculumService } from './services/curriculumService'
import { subjectService } from './services/subjectService'
import { programService } from './services/programService'
import { academicYearService } from './services/academicYearService'

export function CurriculumDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [curriculum, setCurriculum] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [programs, setPrograms] = useState([])
  const [academicYears, setAcademicYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [toast, setToast] = useState(location.state?.toast || '')

  // Add-subject dialog state
  const [addingSemester, setAddingSemester] = useState(null)
  const [selectedSubjectId, setSelectedSubjectId] = useState('')
  const [adding, setAdding] = useState(false)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [curr, subs, progs, ays] = await Promise.all([
        curriculumService.getCurriculumById(id),
        subjectService.getSubjects(),
        programService.getPrograms(),
        academicYearService.getAcademicYears(),
      ])
      if (!curr) { setError('Curriculum not found'); return }
      setCurriculum(curr)
      setSubjects(subs)
      setPrograms(progs)
      setAcademicYears(ays)
      setLoading(false)
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [id])

  const getProgramName = (progId) => programs.find((p) => p.id === progId)?.name || progId
  const getYearName = (ayId) => academicYears.find((y) => y.id === ayId)?.name || ayId

  const assignedSubjectIds = new Set(
    curriculum?.semesters?.flatMap((s) => s.subjects.map((sub) => sub.subjectId)) || []
  )

  const availableSubjectsForAdd = subjects.filter((s) => !assignedSubjectIds.has(s.id))

  const handleAddSubject = async () => {
    if (!selectedSubjectId || !addingSemester) return
    const subject = subjects.find((s) => s.id === selectedSubjectId)
    if (!subject) return
    setAdding(true)
    try {
      const updated = await curriculumService.assignSubjectToCurriculum(id, addingSemester, subject)
      setCurriculum(updated)
      setSelectedSubjectId('')
      setAddingSemester(null)
      showToast(`"${subject.name}" assigned to Semester ${addingSemester}.`)
    } catch (err) {
      alert(err.message)
    }
    setAdding(false)
  }

  const handleRemoveSubject = async (semNum, subjectId, subjectName) => {
    if (!window.confirm(`Remove "${subjectName}" from Semester ${semNum}?`)) return
    try {
      const updated = await curriculumService.removeSubjectFromCurriculum(id, semNum, subjectId)
      setCurriculum(updated)
      showToast(`"${subjectName}" removed from Semester ${semNum}.`)
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={loadData} />
  if (!curriculum) return null

  const TYPE_COLOR = {
    Core: 'bg-blue-50 text-blue-700 border-blue-200',
    Elective: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    Practical: 'bg-amber-50 text-amber-700 border-amber-200',
    Language: 'bg-violet-50 text-violet-700 border-violet-200',
    Activity: 'bg-teal-50 text-teal-700 border-teal-200',
  }

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

      {/* Header */}
      <div className="flex items-start gap-3">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mt-0.5" onClick={() => navigate('/academic-configuration/curriculum')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-xl font-bold text-slate-900">{curriculum.name}</h1>
            <Badge className={curriculum.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}>
              {curriculum.status}
            </Badge>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-slate-500">
            <span>{getProgramName(curriculum.programId)}</span>
            <span>•</span>
            <span>{getYearName(curriculum.academicYearId)}</span>
            <span>•</span>
            <span className="font-semibold text-blue-700">{curriculum.totalCredits} total credits</span>
          </div>
        </div>

        {/* Totals */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="text-center">
            <div className="font-bold text-xl text-slate-900">{curriculum.totalSubjects}</div>
            <div className="text-[10px] text-slate-500">Subjects</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-slate-900">{curriculum.totalCredits}</div>
            <div className="text-[10px] text-slate-500">Credits</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-xl text-slate-900">{curriculum.semesters?.length}</div>
            <div className="text-[10px] text-slate-500">Semesters</div>
          </div>
        </div>
      </div>

      {/* Semester Cards */}
      <div className="space-y-4">
        {curriculum.semesters?.map((sem) => {
          const semCredits = sem.subjects.reduce((sum, s) => sum + (s.credits || 0), 0)
          const isAdding = addingSemester === sem.semester

          return (
            <div key={sem.semester} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 rounded-lg bg-blue-600 text-white">
                    <Layers className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{sem.title}</h3>
                    <p className="text-[11px] text-slate-500">{sem.subjects.length} subjects • {semCredits} credits</p>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => { setAddingSemester(isAdding ? null : sem.semester); setSelectedSubjectId('') }}
                  className="h-7 text-xs border-blue-200 text-blue-700 hover:bg-blue-50">
                  <Plus className="h-3 w-3 mr-1" />
                  {isAdding ? 'Cancel' : 'Add Subject'}
                </Button>
              </div>

              {/* Add subject row */}
              {isAdding && (
                <div className="px-5 py-3 bg-blue-50 border-b border-blue-100 flex items-center gap-3">
                  <select value={selectedSubjectId} onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="flex-1 h-9 px-3 rounded-lg border border-blue-200 text-xs font-medium bg-white">
                    <option value="">Select subject to assign...</option>
                    {availableSubjectsForAdd.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code}) — {s.credits}cr</option>
                    ))}
                  </select>
                  <Button size="sm" disabled={!selectedSubjectId || adding} onClick={handleAddSubject}
                    className="h-9 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                    {adding ? 'Adding...' : 'Assign'}
                  </Button>
                </div>
              )}

              {/* Subject list */}
              {sem.subjects.length === 0 ? (
                <div className="px-5 py-8 text-center">
                  <BookOpen className="h-6 w-6 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">No subjects assigned to this semester yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {sem.subjects.map((sub) => {
                    const typeColor = TYPE_COLOR[sub.type] || 'bg-slate-100 text-slate-600 border-slate-200'
                    return (
                      <div key={sub.subjectId} className="flex items-center justify-between px-5 py-3 hover:bg-slate-50/60 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${typeColor}`}>
                            {sub.type}
                          </span>
                          <div>
                            <span className="font-semibold text-xs text-slate-900">{sub.name}</span>
                            <span className="font-mono text-[10px] text-slate-400 ml-2">{sub.code}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-[11px] text-slate-500">
                          <span><span className="font-bold text-slate-800">{sub.credits}</span> cr</span>
                          <span><span className="font-bold text-slate-800">{sub.lectureHours}h</span> lec</span>
                          {sub.labHours > 0 && <span><span className="font-bold text-slate-800">{sub.labHours}h</span> lab</span>}
                          <Button type="button" variant="ghost" size="sm"
                            onClick={() => handleRemoveSubject(sem.semester, sub.subjectId, sub.name)}
                            className="h-6 w-6 p-0 text-rose-600 hover:bg-rose-50 ml-2">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Semester credit summary */}
              {sem.subjects.length > 0 && (
                <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-100 flex justify-between text-[11px]">
                  <span className="text-slate-500">Semester Total</span>
                  <span className="font-bold text-slate-900">{semCredits} credits across {sem.subjects.length} subjects</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
