// src/modules/finance/pages/StudentFeeDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { InvoiceStatusBadge } from '../components/InvoiceStatusBadge'
import { StudentLedgerTimeline } from '../components/StudentLedgerTimeline'
import { PaymentCollectionModal } from '../components/PaymentCollectionModal'
import { ReceiptViewerModal } from '../components/ReceiptViewerModal'
import { studentFeeService } from '../services/studentFeeService'
import { refundService } from '../services/refundService'
import { formatCurrency } from '../config/financeConfig'
import {
  ArrowLeft,
  CreditCard,
  Tag,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Receipt as ReceiptIcon,
  Eye,
  Building,
  GraduationCap,
} from 'lucide-react'

export function StudentFeeDetailPage() {
  const { studentId } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Payment Modal
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  // Discount Modal
  const [discountModalOpen, setDiscountModalOpen] = useState(false)
  const [discountAmount, setDiscountAmount] = useState(5000)
  const [discountReason, setDiscountReason] = useState('Academic Merit Concession')

  // Refund Modal
  const [refundModalOpen, setRefundModalOpen] = useState(false)
  const [refundAmount, setRefundAmount] = useState(5000)
  const [refundReason, setRefundReason] = useState('Hostel adjustment or caution deposit')

  // Receipt Viewer Modal
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await studentFeeService.getStudentFinanceProfile(studentId)
      setProfile(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [studentId])

  const handleApplyDiscount = async (e) => {
    e.preventDefault()
    try {
      await studentFeeService.applyDiscount(studentId, {
        discountName: 'Institutional Concession',
        amount: discountAmount,
        reason: discountReason,
        approvedBy: 'Finance Directorate',
      })
      setDiscountModalOpen(false)
      loadData()
    } catch (err) {
      alert(err.message || 'Failed to apply discount')
    }
  }

  const handleRequestRefund = async (e) => {
    e.preventDefault()
    try {
      await refundService.requestRefund({
        studentId,
        studentName: profile?.assignment?.studentName,
        paymentId: profile?.payments?.[0]?.id || 'TXN-GEN-99',
        originalAmount: profile?.assignment?.paidAmount || 50000,
        refundableAmount: profile?.assignment?.paidAmount || 50000,
        refundAmount: Number(refundAmount),
        reason: refundReason,
        requestedBy: profile?.assignment?.studentName || 'Student',
      })
      setRefundModalOpen(false)
      loadData()
    } catch (err) {
      alert(err.message || 'Failed to submit refund request')
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-xs text-slate-500">
        Loading student financial profile...
      </div>
    )
  }

  const assignment = profile?.assignment
  const breakdown = assignment?.breakdown || {}

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title={assignment?.studentName}
        description={`Student ID: ${assignment?.studentId} | Class: ${assignment?.className} (${assignment?.sectionName}) | AY: ${assignment?.academicYearName}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link to="/finance/student-fees">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to Students
              </Link>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setDiscountModalOpen(true)}
              className="text-xs"
            >
              <Tag className="h-3.5 w-3.5 mr-1 text-purple-600" />
              Apply Concession
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRefundModalOpen(true)}
              className="text-xs text-rose-700 hover:bg-rose-50"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Request Refund
            </Button>
            <Button
              size="sm"
              onClick={() => setPaymentModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-xs text-xs"
            >
              <CreditCard className="h-3.5 w-3.5 mr-1" />
              Collect Payment
            </Button>
          </div>
        }
      />

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <Card className="p-3 border-slate-200">
          <div className="text-[10px] uppercase font-bold text-slate-400">Total Fees</div>
          <div className="text-base font-black text-slate-900 mt-1">{formatCurrency(assignment?.totalFees)}</div>
          <div className="text-[10px] text-slate-400">Gross fee schedule</div>
        </Card>

        <Card className="p-3 border-slate-200 bg-purple-50/30">
          <div className="text-[10px] uppercase font-bold text-purple-700">Discounts</div>
          <div className="text-base font-black text-purple-800 mt-1">-{formatCurrency(assignment?.discountsApplied)}</div>
          <div className="text-[10px] text-purple-600">Concessions granted</div>
        </Card>

        <Card className="p-3 border-slate-200 bg-indigo-50/30">
          <div className="text-[10px] uppercase font-bold text-indigo-700">Scholarships</div>
          <div className="text-base font-black text-indigo-800 mt-1">-{formatCurrency(assignment?.scholarshipsApplied)}</div>
          <div className="text-[10px] text-indigo-600">Merit/need grants</div>
        </Card>

        <Card className="p-3 border-slate-200 bg-blue-50/30">
          <div className="text-[10px] uppercase font-bold text-blue-700">Net Payable</div>
          <div className="text-base font-black text-blue-900 mt-1">{formatCurrency(assignment?.netPayable)}</div>
          <div className="text-[10px] text-blue-600">Annual net demand</div>
        </Card>

        <Card className="p-3 border-slate-200 bg-emerald-50/30">
          <div className="text-[10px] uppercase font-bold text-emerald-700">Paid Amount</div>
          <div className="text-base font-black text-emerald-800 mt-1">{formatCurrency(assignment?.paidAmount)}</div>
          <div className="text-[10px] text-emerald-600">Settled receipts</div>
        </Card>

        <Card className="p-3 border-slate-200 bg-amber-50/30">
          <div className="text-[10px] uppercase font-bold text-amber-700">Outstanding</div>
          <div className="text-base font-black text-amber-800 mt-1">{formatCurrency(assignment?.outstandingAmount)}</div>
          <div className="text-[10px] text-amber-600">Balance dues</div>
        </Card>

        <Card className="p-3 border-slate-200 bg-rose-50/30">
          <div className="text-[10px] uppercase font-bold text-rose-700">Overdue</div>
          <div className="text-base font-black text-rose-800 mt-1">{formatCurrency(assignment?.overdueAmount)}</div>
          <div className="text-[10px] text-rose-600">Late fine active</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Academic & Fee Component Breakdown */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Assigned Fee Structure
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              <div className="font-semibold text-slate-900">{assignment?.feeStructureName}</div>
              <div className="text-slate-500">{assignment?.campusName} • {assignment?.programName}</div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-slate-500">Account Status:</span>
                <InvoiceStatusBadge status={assignment?.status} />
              </div>
              {assignment?.nextDueDate && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Next Tranche Due Date:</span>
                  <span className="font-semibold text-slate-800">{assignment?.nextDueDate}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Itemized Fee Breakdown */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Fee Component Allocation
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2.5 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Tuition Fee</span>
                <span className="font-bold text-slate-900">{formatCurrency(breakdown.tuition || 90000)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Admission / Registration</span>
                <span className="font-bold text-slate-900">{formatCurrency(breakdown.admission || 15000)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Lab & Computing</span>
                <span className="font-bold text-slate-900">{formatCurrency(breakdown.lab || 12000)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Library & Journals</span>
                <span className="font-bold text-slate-900">{formatCurrency(breakdown.library || 6000)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Examination & Assessments</span>
                <span className="font-bold text-slate-900">{formatCurrency(breakdown.exam || 8000)}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-100">
                <span className="text-slate-600">Campus Tech & ERP</span>
                <span className="font-bold text-slate-900">{formatCurrency(breakdown.tech || 9000)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 font-bold text-blue-900 text-sm">
                <span>Total Annual Demand</span>
                <span>{formatCurrency(assignment?.totalFees)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Center & Right Column: Ledger Timeline, Invoices, Receipts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Invoices Generated */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Issued Demand Invoices ({profile?.invoices?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-2.5 px-4">Invoice ID</th>
                    <th className="py-2.5 px-4">Installment</th>
                    <th className="py-2.5 px-4 text-right">Net Amount</th>
                    <th className="py-2.5 px-4">Due Date</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profile?.invoices?.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-4 font-mono font-medium text-blue-700">
                        <Link to={`/finance/invoices/${inv.id}`} className="hover:underline">
                          {inv.id}
                        </Link>
                      </td>
                      <td className="py-2.5 px-4 text-slate-700">{inv.installmentName}</td>
                      <td className="py-2.5 px-4 text-right font-extrabold text-slate-900">
                        {formatCurrency(inv.netAmount)}
                      </td>
                      <td className="py-2.5 px-4 text-slate-600">{inv.dueDate}</td>
                      <td className="py-2.5 px-4">
                        <InvoiceStatusBadge status={inv.status} />
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Button variant="ghost" size="sm" asChild className="h-6 text-xs text-blue-600">
                          <Link to={`/finance/invoices/${inv.id}`}>
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Transaction Timeline */}
          <StudentLedgerTimeline events={profile?.timeline} />
        </div>
      </div>

      {/* Collect Payment Modal */}
      <PaymentCollectionModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        student={assignment}
        onSuccess={() => loadData()}
      />

      {/* Apply Discount Modal */}
      <Dialog open={discountModalOpen} onOpenChange={setDiscountModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Apply Concession / Fee Waiver
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleApplyDiscount} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Concession Amount (₹) *</label>
              <Input
                type="number"
                min="1"
                max={assignment?.netPayable}
                value={discountAmount}
                onChange={(e) => setDiscountAmount(Number(e.target.value))}
                required
                className="text-xs font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Reason / Justification *</label>
              <Input
                value={discountReason}
                onChange={(e) => setDiscountReason(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div className="p-2.5 bg-slate-50 border rounded text-[11px] text-slate-600">
              Approved by authorized officer. An audit event will be permanently attached to the student ledger.
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setDiscountModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700">
                Grant Concession
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Request Refund Modal */}
      <Dialog open={refundModalOpen} onOpenChange={setRefundModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Initiate Student Refund Request
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleRequestRefund} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Refund Amount (₹) *</label>
              <Input
                type="number"
                min="1"
                max={assignment?.paidAmount || 50000}
                value={refundAmount}
                onChange={(e) => setRefundAmount(Number(e.target.value))}
                required
                className="text-xs font-bold"
              />
              <span className="text-[10px] text-slate-400">Cannot exceed paid amount: {formatCurrency(assignment?.paidAmount)}</span>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Refund Justification *</label>
              <Input
                value={refundReason}
                onChange={(e) => setRefundReason(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setRefundModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-rose-600 hover:bg-rose-700">
                Submit Refund
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
