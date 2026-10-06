// src/modules/academics/components/SubjectAssignmentForm.jsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'

export function SubjectAssignmentForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    subjectId: initialData?.subjectId || 'sub-phy',
    subjectName: initialData?.subjectName || 'Physics (042)',
    subjectCode: initialData?.subjectCode || 'PHY-042',
    classId: initialData?.classId || 'cls-11',
    className: initialData?.className || 'Class 11',
    sectionId: initialData?.sectionId || 'sec-11A',
    sectionName: initialData?.sectionName || 'Section A (PCM)',
    facultyId: initialData?.facultyId || 'usr-5',
    facultyName: initialData?.facultyName || 'Pooja Iyer',
    credits: initialData?.credits || 4,
    weeklyHours: initialData?.weeklyHours || 6,
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1">Select Subject *</label>
        <Select
          value={formData.subjectId}
          onChange={(e) => {
            const map = {
              'sub-phy': { name: 'Physics (042)', code: 'PHY-042' },
              'sub-chem': { name: 'Chemistry (043)', code: 'CHE-043' },
              'sub-math': { name: 'Mathematics (041)', code: 'MAT-041' },
              'sub-bio': { name: 'Biology (044)', code: 'BIO-044' },
              'sub-eng': { name: 'English Core (301)', code: 'ENG-301' },
              'sub-cs': { name: 'Computer Science (083)', code: 'CSC-083' },
            }
            const info = map[e.target.value] || { name: 'Subject', code: 'SUB' }
            setFormData((prev) => ({
              ...prev,
              subjectId: e.target.value,
              subjectName: info.name,
              subjectCode: info.code,
            }))
          }}
          required
        >
          <option value="sub-phy">Physics (042)</option>
          <option value="sub-chem">Chemistry (043)</option>
          <option value="sub-math">Mathematics (041)</option>
          <option value="sub-bio">Biology (044)</option>
          <option value="sub-eng">English Core (301)</option>
          <option value="sub-cs">Computer Science (083)</option>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Target Class *</label>
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
          <label className="text-xs font-semibold text-slate-700 block mb-1">Target Section *</label>
          <Select
            value={formData.sectionId}
            onChange={(e) => {
              const secMap = { 'sec-11A': 'Section A (PCM)', 'sec-11B': 'Section B (PCB)', 'sec-12A': 'Section A (PCM)' }
              setFormData((prev) => ({ ...prev, sectionId: e.target.value, sectionName: secMap[e.target.value] || 'Section A' }))
            }}
          >
            <option value="sec-11A">Section A (PCM)</option>
            <option value="sec-11B">Section B (PCB)</option>
            <option value="sec-12A">Section A (PCM)</option>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-slate-700 block mb-1">Assigned Faculty Educator</label>
        <Select
          value={formData.facultyId}
          onChange={(e) => {
            const facMap = {
              'usr-5': 'Pooja Iyer',
              'usr-fac-2': 'Dr. Suresh Kumar',
              'usr-fac-3': 'Arvind Swamy',
              'usr-fac-4': 'Kavita Chawla',
              '': 'Unassigned',
            }
            setFormData((prev) => ({ ...prev, facultyId: e.target.value, facultyName: facMap[e.target.value] || 'Educator' }))
          }}
        >
          <option value="usr-5">Pooja Iyer (Physics)</option>
          <option value="usr-fac-2">Dr. Suresh Kumar (Physics)</option>
          <option value="usr-fac-3">Arvind Swamy (Mathematics)</option>
          <option value="usr-fac-4">Kavita Chawla (Chemistry)</option>
          <option value="">Leave Unassigned</option>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Weekly Instructional Hours</label>
          <Input
            type="number"
            value={formData.weeklyHours}
            onChange={(e) => handleChange('weeklyHours', Number(e.target.value))}
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Credits</label>
          <Input
            type="number"
            value={formData.credits}
            onChange={(e) => handleChange('credits', Number(e.target.value))}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Save Assignment
        </Button>
      </div>
    </form>
  )
}
