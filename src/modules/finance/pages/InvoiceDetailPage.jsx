// src/modules/finance/pages/InvoiceDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { InvoiceStatusBadge } from '../components/InvoiceStatusBadge'
import { PaymentCollectionModal } from '../components/PaymentCollectionModal'
import { invoiceService } from '../services/invoiceService'
import { formatCurrency } from '../config/financeConfig'
import {
  ArrowLeft,
  CreditCard,
  Printer,
  FileText,
  Calendar,
  Building,
  User,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'

export function InvoiceDetailPage() {
  const { id } = useParams()
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paymentModalOpen, setPaymentModalOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await invoiceService.getInvoiceById(id)
      setInvoice(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading invoice details...</div>
  }

  if (!invoice) {
    return <div className="p-8 text-center text-xs text-slate-500">Invoice not found.</div>
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title={`Invoice: ${invoice.id}`}
        description={`Issued for ${invoice.studentName} (${invoice.studentId}) — Due on ${invoice.dueDate}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link to="/finance/invoices">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Back to Invoices
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint} className="text-xs">
              <Printer className="h-3.5 w-3.5 mr-1" />
              Print Demand
            </Button>
            {invoice.outstandingAmount > 0 && (
              <Button
                size="sm"
                onClick={() => setPaymentModalOpen(true)}
                className="bg-emerald-600 hover:bg-emerald-700 shadow-xs text-xs"
              >
                <CreditCard className="h-3.5 w-3.5 mr-1" />
                Collect Payment ({formatCurrency(invoice.outstandingAmount)})
              </Button>
            )}
          </div>
        }
      />

      {/* Invoice Document Paper */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b pb-4 border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded bg-blue-600 text-white font-bold flex items-center justify-center text-sm">
                M
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900">
                MyCampace Education Operating System
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Institutional Fee Demand Note</p>
            <p className="text-[11px] text-slate-400">{invoice.campusName} • Knowledge Park</p>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm font-bold text-blue-700">{invoice.id}</div>
            <div className="mt-1">
              <InvoiceStatusBadge status={invoice.status} />
            </div>
            <div className="text-xs text-slate-500 mt-1">Issue Date: {invoice.issueDate}</div>
            <div className="text-xs font-semibold text-rose-600">Due Date: {invoice.dueDate}</div>
          </div>
        </div>

        {/* Bill To & Academic Details */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded border border-slate-200 text-xs">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Bill To Student</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{invoice.studentName}</div>
            <div className="text-slate-600 font-mono text-[11px]">ID: {invoice.studentId} | Roll: {invoice.rollNumber}</div>
            <div className="text-slate-600 mt-0.5">{invoice.feeStructureName}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Term Schedule</div>
            <div className="text-sm font-bold text-slate-900 mt-0.5">{invoice.installmentName}</div>
            <div className="text-slate-600 mt-0.5">Academic Session: {invoice.academicYearName}</div>
            <div className="text-slate-600">{invoice.campusName}</div>
          </div>
        </div>

        {/* Itemized Line Items */}
        <div>
          <table className="w-full text-xs text-left border border-slate-200 rounded">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 text-right">Gross Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invoice.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-2.5 px-3 text-slate-700">{item.description}</td>
                  <td className="py-2.5 px-3 text-right font-medium text-slate-800">
                    {formatCurrency(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-slate-200 text-xs">
              <tr>
                <td className="py-2 px-3 text-slate-600 text-right font-medium">Gross Total:</td>
                <td className="py-2 px-3 text-right font-semibold text-slate-800">{formatCurrency(invoice.grossAmount)}</td>
              </tr>
              {invoice.discountAmount > 0 && (
                <tr className="text-purple-700">
                  <td className="py-1 px-3 text-right font-medium">Concession / Discount:</td>
                  <td className="py-1 px-3 text-right font-semibold">-{formatCurrency(invoice.discountAmount)}</td>
                </tr>
              )}
              <tr className="bg-blue-50/70 font-bold text-blue-950 text-sm">
                <td className="py-2.5 px-3 text-right">Net Payable Amount:</td>
                <td className="py-2.5 px-3 text-right font-black">{formatCurrency(invoice.netAmount)}</td>
              </tr>
              <tr>
                <td className="py-2 px-3 text-emerald-700 text-right font-medium">Amount Already Settled:</td>
                <td className="py-2 px-3 text-right font-bold text-emerald-700">-{formatCurrency(invoice.paidAmount)}</td>
              </tr>
              <tr className="bg-rose-50/50 font-bold text-rose-700">
                <td className="py-2.5 px-3 text-right">Outstanding Balance Due:</td>
                <td className="py-2.5 px-3 text-right text-base font-extrabold">{formatCurrency(invoice.outstandingAmount)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Footer Audit Notice */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-blue-600" />
            <span>Digital demand authenticated by MyCampace Finance Engine.</span>
          </div>
          <div>
            Payment methods accepted: UPI, Net Banking, Debit/Credit Card, Bank Transfer.
          </div>
        </div>
      </div>

      <PaymentCollectionModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        invoice={invoice}
        onSuccess={() => loadData()}
      />
    </div>
  )
}
