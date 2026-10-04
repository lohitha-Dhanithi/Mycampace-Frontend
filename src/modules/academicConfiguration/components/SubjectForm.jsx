// src/modules/academicConfiguration/components/SubjectForm.jsx
import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { departmentService } from '../services/departmentService'
import { courseService } from '../services/courseService'

const SUBJECT_TYPES = ['Core', 'Elective', 'Practical', 'Language', 'Activity']
const STATUS_OPTIONS = ['Active', 'Inactive', 'Draft']

export function SubjectForm({ initialData = {}, mode = 'create', onSave, loading }) {
  const [departments, setDepartments] = useState([])
  const [courses, setCourses] = useState([])
  const [filteredCourses, setFilteredCourses] = useState([])

  const [form, setForm] = useState({
    name: '',
    code: '',
    description: '',
    type: 'Core',
    credits: 3,
    lectureHours: 3,
    labHours: 0,
    departmentId: '',
    courseId: '',
    status: 'Active',
    ...initialData,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    Promise.all([
      departmentService.getDepartments(),
      courseService.getCourses(),
    ]).then(([depts, crs]) => {
      setDepartments(depts)
      setCourses(crs)
    })
  }, [])

  useEffect(() => {
    if (form.departmentId && courses.length > 0) {
      setFilteredCourses(courses.filter((c) => c.departmentId === form.departmentId))
    } else {
      setFilteredCourses(courses)
    }
  }, [form.departmentId, courses])

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Subject name is required'
    if (!form.code.trim()) errs.code = 'Subject code is required'
    if (!form.departmentId) errs.departmentId = 'Please select a department'
    if (!form.type) errs.type = 'Subject type is required'
    if (!form.credits || form.credits < 1) errs.credits = 'Credits must be at least 1'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    setErrors({})
    onSave({
      ...form,
      credits: Number(form.credits),
      lectureHours: Number(form.lectureHours),
      labHours: Number(form.labHours),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-4 bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Subject Information</h3>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Subject Name <span className="text-rose-500">*</span></label>
            <Input value={form.name} onChange={(e) => set('name', e.target.value)}
              placeholder="e.g. Data Structures in C++"
              className={`h-9 text-xs ${errors.name ? 'border-rose-400 focus:ring-rose-300' : ''}`} />
            {errors.name && <p className="text-rose-600 text-[11px] mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Subject Code <span className="text-rose-500">*</span></label>
              <Input value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())}
                placeholder="e.g. CS201-T"
                className={`h-9 text-xs uppercase font-mono ${errors.code ? 'border-rose-400' : ''}`} />
              {errors.code && <p className="text-rose-600 text-[11px] mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Subject Type <span className="text-rose-500">*</span></label>
              <select value={form.type} onChange={(e) => set('type', e.target.value)}
                className={`w-full h-9 px-3 rounded-lg border text-xs font-medium ${errors.type ? 'border-rose-400' : 'border-slate-200'} bg-white`}>
                {SUBJECT_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
              {errors.type && <p className="text-rose-600 text-[11px] mt-1">{errors.type}</p>}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
              placeholder="Brief description of course objectives, topics covered..."
              rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400" />
          </div>

          {/* Department & Course */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Department <span className="text-rose-500">*</span></label>
              <select value={form.departmentId} onChange={(e) => { set('departmentId', e.target.value); set('courseId', '') }}
                className={`w-full h-9 px-3 rounded-lg border text-xs font-medium bg-white ${errors.departmentId ? 'border-rose-400' : 'border-slate-200'}`}>
                <option value="">Select department</option>
                {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
              {errors.departmentId && <p className="text-rose-600 text-[11px] mt-1">{errors.departmentId}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Parent Course</label>
              <select value={form.courseId} onChange={(e) => set('courseId', e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium bg-white"
                disabled={!form.departmentId}>
                <option value="">Select course (optional)</option>
                {filteredCourses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Credits & Hours Sidebar */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Credits & Contact Hours</h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Credits <span className="text-rose-500">*</span></label>
              <Input type="number" min="1" max="10" value={form.credits}
                onChange={(e) => set('credits', e.target.value)}
                className={`h-9 text-xs ${errors.credits ? 'border-rose-400' : ''}`} />
              {errors.credits && <p className="text-rose-600 text-[11px] mt-1">{errors.credits}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Lecture Hours / Week</label>
              <Input type="number" min="0" max="10" value={form.lectureHours}
                onChange={(e) => set('lectureHours', e.target.value)}
                className="h-9 text-xs" />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Lab Hours / Week</label>
              <Input type="number" min="0" max="10" value={form.labHours}
                onChange={(e) => set('labHours', e.target.value)}
                className="h-9 text-xs" />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">Status</h3>
            <select value={form.status} onChange={(e) => set('status', e.target.value)}
              className="w-full h-9 px-3 rounded-lg border border-slate-200 text-xs font-medium bg-white">
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white h-10 text-sm font-semibold">
            {loading ? 'Saving...' : mode === 'create' ? 'Create Subject' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  )
}
