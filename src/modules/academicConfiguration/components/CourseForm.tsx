// src/modules/academicConfiguration/components/CourseForm.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Layers, Sparkles, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { COURSE_TYPE_OPTIONS } from '../data/courseMockData'
import { departmentService } from '../services/departmentService'
import { programService } from '../services/programService'

export function CourseForm({
  initialData = null,
  mode = 'create',
  onSave,
  loading = false,
}) {
  const navigate = useNavigate()

  const [departments, setDepartments] = useState([])
  const [programs, setPrograms] = useState([])

  const [formData, setFormData] = useState<Record<string, any>>({
    name: initialData?.name || '',
    code: initialData?.code || '',
    description: initialData?.description || '',
    departmentId: initialData?.departmentId || '',
    programId: initialData?.programId || '',
    duration: initialData?.duration || '1 Semester',
    credits: initialData?.credits || 4,
    type: initialData?.type || 'Core',
    status: initialData?.status || 'Active',
  })

  const [errors, setErrors] = useState<Record<string, any>>({})

  useEffect(() => {
    Promise.all([
      departmentService.getDepartments(),
      programService.getPrograms(),
    ]).then(([depts, progs]) => {
      setDepartments(depts)
      setPrograms(progs)
      if (!formData.departmentId && depts.length > 0) {
        setFormData((prev) => ({ ...prev, departmentId: depts[0].id }))
      }
      if (!formData.programId && progs.length > 0) {
        setFormData((prev) => ({ ...prev, programId: progs[0].id }))
      }
    })
  }, [])

  // Filter programs by selected department (dependency-aware UX!)
  const applicablePrograms = programs.filter(
    (p) => !formData.departmentId || p.departmentId === formData.departmentId
  )

  const validate = () => {
    const errs: Record<string, any> = {}
    if (!formData.name.trim()) errs.name = 'Course title is required'
    if (!formData.code.trim()) errs.code = 'Course code is required (e.g. CS201)'
    if (!formData.departmentId) errs.departmentId = 'Department is required'
    if (!formData.programId) errs.programId = 'Program mapping is required'
    if (!formData.credits || formData.credits < 1) errs.credits = 'Credits must be at least 1'

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
              <BookOpen className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Course Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Title <span className="text-rose-500">*</span>
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
                              .split(' ')
                              .map((w) => w[0])
                              .join('')
                              .toUpperCase() + '101'
                          : prev.code,
                    }))
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
                  }}
                  placeholder="e.g. Data Structures & Algorithms"
                  className={errors.name ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Code <span className="text-rose-500">*</span>
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
                  placeholder="e.g. CS201"
                  className={`font-mono text-xs ${errors.code ? 'border-rose-400 bg-rose-50/20' : ''}`}
                />
                {errors.code && <p className="text-[11px] text-rose-500 mt-1">{errors.code}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hosting Department <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={formData.departmentId}
                  onChange={(e) => {
                    const deptId = e.target.value
                    const validProgs = programs.filter((p) => p.departmentId === deptId)
                    setFormData((prev) => ({
                      ...prev,
                      departmentId: deptId,
                      programId: validProgs.length > 0 ? validProgs[0].id : '',
                    }))
                  }}
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
                  Associated Degree Program <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={formData.programId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, programId: e.target.value }))}
                  className="w-full bg-white text-xs"
                >
                  {applicablePrograms.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.code})
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Course Syllabus Description
              </label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Course scope, learning outcomes, and foundational competencies..."
                className="text-xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Term Duration
                </label>
                <Input
                  value={formData.duration}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duration: e.target.value }))}
                  placeholder="e.g. 1 Semester"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Credits <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.credits}
                  onChange={(e) => setFormData((prev) => ({ ...prev, credits: Number(e.target.value) }))}
                  className={errors.credits ? 'border-rose-400 bg-rose-50/20' : ''}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Course Classification
                </label>
                <Select
                  value={formData.type}
                  onChange={(e) => setFormData((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full bg-white text-xs"
                >
                  {COURSE_TYPE_OPTIONS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Course Specification
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Course Title</span>
                <span className="font-bold text-slate-900">{formData.name || '—'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Identifier Code</span>
                <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 font-semibold inline-block">
                  {formData.code || '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Classification</span>
                <span className="text-slate-800">
                  {formData.type} · {formData.credits} credits
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
              {loading ? 'Saving...' : mode === 'create' ? 'Create Course' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/academic-configuration/courses')}
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
