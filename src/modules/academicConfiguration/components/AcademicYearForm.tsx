// src/modules/academicConfiguration/components/AcademicYearForm.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Check,
  AlertCircle,
  Calendar,
  Sparkles,
  Info,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export function AcademicYearForm({
  initialData = null,
  mode = 'create',
  onSave,
  loading = false,
}) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState<Record<string, any>>({
    name: initialData?.name || '',
    code: initialData?.code || '',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    description: initialData?.description || '',
    status: initialData?.status || 'Active',
    isCurrent: initialData?.isCurrent || false,
    defaultForAdmissions: initialData?.defaultForAdmissions || false,
  })

  const [errors, setErrors] = useState<Record<string, any>>({})

  const validate = () => {
    const errs: Record<string, any> = {}
    if (!formData.name.trim()) errs.name = 'Academic year name is required (e.g. 2026–2027)'
    if (!formData.code.trim()) errs.code = 'Academic year code is required (e.g. AY-2026-27)'
    if (!formData.startDate) errs.startDate = 'Start date is required'
    if (!formData.endDate) errs.endDate = 'End date is required'

    if (formData.startDate && formData.endDate) {
      if (new Date(formData.endDate) <= new Date(formData.startDate)) {
        errs.endDate = 'End date must be strictly after start date'
      }
    }

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
        {/* Main Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <CalendarDays className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year Name <span className="text-rose-500">*</span>
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
                          ? `AY-${name.replace(/[^0-9–-]/g, '')}`
                          : prev.code,
                    }))
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
                  }}
                  placeholder="e.g. 2026–2027"
                  className={errors.name ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Academic Year Code <span className="text-rose-500">*</span>
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
                  placeholder="e.g. AY-2026-27"
                  className={`font-mono text-xs ${errors.code ? 'border-rose-400 bg-rose-50/20' : ''}`}
                />
                {errors.code && <p className="text-[11px] text-rose-500 mt-1">{errors.code}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Term Start Date <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, startDate: e.target.value }))
                    if (errors.startDate) setErrors((prev) => ({ ...prev, startDate: null }))
                  }}
                  className={errors.startDate ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.startDate && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.startDate}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Term End Date <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, endDate: e.target.value }))
                    if (errors.endDate) setErrors((prev) => ({ ...prev, endDate: null }))
                  }}
                  className={errors.endDate ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.endDate && (
                  <p className="text-[11px] text-rose-500 mt-1">{errors.endDate}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description & Administrative Notes
              </label>
              <Textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Institutional remarks, special calendar policies or intake mandates..."
                className="text-xs"
              />
            </div>
          </div>

          {/* Operational Configuration */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Operational Configuration</h2>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Status
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full bg-white"
              >
                <option value="Active">Active (Currently ongoing)</option>
                <option value="Upcoming">Upcoming (Future planning)</option>
                <option value="Inactive">Inactive (Archived)</option>
              </Select>
            </div>

            <div className="pt-2 space-y-3">
              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <Checkbox
                  checked={formData.isCurrent}
                  onChange={(checked) => setFormData((prev) => ({ ...prev, isCurrent: checked }))}
                  className="mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Set as Current Academic Year
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Designates this cycle as the global active context for timetables, attendance,
                    and examinations across all campuses.
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer">
                <Checkbox
                  checked={formData.defaultForAdmissions}
                  onChange={(checked) =>
                    setFormData((prev) => ({ ...prev, defaultForAdmissions: checked }))
                  }
                  className="mt-0.5"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">
                    Default for New Admissions
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Automatically tags new student enquiries, applications, and enrollments to
                    this session.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Sidebar Summary & Actions */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Summary Preview
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Session Name</span>
                <span className="font-bold text-slate-900">{formData.name || '—'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Identifier Code</span>
                <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 inline-block font-semibold">
                  {formData.code || '—'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Term Range</span>
                <span className="text-slate-800">
                  {formData.startDate || 'YYYY-MM-DD'} → {formData.endDate || 'YYYY-MM-DD'}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-slate-500 text-[11px]">Current Active:</span>
                <span
                  className={`text-[11px] font-bold ${
                    formData.isCurrent ? 'text-emerald-700' : 'text-slate-500'
                  }`}
                >
                  {formData.isCurrent ? 'Yes (Primary)' : 'No'}
                </span>
              </div>
            </div>

            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-blue-800 flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <span>
                Programs and cohort classes mapped to this academic year will become selectable in
                the Admissions and Timetable modules.
              </span>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Academic Year' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/academic-configuration/academic-years')}
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
