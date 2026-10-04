// src/modules/finance/pages/PaymentsListPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { InvoiceStatusBadge } from '../components/InvoiceStatusBadge'
import { ReceiptViewerModal } from '../components/ReceiptViewerModal'
import { PaymentCollectionModal } from '../components/PaymentCollectionModal'
import { paymentService } from '../services/paymentService'
import { receiptService } from '../services/receiptService'
import { formatCurrency, PAYMENT_METHODS } from '../config/financeConfig'
import {
  CreditCard,
  Search,
  Receipt as ReceiptIcon,
  Eye,
  Plus,
  ArrowRight,
  Filter,
} from 'lucide-react'

export function PaymentsListPage() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [methodFilter, setMethodFilter] = useState('all')

  // Modals
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await paymentService.getPayments({
        status: statusFilter,
        paymentMethod: methodFilter,
        search,
      })
      setPayments(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [statusFilter, methodFilter, search])

  const handleOpenReceipt = async (receiptId) => {
    if (!receiptId) return
    try {
      const r = await receiptService.getReceiptById(receiptId)
      setSelectedReceipt(r)
      setReceiptModalOpen(true)
    } catch (err) {
      alert('Receipt not found')
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Payment Transactions & Collections"
        description="Comprehensive audit ledger of institutional payments across digital gateways, UPI, net banking, cards, and counter cash."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setCollectionModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 shadow-xs text-xs"
            >
              <CreditCard className="h-3.5 w-3.5 mr-1.5" />
              Collect Payment
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search Txn ID, student, gateway ref..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={methodFilter} onValueChange={setMethodFilter}>
            <SelectTrigger className="w-40 text-xs h-8">
              <SelectValue placeholder="All Methods" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Methods</SelectItem>
              {PAYMENT_METHODS.map(m => (
                <SelectItem key={m.id} value={m.id} className="text-xs">{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36 text-xs h-8">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
              <SelectItem value="Success" className="text-xs">Success</SelectItem>
              <SelectItem value="Pending" className="text-xs">Pending</SelectItem>
              <SelectItem value="Failed" className="text-xs">Failed</SelectItem>
              <SelectItem value="Partially Refunded" className="text-xs">Partially Refunded</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Transaction ID</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Invoice</th>
                  <th className="py-2.5 px-4">Method & Gateway</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4">Payment Date</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Settlement</th>
                  <th className="py-2.5 px-4">Receipt</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-blue-700">
                      <Link to={`/finance/payments/${p.id}`} className="hover:underline">
                        {p.id}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">{p.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{p.studentId}</div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {p.invoiceId ? (
                        <Link to={`/finance/invoices/${p.invoiceId}`} className="hover:underline text-blue-600">
                          {p.invoiceId}
                        </Link>
                      ) : (
                        <span className="text-slate-400 italic">Direct Deposit</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-800">{p.paymentMethod}</div>
                      <div className="text-[10px] text-slate-400">{p.gateway}</div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(p.amount)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      {new Date(p.paymentDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-2.5 px-4">
                      <InvoiceStatusBadge status={p.status} />
                    </td>
                    <td className="py-2.5 px-4">
                      <Badge variant={p.settlementStatus === 'Reconciled' ? 'success' : 'secondary'} className="text-[10px]">
                        {p.settlementStatus}
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4">
                      {p.receiptId ? (
                        <button
                          onClick={() => handleOpenReceipt(p.receiptId)}
                          className="font-mono text-purple-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <ReceiptIcon className="h-3 w-3" />
                          {p.receiptId}
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">N/A</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <Button variant="ghost" size="sm" asChild className="h-6 text-xs text-blue-600">
                        <Link to={`/finance/payments/${p.id}`}>
                          <Eye className="h-3 w-3 mr-1" />
                          Details
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <PaymentCollectionModal
        isOpen={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        onSuccess={() => loadData()}
      />

      <ReceiptViewerModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receipt={selectedReceipt}
      />
    </div>
  )
}
