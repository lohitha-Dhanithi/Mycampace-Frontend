// src/modules/academics/components/FacultyAssignmentForm.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { UserCheck, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { ASSIGNMENT_TYPES } from '../config/facultyAssignmentConfig'

export function FacultyAssignmentForm({
  facultyList = [],
  programs = [],
  courses = [],
  classes = [],
  sections = [],
  subjects = [],
  onSubmit,
  onCancel,
  submitting = false,
}) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    facultyId: facultyList[0]?.id || 'usr-5',
    facultyName: facultyList[0]?.name || 'Pooja Iyer',
    department: 'Senior Science Dept',
    academicYearId: 'ay-2026-27',
    academicYearName: '2026-2027',
    campusId: 'camp-1',
    campusName: 'Hyderabad Main Campus',
    programId: 'prog-1',
    courseId: 'crs-1',
    classId: 'cls-11',
    className: 'Class 11',
    sectionId: 'sec-11A',
    sectionName: 'Section A (PCM)',
    subjectId: 'sub-phy',
    subjectName: 'Physics (042)',
    assignmentType: 'Primary Teacher',
    startDate: '2026-06-01',
    endDate: '2027-04-30',
    status: 'Active',
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFacultySelect = (facultyId) => {
    const f = facultyList.find((item) => item.id === facultyId)
    setFormData((prev) => ({
      ...prev,
      facultyId,
      facultyName: f?.name || 'Faculty Member',
      department: f?.department || 'Academics',
    }))
  }

  const handleClassSelect = (classId) => {
    const c = classes.find((item) => item.id === classId)
    setFormData((prev) => ({
      ...prev,
      classId,
      className: c?.name || 'Class',
    }))
  }

  const handleSectionSelect = (sectionId) => {
    const s = sections.find((item) => item.id === sectionId)
    setFormData((prev) => ({
      ...prev,
      sectionId,
      sectionName: s?.name || 'Section',
    }))
  }

  const handleSubjectSelect = (subjectId) => {
    const sub = subjects.find((item) => item.id === subjectId)
    setFormData((prev) => ({
      ...prev,
      subjectId,
      subjectName: sub?.name || 'Subject',
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            Create Teaching Faculty Assignment
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Assign educators to curriculum subjects across classes and sections for the academic session.
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Faculty */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
              1. Educator Selection
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Faculty Member *</label>
                <Select
                  value={formData.facultyId}
                  onChange={(e) => handleFacultySelect(e.target.value)}
                  required
                >
                  <option value="usr-5">Pooja Iyer (Senior Science Dept)</option>
                  <option value="usr-fac-2">Dr. Suresh Kumar (Physics & Applied Sciences)</option>
                  <option value="usr-fac-3">Arvind Swamy (Mathematics)</option>
                  <option value="usr-fac-4">Kavita Chawla (Chemistry)</option>
                  <option value="usr-fac-5">Manoj Pillai (Life Sciences)</option>
                  <option value="usr-1">Vikram Aditya (Computer Science)</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Department</label>
                <Input
                  value={formData.department}
                  onChange={(e) => handleChange('department', e.target.value)}
                  placeholder="Department..."
                  className="bg-slate-50"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Section 2: Academic Context */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
              2. Academic Allocation & Class Target
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Academic Year</label>
                <Select
                  value={formData.academicYearId}
                  onChange={(e) => handleChange('academicYearId', e.target.value)}
                >
                  <option value="ay-2026-27">2026–2027 (Current Term)</option>
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

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Class Cohort *</label>
                <Select
                  value={formData.classId}
                  onChange={(e) => handleClassSelect(e.target.value)}
                >
                  <option value="cls-12">Class 12</option>
                  <option value="cls-11">Class 11</option>
                  <option value="cls-10">Class 10</option>
                  <option value="cls-9">Class 9</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Section *</label>
                <Select
                  value={formData.sectionId}
                  onChange={(e) => handleSectionSelect(e.target.value)}
                >
                  <option value="sec-11A">Section A (PCM / General)</option>
                  <option value="sec-11B">Section B (PCB / Commerce)</option>
                  <option value="sec-12A">Section A (PCM)</option>
                  <option value="sec-12B">Section B (PCB)</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Curriculum Subject *</label>
                <Select
                  value={formData.subjectId}
                  onChange={(e) => handleSubjectSelect(e.target.value)}
                >
                  <option value="sub-phy">Physics (042)</option>
                  <option value="sub-chem">Chemistry (043)</option>
                  <option value="sub-math">Mathematics (041)</option>
                  <option value="sub-bio">Biology (044)</option>
                  <option value="sub-eng">English Core (301)</option>
                  <option value="sub-cs">Computer Science (083)</option>
                </Select>
              </div>
            </div>
          </div>

          {/* Section 3: Teaching Parameters */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
              3. Assignment Mode & Schedule
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Assignment Role *</label>
                <Select
                  value={formData.assignmentType}
                  onChange={(e) => handleChange('assignmentType', e.target.value)}
                >
                  {ASSIGNMENT_TYPES.map((t) => (
                    <option key={t.id} value={t.label}>{t.label}</option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Start Date</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">End Date</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <Button type="button" variant="outline" size="sm" onClick={onCancel || (() => navigate('/academics/faculty-assignments'))}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {submitting ? 'Creating Assignment...' : 'Confirm Faculty Assignment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
