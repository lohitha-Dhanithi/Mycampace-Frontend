// src/modules/academicConfiguration/CurriculumCreatePage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { curriculumService } from './services/curriculumService'
import { programService } from './services/programService'
import { academicYearService } from './services/academicYearService'
import { courseService } from './services/courseService'

export function CurriculumCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [programs, setPrograms] = useState([])
  const [academicYears, setAcademicYears] = useState([])
  const [courses, setCourses] = useState([])
  const [errors, setErrors] = useState<Record<string, any>>({})

  const [form, setForm] = useState({
    name: '',
    programId: '',
    courseId: '',
    academicYearId: '',
    status: 'Active',
    numSemesters: 2,
  })

  useEffect(() => {
    Promise.all([
      programService.getPrograms(),
      academicYearService.getAcademicYears(),
      courseService.getCourses(),
    ]).then(([progs, ays, crs]) => {
      setPrograms(progs)
      setAcademicYears(ays)
      setCourses(crs)
      const current = ays.find((y) => y.isCurrent)
      if (current) setForm((prev) => ({ ...prev, academicYearId: current.id }))
    })
  }, [])

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const validate = () => {
    const errs: Record<string, any> = {}
    if (!form.name.trim()) errs.name = 'Curriculum name is required'
    if (!form.programId) errs.programId = 'Please select a program'
    if (!form.academicYearId) errs.academicYearId = 'Please select an academic year'
    return errs
  }

  const handleSave = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setLoading(true)
    try {
      const semesters = Array.from({ length: Number(form.numSemesters) }, (_, i) => ({
        semester: i + 1,
        title: `Semester ${i + 1}`,
        subjects: [],
      }))
      const created = await curriculumService.createCurriculum({
        name: form.name,
        programId: form.programId,
        courseId: form.courseId,
        academicYearId: form.academicYearId,
        status: form.status,
        semesters,
        totalCredits: 0,
        totalSubjects: 0,
      })
      setLoading(false)
      navigate(`/academic-configuration/curriculum/${created.id}`, {
        state: { toast: `Curriculum "${created.name}" created. Now assign subjects to semesters.` },
      })
    } catch (err) {
      setLoading(false)
      alert(err.message || 'Failed to create curriculum')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => navigate('/academic-configuration/curriculum')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Create Curriculum Framework</h1>
          <p className="text-xs text-slate-500">Define the program framework and semester structure. Assign subjects in the next step.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="max-w-2xl space-y-5">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Curriculum Details</h3>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Curriculum Name <span className="text-rose-500">*</span></label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. B.Tech CSE - CBCS 2027 Regulations"
              className={`h-9 text-xs ${errors.name ? 'border-rose-400' : ''}`} />
            {errors.name && <p className="text-rose-600 text-[11px] mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Program <span className="text-rose-500">*</span></label>
              <select value={form.programId} onChange={(e) => set('programId', e.target.value)}
                className={`w-full h-9 px-3 rounded-lg border text-xs font-medium bg-white ${errors.programId ? 'border-rose-400' : 'border-slate-200'}`}>
                <option value="">Select program</option>
                {programs.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              {errors.programId && <p className="text-rose-600 text-[11px] mt-1">{errors.programId}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Academic Year <span className="text-rose-500">*</span></label>
              <select value={form.academicYearId} onChange={(e) => set('academicYearId', e.target.value)}
                className={`w-full h-9 px-3 rounded-lg border text-xs font-medium bg-white ${errors.academicYearId ? 'border-rose-400' : 'border-slate-200'}`}>
                <option value="">Select academic year</option>
                {academicYears.map((y) => <option key={y.id} value={y.id}>{y.name}{y.isCurrent ? ' (Current)' : ''}</option>)}
              </select>
              {errors.academicYearId && <p className="text-rose-600 text-[11px] mt-1">{errors.academicYearId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Number of Semesters</label>
              <select value={form.numSemesters} onChange={(e) => set('numSemesters', e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium bg-white">
                {[1, 2, 3, 4, 6, 8, 10].map((n) => <option key={n} value={n}>{n} Semesters</option>)}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Status</label>
              <select value={form.status} onChange={(e) => set('status', e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium bg-white">
                <option value="Active">Active</option>
                <option value="Draft">Draft</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-6">
            {loading ? 'Creating...' : 'Create & Map Subjects →'}
          </Button>
          <Button type="button" variant="outline" onClick={() => navigate('/academic-configuration/curriculum')}>Cancel</Button>
        </div>
      </form>
    </div>
  )
}
