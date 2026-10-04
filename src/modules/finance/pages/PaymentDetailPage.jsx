// src/modules/finance/pages/PaymentDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { InvoiceStatusBadge } from '../components/InvoiceStatusBadge'
import { ReceiptViewerModal } from '../components/ReceiptViewerModal'
import { paymentService } from '../services/paymentService'
import { receiptService } from '../services/receiptService'
import { formatCurrency } from '../config/financeConfig'
import {
  ArrowLeft,
  CreditCard,
  Receipt as ReceiptIcon,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Layers,
  Building,
} from 'lucide-react'

export function PaymentDetailPage() {
  const { id } = useParams()
  const [payment, setPayment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [receipt, setReceipt] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await paymentService.getPaymentById(id)
      setPayment(data)
      if (data.receiptId) {
        try {
          const r = await receiptService.getReceiptById(data.receiptId)
          setReceipt(r)
        } catch (e) {
          console.warn('Receipt lookup note:', e)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading payment transaction...</div>
  }

  if (!payment) {
    return <div className="p-8 text-center text-xs text-slate-500">Transaction not found.</div>
  }

  const activitySteps = [
    { title: 'Payment Initiated', date: payment.paymentDate, status: 'complete' },
    { title: 'Gateway Processing', date: payment.paymentDate, status: 'complete' },
    { title: 'Payment Success & Captured', date: payment.paymentDate, status: payment.status === 'Success' ? 'complete' : 'failed' },
    { title: 'Bank Settlement & Reconciliation', date: payment.settlementDate || 'T+2 Processing', status: payment.settlementStatus === 'Reconciled' ? 'complete' : 'pending' },
  ]

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title={`Transaction: ${payment.id}`}
        description={`Payment received from ${payment.studentName} (${payment.studentId})`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link to="/finance/payments">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to Transactions
              </Link>
            </Button>
            {receipt && (
              <Button
                size="sm"
                onClick={() => setReceiptModalOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-xs"
              >
                <ReceiptIcon className="h-3.5 w-3.5 mr-1.5" />
                View Receipt ({receipt.receiptNumber})
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Transaction Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Transaction Ledger Entry
              </CardTitle>
              <InvoiceStatusBadge status={payment.status} />
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="p-4 bg-emerald-50/50 rounded-lg border border-emerald-100 flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">Settled Amount</div>
                  <div className="text-2xl font-black text-emerald-950 mt-0.5">{formatCurrency(payment.amount)}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-medium text-slate-600 block">Payment Method</span>
                  <span className="font-bold text-slate-900 text-sm">{payment.paymentMethod}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block font-medium">Gateway Service:</span>
                  <span className="font-semibold text-slate-800">{payment.gateway}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Gateway Transaction Reference:</span>
                  <span className="font-mono font-semibold text-slate-800">{payment.gatewayTransactionId || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Linked Demand Invoice:</span>
                  {payment.invoiceId ? (
                    <Link to={`/finance/invoices/${payment.invoiceId}`} className="font-mono text-blue-600 font-semibold hover:underline">
                      {payment.invoiceId}
                    </Link>
                  ) : (
                    <span className="text-slate-500 italic">Direct Student Deposit</span>
                  )}
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Settlement Status:</span>
                  <Badge variant={payment.settlementStatus === 'Reconciled' ? 'success' : 'secondary'} className="text-[10px] mt-0.5">
                    {payment.settlementStatus}
                  </Badge>
                </div>
              </div>

              {payment.notes && (
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs">
                  <span className="font-semibold text-slate-700 block mb-0.5">Notes & Context:</span>
                  <span className="text-slate-600">{payment.notes}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Student Context Card */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Student Account Context
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 text-sm">{payment.studentName}</div>
                <div className="text-slate-500 font-mono text-xs">{payment.studentId}</div>
              </div>
              <Button variant="outline" size="sm" asChild className="text-xs">
                <Link to={`/finance/student-fees/${payment.studentId}`}>
                  View Student Ledger
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Settlement & Processing Pipeline */}
        <div>
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-3 px-4 border-b border-slate-100">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Transaction Lifecycle
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activitySteps.map((step, idx) => (
                  <div key={idx} className="relative">
                    <div className={`absolute -left-[1.65rem] mt-0.5 h-4 w-4 rounded-full border-2 bg-white flex items-center justify-center ${
                      step.status === 'complete' ? 'border-emerald-500 text-emerald-500' : 'border-slate-300 text-slate-300'
                    }`}>
                      <div className={`h-1.5 w-1.5 rounded-full ${step.status === 'complete' ? 'bg-emerald-500' : 'bg-transparent'}`} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800">{step.title}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{step.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ReceiptViewerModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={receipt}
      />
    </div>
  )
}
