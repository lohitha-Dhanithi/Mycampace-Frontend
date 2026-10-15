// src/modules/admissions/components/StudentDocumentVerificationModal.tsx
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
import { Textarea } from '@/components/ui/textarea'
import { StatusBadge } from '@/components/common/StatusBadge'
import { documentService } from '../services/documentService'
import { getCourseFeeStructure, applicationService } from '../services/applicationService'
import { AdmissionOfferPolicyModal } from './AdmissionOfferPolicyModal'
import { ParentAdmissionPortalSimulatorModal } from './ParentAdmissionPortalSimulatorModal'
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Upload,
  AlertCircle,
  FileText,
  Download,
  GraduationCap,
  ExternalLink,
  ShieldCheck,
  Building,
  Mail,
  Lock,
  ArrowRight,
  CreditCard,
  Receipt,
  X,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { PaymentCollectionModal } from '@/modules/finance/components/PaymentCollectionModal'

export interface StudentDocumentVerificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: any
  onVerificationUpdated?: () => void
}

export function StudentDocumentVerificationModal({
  open,
  onOpenChange,
  application,
  onVerificationUpdated,
}: StudentDocumentVerificationModalProps) {
  const navigate = useNavigate()
  const [currentApp, setCurrentApp] = useState<any>(application)
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedDocForReject, setSelectedDocForReject] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [selectedDocForUpload, setSelectedDocForUpload] = useState<any>(null)
  const [simulatedFileName, setSimulatedFileName] = useState('')
  const [toast, setToast] = useState('')
  const [offerPolicyModalOpen, setOfferPolicyModalOpen] = useState(false)
  const [parentPortalModalOpen, setParentPortalModalOpen] = useState(false)
  const [financeHandoverLoading, setFinanceHandoverLoading] = useState(false)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  useEffect(() => {
    setCurrentApp(application)
  }, [application])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleApproveAllAndSendToFinance = async () => {
    const targetApp = currentApp || application
    if (!targetApp?.id) return
    setFinanceHandoverLoading(true)
    try {
      const updated = await applicationService.approveAllDocumentsAndSendToFinance(targetApp.id)
      setCurrentApp(updated)
      showToast('All documents approved! Candidate dispatched to Finance for payment collection.')
      await loadStudentDocs()
      if (onVerificationUpdated) {
        onVerificationUpdated()
      }
    } finally {
      setFinanceHandoverLoading(false)
    }
  }

  const loadStudentDocs = async () => {
    if (!application?.id) return
    setLoading(true)
    try {
      const docs = await documentService.getApplicationDocuments(application.id)
      setDocuments(docs)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (open && application?.id) {
      loadStudentDocs()
    }
  }, [open, application?.id])

  // Sync back to application summary
  const syncApplicationDocSummary = async (updatedDocs: any[]) => {
    const verified = updatedDocs.filter((d) => d.verificationStatus === 'Verified').length
    const pending = updatedDocs.filter((d) => d.verificationStatus === 'Pending').length
    const rejected = updatedDocs.filter((d) => d.verificationStatus === 'Rejected').length
    const total = updatedDocs.length

    let status = 'Pending Verification'
    if (verified === total && total > 0) status = 'Verified'
    else if (rejected > 0) status = 'Action Required'

    await applicationService.updateDocumentVerification(application.id, {
      totalRequired: total,
      verifiedCount: verified,
      pendingCount: pending,
      rejectedCount: rejected,
      status,
    })

    if (onVerificationUpdated) {
      onVerificationUpdated()
    }
  }

  const handleVerify = async (docId: string) => {
    await documentService.verifyDocument(docId, 'Admissions Reviewer')
    const updated = documents.map((d) =>
      d.id === docId
        ? {
            ...d,
            verificationStatus: 'Verified',
            verifiedBy: 'Admissions Reviewer',
            verifiedDate: new Date().toISOString().split('T')[0],
            rejectionReason: null,
          }
        : d
    )
    setDocuments(updated)
    await syncApplicationDocSummary(updated)
    showToast('Document verified successfully.')
  }

  const handleOpenReject = (doc: any) => {
    setSelectedDocForReject(doc)
    setRejectionReason('')
    setRejectModalOpen(true)
  }

  const handleConfirmReject = async () => {
    if (!selectedDocForReject) return
    await documentService.rejectDocument(
      selectedDocForReject.id,
      rejectionReason || 'Document could not be verified. Please provide a clear attested copy.'
    )
    const updated = documents.map((d) =>
      d.id === selectedDocForReject.id
        ? {
            ...d,
            verificationStatus: 'Rejected',
            verifiedBy: 'Admissions Reviewer',
            verifiedDate: new Date().toISOString().split('T')[0],
            rejectionReason: rejectionReason || 'Document rejected. Please upload clearer copy.',
          }
        : d
    )
    setDocuments(updated)
    await syncApplicationDocSummary(updated)
    setRejectModalOpen(false)
    showToast('Document marked as rejected with feedback.')
  }

  const handleOpenUpload = (doc: any) => {
    setSelectedDocForUpload(doc)
    setSimulatedFileName(`${doc.type.replace(/\s+/g, '_')}_Official_Signed.pdf`)
    setUploadModalOpen(true)
  }

  const handleConfirmUpload = async () => {
    if (!selectedDocForUpload) return
    await documentService.uploadDocument(application.id, {
      id: selectedDocForUpload.id,
      type: selectedDocForUpload.type,
      fileName: simulatedFileName || 'Official_Attested_Doc.pdf',
      fileSize: '1.6 MB',
    })
    await loadStudentDocs()
    setUploadModalOpen(false)
    showToast('Document uploaded successfully and marked for verification.')
  }

  const handleVerifyAll = async () => {
    if (!application?.id) return
    const updated = await documentService.attachAndVerifyAllDocuments(
      application.id,
      'Admissions Committee'
    )
    setDocuments(updated)
    await syncApplicationDocSummary(updated)
    showToast('All credentials (including TC) attached and verified to Success!')
  }

  const handleAttachAndVerifySingle = async (doc: any) => {
    if (!application?.id) return
    await documentService.attachAndVerifyDocument(
      application.id,
      doc.id || doc.code,
      'Admissions Committee'
    )
    const updated = await documentService.getApplicationDocuments(application.id)
    setDocuments(updated)
    await syncApplicationDocSummary(updated)
    showToast(`${doc.type} (${doc.code}) attached and verified to Success!`)
  }

  const activeApp = currentApp || application
  if (!activeApp) return null

  const courseFee = getCourseFeeStructure(
    activeApp.academicInterest?.courseName || activeApp.academicInterest?.courseId,
    activeApp.academicInterest?.programName
  )

  const verifiedCount = documents.filter((d) => d.verificationStatus === 'Verified').length
  const totalCount = documents.length
  const progressPercent = totalCount > 0 ? Math.round((verifiedCount / totalCount) * 100) : 0
  const allDocsVerified = verifiedCount === totalCount && totalCount > 0
  const termsAccepted = Boolean(activeApp.admissionPolicy?.termsAccepted)
  const policySent = Boolean(activeApp.admissionPolicy?.policySentDate)
  const isAdmitted = activeApp.status === 'Admitted' || Boolean(activeApp.sentToFinance)
  const canSendToFinance = allDocsVerified && !isAdmitted

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange} side="right">
        <div className="flex flex-col h-full bg-white select-text">
          {/* Side Drawer Header */}
          <div className="px-5 sm:px-6 py-3.5 border-b border-slate-200/90 bg-slate-50/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shrink-0">
                <FileCheck className="h-4.5 w-4.5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                  Student Document Verification Portfolio
                </h2>
                <p className="text-[11px] text-slate-500">
                  Candidate credential authentication & finance clearance
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onOpenChange(false)
                  navigate(`/admissions/applications/${application.id}`)
                }}
                className="text-xs text-blue-600 hover:text-blue-700 h-8 gap-1 hidden sm:inline-flex"
              >
                Full Application Profile <ExternalLink className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition-colors"
                title="Close Drawer"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {toast && (
            <div className="mx-5 sm:mx-6 mt-3 bg-slate-900 text-white text-xs px-3.5 py-2.5 rounded-lg flex items-center gap-2 animate-in fade-in-0 shadow-md shrink-0">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
              <span>{toast}</span>
            </div>
          )}

          {/* Scrollable Center Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">

          {/* Student Profile Card */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-slate-900 text-sm">{application.applicantName}</h3>
                  <StatusBadge status={application.status} />
                </div>
                <div className="text-slate-500 text-[11px] flex items-center gap-3 flex-wrap">
                  <span>App No: <strong className="font-mono text-slate-800">{application.applicationNumber}</strong></span>
                  <span>Program: <strong className="text-slate-800">{application.academicInterest?.programName}</strong></span>
                  <span>Campus: <strong className="text-slate-800">{application.academicInterest?.campusName}</strong></span>
                </div>
              </div>

              {/* Progress pill */}
              <div className="sm:text-right shrink-0">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Clearance Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    progressPercent === 100
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : progressPercent > 0
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {progressPercent === 100 ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  ) : (
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                  )}
                  {verifiedCount} of {totalCount} Verified ({progressPercent}%)
                </span>
              </div>
            </div>

            {/* Verification progress bar */}
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  progressPercent === 100 ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Admission Policy & Parent Agreement Section */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl space-y-2.5 text-xs shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="h-4 w-4 text-indigo-600" />
                Admission Policy Document & Parent Undertaking
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                  termsAccepted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    : policySent
                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {termsAccepted
                  ? '✓ Terms & Conditions Signed'
                  : policySent
                  ? 'Policy Shared (Awaiting Signature)'
                  : 'Policy Not Shared Yet'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Policy Delivery Status</span>
                <span className="font-medium text-slate-800">
                  {policySent
                    ? `Sent to: ${application.admissionPolicy?.policySentToEmail || application.contact?.email} (${application.admissionPolicy?.policySentDate || 'Recent'})`
                    : 'Not sent yet to parent'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Parent Acceptance Signature</span>
                <span className="font-medium text-slate-800">
                  {termsAccepted
                    ? `Signed by: ${application.admissionPolicy?.termsAcceptedBy || application.guardian?.name || 'Parent'} (${application.admissionPolicy?.termsAcceptedDate || 'Signed'})`
                    : 'Awaiting parent sign-off'}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-0.5">
              <div className="text-[11px] text-slate-500">
                {!policySent ? (
                  <span>Parent must be sent the Admission Policy to accept terms & upload credentials.</span>
                ) : !termsAccepted ? (
                  <span>Policy shared with parent. Awaiting parent upload & signature.</span>
                ) : (
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> All terms accepted by parent. Ready for Admissions Committee approval.
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {!policySent && (
                  <Button
                    size="sm"
                    onClick={() => setOfferPolicyModalOpen(true)}
                    className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white gap-1"
                  >
                    <Mail className="h-3 w-3" /> Share Policy to Parent
                  </Button>
                )}
                {policySent && !termsAccepted && (
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
          </div>

          {/* Course-Dependent Fee Structure Notice */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl flex items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-blue-950">
                <Building className="h-4 w-4 text-blue-600" />
                Opted Stream: {application.academicInterest?.courseName || 'Senior Secondary Education'}
              </div>
              <div className="text-[11px] text-blue-700">
                Configured Finance Schedule: <strong className="text-blue-900">{courseFee.feeStructureName}</strong>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-500 font-medium block">Annual Course Fee</span>
              <span className="font-mono text-sm font-black text-blue-900">
                ₹{courseFee.totalFees.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="font-bold text-slate-700">Required Verification Dossier</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleVerifyAll}
                disabled={verifiedCount === totalCount && totalCount > 0}
                className="h-7 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1.5 font-semibold"
                title="Attach all credentials (including Transfer Certificate) and verify to Success"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Simulate All Attached (Success)
              </Button>
            </div>
          </div>

          {/* Document Verification Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading document dossier...</div>
            ) : documents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No documents currently registered for this applicant.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-3.5 py-2.5">Document Type</th>
                    <th className="px-3.5 py-2.5">File Details</th>
                    <th className="px-3.5 py-2.5 text-center">Status</th>
                    <th className="px-3.5 py-2.5">Review Log</th>
                    <th className="px-3.5 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {documents.map((doc) => {
                    const isVerified = doc.verificationStatus === 'Verified'
                    const isRejected = doc.verificationStatus === 'Rejected'
                    const isPending = doc.verificationStatus === 'Pending'

                    return (
                      <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-3.5 py-3 align-middle">
                          <div className="font-bold text-slate-900">{doc.type}</div>
                          <span className="text-[10px] text-slate-400 font-mono">Code: {doc.code}</span>
                        </td>

                        <td className="px-3.5 py-3 align-middle">
                          {doc.uploaded ? (
                            <div className="space-y-0.5">
                              <span className="font-medium text-blue-700 flex items-center gap-1 text-[11px]">
                                <FileText className="h-3 w-3 shrink-0" />
                                {doc.fileName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {doc.fileSize} • Uploaded {doc.uploadedDate}
                              </span>
                            </div>
                          ) : (
                            <span className="text-slate-400 italic text-[11px]">Not uploaded yet</span>
                          )}
                        </td>

                        <td className="px-3.5 py-3 text-center align-middle">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                              isVerified
                                ? 'bg-emerald-100 text-emerald-800'
                                : isRejected
                                ? 'bg-rose-100 text-rose-800'
                                : isPending
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {doc.verificationStatus}
                          </span>
                        </td>

                        <td className="px-3.5 py-3 align-middle max-w-xs">
                          {isVerified ? (
                            <div className="text-[10px] text-emerald-700 space-y-0.5">
                              <div>✓ By: {doc.verifiedBy}</div>
                              <div className="text-slate-400">{doc.verifiedDate}</div>
                            </div>
                          ) : isRejected ? (
                            <div className="text-[10px] text-rose-700">
                              <strong>Reason:</strong> {doc.rejectionReason}
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400">Awaiting reviewer inspection</span>
                          )}
                        </td>

                        <td className="px-3.5 py-3 text-right align-middle">
                          <div className="flex items-center justify-end gap-1.5">
                            {!doc.uploaded ? (
                              <Button
                                size="sm"
                                onClick={() => handleAttachAndVerifySingle(doc)}
                                className="h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 gap-1 font-medium"
                                title="Attach simulated credential and verify to Success immediately"
                              >
                                <CheckCircle2 className="h-3 w-3" /> Attach & Verify
                              </Button>
                            ) : !isVerified ? (
                              <Button
                                size="sm"
                                onClick={() => handleVerify(doc.id)}
                                className="h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 gap-1 font-medium"
                                title="Approve & Verify"
                              >
                                <CheckCircle2 className="h-3 w-3" /> Approve
                              </Button>
                            ) : null}

                            {doc.uploaded && !isRejected && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenReject(doc)}
                                className="h-6 text-[10px] text-rose-700 border-rose-200 hover:bg-rose-50 px-2 gap-1"
                                title="Reject Document"
                              >
                                <XCircle className="h-3 w-3" /> Reject
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenUpload(doc)}
                              className="h-6 text-[10px] px-2 text-slate-600 gap-1"
                              title="Upload Document"
                            >
                              <Upload className="h-3 w-3" /> {doc.uploaded ? 'Replace' : 'Upload'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Handover Readiness Banner */}
          {!isAdmitted && (
            allDocsVerified ? (
              <div className="p-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-emerald-950 text-xs flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2.5">
                  <div className="h-7 w-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="font-bold text-xs text-emerald-950">
                      All Required Documents Verified (100%)
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Candidate dossier is complete and authenticated. Ready for immediate handover to Finance Department to collect admission payments under <strong>{courseFee.feeStructureName}</strong>.
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 bg-white/70 px-2.5 py-1.5 rounded-lg border border-emerald-100">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-emerald-800">Assessed Fee</div>
                  <div className="text-xs font-bold text-emerald-950 font-mono">₹{courseFee.totalFees.toLocaleString('en-IN')}</div>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="text-[11px]">
                    <strong>Document Verification in Progress:</strong> {verifiedCount} of {totalCount} documents verified. Handover to Finance unlocks once all required credentials are authenticated.
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-slate-500 shrink-0 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {totalCount - verifiedCount} remaining
                </span>
              </div>
            )
          )}

          {/* Post-Handover Finance State Card */}
          {isAdmitted && (
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2.5 text-xs">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-emerald-950">Candidate Dispatched to Finance Department</span>
                    <div className="text-[11px] text-emerald-800">
                      Admission No: <strong className="font-mono text-emerald-950">{activeApp.admissionDetails?.admissionNumber || 'ADM-2026-081'}</strong> • Student ID: <strong className="font-mono text-emerald-950">{activeApp.studentId || 'STU-2026-9021'}</strong>
                    </div>
                  </div>
                </div>
                <div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    activeApp.feeDetails?.feeStatus === 'Paid'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-amber-100 text-amber-900 border border-amber-300'
                  }`}>
                    {activeApp.feeDetails?.feeStatus === 'Paid' ? 'Fee Cleared • Paid' : 'Awaiting Admission Payment'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-[11px] bg-white/80 p-2.5 rounded-lg border border-emerald-100">
                <div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">INVOICE NUMBER</div>
                  <div className="font-mono font-semibold text-slate-900">{activeApp.feeDetails?.invoiceNumber || 'INV-2026-4892'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">FEE SCHEDULE</div>
                  <div className="font-medium text-slate-800 truncate" title={activeApp.feeDetails?.feeStructureName || courseFee.feeStructureName}>
                    {activeApp.feeDetails?.feeStructureName || courseFee.feeStructureName}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">TOTAL ASSESSED</div>
                  <div className="font-bold text-slate-900">₹{(activeApp.feeDetails?.netPayable || courseFee.totalFees || 120000).toLocaleString('en-IN')}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">OUTSTANDING</div>
                  <div className={`font-bold ${activeApp.feeDetails?.outstandingAmount === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                    ₹{(activeApp.feeDetails?.outstandingAmount ?? (courseFee.totalFees || 120000)).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            </div>
          )}

          </div>

          {/* Pinned Sticky Drawer Footer */}
          <div className="px-5 sm:px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <Button size="sm" variant="outline" onClick={() => onOpenChange(false)} className="text-xs">
              Done Reviewing
            </Button>

            <div className="flex items-center gap-2">
              {isAdmitted ? (
                <div className="flex items-center gap-2">
                  {activeApp.feeDetails?.feeStatus !== 'Paid' ? (
                    <Button
                      size="sm"
                      onClick={() => setPaymentModalOpen(true)}
                      className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1.5 shadow-sm"
                    >
                      <CreditCard className="h-3.5 w-3.5" /> Collect Payment Now (₹{(activeApp.feeDetails?.outstandingAmount ?? courseFee.totalFees).toLocaleString('en-IN')})
                    </Button>
                  ) : (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      Receipt Issued: {activeApp.feeDetails?.receiptNumber}
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      onOpenChange(false)
                      navigate(activeApp.studentId ? `/app/finance/student-fees/${activeApp.studentId}` : '/app/finance/student-fees')
                    }}
                    className="text-xs border-slate-200 text-slate-700 hover:bg-slate-50 gap-1"
                  >
                    View in Finance Module <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  size="sm"
                  disabled={!canSendToFinance || financeHandoverLoading}
                  onClick={handleApproveAllAndSendToFinance}
                  className={`text-xs gap-1.5 font-bold transition-all shadow-sm ${
                    canSendToFinance
                      ? 'bg-slate-900 hover:bg-slate-800 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                  title={
                    canSendToFinance
                      ? 'Send candidate to Finance Department for collecting admission payment'
                      : 'Locked until all required documents are verified'
                  }
                >
                  {financeHandoverLoading ? (
                    'Dispatching to Finance...'
                  ) : canSendToFinance ? (
                    <>
                      <ArrowRight className="h-3.5 w-3.5 text-emerald-400" /> Send to Finance for Payment Collection (₹{courseFee.totalFees.toLocaleString('en-IN')})
                    </>
                  ) : (
                    <>
                      <Lock className="h-3.5 w-3.5" /> Send to Finance (Locked: Verify All Docs)
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Dialog>

      {/* Reject Reason Dialog */}
      <Dialog open={rejectModalOpen} onOpenChange={setRejectModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-rose-700 flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              Reject Document: {selectedDocForReject?.type}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Specify the compliance reason for rejecting this credential. The applicant will be notified to re-upload.
            </p>
            <Textarea
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Scanned copy is illegible or principal attestation seal is missing..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setRejectModalOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmReject}
              className="bg-rose-600 hover:bg-rose-700 text-white"
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload on Behalf Dialog */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Upload className="h-4 w-4 text-blue-600" />
              Upload Document: {selectedDocForUpload?.type}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 block">Simulated File Name</label>
              <Input
                value={simulatedFileName}
                onChange={(e) => setSimulatedFileName(e.target.value)}
              />
            </div>
            <p className="text-[11px] text-slate-500">
              Uploaded document will be attached to the applicant's record and flagged for reviewer sign-off.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setUploadModalOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmUpload} className="bg-blue-600 hover:bg-blue-700 text-white">
              Confirm Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Admission Offer Policy Modal */}
      <AdmissionOfferPolicyModal
        open={offerPolicyModalOpen}
        onOpenChange={setOfferPolicyModalOpen}
        application={application}
        onPolicySent={() => {
          showToast('Admission policy document sent to parent!')
          if (onVerificationUpdated) onVerificationUpdated()
        }}
      />

      {/* Parent Admission Portal Simulator Modal */}
      <ParentAdmissionPortalSimulatorModal
        open={parentPortalModalOpen}
        onOpenChange={setParentPortalModalOpen}
        application={application}
        onSubmissionComplete={async () => {
          showToast('Parent accepted terms and submitted documents!')
          await loadStudentDocs()
          if (onVerificationUpdated) onVerificationUpdated()
        }}
      />

      {/* Finance Payment Collection Modal */}
      <PaymentCollectionModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        student={{
          studentId: activeApp.studentId || 'STU-2026-9021',
          studentName: activeApp.applicantName,
          rollNumber: activeApp.admissionDetails?.rollNumber || activeApp.studentId,
        }}
        invoice={{
          id: activeApp.feeDetails?.invoiceNumber || 'INV-2026-4892',
          outstandingAmount: activeApp.feeDetails?.outstandingAmount ?? courseFee.totalFees,
          netAmount: activeApp.feeDetails?.netPayable ?? courseFee.totalFees,
          studentName: activeApp.applicantName,
        }}
        onSuccess={async (res) => {
          const payAmount = res?.receipt?.amount || activeApp.feeDetails?.outstandingAmount || courseFee.totalFees
          const updated = await applicationService.recordFeePayment(activeApp.id, {
            amount: payAmount,
            paymentMode: res?.receipt?.paymentMethod || 'UPI / QR Code',
            transactionRef: res?.payment?.id || res?.receipt?.transactionId,
            notes: 'Collected upon Admissions Handover',
          })
          setCurrentApp(updated)
          showToast(`Admission payment of ₹${payAmount.toLocaleString('en-IN')} collected! Receipt: ${updated.feeDetails?.receiptNumber}`)
          if (onVerificationUpdated) onVerificationUpdated()
        }}
      />
    </>
  )
}
