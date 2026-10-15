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
  getCourseFeeStructure,
  applicationService,
} from '../services/applicationService'
import { AdmissionOfferPolicyModal } from './AdmissionOfferPolicyModal'
import { ParentAdmissionPortalSimulatorModal } from './ParentAdmissionPortalSimulatorModal'
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
  CreditCard,
  Receipt,
  ExternalLink,
  DollarSign,
  ShieldCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CandidateFeeClearanceModal } from './CandidateFeeClearanceModal'

export interface ApplicationProfileProps {
  application: any
  documents?: any[]
  onConfirmAdmission?: (id: any, data: any) => Promise<void> | void
  onEnrollToStudent?: (id: any) => Promise<void> | void
  onSendMessage?: (msg: any) => Promise<void> | void
  onVerifyDoc?: (docId: any) => Promise<void> | void
  onRejectDoc?: (docId: any, reason: any) => Promise<void> | void
  onRecordPayment?: (appId: string, paymentData: any) => Promise<void> | void
}

export function ApplicationProfile({
  application,
  documents = [],
  onConfirmAdmission,
  onEnrollToStudent,
  onSendMessage,
  onVerifyDoc,
  onRejectDoc,
  onRecordPayment,
}: ApplicationProfileProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [feeModalOpen, setFeeModalOpen] = useState(false)

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
  const [offerModalOpen, setOfferModalOpen] = useState(false)
  const [parentPortalModalOpen, setParentPortalModalOpen] = useState(false)

  if (!application) return null

  const { percentage, sections } = calculateApplicationCompletion(application)
  const courseFee = getCourseFeeStructure(
    application.academicInterest?.courseName || application.academicInterest?.courseId,
    application.academicInterest?.programName
  )

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
          onClick={() => navigate('/app/admissions/applications')}
          className="gap-1.5 text-xs self-start"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Applications
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            onClick={() => setFeeModalOpen(true)}
            className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
          >
            <CreditCard className="h-3.5 w-3.5" /> Record Fee Payment
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() =>
              navigate(
                application.studentId
                  ? `/app/finance/student-fees/${application.studentId}`
                  : '/app/finance/student-fees'
              )
            }
            className="gap-1 text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Finance Ledger
          </Button>

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
              onClick={() => setOfferModalOpen(true)}
              className="gap-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              <GraduationCap className="h-3.5 w-3.5" /> Admit / Share Policy Document
            </Button>
          )}

          {application.status === 'Policy Shared' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setParentPortalModalOpen(true)}
              className="gap-1 text-xs text-purple-700 border-purple-200 hover:bg-purple-50 font-semibold"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open Parent Portal (Simulator)
            </Button>
          )}

          {application.status === 'Docs Uploaded' && (
            <Button
              size="sm"
              onClick={() => setActiveTab('documents')}
              className="gap-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <FileCheck className="h-3.5 w-3.5" /> Verify Documents & Handover to Finance
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

                {/* Fee Status Badge */}
                {application.feeDetails && (
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                      application.feeDetails.feeStatus === 'Paid'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : application.feeDetails.feeStatus === 'Partially Paid'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-rose-100 text-rose-800 border border-rose-200'
                    }`}
                  >
                    <CreditCard className="h-3 w-3" />
                    Fee: {application.feeDetails.feeStatus}
                  </span>
                )}

                {/* Doc Verification Badge */}
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  <ShieldCheck className="h-3 w-3" />
                  Docs:{' '}
                  {documents.filter((d) => d.verificationStatus === 'Verified').length} /{' '}
                  {documents.length || 4} Verified
                </span>
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
        <TabsList className="bg-slate-100 p-1 flex-wrap h-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="finance">Fee & Finance</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="academic">Academic Info</TabsTrigger>
          <TabsTrigger value="program">Program</TabsTrigger>
          <TabsTrigger value="guardian">Parent / Guardian</TabsTrigger>
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

          {/* Admission Policy & Document Undertaking Lifecycle Card */}
          <Card className="border-slate-200 shadow-xs bg-white">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  Admission Policy & Parent Document Undertaking Lifecycle
                </CardTitle>
                <p className="text-[11px] text-slate-400">
                  Pre-admission document verification and terms agreement tracking
                </p>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  application.admissionPolicy?.termsAccepted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : application.admissionPolicy?.policySentDate
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {application.admissionPolicy?.termsAccepted
                  ? '✓ Terms & Conditions Signed'
                  : application.admissionPolicy?.policySentDate
                  ? 'Policy Shared (Awaiting Signature)'
                  : 'Policy Not Shared Yet'}
              </span>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Policy Delivery</span>
                  <div className="font-semibold text-slate-800">
                    {application.admissionPolicy?.policySentDate ? (
                      <span className="text-purple-700">Sent on {application.admissionPolicy.policySentDate}</span>
                    ) : (
                      <span className="text-slate-400">Not shared with parent yet</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono truncate">
                    {application.admissionPolicy?.policySentToEmail || application.guardian?.email || application.contact?.email}
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Parent Terms Acceptance</span>
                  <div className="font-semibold text-slate-800">
                    {application.admissionPolicy?.termsAccepted ? (
                      <span className="text-emerald-700">Signed by {application.admissionPolicy.termsAcceptedBy || application.guardian?.name || 'Parent'}</span>
                    ) : (
                      <span className="text-amber-700">Awaiting parent digital signature</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {application.admissionPolicy?.termsAcceptedDate ? `Date: ${application.admissionPolicy.termsAcceptedDate}` : 'Pending submission'}
                  </div>
                </div>

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1 text-blue-900">
                  <span className="text-[10px] uppercase font-bold text-blue-500 block">Course Fee Schedule</span>
                  <div className="font-bold text-xs truncate">
                    {courseFee.feeStructureName}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-blue-700">
                    ₹{courseFee.totalFees.toLocaleString('en-IN')} / year
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-1 gap-2 border-t border-slate-100">
                <div className="text-[11px] text-slate-500">
                  {application.status === 'Admitted' ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Candidate is officially admitted & dispatched to Finance under {courseFee.feeStructureName}.
                    </span>
                  ) : application.admissionPolicy?.termsAccepted ? (
                    <span className="text-indigo-700 font-medium">
                      Terms signed by parent. Inspect and verify all uploaded documents to enable Finance handover.
                    </span>
                  ) : (
                    <span>Share the official policy document to parent email to initiate formal onboarding.</span>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!application.admissionPolicy?.policySentDate && application.status === 'Approved' && (
                    <Button
                      size="sm"
                      onClick={() => setOfferModalOpen(true)}
                      className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1"
                    >
                      <Mail className="h-3 w-3" /> Share Policy to Parent
                    </Button>
                  )}
                  {application.admissionPolicy?.policySentDate && !application.admissionPolicy?.termsAccepted && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setParentPortalModalOpen(true)}
                      className="h-7 text-xs text-purple-700 border-purple-200 hover:bg-purple-50 gap-1"
                    >
                      <ExternalLink className="h-3 w-3" /> Open Parent Portal Simulator
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fee & Finance Management Tab */}
        <TabsContent value="finance" className="mt-4 space-y-4">
          {/* Fee Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Assigned Fee Schedule
                </span>
                <div className="text-sm font-bold text-slate-800 mt-1 truncate">
                  {application.feeDetails?.feeStructureName || 'Standard Institutional Schedule'}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Academic Year: {application.academicInterest?.academicYearName || '2026-2027'}
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardContent className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Net Course Fees
                </span>
                <div className="text-lg font-black text-slate-900 font-mono mt-1">
                  ₹{(application.feeDetails?.netPayable || application.feeDetails?.totalFees || 120000).toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Admission Fee Component: ₹{(application.feeDetails?.admissionFee || 25000).toLocaleString('en-IN')}
                </div>
              </CardContent>
            </Card>

            <Card className="border-emerald-200 shadow-xs bg-emerald-50/40">
              <CardContent className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                  Amount Realized / Paid
                </span>
                <div className="text-lg font-black text-emerald-700 font-mono mt-1">
                  ₹{(application.feeDetails?.paidAmount || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-emerald-600 mt-0.5 font-semibold">
                  Status: {application.feeDetails?.feeStatus || 'Pending'}
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 shadow-xs bg-amber-50/40">
              <CardContent className="p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                  Balance Outstanding
                </span>
                <div className="text-lg font-black text-amber-700 font-mono mt-1">
                  ₹{(application.feeDetails?.outstandingAmount ?? 120000).toLocaleString('en-IN')}
                </div>
                <div className="text-[10px] text-amber-600 mt-0.5">
                  Due: {application.feeDetails?.dueDate || 'On Admission'}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Fee Actions & Institutional Ledger Integration */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <CardTitle className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-emerald-600" />
                  Fee Invoices, Receipts & Transactions
                </CardTitle>
                <p className="text-[11px] text-slate-400">
                  Transactions recorded here are automatically reconciled with the Institutional Finance & Accounts ledger
                </p>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setFeeModalOpen(true)}
                  className="h-8 text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50 gap-1.5"
                >
                  <Receipt className="h-3.5 w-3.5" /> View Finance Clearance
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    navigate(
                      application.studentId
                        ? `/app/finance/student-fees/${application.studentId}`
                        : '/app/finance/student-fees'
                    )
                  }
                  className="h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Manage in Fee Management Module
                </Button>
              </div>
            </CardHeader>

            <CardContent className="pt-4">
              {application.feeDetails?.receiptNumber || application.feeDetails?.invoiceNumber ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                      <tr>
                        <th className="px-3.5 py-2.5">Invoice / Receipt</th>
                        <th className="px-3.5 py-2.5">Payment Mode</th>
                        <th className="px-3.5 py-2.5">Transaction Ref</th>
                        <th className="px-3.5 py-2.5">Date</th>
                        <th className="px-3.5 py-2.5 text-right">Amount Paid</th>
                        <th className="px-3.5 py-2.5 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      <tr className="hover:bg-slate-50">
                        <td className="px-3.5 py-3">
                          <div className="font-mono font-bold text-slate-800">
                            {application.feeDetails?.receiptNumber || 'Receipt Pending'}
                          </div>
                          {application.feeDetails?.invoiceNumber && (
                            <div className="text-[10px] text-slate-400 font-mono">
                              Inv: {application.feeDetails.invoiceNumber}
                            </div>
                          )}
                        </td>
                        <td className="px-3.5 py-3 text-slate-700 font-medium">
                          {application.feeDetails?.paymentMode || 'Net Banking / UPI'}
                        </td>
                        <td className="px-3.5 py-3 font-mono text-[11px] text-slate-500">
                          {application.feeDetails?.transactionRef || 'N/A'}
                        </td>
                        <td className="px-3.5 py-3 text-slate-600">
                          {application.feeDetails?.lastPaymentDate || application.applicationDate}
                        </td>
                        <td className="px-3.5 py-3 text-right font-mono font-bold text-emerald-700">
                          ₹{(application.feeDetails?.paidAmount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-3.5 py-3 text-center">
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            Cleared
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-6 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                  No payment transactions recorded yet for this applicant. Click "Record Payment" to process admission fees.
                </div>
              )}
            </CardContent>
          </Card>
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

      {/* Fee Clearance Dialog */}
      <CandidateFeeClearanceModal
        open={feeModalOpen}
        onOpenChange={setFeeModalOpen}
        application={application}
      />

      {/* Admission Offer Policy Modal */}
      <AdmissionOfferPolicyModal
        open={offerModalOpen}
        onOpenChange={setOfferModalOpen}
        application={application}
        onPolicySent={(updated) => {
          if (onConfirmAdmission) onConfirmAdmission(application.id, updated)
        }}
      />

      {/* Parent Admission Portal Simulator Modal */}
      <ParentAdmissionPortalSimulatorModal
        open={parentPortalModalOpen}
        onOpenChange={setParentPortalModalOpen}
        application={application}
        onSubmissionComplete={() => {
          if (onConfirmAdmission) onConfirmAdmission(application.id, application)
        }}
      />
    </div>
  )
}
