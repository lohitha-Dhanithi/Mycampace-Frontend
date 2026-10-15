// src/modules/admissions/components/ApplicationForm.jsx
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { ApplicationStepper } from './ApplicationStepper'
import { academicService } from '@/services/academicService'
import { institutionService } from '@/services/institutionService'
import { masterDataService } from '@/modules/masterData/services/masterDataService'
import { useTenantContext } from '@/store/TenantContext'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Save, Send, Upload } from 'lucide-react'

export function ApplicationForm({ initialData = null, onSaveDraft, onSubmitApplication }) {
  const navigate = useNavigate()
  const { selectedCampus, selectedAcademicYear } = useTenantContext()

  const [step, setStep] = useState(1)

  // Step configs
  const STEPS = [
    { title: 'Personal' },
    { title: 'Contact' },
    { title: 'Academic' },
    { title: 'Program' },
    { title: 'Guardian' },
    { title: 'Documents' },
    { title: 'Declaration' },
  ]

  // Form State
  const [formData, setFormData] = useState({
    personal: {
      firstName: initialData?.personal?.firstName || '',
      lastName: initialData?.personal?.lastName || '',
      dob: initialData?.personal?.dob || '',
      gender: initialData?.personal?.gender || 'Male',
      nationality: initialData?.personal?.nationality || 'Indian',
      bloodGroup: initialData?.personal?.bloodGroup || 'B Positive',
      category: initialData?.personal?.category || 'General',
    },
    contact: {
      email: initialData?.contact?.email || '',
      mobile: initialData?.contact?.mobile || '',
      alternatePhone: initialData?.contact?.alternatePhone || '',
      address: initialData?.contact?.address || '',
      city: initialData?.contact?.city || 'Hyderabad',
      state: initialData?.contact?.state || 'Telangana',
      country: initialData?.contact?.country || 'India',
      postalCode: initialData?.contact?.postalCode || '',
    },
    previousAcademic: {
      previousInstitution: initialData?.previousAcademic?.previousInstitution || '',
      qualification: initialData?.previousAcademic?.qualification || '',
      passingYear: initialData?.previousAcademic?.passingYear || '2026',
      percentage: initialData?.previousAcademic?.percentage || '',
      relevantSubjects: initialData?.previousAcademic?.relevantSubjects || '',
    },
    academicInterest: {
      academicYearId: initialData?.academicInterest?.academicYearId || selectedAcademicYear?.id || 'ay-2026-27',
      academicYearName: initialData?.academicInterest?.academicYearName || selectedAcademicYear?.name || '2026-2027',
      campusId: initialData?.academicInterest?.campusId || selectedCampus?.id || 'camp-1',
      campusName: initialData?.academicInterest?.campusName || selectedCampus?.name || 'Hyderabad Main Campus',
      programId: initialData?.academicInterest?.programId || 'prog-1',
      programName: initialData?.academicInterest?.programName || 'Senior Secondary Education',
      courseId: initialData?.academicInterest?.courseId || 'crs-1',
      courseName: initialData?.academicInterest?.courseName || 'Science Stream (PCM / PCB)',
      classId: initialData?.academicInterest?.classId || 'cls-11',
      className: initialData?.academicInterest?.className || 'Class 11',
    },
    guardian: {
      name: initialData?.guardian?.name || '',
      relationship: initialData?.guardian?.relationship || 'Father',
      mobile: initialData?.guardian?.mobile || '',
      email: initialData?.guardian?.email || '',
      occupation: initialData?.guardian?.occupation || '',
    },
    documents: [
      { type: 'Identity Proof (Aadhaar / Passport)', uploaded: true, fileName: 'Identity_Proof_Doc.pdf' },
      { type: 'Previous Year Grade Sheet', uploaded: true, fileName: 'Class10_ReportCard.pdf' },
      { type: 'Transfer Certificate (TC)', uploaded: false, fileName: '' },
      { type: 'Passport Size Photograph', uploaded: true, fileName: 'Photo.jpg' },
    ],
    declaration: {
      confirmed: initialData?.declaration?.confirmed || false,
      applicantSignature: initialData?.declaration?.applicantSignature || '',
    },
  })

  // Select options from Academic config and Master Data
  const [academicYears, setAcademicYears] = useState([])
  const [campuses, setCampuses] = useState([])
  const [programs, setPrograms] = useState([])
  const [courses, setCourses] = useState([])
  const [classes, setClasses] = useState([])

  useEffect(() => {
    const loadAcademicOptions = async () => {
      const [ays, camps, progs, crss, clss] = await Promise.all([
        academicService.getAcademicYears(),
        institutionService.getCampuses(),
        academicService.getPrograms(),
        academicService.getCourses(),
        academicService.getClasses(),
      ])
      setAcademicYears(ays)
      setCampuses(camps)
      setPrograms(progs)
      setCourses(crss)
      setClasses(clss)
    }
    loadAcademicOptions()
  }, [])

  const handleNext = () => setStep((s) => Math.min(STEPS.length, s + 1))
  const handlePrev = () => setStep((s) => Math.max(1, s - 1))

  const handleSaveDraft = () => {
    if (onSaveDraft) {
      onSaveDraft(formData)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.declaration.confirmed) {
      alert('Please check the declaration box before submitting.')
      return
    }
    if (onSubmitApplication) {
      onSubmitApplication(formData)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate('/app/admissions/applications')}
          className="gap-1.5 text-xs self-start"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Applications
        </Button>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            className="gap-1.5 text-xs"
          >
            <Save className="h-3.5 w-3.5" /> Save Draft
          </Button>
          {step === STEPS.length && (
            <Button
              type="button"
              onClick={handleSubmit}
              size="sm"
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <Send className="h-3.5 w-3.5" /> Submit Application
            </Button>
          )}
        </div>
      </div>

      {/* Stepper Navigation */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-4">
          <ApplicationStepper
            steps={STEPS}
            currentStep={step}
            onStepClick={(num) => setStep(num)}
          />
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            Step {step}: {STEPS[step - 1].title} Details
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          {/* STEP 1: Personal Information */}
          {step === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">First Name *</label>
                <Input
                  required
                  value={formData.personal.firstName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, firstName: e.target.value },
                    })
                  }
                  placeholder="e.g. Aarav"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Last Name *</label>
                <Input
                  required
                  value={formData.personal.lastName}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, lastName: e.target.value },
                    })
                  }
                  placeholder="e.g. Patel"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Date of Birth *</label>
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
                <label className="text-xs font-semibold text-slate-700">Gender *</label>
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
                <label className="text-xs font-semibold text-slate-700">Nationality</label>
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
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Blood Group</label>
                <Select
                  value={formData.personal.bloodGroup}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personal: { ...formData.personal, bloodGroup: e.target.value },
                    })
                  }
                >
                  <option value="A Positive">A Positive (A+)</option>
                  <option value="A Negative">A Negative (A-)</option>
                  <option value="B Positive">B Positive (B+)</option>
                  <option value="B Negative">B Negative (B-)</option>
                  <option value="O Positive">O Positive (O+)</option>
                  <option value="O Negative">O Negative (O-)</option>
                  <option value="AB Positive">AB Positive (AB+)</option>
                  <option value="AB Negative">AB Negative (AB-)</option>
                </Select>
              </div>
            </div>
          )}

          {/* STEP 2: Contact Information */}
          {step === 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Email Address *</label>
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
                <label className="text-xs font-semibold text-slate-700">Mobile Phone *</label>
                <Input
                  type="tel"
                  required
                  value={formData.contact.mobile}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, mobile: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Alternate Phone</label>
                <Input
                  type="tel"
                  value={formData.contact.alternatePhone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, alternatePhone: e.target.value },
                    })
                  }
                />
              </div>
              <div className="sm:col-span-3 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Residential Address *</label>
                <Input
                  required
                  value={formData.contact.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, address: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">City *</label>
                <Input
                  required
                  value={formData.contact.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, city: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">State *</label>
                <Input
                  required
                  value={formData.contact.state}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, state: e.target.value },
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Postal / Pin Code</label>
                <Input
                  value={formData.contact.postalCode}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, postalCode: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 3: Academic Information */}
          {step === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Previous School / Institution *</label>
                <Input
                  required
                  placeholder="e.g. Delhi Public School, Hyderabad"
                  value={formData.previousAcademic.previousInstitution}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      previousAcademic: {
                        ...formData.previousAcademic,
                        previousInstitution: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Qualification / Board *</label>
                <Input
                  required
                  placeholder="e.g. Class 10 CBSE Board / ICSE / IGCSE"
                  value={formData.previousAcademic.qualification}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      previousAcademic: {
                        ...formData.previousAcademic,
                        qualification: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Year of Passing *</label>
                <Input
                  required
                  value={formData.previousAcademic.passingYear}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      previousAcademic: {
                        ...formData.previousAcademic,
                        passingYear: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Percentage / CGPA / Grade</label>
                <Input
                  placeholder="e.g. 94.6%"
                  value={formData.previousAcademic.percentage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      previousAcademic: {
                        ...formData.previousAcademic,
                        percentage: e.target.value,
                      },
                    })
                  }
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-slate-700">Relevant Subjects Studied</label>
                <Input
                  placeholder="e.g. Mathematics, Science, English, Computer Science"
                  value={formData.previousAcademic.relevantSubjects}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      previousAcademic: {
                        ...formData.previousAcademic,
                        relevantSubjects: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 4: Program Selection (Loaded from Academic Configuration) */}
          {step === 4 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Academic Year *</label>
                <Select
                  value={formData.academicInterest.academicYearId}
                  onChange={(e) => {
                    const ay = academicYears.find((y) => y.id === e.target.value)
                    setFormData({
                      ...formData,
                      academicInterest: {
                        ...formData.academicInterest,
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
                <label className="text-xs font-semibold text-slate-700">Campus *</label>
                <Select
                  value={formData.academicInterest.campusId}
                  onChange={(e) => {
                    const cmp = campuses.find((c) => c.id === e.target.value)
                    setFormData({
                      ...formData,
                      academicInterest: {
                        ...formData.academicInterest,
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
                <label className="text-xs font-semibold text-slate-700">Academic Program *</label>
                <Select
                  value={formData.academicInterest.programId}
                  onChange={(e) => {
                    const prog = programs.find((p) => p.id === e.target.value)
                    const filteredCourses = courses.filter((c) => c.programId === e.target.value)
                    setFormData({
                      ...formData,
                      academicInterest: {
                        ...formData.academicInterest,
                        programId: e.target.value,
                        programName: prog?.name || '',
                        courseId: filteredCourses[0]?.id || '',
                        courseName: filteredCourses[0]?.name || '',
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
                <label className="text-xs font-semibold text-slate-700">Course / Stream *</label>
                <Select
                  value={formData.academicInterest.courseId}
                  onChange={(e) => {
                    const crs = courses.find((c) => c.id === e.target.value)
                    setFormData({
                      ...formData,
                      academicInterest: {
                        ...formData.academicInterest,
                        courseId: e.target.value,
                        courseName: crs?.name || '',
                      },
                    })
                  }}
                >
                  {courses
                    .filter((c) => !formData.academicInterest.programId || c.programId === formData.academicInterest.programId)
                    .map((crs) => (
                      <option key={crs.id} value={crs.id}>
                        {crs.name}
                      </option>
                    ))}
                </Select>
              </div>
            </div>
          )}

          {/* STEP 5: Parent / Guardian */}
          {step === 5 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Guardian Full Name *</label>
                <Input
                  required
                  value={formData.guardian.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guardian: { ...formData.guardian, name: e.target.value },
                    })
                  }
                  placeholder="e.g. Rajesh Patel"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Relationship *</label>
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
                  <option value="Other">Other</option>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Guardian Mobile *</label>
                <Input
                  type="tel"
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
                <label className="text-xs font-semibold text-slate-700">Guardian Email</label>
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
                <label className="text-xs font-semibold text-slate-700">Occupation / Organization</label>
                <Input
                  placeholder="e.g. Managing Director, Patel Agro Tech"
                  value={formData.guardian.occupation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      guardian: { ...formData.guardian, occupation: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          )}

          {/* STEP 6: Documents */}
          {step === 6 && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Please attach or verify required admission files. Simulated uploads are enabled.
              </p>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg overflow-hidden bg-white">
                {formData.documents.map((doc, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-semibold text-slate-800">{doc.type}</div>
                      {doc.uploaded ? (
                        <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
                          ✓ File uploaded: {doc.fileName}
                        </div>
                      ) : (
                        <div className="text-[11px] text-amber-600 italic mt-0.5">
                          Pending file attachment
                        </div>
                      )}
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const updated = [...formData.documents]
                        updated[idx].uploaded = true
                        updated[idx].fileName = `${doc.type.split(' ')[0]}_upload.pdf`
                        setFormData({ ...formData, documents: updated })
                      }}
                      className="text-xs h-7 gap-1"
                    >
                      <Upload className="h-3 w-3" /> {doc.uploaded ? 'Replace' : 'Upload'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 7: Declaration */}
          {step === 7 && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                <h4 className="font-bold text-slate-900">Applicant / Parent Undertaking</h4>
                <p>
                  I hereby declare that all information provided in this admission application form is true, correct, and complete to the best of my knowledge. I understand that any false declaration or submission of invalid credentials will result in immediate disqualification or forfeiture of admission.
                </p>
                <p>
                  I agree to abide by the rules, code of conduct, and disciplinary policies of MyCampace Education and the affiliated campus institution.
                </p>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="declCheck"
                  checked={formData.declaration.confirmed}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      declaration: { ...formData.declaration, confirmed: !!checked },
                    })
                  }
                />
                <label
                  htmlFor="declCheck"
                  className="text-xs font-semibold text-slate-800 cursor-pointer"
                >
                  I agree to the declaration terms and confirm submission of this application. *
                </label>
              </div>

              <div className="space-y-1 max-w-sm pt-2">
                <label className="text-xs font-semibold text-slate-700">Applicant Digital Signature / Name *</label>
                <Input
                  required
                  placeholder="Type full legal name as digital signature"
                  value={formData.declaration.applicantSignature}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      declaration: {
                        ...formData.declaration,
                        applicantSignature: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stepper Navigation Buttons */}
      <div className="flex items-center justify-between pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handlePrev}
          disabled={step === 1}
          className="text-xs"
        >
          Previous
        </Button>
        {step < STEPS.length ? (
          <Button
            type="button"
            size="sm"
            onClick={handleNext}
            className="gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs"
          >
            Next Step <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            size="sm"
            className="gap-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
          >
            Submit Final Application <Send className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  )
}
