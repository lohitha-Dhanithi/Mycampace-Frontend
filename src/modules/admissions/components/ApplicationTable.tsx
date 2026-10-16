// src/modules/admissions/components/ApplicationTable.tsx
import React, { useState, useMemo } from 'react'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Eye,
  GraduationCap,
  FileCheck,
  CreditCard,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  Copy,
  Check,
  Send,
  Sparkles,
  ChevronUp,
  ChevronDown,
  ArrowRight,
  FileText,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { calculateApplicationCompletion, applicationService } from '../services/applicationService'
import { CandidateFeeClearanceModal } from './CandidateFeeClearanceModal'
import { StudentDocumentVerificationModal } from './StudentDocumentVerificationModal'
import { AdmissionOfferPolicyModal } from './AdmissionOfferPolicyModal'
import { ParentAdmissionPortalSimulatorModal } from './ParentAdmissionPortalSimulatorModal'

export interface ApplicationTableProps {
  applications?: any[]
  loading?: boolean
  onReview?: (app: any) => void
  onConfirmAdmission?: (app: any) => Promise<void> | void
  onDataRefresh?: () => void
}

export function ApplicationTable({
  applications = [],
  loading = false,
  onReview,
  onConfirmAdmission,
  onDataRefresh,
}: ApplicationTableProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [appStatusFilter, setAppStatusFilter] = useState('all')
  const [feeStatusFilter, setFeeStatusFilter] = useState('all')
  const [docStatusFilter, setDocStatusFilter] = useState('all')
  const [programFilter, setProgramFilter] = useState('all')

  // Modals state
  const [selectedAppForFee, setSelectedAppForFee] = useState<any>(null)
  const [feeModalOpen, setFeeModalOpen] = useState(false)
  const [selectedAppForDoc, setSelectedAppForDoc] = useState<any>(null)
  const [docModalOpen, setDocModalOpen] = useState(false)
  const [selectedAppForOffer, setSelectedAppForOffer] = useState<any>(null)
  const [offerModalOpen, setOfferModalOpen] = useState(false)
  const [selectedAppForParentPortal, setSelectedAppForParentPortal] = useState<any>(null)
  const [parentPortalModalOpen, setParentPortalModalOpen] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(true)

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1800)
  }

  const handleSubmitDraft = async (e: React.MouseEvent, app: any) => {
    e.stopPropagation()
    setSubmittingId(app.id)
    try {
      await applicationService.submitApplication(app.id)
      if (onDataRefresh) {
        onDataRefresh()
      }
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSubmittingId(null)
    }
  }

  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      if (appStatusFilter !== 'all' && app.status.toLowerCase() !== appStatusFilter.toLowerCase()) {
        return false
      }

      if (feeStatusFilter !== 'all') {
        const feeStatus = app.feeDetails?.feeStatus || 'Not Invoiced'
        if (feeStatus.toLowerCase() !== feeStatusFilter.toLowerCase()) {
          return false
        }
      }

      if (docStatusFilter !== 'all') {
        const docStatus = app.documentVerificationSummary?.status || 'Pending Verification'
        if (docStatus.toLowerCase() !== docStatusFilter.toLowerCase()) {
          return false
        }
      }

      if (
        programFilter !== 'all' &&
        app.academicInterest?.programName !== programFilter &&
        app.academicInterest?.courseName !== programFilter
      ) {
        return false
      }

      if (search) {
        const q = search.toLowerCase()
        const matchName = app.applicantName?.toLowerCase().includes(q)
        const matchAppNo = app.applicationNumber?.toLowerCase().includes(q)
        const matchAdmissionNo = app.admissionDetails?.admissionNumber?.toLowerCase().includes(q)
        const matchEmail = app.contact?.email?.toLowerCase().includes(q)
        const matchPhone = app.contact?.mobile?.includes(q)
        if (!matchName && !matchAppNo && !matchAdmissionNo && !matchEmail && !matchPhone) {
          return false
        }
      }

      return true
    })
  }, [applications, search, appStatusFilter, feeStatusFilter, docStatusFilter, programFilter])

  const handleOpenFeeModal = (app: any) => {
    setSelectedAppForFee(app)
    setFeeModalOpen(true)
  }

  const handleOpenDocModal = (app: any) => {
    setSelectedAppForDoc(app)
    setDocModalOpen(true)
  }

  const handleOpenOfferModal = (app: any) => {
    setSelectedAppForOffer(app)
    setOfferModalOpen(true)
  }

  const handleOpenParentPortalModal = (app: any) => {
    setSelectedAppForParentPortal(app)
    setParentPortalModalOpen(true)
  }

  const handleSendToFinance = async (appId: string) => {
    await applicationService.sendToFinance(appId)
    if (onDataRefresh) {
      onDataRefresh()
    }
  }

  return (
    <div className="space-y-3.5">
      {/* Visual Admissions Workflow & Next Steps Guide */}
      <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-2xs">
        <div
          className="flex items-center justify-between cursor-pointer select-none"
          onClick={() => setShowWorkflowGuide(!showWorkflowGuide)}
        >
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <span>Admissions Workflow & Next Steps Guide</span>
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded">
                  Pipeline Steps
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Actionable milestones from lead conversion to final fee clearance and enrollment
              </p>
            </div>
          </div>
          <button
            type="button"
            className="flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/60 px-2.5 py-1 rounded-lg border border-blue-100/60 transition-colors"
          >
            <span>{showWorkflowGuide ? 'Hide Steps' : 'View Steps'}</span>
            {showWorkflowGuide ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {showWorkflowGuide && (
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-[11px]">
            {/* Step 1 */}
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Step 1</span>
                <span className="font-bold text-slate-800 block mt-0.5">Convert to App</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">From Lead / Enquiry into draft application</span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center gap-1 text-[10px] font-semibold text-blue-700">
                <span>Status:</span>
                <span className="px-1 bg-slate-200/60 rounded">Draft</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-600">Step 2 (Current)</span>
                <span className="font-bold text-slate-900 block mt-0.5">Submit Application</span>
                <span className="text-[10px] text-slate-600 block mt-0.5 leading-tight">Submit draft to initiate staff review</span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-blue-200/60 flex items-center justify-between text-[10px] font-bold text-blue-700">
                <span>Action:</span>
                <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[9px]">Submit App</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Step 3</span>
                <span className="font-bold text-slate-800 block mt-0.5">Document Screening</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">Verify student certificates & criteria</span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-slate-700">
                <span>Action:</span>
                <span className="px-1.5 py-0.5 bg-white border border-slate-300 text-slate-700 rounded text-[9px]">Review & Screen</span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Step 4</span>
                <span className="font-bold text-slate-800 block mt-0.5">Admit & Send Policy</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">Email policy doc & T&C to parents</span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-blue-700">
                <span>Action:</span>
                <span className="px-1.5 py-0.5 bg-blue-600 text-white rounded text-[9px]">Admit / Policy</span>
              </div>
            </div>

            {/* Step 5 */}
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Step 5</span>
                <span className="font-bold text-slate-800 block mt-0.5">Parent Acceptance</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">Parent signs & uploads required docs</span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-purple-700">
                <span>Action:</span>
                <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded text-[9px]">Parent Portal</span>
              </div>
            </div>

            {/* Step 6 */}
            <div className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Step 6</span>
                <span className="font-bold text-slate-800 block mt-0.5">Dossier & Finance</span>
                <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">Staff approves; sent to Fee Management</span>
              </div>
              <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-bold text-emerald-700">
                <span>Action:</span>
                <span className="px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[9px]">Verify Dossier</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Comprehensive Filter Toolbar */}
      <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2.5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Search by name, application #, contact..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 text-xs h-8"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Application Status Filter */}
            <select
              value={appStatusFilter}
              onChange={(e) => setAppStatusFilter(e.target.value)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700"
            >
              <option value="all">All Application Statuses</option>
              <option value="Submitted">Submitted</option>
              <option value="Under Review">Under Review</option>
              <option value="Approved">Approved</option>
              <option value="Policy Shared">Policy Shared</option>
              <option value="Docs Uploaded">Docs Uploaded</option>
              <option value="Admitted">Admitted</option>
              <option value="Enrolled">Enrolled</option>
              <option value="Documents Required">Documents Required</option>
            </select>

            {/* Fee Collection Status Filter */}
            <select
              value={feeStatusFilter}
              onChange={(e) => setFeeStatusFilter(e.target.value)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-700"
            >
              <option value="all">All Fee Statuses</option>
              <option value="Paid">Fee Paid (Full)</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Pending">Fee Pending</option>
              <option value="Not Invoiced">Not Invoiced</option>
            </select>

            {/* Document Verification Filter */}
            <select
              value={docStatusFilter}
              onChange={(e) => setDocStatusFilter(e.target.value)}
              className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs text-slate-700"
            >
              <option value="all">All Document Statuses</option>
              <option value="Verified">Fully Verified</option>
              <option value="Pending Verification">Pending Verification</option>
              <option value="Action Required">Action / Re-upload Required</option>
            </select>

            {/* Reset Filters */}
            {(appStatusFilter !== 'all' || feeStatusFilter !== 'all' || docStatusFilter !== 'all' || search) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch('')
                  setAppStatusFilter('all')
                  setFeeStatusFilter('all')
                  setDocStatusFilter('all')
                  setProgramFilter('all')
                }}
                className="h-8 text-xs text-slate-500 hover:text-slate-800 px-2"
              >
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap min-w-[170px]">Application ID</th>
                <th className="px-4 py-3 whitespace-nowrap min-w-[180px]">Applicant</th>
                <th className="px-4 py-3 whitespace-nowrap min-w-[220px]">Program</th>
                <th className="px-4 py-3 text-center whitespace-nowrap min-w-[120px]">Status</th>
                <th className="px-4 py-3 text-center whitespace-nowrap min-w-[140px]">Fee Clearance</th>
                <th className="px-4 py-3 text-center whitespace-nowrap min-w-[140px]">Documents</th>
                <th className="px-4 py-3 text-right whitespace-nowrap min-w-[180px]">Next Steps & Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    Loading student applications...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No applications found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => {
                  const fee = app.feeDetails || {
                    totalFees: 120000,
                    netPayable: 120000,
                    paidAmount: 0,
                    outstandingAmount: 120000,
                    feeStatus: 'Not Invoiced',
                  }

                  const doc = app.documentVerificationSummary || {
                    totalRequired: 4,
                    verifiedCount: 0,
                    status: 'Pending Verification',
                  }

                  const isFeePaid = fee.feeStatus === 'Paid'
                  const isFeePartial = fee.feeStatus === 'Partially Paid'

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Application ID with Copy Button */}
                      <td className="px-4 py-3 align-middle whitespace-nowrap min-w-[170px]">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => navigate(`/app/admissions/applications/${app.id}`)}
                            className="font-mono font-medium text-slate-800 hover:text-blue-600 transition-colors text-xs whitespace-nowrap"
                          >
                            {app.applicationNumber}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleCopyId(e, app.applicationNumber)}
                            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors shrink-0"
                            title={copiedId === app.applicationNumber ? 'Copied!' : 'Copy Application ID'}
                            aria-label="Copy Application ID"
                          >
                            {copiedId === app.applicationNumber ? (
                              <Check className="h-3 w-3 text-emerald-600" />
                            ) : (
                              <Copy className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* Applicant Name (Single line, no subtext) */}
                      <td className="px-4 py-3 align-middle whitespace-nowrap min-w-[180px]">
                        <div className="font-semibold text-slate-900 text-xs">{app.applicantName}</div>
                      </td>

                      {/* Program (Single line, no subtext) */}
                      <td className="px-4 py-3 align-middle whitespace-nowrap min-w-[220px]">
                        <div
                          className="font-medium text-slate-800 text-xs truncate max-w-[220px]"
                          title={app.academicInterest?.courseName || app.academicInterest?.programName}
                        >
                          {app.academicInterest?.courseName || app.academicInterest?.programName}
                        </div>
                      </td>

                      {/* Application Status */}
                      <td className="px-4 py-3 text-center align-middle whitespace-nowrap min-w-[120px]">
                        <StatusBadge status={app.status} />
                      </td>

                      {/* Fee Clearance (Single line, no stacked text) */}
                      <td className="px-4 py-3 text-center align-middle whitespace-nowrap min-w-[140px]">
                        <button
                          type="button"
                          onClick={() => handleOpenFeeModal(app)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Click to view fee breakdown"
                        >
                          {isFeePaid ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              <span className="font-semibold text-slate-900">₹{(fee.paidAmount || 0).toLocaleString('en-IN')}</span>
                            </>
                          ) : isFeePartial ? (
                            <>
                              <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              <span>₹{(fee.paidAmount || 0).toLocaleString('en-IN')} / ₹{(fee.netPayable || fee.totalFees || 0).toLocaleString('en-IN')}</span>
                            </>
                          ) : (
                            <>
                              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                              <span>₹{(fee.outstandingAmount || fee.netPayable || 0).toLocaleString('en-IN')} Pending</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Document Verification (Single line, no stacked text) */}
                      <td className="px-4 py-3 text-center align-middle whitespace-nowrap min-w-[140px]">
                        <button
                          type="button"
                          onClick={() => handleOpenDocModal(app)}
                          className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Click to inspect student documents"
                        >
                          {doc.status === 'Verified' ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          ) : doc.status === 'Action Required' ? (
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          )}
                          <span>{doc.verifiedCount}/{doc.totalRequired || 4} Verified</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right align-middle whitespace-nowrap min-w-[180px]">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Step 2: Draft -> Submit App */}
                          {app.status === 'Draft' && (
                            <Button
                              size="sm"
                              disabled={submittingId === app.id}
                              onClick={(e) => handleSubmitDraft(e, app)}
                              className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white px-2.5 gap-1 font-semibold shadow-none"
                              title="Next Step: Submit application draft for document screening & review"
                            >
                              <Send className="h-3 w-3" />
                              <span>{submittingId === app.id ? 'Submitting...' : 'Submit App'}</span>
                            </Button>
                          )}

                          {/* Step 3: Submitted / Under Review -> Review & Screen */}
                          {['Submitted', 'Under Review'].includes(app.status) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigate(`/app/admissions/applications/${app.id}/review`)}
                              className="h-7 text-xs text-blue-700 border-blue-200 hover:bg-blue-50 px-2.5 gap-1 font-semibold shadow-none"
                              title="Next Step: Verify student certificates, eligibility, and screening notes"
                            >
                              <FileCheck className="h-3 w-3 text-blue-600" />
                              <span>Review & Screen</span>
                            </Button>
                          )}

                          {/* Step 3b: Documents Required -> Re-Verify Docs */}
                          {app.status === 'Documents Required' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDocModal(app)}
                              className="h-7 text-xs text-amber-700 border-amber-200 hover:bg-amber-50 px-2.5 gap-1 font-semibold shadow-none"
                              title="Next Step: Inspect student re-uploaded documents and update verification"
                            >
                              <AlertCircle className="h-3 w-3 text-amber-600" />
                              <span>Re-Verify Docs</span>
                            </Button>
                          )}

                          {/* Step 4: Approved -> Verify Documents & Send to Finance */}
                          {app.status === 'Approved' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleOpenDocModal(app)}
                                className={`h-7 text-xs px-2.5 gap-1 font-semibold shadow-none ${
                                  app.documentVerificationSummary?.status === 'Verified'
                                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                                title={
                                  app.documentVerificationSummary?.status === 'Verified'
                                    ? 'All documents verified. Ready to send to Finance to collect admission payments'
                                    : 'Verify required student documents to enable sending to Finance'
                                }
                              >
                                {app.documentVerificationSummary?.status === 'Verified' ? (
                                  <>
                                    <ArrowRight className="h-3 w-3 text-emerald-200" />
                                    <span>Send to Finance</span>
                                  </>
                                ) : (
                                  <>
                                    <FileCheck className="h-3 w-3 text-blue-200" />
                                    <span>Verify Documents</span>
                                  </>
                                )}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenOfferModal(app)}
                                className="h-7 text-xs text-blue-700 border-blue-200 hover:bg-blue-50 px-2 gap-1 font-medium shadow-none"
                                title="Email official Admission Offer & Policy Terms to parent"
                              >
                                <GraduationCap className="h-3 w-3" />
                                <span>Policy</span>
                              </Button>
                            </>
                          )}

                          {/* Step 5: Policy Shared -> Parent Portal */}
                          {app.status === 'Policy Shared' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenParentPortalModal(app)}
                              className="h-7 text-xs text-purple-700 border-purple-200 hover:bg-purple-50 px-2.5 gap-1 font-semibold shadow-none"
                              title="Next Step: Parent accepts terms and uploads signed document dossier"
                            >
                              <ExternalLink className="h-3 w-3 text-purple-600" />
                              <span>Parent Portal</span>
                            </Button>
                          )}

                          {/* Step 6: Docs Uploaded -> Verify Dossier & Send to Finance */}
                          {app.status === 'Docs Uploaded' && (
                            <Button
                              size="sm"
                              onClick={() => handleOpenDocModal(app)}
                              className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 gap-1 font-semibold shadow-none"
                              title="Next Step: Verify signed parent dossier and approve dispatch to Fee Management"
                            >
                              <FileCheck className="h-3 w-3" />
                              <span>Verify Dossier</span>
                            </Button>
                          )}

                          {/* Step 7: Admitted / Enrolled -> Fee Status */}
                          {['Admitted', 'Enrolled'].includes(app.status) && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenFeeModal(app)}
                              className="h-7 text-xs text-slate-700 border-slate-200 hover:bg-slate-50 px-2.5 gap-1 font-medium shadow-none"
                              title="Next Step: Track fee clearance view-state from Fee Management module"
                            >
                              <CreditCard className="h-3 w-3 text-slate-500" />
                              <span>Fee Status</span>
                            </Button>
                          )}

                          {/* View Full Profile */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/app/admissions/applications/${app.id}`)}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-slate-800"
                            title="View Full Application Profile"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <CandidateFeeClearanceModal
        open={feeModalOpen}
        onOpenChange={setFeeModalOpen}
        application={selectedAppForFee}
        onSendToFinance={handleSendToFinance}
      />

      <StudentDocumentVerificationModal
        open={docModalOpen}
        onOpenChange={setDocModalOpen}
        application={selectedAppForDoc}
        onVerificationUpdated={onDataRefresh}
      />

      {/* Admission Offer Policy Modal */}
      <AdmissionOfferPolicyModal
        open={offerModalOpen}
        onOpenChange={setOfferModalOpen}
        application={selectedAppForOffer}
        onPolicySent={() => {
          if (onDataRefresh) onDataRefresh()
        }}
      />

      {/* Parent Admission Portal Simulator Modal */}
      <ParentAdmissionPortalSimulatorModal
        open={parentPortalModalOpen}
        onOpenChange={setParentPortalModalOpen}
        application={selectedAppForParentPortal}
        onSubmissionComplete={() => {
          if (onDataRefresh) onDataRefresh()
        }}
      />
    </div>
  )
}
