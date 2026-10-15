// src/modules/admissions/components/AdmissionOfferPolicyModal.tsx
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
  GraduationCap,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Building,
  Calendar,
  Send,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react'
import { getCourseFeeStructure, applicationService } from '../services/applicationService'

export interface AdmissionOfferPolicyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: any
  onPolicySent?: (app: any) => void
}

export function AdmissionOfferPolicyModal({
  open,
  onOpenChange,
  application,
  onPolicySent,
}: AdmissionOfferPolicyModalProps) {
  const [parentEmail, setParentEmail] = useState('')
  const [parentName, setParentName] = useState('')
  const [parentMobile, setParentMobile] = useState('')
  const [sending, setSending] = useState(false)
  const [successSent, setSuccessSent] = useState(false)

  useEffect(() => {
    if (application) {
      setParentEmail(
        application.guardian?.email ||
          application.contact?.email ||
          'parent@example.com'
      )
      setParentName(application.guardian?.name || 'Parent / Guardian')
      setParentMobile(
        application.guardian?.mobile || application.contact?.mobile || ''
      )
      setSuccessSent(false)
    }
  }, [application, open])

  if (!application) return null

  const courseFee = getCourseFeeStructure(
    application.academicInterest?.courseName || application.academicInterest?.courseId,
    application.academicInterest?.programName
  )

  const handleSendPolicy = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    try {
      const updated = await applicationService.sendAdmissionPolicyToParent(application.id, {
        parentEmail,
        parentName,
        parentMobile,
      })
      setSuccessSent(true)
      if (onPolicySent) {
        onPolicySent(updated)
      }
      setTimeout(() => {
        onOpenChange(false)
        setSuccessSent(false)
      }, 1600)
    } finally {
      setSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <div>Share Admission Policy & Document Undertaking</div>
              <div className="text-[11px] font-normal text-slate-500">
                Send formal admission offer and institutional agreement to parents for review & document submission
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        {successSent ? (
          <div className="p-8 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Admission Policy Shared Successfully!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              The official Admission Policy document and document upload link have been delivered to{' '}
              <strong className="text-slate-800">{parentEmail}</strong>.
            </p>
            <div className="text-[11px] bg-slate-50 border border-slate-200 rounded-lg p-2.5 max-w-sm mx-auto text-slate-600">
              Application status updated to <strong>Policy Shared</strong>. Finance handover will activate once parent uploads documents and admissions approves them.
            </div>
          </div>
        ) : (
          <form onSubmit={handleSendPolicy} className="space-y-4 text-xs">
            {/* Student & Course Summary Banner */}
            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{application.applicantName}</div>
                  <div className="text-[11px] text-slate-500">
                    App No: <span className="font-mono font-bold text-slate-700">{application.applicationNumber}</span> • Campus: {application.academicInterest?.campusName}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Opted Course</span>
                  <span className="font-bold text-blue-700">
                    {application.academicInterest?.courseName || 'Senior Secondary Education'}
                  </span>
                </div>
              </div>

              {/* Course-dependent fee notice */}
              <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-lg flex items-start gap-2.5 text-blue-900">
                <Building className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5 flex-1">
                  <div className="font-bold text-[11px] flex items-center justify-between">
                    <span>Course Fee Schedule: {courseFee.feeStructureName}</span>
                    <span className="font-mono text-xs font-black">₹{courseFee.totalFees.toLocaleString('en-IN')} / yr</span>
                  </div>
                  <p className="text-[10px] text-blue-700 leading-relaxed">
                    Upon Admissions approval of all parent-uploaded credentials, the candidate will be dispatched to Finance Management under this exact schedule (Admission Deposit: ₹{courseFee.admissionFee.toLocaleString('en-IN')}, Tuition: ₹{courseFee.tuitionFee.toLocaleString('en-IN')}).
                  </p>
                </div>
              </div>
            </div>

            {/* Recipient Parent Contact Form */}
            <div className="space-y-2.5 border border-slate-200 rounded-xl p-3.5 bg-white">
              <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <Mail className="h-3.5 w-3.5 text-indigo-600" /> Parent / Guardian Delivery Details
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Parent / Guardian Name *</label>
                  <Input
                    required
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="h-8 text-xs"
                    placeholder="e.g. Sunil Deshmukh"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-700">Parent Email (Recipient) *</label>
                  <Input
                    type="email"
                    required
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    className="h-8 text-xs font-mono"
                    placeholder="parent@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-700">Parent Contact Mobile</label>
                <Input
                  value={parentMobile}
                  onChange={(e) => setParentMobile(e.target.value)}
                  className="h-8 text-xs font-mono"
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>

            {/* Institutional Admission Policy Preview */}
            <div className="space-y-2 border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
              <div className="font-bold text-slate-800 flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-600" />
                  Admission Policy & Code of Conduct Clauses
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Doc: POL-2026-ADM</span>
              </div>

              <div className="max-h-36 overflow-y-auto space-y-2 p-2.5 bg-white border border-slate-200 rounded-lg text-[11px] text-slate-600 leading-relaxed font-sans">
                <div>
                  <strong className="text-slate-900 block">1. Academic Regularity & Mandatory Attendance:</strong>
                  The student must maintain an aggregate physical attendance of at least 75% across all scheduled theory lectures and practical laboratories.
                </div>
                <div>
                  <strong className="text-slate-900 block">2. Course-Specific Fee Undertaking:</strong>
                  The parent/guardian undertakes to remit the scheduled fees corresponding to the selected course (<strong>{courseFee.courseCategory}</strong>) as per the institutional term schedule. Admission deposits are non-refundable once enrollment commences.
                </div>
                <div>
                  <strong className="text-slate-900 block">3. Mandatory Document Submission:</strong>
                  All required identity documents, prior marksheets, and transfer certificates must be uploaded by the parent and approved by the Admissions Committee before the student profile is handed over to Finance.
                </div>
                <div>
                  <strong className="text-slate-900 block">4. Institutional Discipline & Campus Safety:</strong>
                  The student and parent agree to adhere strictly to the institution’s Code of Discipline, Anti-Ragging regulations, and digital device usage policies.
                </div>
              </div>
            </div>

            {/* Required Verification Documents Checklist */}
            <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-white">
              <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                Required Documents Checklist Requested from Parent:
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Official Birth Certificate
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> 10th / Prior Board Marksheet
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Transfer Certificate (TC) & Migration
                </li>
                <li className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" /> Student & Parent Aadhaar / ID Proof
                </li>
              </ul>
            </div>

            {/* Compliance Alert Box */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-amber-900 text-xs">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-[11px]">
                <strong className="block font-semibold">Institutional Workflow Rule:</strong>
                <span>
                  Sending this policy will notify the parent. The candidate will remain in Admissions until the parent uploads documents and the Admissions Committee verifies 100% of the credentials. Only upon full approval will the candidate be dispatched to Finance Management.
                </span>
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
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={sending || !parentEmail}
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs gap-1.5 font-semibold"
              >
                {sending ? (
                  'Sharing to Parent Email...'
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" /> Share Admission Policy to Parent Email
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
