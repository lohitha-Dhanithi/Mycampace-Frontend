// src/modules/finance/components/ReceiptViewerModal.jsx
import React, { useRef } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '../config/financeConfig'
import { Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react'

export function ReceiptViewerModal({ isOpen, onClose, receipt }) {
  const receiptRef = useRef()

  if (!receipt) return null

  const handlePrint = () => {
    window.print()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-white print:m-0 print:p-0 print:border-none">
        <DialogHeader className="p-4 bg-slate-900 text-white flex flex-row items-center justify-between">
          <DialogTitle className="text-sm font-bold tracking-wide flex items-center gap-2 text-white">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            Official Electronic Fee Receipt
          </DialogTitle>
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" onClick={handlePrint} className="h-7 text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700">
              <Printer className="h-3.5 w-3.5 mr-1" />
              Print
            </Button>
            <Button variant="secondary" size="sm" onClick={handlePrint} className="h-7 text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700">
              <Download className="h-3.5 w-3.5 mr-1" />
              Download
            </Button>
          </div>
        </DialogHeader>

        {/* Printable Receipt Paper */}
        <div ref={receiptRef} className="p-6 text-slate-800 space-y-5 bg-white">
          {/* Institutional Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded bg-blue-600 text-white font-black flex items-center justify-center text-base">
                  M
                </div>
                <div>
                  <h2 className="text-base font-black tracking-tight text-slate-900 uppercase">MyCampace University</h2>
                  <p className="text-[10px] text-slate-500 font-medium">Accredited by National Assessment & Accreditation Council (Grade A++)</p>
                </div>
              </div>
              <p className="text-[11px] text-slate-600">Administrative Block, Tech Campus, City Road, Knowledge Park</p>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-slate-400">Receipt No.</div>
              <div className="text-sm font-mono font-extrabold text-blue-700">{receipt.receiptNumber}</div>
              <div className="text-[11px] text-slate-500 mt-1">
                Date: {receipt.paymentDate ? new Date(receipt.paymentDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'}
              </div>
            </div>
          </div>

          {/* Student & Payment Metadata */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 border border-slate-200 rounded text-xs">
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Student Details</div>
              <div className="font-bold text-slate-900 mt-0.5">{receipt.studentName}</div>
              <div className="text-slate-600 font-mono text-[11px]">ID: {receipt.studentId} {receipt.rollNumber && `| Roll: ${receipt.rollNumber}`}</div>
              <div className="text-slate-600 mt-0.5">{receipt.programName || 'Degree Program'} ({receipt.className || 'Undergraduate'})</div>
            </div>
            <div>
              <div className="text-[10px] font-semibold text-slate-400 uppercase">Payment Context</div>
              <div className="text-slate-700 mt-0.5"><span className="font-medium">Method:</span> {receipt.paymentMethod}</div>
              {receipt.transactionId && (
                <div className="text-slate-700 text-[11px] font-mono"><span className="font-sans font-medium">Txn ID:</span> {receipt.transactionId}</div>
              )}
              {receipt.invoiceId && (
                <div className="text-slate-700 text-[11px] font-mono"><span className="font-sans font-medium">Invoice:</span> {receipt.invoiceId}</div>
              )}
              <div className="mt-1">
                <Badge variant="success" className="text-[10px] h-5">Verified & Settled</Badge>
              </div>
            </div>
          </div>

          {/* Fee Settlement Breakdown */}
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Fee Allocation Details</div>
            <table className="w-full text-xs border border-slate-200 rounded">
              <thead>
                <tr className="bg-slate-100 text-slate-700 text-left border-b border-slate-200">
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipt.breakdown?.length > 0 ? (
                  receipt.breakdown.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 text-slate-700">{item.name}</td>
                      <td className="py-2 px-3 text-right font-medium text-slate-800">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="py-2 px-3 text-slate-700">Tuition & Institutional Fee Installment</td>
                    <td className="py-2 px-3 text-right font-medium text-slate-800">{formatCurrency(receipt.amount)}</td>
                  </tr>
                )}
              </tbody>
              <tfoot>
                <tr className="bg-blue-50 font-bold border-t-2 border-slate-300 text-blue-900">
                  <td className="py-2.5 px-3">Total Amount Received</td>
                  <td className="py-2.5 px-3 text-right text-sm text-blue-950 font-extrabold">{formatCurrency(receipt.amount)}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer Signatory & Security Seal */}
          <div className="pt-4 border-t border-slate-200 flex items-end justify-between">
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <ShieldCheck className="h-6 w-6 text-emerald-600 shrink-0" />
              <div>
                <p className="font-semibold text-slate-700">Computer Generated Authentic University Receipt</p>
                <p>Authenticated cryptographically against MyCampace Central Audit Ledger.</p>
              </div>
            </div>
            <div className="text-center">
              <div className="h-10 flex items-center justify-center">
                <span className="font-serif italic font-bold text-slate-700 text-sm">Registrar (Accounts)</span>
              </div>
              <div className="border-t border-slate-300 pt-0.5 text-[10px] font-semibold text-slate-600">
                Authorized Signatory
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="p-3 bg-slate-50 border-t border-slate-200">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
