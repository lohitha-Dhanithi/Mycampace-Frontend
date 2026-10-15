// src/modules/admissions/components/AdmissionsFeeTrackingTable.tsx
import React, { useState, useMemo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileCheck,
  ExternalLink,
  Receipt,
  Eye,
  Building2,
  ArrowRight,
  Info,
  Copy,
  Check,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { CandidateFeeClearanceModal } from './CandidateFeeClearanceModal'
import { StudentDocumentVerificationModal } from './StudentDocumentVerificationModal'
import { applicationService } from '../services/applicationService'
import { StatusBadge } from '@/components/common/StatusBadge'

export interface AdmissionsFeeTrackingTableProps {
  applications: any[]
  loading?: boolean
  onDataRefresh?: () => void
}

export function AdmissionsFeeTrackingTable({
  applications = [],
  loading = false,
  onDataRefresh,
}: AdmissionsFeeTrackingTableProps) {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [feeStatusFilter, setFeeStatusFilter] = useState('all')
  const [programFilter, setProgramFilter] = useState('all')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current))
    }, 2000)
  }

  // Modals state
  const [feeModalOpen, setFeeModalOpen] = useState(false)
  const [docModalOpen, setDocModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState<any>(null)

  // Compute summary metrics
  const metrics = useMemo(() => {
    let totalProjected = 0
    let totalCollected = 0
    let totalOutstanding = 0
    let paidCount = 0
    let partialCount = 0
    let pendingCount = 0

    applications.forEach((app) => {
      const f = app.feeDetails
      if (f) {
        const net = f.netPayable || f.totalFees || 0
        const paid = f.paidAmount || 0
        const out = f.outstandingAmount ?? (net - paid)

        totalProjected += net
        totalCollected += paid
        totalOutstanding += out

        if (f.feeStatus === 'Paid' || out === 0) paidCount++
        else if (f.feeStatus === 'Partially Paid' || paid > 0) partialCount++
        else pendingCount++
      }
    })

    const realizationRate = totalProjected > 0 ? ((totalCollected / totalProjected) * 100).toFixed(1) : '0'

    return {
      totalProjected,
      totalCollected,
      totalOutstanding,
      realizationRate,
      paidCount,
      partialCount,
      pendingCount,
    }
  }, [applications])

  // Filtered list
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      const f = app.feeDetails
      const status = f?.feeStatus || 'Not Invoiced'
      const isPaid = status === 'Paid' || f?.outstandingAmount === 0
      const isPartial = status === 'Partially Paid' || (f?.paidAmount > 0 && !isPaid)
      const isPending = !isPaid && !isPartial && status !== 'Not Invoiced'

      if (feeStatusFilter === 'Paid' && !isPaid) return false
      if (feeStatusFilter === 'Partially Paid' && !isPartial) return false
      if (feeStatusFilter === 'Pending' && !isPending) return false
      if (feeStatusFilter === 'Not Invoiced' && status !== 'Not Invoiced') return false

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
  }, [applications, search, feeStatusFilter, programFilter])

  const handleOpenFeeModal = (app: any) => {
    setSelectedApplication(app)
    setFeeModalOpen(true)
  }

  const handleOpenDocModal = (app: any) => {
    setSelectedApplication(app)
    setDocModalOpen(true)
  }

  const handleSendToFinance = async (appId: string) => {
    await applicationService.sendToFinance(appId)
    if (onDataRefresh) {
      onDataRefresh()
    }
  }

  return (
    <div className="space-y-4">
      {/* Informational Integration Banner */}
      <div className="p-3.5 rounded-xl bg-linear-to-r from-indigo-50/80 via-blue-50/60 to-white border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Building2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold text-slate-800">
              Fee Management Module Synchronization (View State)
            </span>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Admissions reflects candidate payment clearance status. Official invoicing, online payments, offline receipts, concessions, and reminder follow-ups are governed in the <strong>Fee Management</strong> module.
            </p>
          </div>
        </div>
        <Button
          size="sm"
          onClick={() => navigate('/app/finance/student-fees')}
          className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shrink-0 self-start sm:self-auto h-8"
        >
          <span>Open Fee Management Module</span>
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>

      {/* 1. Header Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <Card className="border-slate-200 shadow-xs bg-linear-to-br from-white to-slate-50">
          <CardContent className="p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Total Fee Commitment
            </span>
            <div className="text-xl font-black text-slate-900 font-mono mt-1">
              ₹{(metrics.totalProjected / 100000).toFixed(2)} L
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Across {applications.length} admitted / enrolled candidates
            </div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200/80 shadow-xs bg-linear-to-br from-emerald-50/50 to-white">
          <CardContent className="p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
              Cleared in Finance
            </span>
            <div className="text-xl font-black text-emerald-700 font-mono mt-1">
              ₹{(metrics.totalCollected / 100000).toFixed(2)} L
            </div>
            <div className="text-[10px] text-emerald-600 mt-1 font-semibold">
              {metrics.realizationRate}% Overall Clearance Rate
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200/80 shadow-xs bg-linear-to-br from-amber-50/50 to-white">
          <CardContent className="p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
              Pending in Fee Management
            </span>
            <div className="text-xl font-black text-amber-700 font-mono mt-1">
              ₹{(metrics.totalOutstanding / 100000).toFixed(2)} L
            </div>
            <div className="text-[10px] text-amber-600 mt-1 font-semibold">
              {metrics.pendingCount} Pending • {metrics.partialCount} Partial
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200/80 shadow-xs bg-linear-to-br from-blue-50/50 to-white">
          <CardContent className="p-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
              Fully Cleared Candidates
            </span>
            <div className="text-xl font-black text-blue-700 font-mono mt-1">
              {metrics.paidCount} / {applications.length}
            </div>
            <div className="text-[10px] text-blue-600 mt-1 font-semibold">
              Ready for Student SIS onboarding
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 2. Filter & Search Toolbar */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-3.5 space-y-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <Input
                placeholder="Search candidate name, application #, student ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={feeStatusFilter}
                onChange={(e) => setFeeStatusFilter(e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700"
              >
                <option value="all">All Clearance States</option>
                <option value="Paid">Cleared (Full)</option>
                <option value="Partially Paid">Partially Cleared</option>
                <option value="Pending">Pending in Finance</option>
                <option value="Not Invoiced">Pre-admission / Not Sent</option>
              </select>

              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="h-8 rounded-md border border-slate-200 bg-white px-2.5 text-xs font-semibold text-slate-700"
              >
                <option value="all">All Programs & Courses</option>
                <option value="Senior Secondary Education">Senior Secondary Education</option>
                <option value="Bachelor of Technology">Bachelor of Technology</option>
                <option value="Bachelor of Arts">Bachelor of Arts</option>
                <option value="Bachelor of Science">Bachelor of Science</option>
              </select>

              {(feeStatusFilter !== 'all' || programFilter !== 'all' || search) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearch('')
                    setFeeStatusFilter('all')
                    setProgramFilter('all')
                  }}
                  className="h-8 text-xs text-slate-500 hover:text-slate-800 px-2"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Candidate Fee Clearance Table */}
      <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap min-w-[170px]">Application ID</th>
                <th className="px-4 py-3 whitespace-nowrap min-w-[160px]">Candidate</th>
                <th className="px-4 py-3 whitespace-nowrap min-w-[180px]">Program</th>
                <th className="px-4 py-3 text-center whitespace-nowrap min-w-[130px]">Clearance Status</th>
                <th className="px-4 py-3 text-right whitespace-nowrap min-w-[110px]">Assessed</th>
                <th className="px-4 py-3 text-right whitespace-nowrap min-w-[110px]">Cleared</th>
                <th className="px-4 py-3 text-right whitespace-nowrap min-w-[110px]">Balance</th>
                <th className="px-4 py-3 whitespace-nowrap min-w-[130px]">Finance Ref</th>
                <th className="px-4 py-3 text-center whitespace-nowrap min-w-[120px]">Docs</th>
                <th className="px-4 py-3 text-right whitespace-nowrap min-w-[140px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                    Loading fee clearance records...
                  </td>
                </tr>
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-500">
                    No candidate records found matching selected filters.
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
                    feeStructureName: 'General University Schedule',
                  }

                  const docSummary = app.documentVerificationSummary || {
                    verifiedCount: 0,
                    totalRequired: 4,
                    status: 'Pending Verification',
                  }

                  const isPaid = fee.feeStatus === 'Paid' || fee.outstandingAmount === 0
                  const isPartial = fee.feeStatus === 'Partially Paid' || (fee.paidAmount > 0 && !isPaid)
                  const isPending = !isPaid && !isPartial && fee.feeStatus !== 'Not Invoiced'

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Application ID with Copy Button */}
                      <td className="px-4 py-3 align-middle whitespace-nowrap min-w-[170px]">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
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

                      {/* Candidate Name (Single line, no subtext) */}
                      <td className="px-4 py-3 align-middle whitespace-nowrap min-w-[160px]">
                        <div className="font-semibold text-slate-900 text-xs whitespace-nowrap">
                          {app.applicantName}
                        </div>
                      </td>

                      {/* Program (Single line, no subtext) */}
                      <td className="px-4 py-3 align-middle whitespace-nowrap min-w-[180px]">
                        <div
                          className="font-medium text-slate-800 text-xs truncate max-w-[180px]"
                          title={app.academicInterest?.courseName || app.academicInterest?.programName}
                        >
                          {app.academicInterest?.courseName || app.academicInterest?.programName}
                        </div>
                      </td>

                      {/* Clearance Status (Single line calm button) */}
                      <td className="px-4 py-3 text-center align-middle whitespace-nowrap min-w-[130px]">
                        <button
                          type="button"
                          onClick={() => handleOpenFeeModal(app)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors hover:bg-slate-100"
                          title="Click to view candidate fee clearance details"
                        >
                          {isPaid ? (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span className="text-slate-800">Cleared</span>
                            </>
                          ) : isPartial ? (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                              <span className="text-slate-800">Partial</span>
                            </>
                          ) : isPending ? (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shrink-0" />
                              <span className="text-slate-800">Pending</span>
                            </>
                          ) : (
                            <>
                              <span className="h-1.5 w-1.5 rounded-full bg-slate-400 shrink-0" />
                              <span className="text-slate-700">Pre-admit</span>
                            </>
                          )}
                        </button>
                      </td>

                      {/* Assessed */}
                      <td className="px-4 py-3 text-right font-mono text-slate-800 whitespace-nowrap align-middle">
                        ₹{(fee.netPayable || fee.totalFees || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Cleared */}
                      <td className="px-4 py-3 text-right font-mono font-semibold text-emerald-700 whitespace-nowrap align-middle">
                        ₹{(fee.paidAmount || 0).toLocaleString('en-IN')}
                      </td>

                      {/* Balance */}
                      <td className="px-4 py-3 text-right font-mono font-semibold whitespace-nowrap align-middle">
                        <span className={fee.outstandingAmount > 0 ? 'text-rose-600' : 'text-slate-400'}>
                          ₹{(fee.outstandingAmount || 0).toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Finance Reference (Single line) */}
                      <td className="px-4 py-3 align-middle text-xs font-mono whitespace-nowrap text-slate-700">
                        {fee.receiptNumber ? (
                          <span className="text-emerald-700 font-semibold">{fee.receiptNumber}</span>
                        ) : fee.invoiceNumber ? (
                          <span>{fee.invoiceNumber}</span>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Docs Status (Single line) */}
                      <td className="px-4 py-3 text-center align-middle whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDocModal(app)}
                          className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs text-slate-700 hover:bg-slate-100 transition-colors"
                          title="Click to view & verify documents"
                        >
                          {docSummary.status === 'Verified' ? (
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          ) : (
                            <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          )}
                          <span>{docSummary.verifiedCount}/{docSummary.totalRequired || 4} Verified</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right align-middle whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenFeeModal(app)}
                            className="h-7 text-xs text-slate-700 border-slate-200 hover:bg-slate-50 px-2.5 gap-1 font-medium shadow-none"
                            title="View Finance Clearance Details"
                          >
                            <Eye className="h-3 w-3" />
                            <span>Clearance</span>
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              navigate(
                                app.studentId
                                  ? `/app/finance/student-fees/${app.studentId}`
                                  : '/app/finance/student-fees'
                              )
                            }
                            className="h-7 w-7 p-0 text-slate-400 hover:text-slate-800"
                            title="Open Ledger in Fee Management"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
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
        application={selectedApplication}
        onSendToFinance={handleSendToFinance}
      />

      <StudentDocumentVerificationModal
        open={docModalOpen}
        onOpenChange={setDocModalOpen}
        application={selectedApplication}
        onVerificationUpdated={onDataRefresh}
      />
    </div>
  )
}
