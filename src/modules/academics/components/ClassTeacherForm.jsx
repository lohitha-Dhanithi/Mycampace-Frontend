// src/modules/academics/components/ClassTeacherForm.jsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

export function ClassTeacherForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    academicYearId: initialData?.academicYearId || 'ay-2026-27',
    academicYearName: initialData?.academicYearName || '2026-2027',
    campusId: initialData?.campusId || 'camp-1',
    campusName: initialData?.campusName || 'Hyderabad Main Campus',
    classId: initialData?.classId || 'cls-11',
    className: initialData?.className || 'Class 11',
    sectionId: initialData?.sectionId || 'sec-11A',
    sectionName: initialData?.sectionName || 'Section A (PCM)',
    facultyId: initialData?.facultyId || 'usr-5',
    facultyName: initialData?.facultyName || 'Pooja Iyer',
    facultyEmail: initialData?.facultyEmail || 'pooja.iyer@abcschool.edu.in',
    effectiveDate: initialData?.effectiveDate || new Date().toISOString().split('T')[0],
    notes: initialData?.notes || 'Designated primary class teacher and homeroom advisor.',
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFacultyChange = (e) => {
    const map = {
      'usr-5': { name: 'Pooja Iyer', email: 'pooja.iyer@abcschool.edu.in' },
      'usr-fac-2': { name: 'Dr. Suresh Kumar', email: 'suresh.k@abcschool.edu.in' },
      'usr-fac-3': { name: 'Arvind Swamy', email: 'arvind.s@abcschool.edu.in' },
      'usr-fac-4': { name: 'Kavita Chawla', email: 'kavita.c@abcschool.edu.in' },
      'usr-fac-5': { name: 'Manoj Pillai', email: 'manoj.p@abcschool.edu.in' },
    }
    const f = map[e.target.value] || { name: 'Educator', email: '' }
    setFormData((prev) => ({
      ...prev,
      facultyId: e.target.value,
      facultyName: f.name,
      facultyEmail: f.email,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Academic Year</label>
          <Select
            value={formData.academicYearId}
            onChange={(e) => handleChange('academicYearId', e.target.value)}
          >
            <option value="ay-2026-27">2026–2027</option>
            <option value="ay-2027-28">2027–2028</option>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Campus</label>
          <Select
            value={formData.campusId}
            onChange={(e) => handleChange('campusId', e.target.value)}
          >
            <option value="camp-1">Hyderabad Main Campus</option>
            <option value="camp-2">Bangalore Campus</option>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Class *</label>
          <Select
            value={formData.classId}
            onChange={(e) => {
              const nameMap = { 'cls-12': 'Class 12', 'cls-11': 'Class 11', 'cls-10': 'Class 10' }
              setFormData((prev) => ({ ...prev, classId: e.target.value, className: nameMap[e.target.value] || 'Class' }))
            }}
          >
            <option value="cls-12">Class 12</option>
            <option value="cls-11">Class 11</option>
            <option value="cls-10">Class 10</option>
          </Select>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Section *</label>
          <Select
            value={formData.sectionId}
            onChange={(e) => {
              const secMap = { 'sec-11A': 'Section A (PCM)', 'sec-11B': 'Section B (PCB)', 'sec-12A': 'Section A (PCM)', 'sec-12B': 'Section B (PCB)' }
              setFormData((prev) => ({ ...prev, sectionId: e.target.value, sectionName: secMap[e.target.value] || 'Section A' }))
            }}
          >
            <option value="sec-11A">Section A (PCM)</option>
            <option value="sec-11B">Section B (PCB)</option>
            <option value="sec-12A">Section A (PCM)</option>
            <option value="sec-12B">Section B (PCB)</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1">Designated Faculty *</label>
        <Select
          value={formData.facultyId}
          onChange={handleFacultyChange}
          required
        >
          <option value="usr-5">Pooja Iyer (Senior Science Dept)</option>
          <option value="usr-fac-2">Dr. Suresh Kumar (Physics & Applied Sciences)</option>
          <option value="usr-fac-3">Arvind Swamy (Mathematics)</option>
          <option value="usr-fac-4">Kavita Chawla (Chemistry)</option>
          <option value="usr-fac-5">Manoj Pillai (Life Sciences)</option>
        </Select>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1">Effective Commencement Date *</label>
        <Input
          type="date"
          value={formData.effectiveDate}
          onChange={(e) => handleChange('effectiveDate', e.target.value)}
          required
        />
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1">Assignment Remarks</label>
        <Input
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Class mentor notes..."
        />
      </div>

      <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px]">
        <strong>Rule Enforcement:</strong> Assigning a new class teacher will automatically relieve any previous active teacher for this section.
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Confirm Class Teacher
        </Button>
      </div>
    </form>
  )
}
