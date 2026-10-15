// src/modules/admissions/components/ParentAdmissionPortalSimulatorModal.tsx
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FileCheck,
  CheckCircle2,
  Upload,
  FileText,
  Building,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  Laptop,
} from 'lucide-react'
import { getCourseFeeStructure, applicationService } from '../services/applicationService'

export interface ParentAdmissionPortalSimulatorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: any
  onSubmissionComplete?: () => void
}

interface UploadItem {
  id: string
  type: string
  code: string
  required: boolean
  fileName: string
  fileSize: string
  uploaded: boolean
}

export function ParentAdmissionPortalSimulatorModal({
  open,
  onOpenChange,
  application,
  onSubmissionComplete,
}: ParentAdmissionPortalSimulatorModalProps) {
  const [parentName, setParentName] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [parentNotes, setParentNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submittedSuccess, setSubmittedSuccess] = useState(false)

  // Document checklist for parent upload
  const [docList, setDocList] = useState<UploadItem[]>([
    {
      id: 'doc-birth',
      type: 'Birth Certificate',
      code: 'BC',
      required: true,
      fileName: 'Birth_Certificate_Attested.pdf',
      fileSize: '1.2 MB',
      uploaded: true,
    },
    {
      id: 'doc-qual',
      type: 'Previous Qualification Marksheet',
      code: 'PR',
      required: true,
      fileName: 'Class_10_Board_Marksheet.pdf',
      fileSize: '2.4 MB',
      uploaded: true,
    },
    {
      id: 'doc-tc',
      type: 'Transfer Certificate & Migration',
      code: 'TC',
      required: true,
      fileName: 'Transfer_Certificate_Signed.pdf',
      fileSize: '950 KB',
      uploaded: true,
    },
    {
      id: 'doc-id',
      type: 'Identity Proof (Aadhaar / Passport)',
      code: 'AAD',
      required: true,
      fileName: 'Student_Parent_Aadhaar_Card.pdf',
      fileSize: '1.5 MB',
      uploaded: true,
    },
    {
      id: 'doc-med',
      type: 'Medical Fitness & Vaccination Record',
      code: 'MED',
      required: false,
      fileName: 'Medical_Fitness_Certificate.pdf',
      fileSize: '820 KB',
      uploaded: true,
    },
  ])

  useEffect(() => {
    if (application) {
      setParentName(
        application.admissionPolicy?.parentName ||
          application.guardian?.name ||
          'Parent / Guardian'
      )
      setTermsAccepted(Boolean(application.admissionPolicy?.termsAccepted))
      setParentNotes(application.admissionPolicy?.parentDeclarationNotes || '')
      setSubmittedSuccess(false)
    }
  }, [application, open])

  if (!application) return null

  const courseFee = getCourseFeeStructure(
    application.academicInterest?.courseName || application.academicInterest?.courseId,
    application.academicInterest?.programName
  )

  const handleToggleDocUpload = (id: string) => {
    setDocList((prev) =>
      prev.map((d) => (d.id === id ? { ...d, uploaded: !d.uploaded } : d))
    )
  }

  const handleUploadAll = () => {
    setDocList((prev) => prev.map((d) => ({ ...d, uploaded: true })))
  }

  const allRequiredUploaded = docList
    .filter((d) => d.required)
    .every((d) => d.uploaded)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!termsAccepted || !allRequiredUploaded) return

    setSubmitting(true)
    try {
      const uploadedDocs = docList.filter((d) => d.uploaded)
      await applicationService.parentSubmitPolicyAndDocuments(application.id, {
        parentName,
        parentSignature: parentName,
        termsAccepted: true,
        parentNotes,
        uploadedDocs,
      })
      setSubmittedSuccess(true)
      if (onSubmissionComplete) {
        onSubmissionComplete()
      }
      setTimeout(() => {
        onOpenChange(false)
        setSubmittedSuccess(false)
      }, 1600)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Laptop className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle className="text-sm font-bold text-slate-900">
                  Parent Onboarding Portal (Email Link View)
                </DialogTitle>
                <div className="text-[11px] text-slate-500">
                  Shared to parent email: <strong className="font-mono text-slate-700">{application.admissionPolicy?.policySentToEmail || application.contact?.email}</strong>
                </div>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
              Interactive Simulation
            </span>
          </div>
        </DialogHeader>

        {submittedSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Policy Signed & Documents Submitted!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Thank you, <strong className="text-slate-800">{parentName}</strong>. Your acceptance of the institutional terms and uploaded credentials have been transmitted directly to the Admissions Review Board.
            </p>
            <div className="text-[11px] bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 max-w-sm mx-auto text-emerald-800 font-semibold">
              Admissions status is now updated to: <strong>Docs Uploaded (Awaiting Admissions Verification)</strong>.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Institution Letterhead Banner */}
            <div className="p-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-xl space-y-1 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-300">
                  Official Admission Onboarding & Undertaking
                </span>
                <span className="text-[10px] bg-indigo-800/60 px-2 py-0.5 rounded text-indigo-200 font-mono">
                  AY 2026-2027
                </span>
              </div>
              <h2 className="text-base font-bold">
                Admission Formalities for {application.applicantName}
              </h2>
              <div className="text-[11px] text-slate-300 flex items-center gap-3 flex-wrap pt-1">
                <span>Application: <strong className="text-white font-mono">{application.applicationNumber}</strong></span>
                <span>Opted Course: <strong className="text-amber-300">{application.academicInterest?.courseName || 'Senior Secondary'}</strong></span>
                <span>Campus: <strong className="text-white">{application.academicInterest?.campusName}</strong></span>
              </div>
            </div>

            {/* Course-Specific Fee Undertaking Notice */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1 text-blue-900">
              <div className="flex items-center justify-between font-bold text-xs">
                <span className="flex items-center gap-1.5">
                  <Building className="h-3.5 w-3.5 text-blue-600" />
                  Course Fee Schedule: {courseFee.feeStructureName}
                </span>
                <span className="font-mono text-sm font-black text-blue-800">
                  ₹{courseFee.totalFees.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-blue-700 leading-relaxed">
                By submitting this form, you acknowledge the scheduled fees applicable to {application.applicantName}’s opted stream. Upon verification and approval of your documents by Admissions, an official invoice will be generated in Finance.
              </p>
            </div>

            {/* Step 1: Admission Policy Document Clauses */}
            <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-white">
              <div className="flex items-center justify-between font-bold text-slate-800 text-xs">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-600" />
                  Step 1: Read Institutional Policy & Terms
                </span>
                <span className="text-[10px] text-emerald-700 font-bold">Mandatory Read</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg max-h-32 overflow-y-auto text-[11px] text-slate-600 space-y-2 leading-relaxed">
                <p>
                  <strong>• Academic & Attendance Compliance:</strong> Student is required to maintain minimum 75% attendance in all classes, labs, and tutorials to be eligible for promotional examinations.
                </p>
                <p>
                  <strong>• Fee Remittance Clause:</strong> Institutional fees must be remitted as per the term dates. Delayed payments after the grace period may incur administrative surcharges.
                </p>
                <p>
                  <strong>• Code of Conduct & Anti-Bullying:</strong> MyCampace maintains a zero-tolerance policy regarding harassment, ragging, and unauthorized possession of electronic devices during examinations.
                </p>
                <p>
                  <strong>• Document Authenticity:</strong> In the event that any submitted marksheet, transfer certificate, or identity credential is found fraudulent, the provisional admission stands summarily revoked.
                </p>
              </div>
            </div>

            {/* Step 2: Upload Required Verification Documents */}
            <div className="space-y-2.5 border border-slate-200 rounded-xl p-3 bg-white">
              <div className="flex items-center justify-between font-bold text-slate-800 text-xs">
                <span className="flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5 text-blue-600" />
                  Step 2: Upload Required Student Credentials
                </span>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={handleUploadAll}
                  className="h-6 text-[10px] text-blue-700 border-blue-200 hover:bg-blue-50 px-2"
                >
                  Attach All Documents
                </Button>
              </div>

              <div className="space-y-2">
                {docList.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 transition-all ${
                      item.uploaded
                        ? 'bg-emerald-50/50 border-emerald-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                        {item.type}
                        {item.required && (
                          <span className="text-[10px] text-rose-600 font-normal">*Required</span>
                        )}
                      </div>
                      {item.uploaded ? (
                        <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-mono">
                          <CheckCircle2 className="h-3 w-3" />
                          {item.fileName} ({item.fileSize})
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-400 italic">No file attached</div>
                      )}
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      variant={item.uploaded ? 'outline' : 'default'}
                      onClick={() => handleToggleDocUpload(item.id)}
                      className={`h-7 text-[11px] px-2.5 ${
                        item.uploaded
                          ? 'border-emerald-300 text-emerald-800 hover:bg-emerald-100/60'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {item.uploaded ? '✓ Attached (Change)' : '+ Attach File'}
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 3: Terms Acceptance & Digital Signature */}
            <div className="space-y-3 border border-slate-200 rounded-xl p-3.5 bg-slate-50/60">
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Step 3: Parent Acceptance & Declaration
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer p-2.5 bg-white border border-slate-200 rounded-lg hover:border-blue-300 transition-colors">
                <input
                  type="checkbox"
                  required
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[11px] text-slate-700 leading-snug">
                  I, the undersigned parent/guardian, hereby confirm that all uploaded documents are true, genuine copies. I have read, understood, and accept all terms of the <strong>Institutional Admission Policy</strong> and undertake to fulfill fee requirements for <strong>{courseFee.courseCategory}</strong>.
                </span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">
                    Parent Digital Signature (Full Name) *
                  </label>
                  <Input
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="h-8 text-xs font-serif font-bold text-slate-900 bg-white"
                    placeholder="Enter parent full name"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Date of Signing</label>
                  <Input
                    disabled
                    value={new Date().toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                    className="h-8 text-xs bg-slate-100 font-mono text-slate-600"
                  />
                </div>
              </div>
            </div>

            {/* Workflow Notice */}
            <div className="p-2.5 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 text-[11px] flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
              <div>
                <strong>Next Step in Admissions Workflow:</strong> Upon clicking submit, these uploaded credentials and signed agreement will immediately reflect in the Admissions section. The Admissions Committee will inspect each credential, and only upon full approval will the student be dispatched to Finance Management.
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-xs"
              >
                Close Simulator
              </Button>
              <Button
                type="submit"
                disabled={submitting || !termsAccepted || !allRequiredUploaded}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 font-bold"
              >
                {submitting ? (
                  'Submitting to Admissions...'
                ) : (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5" /> Submit Signed Policy & Uploaded Documents
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
