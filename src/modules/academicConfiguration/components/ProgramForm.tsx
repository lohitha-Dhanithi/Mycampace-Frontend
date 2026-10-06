// src/modules/academicConfiguration/components/ProgramForm.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GraduationCap, BookOpen, Layers, Sparkles, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { PROGRAM_LEVEL_OPTIONS, PROGRAM_MODE_OPTIONS } from '../data/programMockData'
import { departmentService } from '../services/departmentService'
import { academicYearService } from '../services/academicYearService'

export function ProgramForm({
  initialData = null,
  mode = 'create',
  onSave,
  loading = false,
}) {
  const navigate = useNavigate()

  const [departments, setDepartments] = useState([])
  const [academicYears, setAcademicYears] = useState([])

  const [formData, setFormData] = useState<Record<string, any>>({
    name: initialData?.name || '',
    code: initialData?.code || '',
    description: initialData?.description || '',
    departmentId: initialData?.departmentId || '',
    level: initialData?.level || 'Undergraduate',
    duration: initialData?.duration || 4,
    durationUnit: initialData?.durationUnit || 'Years',
    mode: initialData?.mode || 'Full Time',
    status: initialData?.status || 'Active',
    creditSystemEnabled: initialData?.creditSystemEnabled ?? true,
    totalCredits: initialData?.totalCredits || 160,
    applicableAcademicYears: initialData?.applicableAcademicYears || ['ay-2026-27'],
  })

  const [errors, setErrors] = useState<Record<string, any>>({})

  useEffect(() => {
    Promise.all([
      departmentService.getDepartments(),
      academicYearService.getAcademicYears(),
    ]).then(([depts, ays]) => {
      setDepartments(depts)
      setAcademicYears(ays)
      if (!formData.departmentId && depts.length > 0) {
        setFormData((prev) => ({ ...prev, departmentId: depts[0].id }))
      }
    })
  }, [])

  const validate = () => {
    const errs: Record<string, any> = {}
    if (!formData.name.trim()) errs.name = 'Program title is required'
    if (!formData.code.trim()) errs.code = 'Program code is required (e.g. BTECH-CSE)'
    if (!formData.departmentId) errs.departmentId = 'Department is required'
    if (!formData.duration || formData.duration <= 0) errs.duration = 'Valid duration is required'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSave(formData)
  }

  const toggleAcademicYear = (ayId) => {
    setFormData((prev) => {
      const exists = prev.applicableAcademicYears.includes(ayId)
      return {
        ...prev,
        applicableAcademicYears: exists
          ? prev.applicableAcademicYears.filter((id) => id !== ayId)
          : [...prev.applicableAcademicYears, ayId],
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Program Information */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <GraduationCap className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Program Identity</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program Name <span className="text-rose-500">*</span>
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
                              .slice(0, 15)
                          : prev.code,
                    }))
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
                  }}
                  placeholder="e.g. Bachelor of Technology in Computer Science"
                  className={errors.name ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program Code <span className="text-rose-500">*</span>
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
                  placeholder="e.g. BTECH-CSE"
                  className={`font-mono text-xs ${errors.code ? 'border-rose-400 bg-rose-50/20' : ''}`}
                />
                {errors.code && <p className="text-[11px] text-rose-500 mt-1">{errors.code}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Host Department <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={formData.departmentId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, departmentId: e.target.value }))}
                  className="w-full bg-white text-xs"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Degree / Program Level
                </label>
                <Select
                  value={formData.level}
                  onChange={(e) => setFormData((prev) => ({ ...prev, level: e.target.value }))}
                  className="w-full bg-white text-xs"
                >
                  {PROGRAM_LEVEL_OPTIONS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Program Description
              </label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Pedagogical objectives, graduation requirements and specialization details..."
                className="text-xs"
              />
            </div>
          </div>

          {/* Delivery & Duration */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Building2 className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Delivery & Duration</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration Value <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: Number(e.target.value) }))}
                  className={errors.duration ? 'border-rose-400 bg-rose-50/20' : ''}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Duration Unit
                </label>
                <Select
                  value={formData.durationUnit}
                  onChange={(e) => setFormData((prev) => ({ ...prev, durationUnit: e.target.value }))}
                  className="w-full bg-white text-xs"
                >
                  <option value="Years">Years</option>
                  <option value="Semesters">Semesters</option>
                  <option value="Months">Months</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Delivery Mode
                </label>
                <Select
                  value={formData.mode}
                  onChange={(e) => setFormData((prev) => ({ ...prev, mode: e.target.value }))}
                  className="w-full bg-white text-xs"
                >
                  {PROGRAM_MODE_OPTIONS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Program Status
                </label>
                <Select
                  value={formData.status}
                  onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-white text-xs"
                >
                  <option value="Active">Active (Accepting enrollments)</option>
                  <option value="Inactive">Inactive / Suspended</option>
                </Select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Graduation Credits
                </label>
                <Input
                  type="number"
                  value={formData.totalCredits}
                  onChange={(e) => setFormData((prev) => ({ ...prev, totalCredits: Number(e.target.value) }))}
                  disabled={!formData.creditSystemEnabled}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={formData.creditSystemEnabled}
                  onChange={(checked) => setFormData((prev) => ({ ...prev, creditSystemEnabled: checked }))}
                />
                <span className="text-xs font-medium text-slate-800">
                  Credit System (CBCS / ECTS) Enabled for this Program
                </span>
              </label>
            </div>
          </div>

          {/* Applicable Academic Years */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Applicable Academic Sessions
            </h3>
            <p className="text-xs text-slate-500">
              Select which academic year intakes are authorized to run this program.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {academicYears.map((ay) => {
                const selected = formData.applicableAcademicYears.includes(ay.id)
                return (
                  <label
                    key={ay.id}
                    className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      selected
                        ? 'border-blue-500 bg-blue-50/50 text-blue-900 font-semibold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <Checkbox
                      checked={selected}
                      onChange={() => toggleAcademicYear(ay.id)}
                    />
                    <span>{ay.name} ({ay.code})</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Program Summary
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Program Name</span>
                <span className="font-bold text-slate-900">{formData.name || '—'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Identifier Code</span>
                <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 inline-block font-semibold">
                  {formData.code || '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Level & Mode</span>
                <span className="text-slate-800">
                  {formData.level} · {formData.mode}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Duration</span>
                <span className="text-slate-800">
                  {formData.duration} {formData.durationUnit} ({formData.totalCredits} credits)
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Program' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/academic-configuration/programs')}
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
