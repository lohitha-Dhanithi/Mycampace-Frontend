// src/modules/admissions/components/LeadForm.jsx
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { academicService } from '@/services/academicService'
import { institutionService } from '@/services/institutionService'
import { masterDataService } from '@/modules/masterData/services/masterDataService'
import { userService } from '@/services/userService'
import { useTenantContext } from '@/store/TenantContext'
import { useNavigate } from 'react-router-dom'
import { UserPlus, ArrowLeft, Save } from 'lucide-react'

export function LeadForm({ initialData = null, onSubmit, isEditing = false }) {
  const navigate = useNavigate()
  const { selectedCampus, selectedAcademicYear } = useTenantContext()

  // Form states
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    dob: initialData?.dob || '',
    gender: initialData?.gender || 'Male',
    mobile: initialData?.phone || '',
    email: initialData?.email || '',
    alternateContact: initialData?.alternateContact || '',
    campusId: initialData?.campusId || selectedCampus?.id || 'camp-1',
    campusName: initialData?.campusName || selectedCampus?.name || 'Hyderabad Main Campus',
    academicYearId: initialData?.academicYearId || selectedAcademicYear?.id || 'ay-2026-27',
    academicYearName: initialData?.academicYearName || selectedAcademicYear?.name || '2026-2027',
    programId: initialData?.programId || 'prog-1',
    programName: initialData?.programName || '',
    courseId: initialData?.courseId || 'crs-1',
    courseName: initialData?.courseName || '',
    source: initialData?.source || 'Website',
    campaign: initialData?.campaign || 'Admissions 2026 Early Bird',
    counsellorId: initialData?.counsellorId || '',
    counsellorName: initialData?.counsellorName || '',
    priority: initialData?.priority || 'Medium',
    notes: initialData?.notes || '',
  })

  // Dropdown options loaded from existing config
  const [academicYears, setAcademicYears] = useState([])
  const [campuses, setCampuses] = useState([])
  const [programs, setPrograms] = useState([])
  const [courses, setCourses] = useState([])
  const [leadSources, setLeadSources] = useState([])
  const [genders, setGenders] = useState([])
  const [counsellors, setCounsellors] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadConfiguration = async () => {
      try {
        const [ays, camps, progs, crss, sourcesMaster, gendersMaster, staffUsers] = await Promise.all([
          academicService.getAcademicYears(),
          institutionService.getCampuses(),
          academicService.getPrograms(),
          academicService.getCourses(),
          masterDataService.getCategoryData('admissionSource'),
          masterDataService.getCategoryData('gender'),
          userService.getUsers({ status: 'Active' }),
        ])

        setAcademicYears(ays)
        setCampuses(camps)
        setPrograms(progs)
        setCourses(crss)
        setLeadSources(
          sourcesMaster.length > 0
            ? sourcesMaster
            : [
                { name: 'Website' },
                { name: 'Walk-in' },
                { name: 'Phone' },
                { name: 'Email' },
                { name: 'Social Media' },
                { name: 'Referral' },
                { name: 'Advertisement' },
                { name: 'Education Fair' },
                { name: 'Partner' },
              ]
        )
        setGenders(gendersMaster.length > 0 ? gendersMaster : [{ name: 'Male' }, { name: 'Female' }, { name: 'Other' }])
        setCounsellors(staffUsers)

        // Set default program name if empty
        if (!formData.programName && progs.length > 0) {
          const defaultProg = progs.find((p) => p.id === formData.programId) || progs[0]
          const defaultCourse = crss.find((c) => c.programId === defaultProg.id) || crss[0]
          setFormData((prev) => ({
            ...prev,
            programId: defaultProg.id,
            programName: defaultProg.name,
            courseId: defaultCourse?.id || '',
            courseName: defaultCourse?.name || '',
            counsellorId: staffUsers[0]?.id || '',
            counsellorName: staffUsers[0]?.name || '',
          }))
        }
      } finally {
        setLoading(false)
      }
    }
    loadConfiguration()
  }, [])

  const handleProgramChange = (progId) => {
    const prog = programs.find((p) => p.id === progId)
    const relatedCourses = courses.filter((c) => c.programId === progId)
    setFormData((prev) => ({
      ...prev,
      programId: progId,
      programName: prog?.name || '',
      courseId: relatedCourses[0]?.id || '',
      courseName: relatedCourses[0]?.name || '',
    }))
  }

  const handleCounsellorChange = (userId) => {
    const counsellor = counsellors.find((c) => c.id === userId)
    setFormData((prev) => ({
      ...prev,
      counsellorId: userId,
      counsellorName: counsellor?.name || '',
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate('/admissions/leads')}
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Leads
        </Button>
        <Button type="submit" size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs">
          <Save className="h-3.5 w-3.5" /> {isEditing ? 'Save Changes' : 'Create Prospective Lead'}
        </Button>
      </div>

      {/* 1. Personal Information */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">1. Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">First Name *</label>
            <Input
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              placeholder="e.g. Aarav"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Last Name *</label>
            <Input
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              placeholder="e.g. Patel"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Date of Birth</label>
            <Input
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Gender</label>
            <Select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              {genders.map((g, i) => (
                <option key={i} value={g.name}>
                  {g.name}
                </option>
              ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 2. Contact Information */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">2. Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Mobile Number *</label>
            <Input
              required
              type="tel"
              value={formData.mobile}
              onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              placeholder="+91 98765 43210"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Email Address *</label>
            <Input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="applicant@example.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Alternate Contact (Parent/Guardian)</label>
            <Input
              type="tel"
              value={formData.alternateContact}
              onChange={(e) => setFormData({ ...formData, alternateContact: e.target.value })}
              placeholder="+91 98765 00000"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Academic Interest (Connected to existing config) */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">
            3. Academic Interest (Configured in Academic System)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Target Academic Year *</label>
            <Select
              value={formData.academicYearId}
              onChange={(e) => {
                const ay = academicYears.find((y) => y.id === e.target.value)
                setFormData({
                  ...formData,
                  academicYearId: e.target.value,
                  academicYearName: ay?.name || ay?.year || '',
                })
              }}
            >
              {academicYears.map((ay) => (
                <option key={ay.id} value={ay.id}>
                  {ay.name || ay.year} {ay.isCurrent ? '(Current)' : ''}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Campus *</label>
            <Select
              value={formData.campusId}
              onChange={(e) => {
                const cmp = campuses.find((c) => c.id === e.target.value)
                setFormData({
                  ...formData,
                  campusId: e.target.value,
                  campusName: cmp?.name || '',
                })
              }}
            >
              {campuses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Program *</label>
            <Select
              value={formData.programId}
              onChange={(e) => handleProgramChange(e.target.value)}
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Course / Stream</label>
            <Select
              value={formData.courseId}
              onChange={(e) => {
                const crs = courses.find((c) => c.id === e.target.value)
                setFormData({
                  ...formData,
                  courseId: e.target.value,
                  courseName: crs?.name || '',
                })
              }}
            >
              {courses
                .filter((c) => !formData.programId || c.programId === formData.programId)
                .map((crs) => (
                  <option key={crs.id} value={crs.id}>
                    {crs.name}
                  </option>
                ))}
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 4. Lead Source & Counsellor Assignment */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">4. Lead Metadata & Routing</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Lead Source *</label>
            <Select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            >
              {leadSources.map((s, i) => (
                <option key={i} value={s.name}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Marketing Campaign</label>
            <Input
              value={formData.campaign}
              onChange={(e) => setFormData({ ...formData, campaign: e.target.value })}
              placeholder="e.g. Open House 2026"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Assigned Counsellor</label>
            <Select
              value={formData.counsellorId}
              onChange={(e) => handleCounsellorChange(e.target.value)}
            >
              {counsellors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.role || 'Staff'})
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Priority Level</label>
            <Select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="High">High (Immediate Hot Follow-up)</option>
              <option value="Medium">Medium (Regular Warm Lead)</option>
              <option value="Low">Low (Passive / Exploratory)</option>
            </Select>
          </div>

          <div className="col-span-1 sm:col-span-2 md:col-span-4 space-y-1">
            <label className="text-xs font-semibold text-slate-700">Counselling / Intake Notes</label>
            <Textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Enter initial conversation highlights, questions asked by parents, or specific transport/boarding requirements..."
            />
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
