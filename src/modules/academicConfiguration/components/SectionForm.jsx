// src/modules/academicConfiguration/components/SectionForm.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Grid, Calendar, Layers, User, Sparkles, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { academicYearService } from '../services/academicYearService'
import { classService } from '../services/classService'

export function SectionForm({
  initialData = null,
  mode = 'create',
  onSave,
  loading = false,
}) {
  const navigate = useNavigate()

  const [academicYears, setAcademicYears] = useState([])
  const [classes, setClasses] = useState([])

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    academicYearId: initialData?.academicYearId || '',
    classId: initialData?.classId || '',
    classTeacher: initialData?.classTeacher || '',
    studentCapacity: initialData?.studentCapacity || 60,
    roomNumber: initialData?.roomNumber || 'LH-101',
    status: initialData?.status || 'Active',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    Promise.all([
      academicYearService.getAcademicYears(),
      classService.getClasses(),
    ]).then(([ays, cls]) => {
      setAcademicYears(ays)
      setClasses(cls)
      if (!formData.academicYearId && ays.length > 0) {
        const cur = ays.find((y) => y.isCurrent) || ays[0]
        setFormData((prev) => ({ ...prev, academicYearId: cur.id }))
      }
      if (!formData.classId && cls.length > 0) {
        setFormData((prev) => ({ ...prev, classId: cls[0].id }))
      }
    })
  }, [])

  // Filter classes by selected academic year (dependency-aware UX)
  const applicableClasses = classes.filter(
    (c) => !formData.academicYearId || c.academicYearId === formData.academicYearId
  )

  const validate = () => {
    const errs = {}
    if (!formData.name.trim()) errs.name = 'Section name is required'
    if (!formData.code.trim()) errs.code = 'Section code is required (e.g. CSE-1A)'
    if (!formData.academicYearId) errs.academicYearId = 'Academic year is required'
    if (!formData.classId) errs.classId = 'Parent class is required'
    if (!formData.classTeacher.trim()) errs.classTeacher = 'Class tutor is required'
    if (!formData.studentCapacity || formData.studentCapacity < 1) {
      errs.studentCapacity = 'Valid student capacity is required'
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
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Grid className="h-4 w-4 text-blue-600" />
              <h2 className="text-sm font-bold text-slate-900">Section Allocation</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Name <span className="text-rose-500">*</span>
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
                          ? `SEC-${name.replace(/[^A-Z0-9]/gi, '').toUpperCase()}`
                          : prev.code,
                    }))
                    if (errors.name) setErrors((prev) => ({ ...prev, name: null }))
                  }}
                  placeholder="e.g. Section A (Alpha)"
                  className={errors.name ? 'border-rose-400 bg-rose-50/20' : ''}
                />
                {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Section Code <span className="text-rose-500">*</span>
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
                  placeholder="e.g. CSE-1A"
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
                  onChange={(e) => {
                    const ayId = e.target.value
                    const validClasses = classes.filter((c) => c.academicYearId === ayId)
                    setFormData((prev) => ({
                      ...prev,
                      academicYearId: ayId,
                      classId: validClasses.length > 0 ? validClasses[0].id : '',
                    }))
                  }}
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
                  Parent Class Cohort <span className="text-rose-500">*</span>
                </label>
                <Select
                  value={formData.classId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, classId: e.target.value }))}
                  className="w-full bg-white text-xs"
                >
                  {applicableClasses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.code})
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Class Tutor / Mentor <span className="text-rose-500">*</span>
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
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Student Capacity <span className="text-rose-500">*</span>
                </label>
                <Input
                  type="number"
                  min="1"
                  max="120"
                  value={formData.studentCapacity}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, studentCapacity: Number(e.target.value) }))
                  }
                  className={errors.studentCapacity ? 'border-rose-400 bg-rose-50/20' : ''}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Designated Room
                </label>
                <Input
                  value={formData.roomNumber}
                  onChange={(e) => setFormData((prev) => ({ ...prev, roomNumber: e.target.value }))}
                  placeholder="e.g. LH-101"
                  className="text-xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Section Status
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData((prev) => ({ ...prev, status: e.target.value }))}
                className="w-full bg-white text-xs max-w-xs"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Section Preview
            </h3>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 text-xs">
              <div>
                <span className="text-[11px] text-slate-500 block">Section</span>
                <span className="font-bold text-slate-900">{formData.name || '—'}</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Max Seats</span>
                <span className="font-bold text-blue-700">{formData.studentCapacity} students</span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Room</span>
                <span className="text-slate-800">{formData.roomNumber || '—'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            >
              {loading ? 'Saving...' : mode === 'create' ? 'Create Section' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/academic-configuration/sections')}
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
