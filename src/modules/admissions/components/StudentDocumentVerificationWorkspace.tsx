// src/modules/admissions/components/StudentDocumentVerificationWorkspace.tsx
import React, { useState, useEffect } from 'react'
import {
  ShieldCheck,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Upload,
  AlertCircle,
  Search,
  Filter,
  User,
  GraduationCap,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Lock,
  ArrowRight,
  FileCheck,
  RefreshCw,
  Copy,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { documentService } from '../services/documentService'
import { applicationService } from '../services/applicationService'
import { StudentDocumentVerificationModal } from './StudentDocumentVerificationModal'
import { useNavigate } from 'react-router-dom'

export interface StudentDocumentVerificationWorkspaceProps {
  applications: any[]
  initialSelectedApplicationId?: string
  onDataRefresh?: () => void
}

export function StudentDocumentVerificationWorkspace({
  applications = [],
  initialSelectedApplicationId,
  onDataRefresh,
}: StudentDocumentVerificationWorkspaceProps) {
  const navigate = useNavigate()

  // Selected student
  const [selectedAppId, setSelectedAppId] = useState<string>(
    initialSelectedApplicationId || applications[0]?.id || 'app-1'
  )

  // Search & Filter for students list
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'clarification'>('all')

  // Selected student documents
  const [studentDocs, setStudentDocs] = useState<any[]>([])
  const [loadingDocs, setLoadingDocs] = useState(false)

  // Dialog states for verification actions
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedDocForReject, setSelectedDocForReject] = useState<any>(null)
  const [rejectionReason, setRejectionReason] = useState('')

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadTargetDoc, setUploadTargetDoc] = useState<any>(null)
  const [uploadFileName, setUploadFileName] = useState('')

  const [previewDoc, setPreviewDoc] = useState<any>(null)
  const [fullModalOpen, setFullModalOpen] = useState(false)

  const [toastMessage, setToastMessage] = useState('')
  const [copiedAppId, setCopiedAppId] = useState<string | null>(null)

  const handleCopyAppId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopiedAppId(id)
    setTimeout(() => setCopiedAppId(null), 1800)
  }

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(''), 3500)
  }

  // Update selected app when list arrives or changes
  useEffect(() => {
    if (applications.length > 0 && !applications.some((a) => a.id === selectedAppId)) {
      setSelectedAppId(applications[0].id)
    }
  }, [applications])

  // Fetch documents for the selected student
  const loadStudentDocuments = async (appId: string) => {
    if (!appId) return
    setLoadingDocs(true)
    try {
      const docs = await documentService.getApplicationDocuments(appId)
      setStudentDocs(docs)
    } finally {
      setLoadingDocs(false)
    }
  }

  useEffect(() => {
    if (selectedAppId) {
      loadStudentDocuments(selectedAppId)
    }
  }, [selectedAppId])

  const selectedApp = applications.find((a) => a.id === selectedAppId) || applications[0]

  // Check if candidate is already dispatched or actively tracking in Finance
  const isDispatched = Boolean(
    selectedApp?.sentToFinance ||
    selectedApp?.status === 'Admitted' ||
    selectedApp?.status === 'Enrolled' ||
    (selectedApp?.feeDetails?.feeStatus && selectedApp.feeDetails.feeStatus !== 'Not Invoiced') ||
    selectedApp?.feeDetails?.invoiceNumber
  )

  // Handlers for document verification
  const handleVerify = async (docId: string) => {
    await documentService.verifyDocument(docId, 'Admissions Reviewer')
    showToast('Document marked as Verified.')
    if (selectedAppId) {
      loadStudentDocuments(selectedAppId)
    }
    if (onDataRefresh) onDataRefresh()
  }

  const handleOpenReject = (doc: any) => {
    setSelectedDocForReject(doc)
    setRejectionReason('')
    setRejectDialogOpen(true)
  }

  const handleConfirmReject = async () => {
    if (!selectedDocForReject) return
    await documentService.rejectDocument(
      selectedDocForReject.id,
      rejectionReason || 'Document rejected. Please upload clearer copy.'
    )
    setRejectDialogOpen(false)
    showToast('Clarification requested from student/parent.')
    if (selectedAppId) {
      loadStudentDocuments(selectedAppId)
    }
    if (onDataRefresh) onDataRefresh()
  }

  const handleOpenUpload = (doc: any) => {
    setUploadTargetDoc(doc)
    setUploadFileName(`${doc.type.replace(/\s+/g, '_')}_Document.pdf`)
    setUploadDialogOpen(true)
  }

  const handleConfirmUpload = async () => {
    if (!uploadTargetDoc || !selectedAppId) return
    await documentService.uploadDocument(selectedAppId, {
      id: uploadTargetDoc.id,
      type: uploadTargetDoc.type,
      code: uploadTargetDoc.code,
      fileName: uploadFileName || 'Uploaded_Document.pdf',
      fileSize: '1.2 MB',
    })
    setUploadDialogOpen(false)
    showToast('Document uploaded successfully for candidate.')
    loadStudentDocuments(selectedAppId)
    if (onDataRefresh) onDataRefresh()
  }

  const handleSimulateAllAttachedSuccess = async () => {
    if (!selectedAppId) return
    await documentService.attachAndVerifyAllDocuments(selectedAppId, 'Admissions Reviewer')
    await applicationService.updateDocumentVerification(selectedAppId, {
      status: 'Verified',
      verifiedCount: totalDocs || 4,
      pendingCount: 0,
      rejectedCount: 0,
    })
    showToast('All credentials (including TC) attached & verified to Success!')
    loadStudentDocuments(selectedAppId)
    if (onDataRefresh) onDataRefresh()
  }

  const handleAttachAndVerifySingle = async (doc: any) => {
    if (!selectedAppId) return
    await documentService.attachAndVerifyDocument(
      selectedAppId,
      doc.id || doc.code,
      'Admissions Reviewer'
    )
    showToast(`${doc.type} (${doc.code}) attached and verified to Success!`)
    loadStudentDocuments(selectedAppId)
    if (onDataRefresh) onDataRefresh()
  }

  // Calculate statistics for the selected student
  const totalDocs = studentDocs.length
  const verifiedDocs = studentDocs.filter((d) => d.verificationStatus === 'Verified').length
  const rejectedDocs = studentDocs.filter(
    (d) => d.verificationStatus === 'Rejected' || d.verificationStatus === 'Clarification Required'
  ).length
  const pendingDocs = studentDocs.filter(
    (d) => d.uploaded && d.verificationStatus !== 'Verified' && d.verificationStatus !== 'Rejected'
  ).length
  const unuploadedDocs = studentDocs.filter((d) => !d.uploaded).length

  const allVerified = totalDocs > 0 && verifiedDocs === totalDocs
  const progressPercent = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 0

  // Filter applications list
  const filteredApplications = applications.filter((app) => {
    const q = searchQuery.toLowerCase().trim()
    const matchesSearch =
      !q ||
      app.applicantName?.toLowerCase().includes(q) ||
      app.applicationNumber?.toLowerCase().includes(q) ||
      app.appliedCourse?.toLowerCase().includes(q)

    if (!matchesSearch) return false

    if (statusFilter === 'all') return true
    if (statusFilter === 'verified') {
      return (
        app.documentVerificationStatus === 'Verified' ||
        app.status === 'Verified' ||
        app.status === 'Admitted'
      )
    }
    if (statusFilter === 'clarification') {
      return (
        app.documentVerificationStatus === 'Clarification Required' ||
        app.status === 'Clarification Required'
      )
    }
    if (statusFilter === 'pending') {
      return (
        app.documentVerificationStatus !== 'Verified' &&
        app.status !== 'Verified' &&
        app.status !== 'Admitted'
      )
    }
    return true
  })

  return (
    <div className="space-y-4">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 animate-in fade-in-0 slide-in-from-bottom-5">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Student-Specific Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT COLUMN: Student Candidates Directory (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-100 bg-slate-50/70">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" /> Candidate Dossiers
              </span>
              <span className="text-[11px] font-semibold text-slate-500">
                {filteredApplications.length} Candidates
              </span>
            </div>

            {/* Search Input */}
            <div className="relative mb-2">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search by student name, app #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 pl-8 text-xs bg-white"
              />
            </div>

            {/* Quick Status Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px]">
              <button
                type="button"
                onClick={() => setStatusFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  statusFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('pending')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  statusFilter === 'pending'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Pending
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('clarification')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  statusFilter === 'clarification'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Clarification
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('verified')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                  statusFilter === 'verified'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Verified
              </button>
            </div>
          </div>

          {/* Student Candidate List */}
          <div className="divide-y divide-slate-100 max-h-[640px] overflow-y-auto">
            {filteredApplications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No candidates match the selected search or filter.
              </div>
            ) : (
              filteredApplications.map((app) => {
                const isSelected = app.id === selectedAppId
                const appCourse = app.appliedCourse || app.academicInterest?.courseName || 'General Program'
                const isAppVerified =
                  app.documentVerificationStatus === 'Verified' ||
                  app.status === 'Verified' ||
                  app.status === 'Admitted'
                const isClarification =
                  app.documentVerificationStatus === 'Clarification Required' ||
                  app.status === 'Clarification Required'

                return (
                  <button
                    key={app.id}
                    type="button"
                    onClick={() => setSelectedAppId(app.id)}
                    className={`w-full text-left p-3 transition-colors flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-slate-100/80 border-l-4 border-slate-900'
                        : 'hover:bg-slate-50/80 border-l-4 border-transparent'
                    }`}
                  >
                    {/* Avatar with Initials */}
                    <div
                      className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {app.applicantName
                        ?.split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase() || 'ST'}
                    </div>

                    {/* Student Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-xs truncate ${
                            isSelected ? 'text-slate-900 font-bold' : 'text-slate-900 font-semibold'
                          }`}
                        >
                          {app.applicantName}
                        </span>
                        <span className="font-mono text-[10px] text-slate-400 shrink-0">
                          {app.applicationNumber}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate mt-0.5">{appCourse}</p>

                      <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                        {isAppVerified ? (
                          <span className="inline-flex items-center gap-1 font-medium text-emerald-700">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Verified
                          </span>
                        ) : isClarification ? (
                          <span className="inline-flex items-center gap-1 font-medium text-amber-700">
                            <AlertCircle className="h-3 w-3 text-amber-600" /> Clarification
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-slate-500">
                            <Clock className="h-3 w-3 text-slate-400" /> Pending Review
                          </span>
                        )}
                        <span>•</span>
                        <span>{app.academicYear || '2026-2027'}</span>
                      </div>
                    </div>

                    <ChevronRight
                      className={`h-4 w-4 shrink-0 self-center ${
                        isSelected ? 'text-slate-900' : 'text-slate-300'
                      }`}
                    />
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Selected Student's Specific Document Dossier (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {selectedApp ? (
            <>
              {/* Student Dossier Header Card */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-start gap-3.5">
                    <div className="h-11 w-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
                      {selectedApp.applicantName
                        ?.split(' ')
                        .map((n: string) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase() || 'ST'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-sm font-bold text-slate-900">
                          {selectedApp.applicantName}
                        </h2>
                        <div className="flex items-center gap-1 font-mono text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
                          <span>{selectedApp.applicationNumber}</span>
                          <button
                            type="button"
                            onClick={(e) => handleCopyAppId(e, selectedApp.applicationNumber)}
                            className="p-0.5 text-slate-400 hover:text-slate-700 rounded transition-colors"
                            title={copiedAppId === selectedApp.applicationNumber ? 'Copied!' : 'Copy Application ID'}
                            aria-label="Copy Application ID"
                          >
                            {copiedAppId === selectedApp.applicationNumber ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                        {allVerified ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> All Documents Verified
                          </span>
                        ) : rejectedDocs > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-600" /> Clarification Required
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            <Clock className="h-3.5 w-3.5 text-slate-500" /> Verification In Progress
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-500 mt-1.5 flex-wrap">
                        <span className="flex items-center gap-1 text-slate-700 font-medium">
                          <GraduationCap className="h-3.5 w-3.5 text-slate-500" />
                          {selectedApp.appliedCourse || selectedApp.academicInterest?.courseName || 'General Program'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5 text-slate-400" />
                          Parent: {selectedApp.parentName || selectedApp.guardian?.fatherName || 'Guardian'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3.5 w-3.5 text-slate-400" />
                          {selectedApp.phone || selectedApp.contact?.mobile || 'No contact'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setFullModalOpen(true)}
                      className="gap-1.5 text-xs h-8 border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-slate-500" /> Open Full Dossier
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => loadStudentDocuments(selectedApp.id)}
                      className="h-8 px-2 text-slate-500 hover:bg-slate-50"
                      title="Refresh Student Documents"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {/* Verification Progress Meter */}
                <div className="mt-4 pt-1 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-600 font-medium">
                        Verification Progress for <strong>{selectedApp.applicantName}</strong>:
                      </span>
                      <span className="font-bold text-slate-900">
                        {verifiedDocs} of {totalDocs} Verified ({progressPercent}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-slate-900 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Summary Metric Counters (Clean Neutral) */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <div className="text-center px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 min-w-[54px]">
                      <div className="text-xs font-bold text-slate-800">{verifiedDocs}</div>
                      <div className="text-[10px] text-slate-500">Verified</div>
                    </div>
                    <div className="text-center px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 min-w-[54px]">
                      <div className="text-xs font-bold text-slate-800">{pendingDocs}</div>
                      <div className="text-[10px] text-slate-500">Review</div>
                    </div>
                    {rejectedDocs > 0 && (
                      <div className="text-center px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200 min-w-[54px]">
                        <div className="text-xs font-bold text-slate-800">{rejectedDocs}</div>
                        <div className="text-[10px] text-slate-500">Clarify</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Student's Specific Documents Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-3.5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCheck className="h-3.5 w-3.5 text-slate-500" />
                      Uploaded Documents & Certificates ({studentDocs.length})
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Individual credential files uploaded specifically for applicant{' '}
                      <strong>{selectedApp.applicantName}</strong>.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-500 mr-1">
                      Mandatory: <strong className="text-slate-800">{studentDocs.filter((d) => d.required).length}</strong>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleSimulateAllAttachedSuccess}
                      disabled={allVerified || totalDocs === 0}
                      className="h-7 text-xs text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1.5 font-semibold"
                      title="Attach all credentials (including Transfer Certificate) and verify to Success"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Simulate All Attached (Success)
                    </Button>
                  </div>
                </div>

                {loadingDocs ? (
                  <div className="p-12 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
                    <RefreshCw className="h-4 w-4 animate-spin text-slate-500" />
                    <span>Loading documents for {selectedApp.applicantName}...</span>
                  </div>
                ) : studentDocs.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 text-xs">
                    No documents uploaded yet for this student.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 uppercase text-[10px] tracking-wider font-semibold">
                          <th className="py-2.5 px-4">Document Type</th>
                          <th className="py-2.5 px-4">Requirement</th>
                          <th className="py-2.5 px-4">Uploaded File</th>
                          <th className="py-2.5 px-4">Verification Status</th>
                          <th className="py-2.5 px-4">Reviewer</th>
                          <th className="py-2.5 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {studentDocs.map((doc) => {
                          const isVerified = doc.verificationStatus === 'Verified'
                          const isRejected =
                            doc.verificationStatus === 'Rejected' ||
                            doc.verificationStatus === 'Clarification Required'

                          return (
                            <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                                  <div>
                                    <div className="font-semibold text-slate-900">{doc.type}</div>
                                    <span className="text-[10px] text-slate-400">Code: {doc.code || 'DOC'}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4">
                                {doc.required ? (
                                  <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                    Mandatory
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50 text-slate-400">
                                    Optional
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                {doc.uploaded ? (
                                  <div>
                                    <div className="font-medium text-slate-800">{doc.fileName}</div>
                                    <div className="text-[10px] text-slate-400">
                                      {doc.fileSize} • Uploaded {doc.uploadedDate || '2026-09-24'}
                                    </div>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic text-[11px]">Upload Pending</span>
                                )}
                              </td>

                              <td className="py-3 px-4">
                                <div>
                                  {isVerified ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                      <CheckCircle2 className="h-3 w-3" /> Verified
                                    </span>
                                  ) : isRejected ? (
                                    <div>
                                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                        <AlertCircle className="h-3 w-3" /> Clarification
                                      </span>
                                      {doc.rejectionReason && (
                                        <p className="text-[10px] text-amber-700 mt-0.5 max-w-xs font-normal">
                                          {doc.rejectionReason}
                                        </p>
                                      )}
                                    </div>
                                  ) : !doc.uploaded ? (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      <Clock className="h-3 w-3" /> Not Uploaded
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                                      <Clock className="h-3 w-3 text-slate-500" /> Pending Review
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="py-3 px-4 text-slate-600">
                                {doc.verifiedBy ? (
                                  <div>
                                    <div className="font-medium text-slate-800">{doc.verifiedBy}</div>
                                    <div className="text-[10px] text-slate-400">{doc.verifiedDate}</div>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">—</span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {doc.uploaded && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => setPreviewDoc(doc)}
                                      className="h-7 px-2 text-[11px] border-slate-200 hover:bg-slate-50"
                                      title="Preview Document File"
                                    >
                                      <Eye className="h-3 w-3 text-slate-600" />
                                    </Button>
                                  )}

                                  {!doc.uploaded ? (
                                    <>
                                      <Button
                                        size="sm"
                                        onClick={() => handleAttachAndVerifySingle(doc)}
                                        className="h-7 text-[11px] gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-none px-2.5"
                                        title="Attach simulated credential and verify to Success immediately"
                                      >
                                        <CheckCircle2 className="h-3 w-3" /> Attach & Verify
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleOpenUpload(doc)}
                                        className="h-7 text-[11px] gap-1 text-slate-600 border-slate-200 hover:bg-slate-50"
                                      >
                                        <Upload className="h-3 w-3" /> Upload
                                      </Button>
                                    </>
                                  ) : (
                                    <>
                                      {!isVerified && (
                                        <Button
                                          size="sm"
                                          onClick={() => handleVerify(doc.id)}
                                          className="h-7 text-xs bg-slate-900 hover:bg-slate-800 text-white px-2.5 font-medium shadow-none"
                                        >
                                          Verify
                                        </Button>
                                      )}

                                      {!isRejected && (
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => handleOpenReject(doc)}
                                          className="h-7 text-xs text-slate-700 border-slate-200 hover:bg-slate-50 px-2 font-medium"
                                        >
                                          Clarify
                                        </Button>
                                      )}
                                    </>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Stage 4 Completion / Gate Handover Banner */}
              {isDispatched ? (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Dispatched to Finance Team:</strong> Candidate credentials verified and fee collection is actively handled in Fee Management.
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate('/app/admissions/fees')}
                    className="h-7 text-xs border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium shrink-0 shadow-2xs"
                  >
                    View Fee Clearance
                  </Button>
                </div>
              ) : allVerified ? (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 text-slate-700">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Verification Complete:</strong> All certificates authenticated. Candidate is cleared for Finance handover.
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      onClick={() => setFullModalOpen(true)}
                      className="h-7 text-xs bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-none"
                    >
                      Dispatch to Finance
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => navigate('/app/admissions/fees')}
                      className="h-7 text-xs border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium shadow-2xs"
                    >
                      View Fee Clearance
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                    <span>
                      Verification gate: Handover to Finance unlocks once all mandatory documents are verified.
                    </span>
                  </div>
                  <span className="text-[11px] font-medium text-slate-500 shrink-0">
                    {totalDocs - verifiedDocs} remaining
                  </span>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
              Select a student candidate from the list to review and verify their specific documents.
            </div>
          )}
        </div>
      </div>

      {/* Reject / Request Clarification Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Request Clarification for {selectedDocForReject?.type}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Specify the clarification or rejection reason for{' '}
              <strong>{selectedDocForReject?.fileName}</strong> (Candidate: <strong>{selectedApp?.applicantName}</strong>).
            </p>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Reason / Clarification Note *</label>
              <Textarea
                placeholder="e.g. Scanned copy is illegible, please upload high-resolution original certificate..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="text-xs"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmReject}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Send Clarification Request
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Staff Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document for {selectedApp?.applicantName}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Upload physical or verified electronic copy for{' '}
              <strong>{uploadTargetDoc?.type}</strong> on behalf of the applicant.
            </p>
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">File Name *</label>
              <Input
                value={uploadFileName}
                onChange={(e) => setUploadFileName(e.target.value)}
                className="text-xs"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleConfirmUpload}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Upload File
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document File Preview Dialog */}
      <Dialog open={Boolean(previewDoc)} onOpenChange={() => setPreviewDoc(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-600" />
              <span>{previewDoc?.type}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Candidate:</span>
                <span className="font-semibold text-slate-900">{selectedApp?.applicantName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">File Name:</span>
                <span className="font-mono text-slate-800">{previewDoc?.fileName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">File Size:</span>
                <span>{previewDoc?.fileSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Upload Date:</span>
                <span>{previewDoc?.uploadedDate || '2026-09-24'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold">{previewDoc?.verificationStatus}</span>
              </div>
            </div>

            {/* Simulated Document Preview Canvas */}
            <div className="h-44 rounded-lg bg-slate-100 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-2">
              <FileText className="h-10 w-10 text-slate-400" />
              <span className="text-xs">Document Certificate Viewer Preview ({previewDoc?.fileName})</span>
              <span className="text-[10px] text-slate-400 font-mono">Digital Signature Valid • SHA-256 Verified</span>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setPreviewDoc(null)}>
                Close Preview
              </Button>
              {previewDoc?.verificationStatus !== 'Verified' && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => {
                    handleVerify(previewDoc.id)
                    setPreviewDoc(null)
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  Verify This Document
                </Button>
              )}
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* Full Modal for In-depth Verification & Parent Simulator */}
      {selectedApp && (
        <StudentDocumentVerificationModal
          open={fullModalOpen}
          onOpenChange={setFullModalOpen}
          application={selectedApp}
          onVerificationUpdated={() => {
            if (selectedAppId) loadStudentDocuments(selectedAppId)
            if (onDataRefresh) onDataRefresh()
          }}
        />
      )}
    </div>
  )
}
