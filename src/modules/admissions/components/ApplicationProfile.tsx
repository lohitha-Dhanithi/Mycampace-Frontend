// src/modules/admissions/components/ApplicationProfile.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CommunicationTimeline } from './CommunicationTimeline'
import { DocumentTable } from './DocumentTable'
import {
  calculateApplicationCompletion,
} from '../services/applicationService'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  GraduationCap,
  FileCheck,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  Building2,
  BookOpen,
  Calendar,
  AlertCircle,
  FileText,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ApplicationProfile({
  application,
  documents = [],
  onConfirmAdmission,
  onEnrollToStudent,
  onSendMessage,
  onVerifyDoc,
  onRejectDoc,
}) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')

  // Admission confirmation dialog
  const [admissionDialogOpen, setAdmissionDialogOpen] = useState(false)
  const [admissionForm, setAdmissionForm] = useState({
    admissionNumber: `ADM-2026-${Math.floor(100 + Math.random() * 900)}`,
    rollNumber: `11-PCM-${Math.floor(10 + Math.random() * 90)}`,
    section: 'Section A (PCM)',
    admissionDate: new Date().toISOString().split('T')[0],
    admissionNotes: 'Direct admission approved by the Academic Admissions Board.',
  })

  // Enrolment dialog (converts to Student SIS record)
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false)

  if (!application) return null

  const { percentage, sections } = calculateApplicationCompletion(application)

  const handleAdmissionConfirmSubmit = (e) => {
    e.preventDefault()
    if (onConfirmAdmission) {
      onConfirmAdmission(application.id, admissionForm)
    }
    setAdmissionDialogOpen(false)
  }

  const handleEnrollConfirm = () => {
    if (onEnrollToStudent) {
      onEnrollToStudent(application.id)
    }
    setEnrollDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admissions/applications')}
          className="gap-1.5 text-xs self-start"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Applications
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          {['Submitted', 'Under Review', 'Documents Required'].includes(application.status) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admissions/applications/${application.id}/review`)}
              className="gap-1 text-xs text-amber-700 border-amber-200 hover:bg-amber-50"
            >
              <FileCheck className="h-3.5 w-3.5" /> Review Application
            </Button>
          )}

          {application.status === 'Approved' && (
            <Button
              size="sm"
              onClick={() => setAdmissionDialogOpen(true)}
              className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <GraduationCap className="h-3.5 w-3.5" /> Confirm Admission
            </Button>
          )}

          {application.status === 'Admitted' && !application.studentId && (
            <Button
              size="sm"
              onClick={() => setEnrollDialogOpen(true)}
              className="gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Create Student Record (SIS)
            </Button>
          )}

          {application.studentId && (
            <span className="text-xs px-2.5 py-1 rounded bg-teal-50 text-teal-700 border border-teal-200 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-teal-600" /> Student Profile Created (SIS)
            </span>
          )}
        </div>
      </div>

      {/* Header Profile Summary */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 font-black text-xl flex items-center justify-center shrink-0 border-2 border-blue-200">
              {application.applicantName?.slice(0, 2).toUpperCase() || 'AP'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">{application.applicantName}</h2>
                <StatusBadge status={application.status} />
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-4 flex-wrap">
                <span>App #: <strong className="text-slate-800 font-mono">{application.applicationNumber}</strong></span>
                <span>Date: {application.applicationDate}</span>
                <span>Reviewer: {application.assignedReviewerName || 'Committee'}</span>
                <span>Program: {application.academicInterest?.programName}</span>
              </div>
            </div>
          </div>

          {/* Completion Progress Bar */}
          <div className="w-full md:w-56 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-slate-200">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600">Application Progress</span>
              <span className={percentage === 100 ? 'text-emerald-700' : 'text-blue-700'}>
                {percentage}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  percentage === 100 ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 text-center">
              {percentage === 100 ? 'All 6 core sections completed' : 'Sections pending validation'}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="academic">Academic Info</TabsTrigger>
          <TabsTrigger value="program">Program</TabsTrigger>
          <TabsTrigger value="guardian">Parent / Guardian</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="review">Review Evaluation</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
        </TabsList>

        {/* 1. Overview */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-xs font-bold uppercase text-slate-700">Applicant Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Gender</span>
                  <span className="font-semibold text-slate-800">{application.personal?.gender}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{application.personal?.dob}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Blood Group</span>
                  <span className="font-semibold text-slate-800">{application.personal?.bloodGroup}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Nationality</span>
                  <span className="font-semibold text-slate-800">{application.personal?.nationality}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-xs font-bold uppercase text-slate-700">Contact & Address</CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Mobile</span>
                  <span className="font-semibold text-slate-800">{application.contact?.mobile}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Email</span>
                  <span className="font-semibold text-slate-800">{application.contact?.email}</span>
                </div>
                <div className="py-1">
                  <span className="text-slate-500 block mb-0.5">Address</span>
                  <span className="font-semibold text-slate-800 block text-[11px] leading-tight">
                    {application.contact?.address}, {application.contact?.city}, {application.contact?.state} - {application.contact?.postalCode}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-xs font-bold uppercase text-slate-700">Admission Status</CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2 text-xs">
                {application.admissionDetails ? (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Admission #</span>
                      <span className="font-bold text-emerald-700 font-mono">
                        {application.admissionDetails.admissionNumber}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Roll Number</span>
                      <span className="font-semibold text-slate-800 font-mono">
                        {application.admissionDetails.rollNumber}
                      </span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Allocated Section</span>
                      <span className="font-semibold text-slate-800">
                        {application.admissionDetails.allocatedSection}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Admission Date</span>
                      <span className="font-semibold text-slate-800">
                        {application.admissionDetails.admissionDate}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-4 text-center text-slate-400 text-xs">
                    Admission pending committee review and approval.
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. Personal */}
        <TabsContent value="personal" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase text-slate-700">Detailed Personal Record</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400">First Name</span>
                <div className="font-bold text-slate-800 mt-0.5">{application.personal?.firstName}</div>
              </div>
              <div>
                <span className="text-slate-400">Last Name</span>
                <div className="font-bold text-slate-800 mt-0.5">{application.personal?.lastName}</div>
              </div>
              <div>
                <span className="text-slate-400">Date of Birth</span>
                <div className="font-bold text-slate-800 mt-0.5">{application.personal?.dob}</div>
              </div>
              <div>
                <span className="text-slate-400">Gender</span>
                <div className="font-bold text-slate-800 mt-0.5">{application.personal?.gender}</div>
              </div>
              <div>
                <span className="text-slate-400">Nationality</span>
                <div className="font-bold text-slate-800 mt-0.5">{application.personal?.nationality}</div>
              </div>
              <div>
                <span className="text-slate-400">Blood Group</span>
                <div className="font-bold text-slate-800 mt-0.5">{application.personal?.bloodGroup}</div>
              </div>
              <div>
                <span className="text-slate-400">Category</span>
                <div className="font-bold text-slate-800 mt-0.5">{application.personal?.category || 'General'}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Academic Info */}
        <TabsContent value="academic" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase text-slate-700">Prior Academic History</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <span className="text-slate-400">Previous School</span>
                  <div className="font-bold text-slate-800 mt-0.5">{application.previousAcademic?.previousInstitution}</div>
                </div>
                <div>
                  <span className="text-slate-400">Board / Qualification</span>
                  <div className="font-bold text-slate-800 mt-0.5">{application.previousAcademic?.qualification}</div>
                </div>
                <div>
                  <span className="text-slate-400">Year of Passing</span>
                  <div className="font-bold text-slate-800 mt-0.5">{application.previousAcademic?.passingYear}</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <span className="text-slate-400">Percentage / Grade</span>
                  <div className="font-bold text-emerald-700 text-sm mt-0.5">
                    {application.previousAcademic?.percentage}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Subjects Studied</span>
                  <div className="font-semibold text-slate-800 mt-0.5">
                    {application.previousAcademic?.relevantSubjects}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Program */}
        <TabsContent value="program" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase text-slate-700">Target Academic Structure</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 text-[11px]">Academic Year</span>
                <div className="font-bold text-slate-900 mt-0.5">{application.academicInterest?.academicYearName}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 text-[11px]">Campus</span>
                <div className="font-bold text-slate-900 mt-0.5">{application.academicInterest?.campusName}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 text-[11px]">Program</span>
                <div className="font-bold text-slate-900 mt-0.5">{application.academicInterest?.programName}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200">
                <span className="text-slate-400 text-[11px]">Course / Stream</span>
                <div className="font-bold text-slate-900 mt-0.5">{application.academicInterest?.courseName}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Guardian */}
        <TabsContent value="guardian" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase text-slate-700">Parent / Guardian Information</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-slate-400">Guardian Name</span>
                <div className="font-bold text-slate-800 mt-0.5">{application.guardian?.name}</div>
              </div>
              <div>
                <span className="text-slate-400">Relationship</span>
                <div className="font-bold text-slate-800 mt-0.5">{application.guardian?.relationship}</div>
              </div>
              <div>
                <span className="text-slate-400">Phone</span>
                <div className="font-bold text-slate-800 mt-0.5">{application.guardian?.mobile}</div>
              </div>
              <div>
                <span className="text-slate-400">Email</span>
                <div className="font-bold text-slate-800 mt-0.5">{application.guardian?.email}</div>
              </div>
              <div className="sm:col-span-2">
                <span className="text-slate-400">Occupation / Employer</span>
                <div className="font-semibold text-slate-800 mt-0.5">{application.guardian?.occupation}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. Documents */}
        <TabsContent value="documents" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase text-slate-700">Application Documents</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <DocumentTable
                documents={documents}
                onVerify={onVerifyDoc}
                onReject={onRejectDoc}
                allowActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 7. Review */}
        <TabsContent value="review" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase text-slate-700">Admissions Review Findings</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              {application.reviewData ? (
                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                    <span className="text-slate-500 font-medium">Reviewer Remarks:</span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {application.reviewData.reviewerComments}
                    </p>
                  </div>
                  {application.reviewData.conditionalTerms && (
                    <div className="p-3 bg-amber-50 rounded border border-amber-200 text-amber-800 space-y-1">
                      <span className="font-bold">Conditional Terms:</span>
                      <p>{application.reviewData.conditionalTerms}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                    <span>Evaluated by: <strong>{application.reviewData.decisionBy}</strong></span>
                    <span>Date: {application.reviewData.decisionDate}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6 text-slate-400">
                  No review decision has been recorded yet. Click "Review Application" in top bar to evaluate.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 8. Communication */}
        <TabsContent value="communication" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="p-5">
              <CommunicationTimeline
                communications={application.communications || []}
                onSendMessage={onSendMessage}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation of Admission Dialog */}
      <Dialog open={admissionDialogOpen} onOpenChange={setAdmissionDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-800">
              <GraduationCap className="h-5 w-5" /> Confirm Student Admission
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdmissionConfirmSubmit} className="space-y-3 text-xs">
            <p className="text-slate-600">
              Confirm official admission for <strong>{application.applicantName}</strong> into{' '}
              <strong>{application.academicInterest?.programName}</strong>.
            </p>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Admission Number *</label>
              <Input
                required
                value={admissionForm.admissionNumber}
                onChange={(e) =>
                  setAdmissionForm({ ...admissionForm, admissionNumber: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Roll / Student Number *</label>
              <Input
                required
                value={admissionForm.rollNumber}
                onChange={(e) =>
                  setAdmissionForm({ ...admissionForm, rollNumber: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Allocated Section *</label>
              <Input
                required
                value={admissionForm.section}
                onChange={(e) =>
                  setAdmissionForm({ ...admissionForm, section: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Admission Date *</label>
              <Input
                type="date"
                required
                value={admissionForm.admissionDate}
                onChange={(e) =>
                  setAdmissionForm({ ...admissionForm, admissionDate: e.target.value })
                }
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Admission Notes & Terms</label>
              <Textarea
                rows={2}
                value={admissionForm.admissionNotes}
                onChange={(e) =>
                  setAdmissionForm({ ...admissionForm, admissionNotes: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAdmissionDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                Confirm & Issue Admission
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Convert to SIS Student record dialog */}
      <Dialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-blue-700">
              <CheckCircle2 className="h-5 w-5" /> Enrol into Student Information System (SIS)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs text-slate-600">
            <p>
              This action transitions applicant <strong>{application.applicantName}</strong> from{' '}
              <strong>Admitted</strong> to <strong>Enrolled</strong>, automatically generating a student master record in the Student Information System.
            </p>
            <div className="p-3 bg-blue-50 rounded border border-blue-200 space-y-1">
              <div><strong>Admission No:</strong> {application.admissionDetails?.admissionNumber}</div>
              <div><strong>Section:</strong> {application.admissionDetails?.allocatedSection}</div>
              <div><strong>Program:</strong> {application.academicInterest?.programName}</div>
              <div><strong>Campus:</strong> {application.academicInterest?.campusName}</div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setEnrollDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleEnrollConfirm}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              Confirm Enrolment & Create SIS Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
