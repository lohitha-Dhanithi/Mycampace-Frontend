// src/modules/admissions/components/CandidateFeeClearanceModal.tsx
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Receipt,
  AlertCircle,
  ExternalLink,
  Building2,
  Calendar,
  Send,
  CreditCard,
  ArrowRight,
  Info,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface CandidateFeeClearanceModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  application: any
  onSendToFinance?: (appId: string) => Promise<void> | void
}

export function CandidateFeeClearanceModal({
  open,
  onOpenChange,
  application,
  onSendToFinance,
}: CandidateFeeClearanceModalProps) {
  const navigate = useNavigate()
  const [sendingToFinance, setSendingToFinance] = useState(false)
  const [sentSuccess, setSentSuccess] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  if (!application) return null

  const fee = application.feeDetails || {
    totalFees: 120000,
    admissionFee: 25000,
    tuitionFee: 95000,
    netPayable: 120000,
    paidAmount: 0,
    outstandingAmount: 120000,
    feeStatus: 'Pending',
    feeStructureName: 'Standard Composite Fee',
  }

  const isDocsVerified = application.documentVerificationSummary?.status === 'Verified'
  const isCleared = fee.feeStatus === 'Paid' || fee.outstandingAmount === 0
  const isPartial = fee.feeStatus === 'Partially Paid' || (fee.paidAmount > 0 && !isCleared)
  const isPending = !isCleared && !isPartial
  const isAdmitted = application.status === 'Admitted' || application.status === 'Approved' || application.status === 'Confirmed'
  const isSentToFinance = Boolean(application.sentToFinance || fee.invoiceNumber || isAdmitted || sentSuccess)

  const handleSendToFinanceClick = async () => {
    if (!isDocsVerified) {
      setErrorMessage('Validation Error: Documents must be verified before sending candidate to Finance.')
      return
    }
    setSendingToFinance(true)
    setErrorMessage('')
    try {
      if (onSendToFinance) {
        await onSendToFinance(application.id)
      }
      setSentSuccess(true)
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send to Finance')
    } finally {
      setSendingToFinance(false)
    }
  }

  const handleOpenFeeManagement = () => {
    onOpenChange(false)
    if (application.studentId) {
      navigate(`/app/finance/student-fees/${application.studentId}`)
    } else {
      navigate('/app/finance/student-fees')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-slate-200">
        {/* Header */}
        <DialogHeader className="p-5 pb-4 bg-slate-50 border-b border-slate-200/80">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-bold text-slate-900">
                  Fee Clearance View State
                </DialogTitle>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Finance Synchronized
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Candidate: <strong className="text-slate-800">{application.applicantName}</strong> • {application.applicationNumber}
              </p>
            </div>
            {application.studentId && (
              <span className="text-[11px] font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-600 font-bold">
                {application.studentId}
              </span>
            )}
          </div>
        </DialogHeader>

        <div className="p-5 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
          {/* Clearance Status Hero Banner */}
          {isCleared ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-emerald-900 text-sm">
                  Payment Cleared in Fee Management
                </div>
                <p className="text-emerald-700 text-xs">
                  All admission dues and term fees have been collected, verified, and settled by Institutional Finance.
                </p>
                {fee.receiptNumber && (
                  <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-emerald-800">
                    <span>Receipt: <strong className="font-mono">{fee.receiptNumber}</strong></span>
                    {fee.lastPaymentDate && <span>Cleared Date: {fee.lastPaymentDate}</span>}
                  </div>
                )}
              </div>
            </div>
          ) : isPartial ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-amber-900 text-sm">
                  Partially Cleared (Balance Due in Fee Management)
                </div>
                <p className="text-amber-700 text-xs">
                  Admission deposit or partial installment has been cleared. The outstanding balance is being tracked for collection by Finance.
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-amber-800">
                  <span>Cleared: <strong>₹{(fee.paidAmount || 0).toLocaleString('en-IN')}</strong></span>
                  <span>Pending: <strong className="text-rose-700">₹{(fee.outstandingAmount || 0).toLocaleString('en-IN')}</strong></span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-slate-800 text-sm">
                  Payment Pending Clearance in Finance
                </div>
                <p className="text-slate-600 text-xs">
                  Fee assessment is registered. Collection and follow-ups are actively monitored in the Fee Management module.
                </p>
                <div className="flex items-center gap-3 pt-1 text-[11px] font-semibold text-slate-700">
                  <span>Assessed Amount: <strong>₹{(fee.netPayable || fee.totalFees || 0).toLocaleString('en-IN')}</strong></span>
                  {fee.dueDate && <span>Due Date: {fee.dueDate}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Finance Synchronization Status */}
          <div className="p-3 rounded-lg border border-slate-200 bg-white space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-indigo-600" /> Fee Management Process State:
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isSentToFinance
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {isSentToFinance ? 'Synced with Fee Management' : 'Pending Admission Completion'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              In MyCampace, actual invoices, online payment gateways, offline receipts, concessions, and collection reminder follow-ups are processed within the <strong>Fee Management</strong> module. Admissions maintains a live clearance reflection for candidate admission tracking.
            </p>
          </div>

          {/* Synchronized Financial Figures */}
          <div className="rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between font-semibold text-slate-700">
              <span>Financial Ledger Summary</span>
              <span className="text-[11px] text-slate-400 font-normal">
                {fee.feeStructureName || 'Senior Secondary Fee Schedule'}
              </span>
            </div>
            <div className="p-3.5 grid grid-cols-3 gap-3 divide-x divide-slate-100 text-center">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Assessed</div>
                <div className="text-sm font-bold text-slate-900 mt-0.5">
                  ₹{(fee.netPayable || fee.totalFees || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Cleared Amount</div>
                <div className="text-sm font-bold text-emerald-700 mt-0.5">
                  ₹{(fee.paidAmount || 0).toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Pending Balance</div>
                <div className="text-sm font-bold text-rose-700 mt-0.5">
                  ₹{(fee.outstandingAmount ?? ((fee.netPayable || fee.totalFees || 0) - (fee.paidAmount || 0))).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Invoices and Receipts Registered in Finance */}
            <div className="p-3 bg-slate-50/50 border-t border-slate-100 space-y-1.5 text-[11px]">
              <div className="flex justify-between text-slate-600">
                <span>Invoice / Demand Note:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {fee.invoiceNumber || 'INV-2026-AUTOGEN'}
                </span>
              </div>
              {fee.paymentMode && (
                <div className="flex justify-between text-slate-600">
                  <span>Cleared Payment Mode:</span>
                  <span className="font-semibold text-slate-800">{fee.paymentMode}</span>
                </div>
              )}
              {fee.transactionRef && (
                <div className="flex justify-between text-slate-600">
                  <span>Finance Transaction ID:</span>
                  <span className="font-mono text-slate-700">{fee.transactionRef}</span>
                </div>
              )}
              {fee.dueDate && !isCleared && (
                <div className="flex justify-between text-slate-600">
                  <span>Clearance Due Date:</span>
                  <span className="font-semibold text-amber-700">{fee.dueDate}</span>
                </div>
              )}
            </div>
          </div>

          {/* Read-Only Notice */}
          <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-200/80 flex items-start gap-2.5 text-[11px] text-blue-900">
            <Info className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Admissions View State Only:</strong> All payment modifications, ledger postings, concession adjustments, and reminder follow-ups must be executed in the Fee Management module.
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <DialogFooter className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between sm:justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close View
          </Button>

          <div className="flex items-center gap-2">
            {!isSentToFinance && isAdmitted && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSendToFinanceClick}
                disabled={sendingToFinance || !isDocsVerified}
                className="gap-1.5 text-xs text-indigo-700 border-indigo-200 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed"
                title={
                  !isDocsVerified
                    ? 'Document verification must be completed before sending candidate to Finance'
                    : 'Send candidate to Fee Management'
                }
              >
                <Send className="h-3.5 w-3.5" />
                {sendingToFinance ? 'Sending...' : 'Send to Fee Management'}
              </Button>
            )}

            <Button
              type="button"
              size="sm"
              onClick={handleOpenFeeManagement}
              className="gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Open in Fee Management</span>
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
