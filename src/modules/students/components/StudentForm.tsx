// src/modules/students/components/StudentForm.jsx
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { academicService } from '@/services/academicService'
import { institutionService } from '@/services/institutionService'
import { masterDataService } from '@/modules/masterData/services/masterDataService'
import { applicationService } from '@/modules/admissions/services/applicationService'
import { useTenantContext } from '@/store/TenantContext'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Sparkles, UserPlus } from 'lucide-react'

export function StudentForm({ initialData = null, onSubmit, isEditing = false }) {
  const navigate = useNavigate()
  const { selectedCampus, selectedAcademicYear } = useTenantContext()

  // Form State
  const [formData, setFormData] = useState({
    personal: {
      firstName: initialData?.personal?.firstName || '',
      middleName: initialData?.personal?.middleName || '',
      lastName: initialData?.personal?.lastName || '',
      preferredName: initialData?.personal?.preferredName || '',
      dob: initialData?.personal?.dob || '',
      gender: initialData?.personal?.gender || 'Male',
      nationality: initialData?.personal?.nationality || 'Indian',
      bloodGroup: initialData?.personal?.bloodGroup || 'B Positive',
      aadhaarNumber: initialData?.personal?.aadhaarNumber || '',
    },
    contact: {
      primaryMobile: initialData?.contact?.primaryMobile || '',
      alternateMobile: initialData?.contact?.alternateMobile || '',
      email: initialData?.contact?.email || '',
      alternateEmail: initialData?.contact?.alternateEmail || '',
    },
    address: {
      addressLine1: initialData?.address?.addressLine1 || '',
      addressLine2: initialData?.address?.addressLine2 || '',
      city: initialData?.address?.city || 'Hyderabad',
      state: initialData?.address?.state || 'Telangana',
      country: initialData?.address?.country || 'India',
      postalCode: initialData?.address?.postalCode || '',
    },
    academicEnrollment: {
      academicYearId: initialData?.academicYearId || selectedAcademicYear?.id || 'ay-2026-27',
      academicYearName: initialData?.academicYearName || selectedAcademicYear?.name || '2026-2027',
      campusId: initialData?.campusId || selectedCampus?.id || 'camp-1',
      campusName: initialData?.campusName || selectedCampus?.name || 'Hyderabad Main Campus',
      programId: initialData?.programId || 'prog-1',
      programName: initialData?.programName || 'Senior Secondary Education',
      courseId: initialData?.courseId || 'crs-1',
      courseName: initialData?.courseName || 'Science Stream (PCM / PCB)',
      classId: initialData?.classId || 'cls-11',
      className: initialData?.className || 'Class 11',
      sectionId: initialData?.sectionId || 'sec-11A',
      sectionName: initialData?.sectionName || 'Section A',
      rollNumber: initialData?.rollNumber || '',
    },
    guardian: {
      name: initialData?.guardian?.name || '',
      relationship: initialData?.guardian?.relationship || 'Father',
      mobile: initialData?.guardian?.mobile || '',
      email: initialData?.guardian?.email || '',
      occupation: initialData?.guardian?.occupation || '',
    },
    admissionDetails: {
      admissionNumber: initialData?.admissionNumber || `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
      admissionDate: initialData?.admissionDate || new Date().toISOString().split('T')[0],
      status: initialData?.status || 'Active',
    },
    applicationId: initialData?.applicationId || null,
  })

  // Dropdown states loaded from configurations
  const [academicYears, setAcademicYears] = useState([])
  const [campuses, setCampuses] = useState([])
  const [programs, setPrograms] = useState([])
  const [courses, setCourses] = useState([])
  const [classes, setClasses] = useState([])
  const [sections, setSections] = useState([])
  const [admittedApplications, setAdmittedApplications] = useState([])

  useEffect(() => {
    const loadDependencies = async () => {
      const [ays, camps, progs, crss, clss, secs, apps] = await Promise.all([
        academicService.getAcademicYears(),
        institutionService.getCampuses(),
        academicService.getPrograms(),
        academicService.getCourses(),
        academicService.getClasses(),
        academicService.getSections(),
        applicationService.getApplications({ status: 'Admitted' }),
      ])
      setAcademicYears(ays)
      setCampuses(camps)
      setPrograms(progs)
      setCourses(crss)
      setClasses(clss)
      setSections(secs)
      setAdmittedApplications(apps)
    }
    loadDependencies()
  }, [])

  // Path A: Pre-populate from an admitted application
  const handleSelectAdmittedApplication = (appId) => {
    if (!appId) return
    const app = admittedApplications.find((a) => a.id === appId)
    if (!app) return

    setFormData((prev) => ({
      ...prev,
      applicationId: app.id,
      personal: {
        firstName: app.personal?.firstName || '',
        middleName: '',
        lastName: app.personal?.lastName || '',
        preferredName: app.personal?.firstName || '',
        dob: app.personal?.dob || '',
        gender: app.personal?.gender || 'Male',
        nationality: app.personal?.nationality || 'Indian',
        bloodGroup: app.personal?.bloodGroup || 'B Positive',
        aadhaarNumber: '',
      },
      contact: {
        primaryMobile: app.contact?.mobile || '',
        alternateMobile: app.contact?.alternatePhone || '',
        email: app.contact?.email || '',
        alternateEmail: '',
      },
      address: {
        addressLine1: app.contact?.address || '',
        addressLine2: '',
        city: app.contact?.city || 'Hyderabad',
        state: app.contact?.state || 'Telangana',
        country: app.contact?.country || 'India',
        postalCode: app.contact?.postalCode || '',
      },
      academicEnrollment: {
        academicYearId: app.academicInterest?.academicYearId || prev.academicEnrollment.academicYearId,
        academicYearName: app.academicInterest?.academicYearName || prev.academicEnrollment.academicYearName,
        campusId: app.academicInterest?.campusId || prev.academicEnrollment.campusId,
        campusName: app.academicInterest?.campusName || prev.academicEnrollment.campusName,
        programId: app.academicInterest?.programId || prev.academicEnrollment.programId,
        programName: app.academicInterest?.programName || prev.academicEnrollment.programName,
        courseId: app.academicInterest?.courseId || prev.academicEnrollment.courseId,
        courseName: app.academicInterest?.courseName || prev.academicEnrollment.courseName,
        classId: app.academicInterest?.classId || 'cls-11',
        className: app.academicInterest?.className || 'Class 11',
        sectionId: app.academicInterest?.sectionId || 'sec-11A',
        sectionName: app.admissionDetails?.allocatedSection || 'Section A',
        rollNumber: app.admissionDetails?.rollNumber || '',
      },
      guardian: {
        name: app.guardian?.name || '',
        relationship: app.guardian?.relationship || 'Father',
        mobile: app.guardian?.mobile || '',
        email: app.guardian?.email || '',
        occupation: app.guardian?.occupation || '',
      },
      admissionDetails: {
        admissionNumber: app.admissionDetails?.admissionNumber || prev.admissionDetails.admissionNumber,
        admissionDate: app.admissionDetails?.admissionDate || prev.admissionDetails.admissionDate,
        status: 'Active',
      },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit({
        ...formData,
        ...formData.academicEnrollment,
        ...formData.admissionDetails,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate('/students')}
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Students
        </Button>
        <Button type="submit" size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs">
          <Save className="h-3.5 w-3.5" /> {isEditing ? 'Save Changes' : 'Create Student Record'}
        </Button>
      </div>

      {/* Path A vs Path B Banner */}
      {!isEditing && (
        <Card className="border-blue-200 bg-blue-50/50 shadow-xs">
          <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="font-bold text-blue-900 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-blue-600" /> Fast Enrolment from Admitted Application
              </div>
              <p className="text-blue-700">
                You can pre-fill this form directly from an approved candidate in the Admissions CRM.
              </p>
            </div>
            <div className="min-w-[240px]">
              <Select
                onChange={(e) => handleSelectAdmittedApplication(e.target.value)}
                className="bg-white border-blue-300"
              >
                <option value="">-- Choose Admitted Applicant --</option>
                {admittedApplications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.applicantName} ({app.applicationNumber})
                  </option>
                ))}
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 1. Identification & Admission Meta */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">1. Student Identification & Status</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Admission Number *</label>
            <Input
              required
              value={formData.admissionDetails.admissionNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  admissionDetails: { ...formData.admissionDetails, admissionNumber: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Admission Date *</label>
            <Input
              type="date"
              required
              value={formData.admissionDetails.admissionDate}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  admissionDetails: { ...formData.admissionDetails, admissionDate: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Lifecycle Status</label>
            <Select
              value={formData.admissionDetails.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  admissionDetails: { ...formData.admissionDetails, status: e.target.value },
                })
              }
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="On Leave">On Leave</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 2. Personal Information */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">2. Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">First Name *</label>
            <Input
              required
              value={formData.personal.firstName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: { ...formData.personal, firstName: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Middle Name</label>
            <Input
              value={formData.personal.middleName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: { ...formData.personal, middleName: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Last Name *</label>
            <Input
              required
              value={formData.personal.lastName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: { ...formData.personal, lastName: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Preferred Name</label>
            <Input
              value={formData.personal.preferredName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: { ...formData.personal, preferredName: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Date of Birth *</label>
            <Input
              type="date"
              required
              value={formData.personal.dob}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: { ...formData.personal, dob: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Gender *</label>
            <Select
              value={formData.personal.gender}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: { ...formData.personal, gender: e.target.value },
                })
              }
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Blood Group</label>
            <Select
              value={formData.personal.bloodGroup}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: { ...formData.personal, bloodGroup: e.target.value },
                })
              }
            >
              <option value="A Positive">A Positive</option>
              <option value="A Negative">A Negative</option>
              <option value="B Positive">B Positive</option>
              <option value="B Negative">B Negative</option>
              <option value="O Positive">O Positive</option>
              <option value="O Negative">O Negative</option>
              <option value="AB Positive">AB Positive</option>
              <option value="AB Negative">AB Negative</option>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Nationality</label>
            <Input
              value={formData.personal.nationality}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  personal: { ...formData.personal, nationality: e.target.value },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Contact & Address */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">3. Contact & Residential Address</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Primary Mobile *</label>
            <Input
              required
              value={formData.contact.primaryMobile}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, primaryMobile: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Alternate Mobile</label>
            <Input
              value={formData.contact.alternateMobile}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, alternateMobile: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Email Address *</label>
            <Input
              type="email"
              required
              value={formData.contact.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Alternate / Institutional Email</label>
            <Input
              value={formData.contact.alternateEmail}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, alternateEmail: e.target.value },
                })
              }
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-slate-700">Address Line 1 *</label>
            <Input
              required
              value={formData.address.addressLine1}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, addressLine1: e.target.value },
                })
              }
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-slate-700">Address Line 2</label>
            <Input
              value={formData.address.addressLine2}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, addressLine2: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">City *</label>
            <Input
              required
              value={formData.address.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, city: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">State *</label>
            <Input
              required
              value={formData.address.state}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, state: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Country</label>
            <Input
              value={formData.address.country}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, country: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Postal / Pincode</label>
            <Input
              value={formData.address.postalCode}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, postalCode: e.target.value },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Academic Enrollment (from Academic Config) */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">4. Academic Structure & Enrolment</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Academic Year *</label>
            <Select
              value={formData.academicEnrollment.academicYearId}
              onChange={(e) => {
                const ay = academicYears.find((y) => y.id === e.target.value)
                setFormData({
                  ...formData,
                  academicEnrollment: {
                    ...formData.academicEnrollment,
                    academicYearId: e.target.value,
                    academicYearName: ay?.name || ay?.year || '',
                  },
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
            <label className="font-semibold text-slate-700">Campus *</label>
            <Select
              value={formData.academicEnrollment.campusId}
              onChange={(e) => {
                const cmp = campuses.find((c) => c.id === e.target.value)
                setFormData({
                  ...formData,
                  academicEnrollment: {
                    ...formData.academicEnrollment,
                    campusId: e.target.value,
                    campusName: cmp?.name || '',
                  },
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
            <label className="font-semibold text-slate-700">Program *</label>
            <Select
              value={formData.academicEnrollment.programId}
              onChange={(e) => {
                const p = programs.find((prog) => prog.id === e.target.value)
                const relatedCourses = courses.filter((c) => c.programId === e.target.value)
                setFormData({
                  ...formData,
                  academicEnrollment: {
                    ...formData.academicEnrollment,
                    programId: e.target.value,
                    programName: p?.name || '',
                    courseId: relatedCourses[0]?.id || '',
                    courseName: relatedCourses[0]?.name || '',
                  },
                })
              }}
            >
              {programs.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Course / Stream</label>
            <Select
              value={formData.academicEnrollment.courseId}
              onChange={(e) => {
                const crs = courses.find((c) => c.id === e.target.value)
                setFormData({
                  ...formData,
                  academicEnrollment: {
                    ...formData.academicEnrollment,
                    courseId: e.target.value,
                    courseName: crs?.name || '',
                  },
                })
              }}
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Class *</label>
            <Select
              value={formData.academicEnrollment.classId}
              onChange={(e) => {
                const cls = classes.find((c) => c.id === e.target.value)
                setFormData({
                  ...formData,
                  academicEnrollment: {
                    ...formData.academicEnrollment,
                    classId: e.target.value,
                    className: cls?.name || '',
                  },
                })
              }}
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Section *</label>
            <Select
              value={formData.academicEnrollment.sectionId}
              onChange={(e) => {
                const sec = sections.find((s) => s.id === e.target.value)
                setFormData({
                  ...formData,
                  academicEnrollment: {
                    ...formData.academicEnrollment,
                    sectionId: e.target.value,
                    sectionName: sec?.name || '',
                  },
                })
              }}
            >
              {sections.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="font-semibold text-slate-700">Roll Number *</label>
            <Input
              required
              placeholder="e.g. 11-PCM-014"
              value={formData.academicEnrollment.rollNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  academicEnrollment: {
                    ...formData.academicEnrollment,
                    rollNumber: e.target.value,
                  },
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* 5. Guardian Information */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">5. Primary Guardian Details</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Guardian Name *</label>
            <Input
              required
              value={formData.guardian.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  guardian: { ...formData.guardian, name: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Relationship *</label>
            <Select
              value={formData.guardian.relationship}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  guardian: { ...formData.guardian, relationship: e.target.value },
                })
              }
            >
              <option value="Father">Father</option>
              <option value="Mother">Mother</option>
              <option value="Legal Guardian">Legal Guardian</option>
            </Select>
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Guardian Mobile *</label>
            <Input
              required
              value={formData.guardian.mobile}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  guardian: { ...formData.guardian, mobile: e.target.value },
                })
              }
            />
          </div>
          <div className="space-y-1">
            <label className="font-semibold text-slate-700">Guardian Email</label>
            <Input
              type="email"
              value={formData.guardian.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  guardian: { ...formData.guardian, email: e.target.value },
                })
              }
            />
          </div>
          <div className="sm:col-span-2 space-y-1">
            <label className="font-semibold text-slate-700">Occupation / Employer</label>
            <Input
              value={formData.guardian.occupation}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  guardian: { ...formData.guardian, occupation: e.target.value },
                })
              }
            />
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
