// src/modules/academicConfiguration/components/ClassForm.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layers, Calendar, GraduationCap, User, Sparkles } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { academicYearService } from '../services/academicYearService'
import { programService } from '../services/programService'

export function ClassForm({
  initialData = null,
  mode = 'create',
  onSave,
  loading = false,
}) {
  const navigate = useNavigate()

  const [academicYears, setAcademicYears] = useState([])
  const [programs, setPrograms] = useState([])

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    academicYearId: initialData?.academicYearId || '',
    programId: initialData?.programId || '',
    classTeacher: initialData?.classTeacher || '',
    status: initialData?.status || 'Active',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    Promise.all([
      academicYearService.getAcademicYears(),
      programService.getPrograms(),
    ]).then(([ays, progs]) => {
      setAcademicYears(ays)
      setPrograms(progs)
      if (!formData.academicYearId && ays.length > 0) {
        const cur = ays.find((y) => y.isCurrent) || ays[0]
        setFormData((prev) => ({ ...prev, academicYearId: cur.id }))
      }
      if (!formData.programId && progs.length > 0) {
        setFormData((prev) => ({ ...prev, programId: progs[0].id }))
      }
    })
  }, [])

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Class name is required'
    if (!formData.code.trim()) errs.code = 'Class code is required (e.g. CSE-Y1-2026)'
    if (!formData.academicYearId) errs.academicYearId = 'Academic year is required'
    if (!formData.programId) errs.programId = 'Program is required'
    if (!formData.classTeacher.trim()) errs.classTeacher = 'Designated class teacher is required'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Layers className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Cohort Class Definition</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setFormData((prev) => ({
                      ...prev,
                      name,
                      code:
                        mode === 'create' && !prev.codeManual
                          ? name
                              .toUpperCase()
                              .replace(/[^A-Z0-9]+/g, '-')
                              .slice(0, 16)
                          : prev.code,
                    }))
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
                  }}
                  placeholder="e.g. B.Tech CSE - 1st Year (Cohort 2026)"
                  className={errors.name ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Code <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.code}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      code: e.target.value.toUpperCase(),
                      codeManual: true,
                    }))
                    if (errors.code) setErrors((prev) => ({ ...prev, code: null }))
                  }}
                  placeholder="e.g. CSE-Y1-2026"
                  className={`font-mono text-xs ${errors.code ? 'border-rose-400 bg-rose-50/20' : ''}`}
                />
                {errors.code && <p className="text-[11px] text-rose-500 mt-1">{errors.code}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Session <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={formData.academicYearId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, academicYearId: e.target.value }))}
                  className="w-full bg-white text-xs"
                >
                  {academicYears.map((ay) => (
                    <option key={ay.id} value={ay.id}>
                      {ay.name} ({ay.code}) {ay.isCurrent ? '★ Current' : ''}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Degree Program <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={formData.programId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, programId: e.target.value }))}
                  className="w-full bg-white text-xs"
                >
                  {programs.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designated Class Teacher / Mentor <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={formData.classTeacher}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, classTeacher: e.target.value }))
                    if (errors.classTeacher) setErrors((prev) => ({ ...prev, classTeacher: null }))
                  }}
                  placeholder="e.g. Prof. Arvind Swamy"
                  className={errors.classTeacher ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.classTeacher && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.classTeacher}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-white text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Class Specification
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Class Name</span>
                <span className="font-bold text-slate-900">{formData.name || '—'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Identifier Code</span>
                <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-semibold inline-block">
                  {formData.code || '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Class Mentor</span>
                <span className="text-slate-800">{formData.classTeacher || '—'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Class' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/academic-configuration/classes')}
              className="w-full text-slate-700"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
