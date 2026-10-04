// src/modules/finance/components/PaymentCollectionModal.jsx
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { formatCurrency, PAYMENT_METHODS } from '../config/financeConfig'
import { paymentService } from '../services/paymentService'
import { CheckCircle2, CreditCard, ShieldCheck } from 'lucide-react'

export function PaymentCollectionModal({ isOpen, onClose, invoice, student, onSuccess }) {
  const [amount, setAmount] = useState(invoice ? invoice.outstandingAmount : 50000)
  const [method, setMethod] = useState('upi')
  const [reference, setReference] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [receiptResult, setReceiptResult] = useState(null)

  const handleCollect = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const selectedMethodObj = PAYMENT_METHODS.find(m => m.id === method)
      const res = await paymentService.collectPayment({
        invoiceId: invoice?.id || null,
        studentId: student?.studentId || invoice?.studentId || 'STU-2026-0001',
        studentName: student?.studentName || invoice?.studentName || 'Student Name',
        amount: Number(amount),
        paymentMethod: selectedMethodObj ? selectedMethodObj.label : 'UPI / QR Code',
        gatewayTransactionId: reference || undefined,
        notes,
      })
      setReceiptResult(res.receipt)
      if (onSuccess) onSuccess(res)
    } catch (err) {
      alert(err.message || 'Payment collection failed')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setReceiptResult(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base font-bold text-slate-900">
            <CreditCard className="h-5 w-5 text-blue-600" />
            {receiptResult ? 'Payment Collected Successfully' : 'Collect Fee Payment'}
          </DialogTitle>
        </DialogHeader>

        {receiptResult ? (
          <div className="py-4 text-center space-y-4">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Receipt Generated</h3>
              <p className="text-xs text-slate-500 mt-1">Receipt Number: <span className="font-mono font-bold text-blue-600">{receiptResult.receiptNumber}</span></p>
              <div className="mt-3 p-3 bg-slate-50 rounded border border-slate-200 text-sm font-semibold text-slate-700">
                Amount Paid: <span className="text-emerald-600 font-bold">{formatCurrency(receiptResult.amount)}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button variant="default" size="sm" onClick={handleClose}>
                Done
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleCollect} className="space-y-4 py-2">
            {invoice && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-md text-xs space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>Invoice:</span>
                  <span className="font-mono font-medium text-slate-700">{invoice.id}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Student:</span>
                  <span className="font-medium text-slate-800">{invoice.studentName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Total Net:</span>
                  <span className="font-bold text-slate-800">{formatCurrency(invoice.netAmount)}</span>
                </div>
                <div className="flex justify-between text-slate-700 font-semibold border-t border-slate-200 pt-1">
                  <span>Outstanding Balance:</span>
                  <span className="text-rose-600 font-bold">{formatCurrency(invoice.outstandingAmount)}</span>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Payment Amount (₹) *
              </label>
              <Input
                type="number"
                min="1"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="font-bold text-base text-slate-900"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Payment Method *
              </label>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.id} value={m.id} className="text-xs">
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Transaction Reference / UTR / Cheque No.
              </label>
              <Input
                placeholder="e.g. UTR-982182910 or Cheque #00281"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                className="text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 mb-1 block">
                Audit Notes / Counter Remarks
              </label>
              <Textarea
                placeholder="Optional payment notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="text-xs resize-none h-16"
              />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-slate-500 bg-blue-50/50 p-2 rounded border border-blue-100">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <span>Payment will be logged into institutional ledger with unique receipt generation.</span>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={loading}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={loading} className="bg-emerald-600 hover:bg-emerald-700">
                {loading ? 'Processing...' : `Record Payment (${formatCurrency(Number(amount))})`}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
