// src/modules/finance/pages/InvoicesListPage.jsx
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
import { PaymentCollectionModal } from '../components/PaymentCollectionModal'
import { invoiceService } from '../services/invoiceService'
import { formatCurrency } from '../config/financeConfig'
import {
  FileText,
  Search,
  Plus,
  CreditCard,
  Eye,
  Calendar,
  AlertTriangle,
} from 'lucide-react'

export function InvoicesListPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Collection modal
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await invoiceService.getInvoices({
        status: statusFilter,
        search,
      })
      setInvoices(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [statusFilter, search])

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Fee Invoices & Billing Demands"
        description="Official institutional payment demands generated per semester installment or annual lump sum."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setSelectedInvoice(null)
                setCollectionModalOpen(true)
              }}
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
            placeholder="Search invoice number or student..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40 text-xs h-8">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
              <SelectItem value="Issued" className="text-xs">Issued</SelectItem>
              <SelectItem value="Paid" className="text-xs">Paid</SelectItem>
              <SelectItem value="Partially Paid" className="text-xs">Partially Paid</SelectItem>
              <SelectItem value="Overdue" className="text-xs">Overdue</SelectItem>
              <SelectItem value="Draft" className="text-xs">Draft</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table of Invoices */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Invoice ID</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Installment Tranche</th>
                  <th className="py-2.5 px-4 text-right">Net Amount</th>
                  <th className="py-2.5 px-4 text-right">Paid</th>
                  <th className="py-2.5 px-4 text-right">Balance Due</th>
                  <th className="py-2.5 px-4">Due Date</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-blue-700">
                      <Link to={`/finance/invoices/${inv.id}`} className="hover:underline">
                        {inv.id}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">
                        <Link to={`/finance/student-fees/${inv.studentId}`} className="hover:underline">
                          {inv.studentName}
                        </Link>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{inv.studentId}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700">
                      <div className="font-medium">{inv.installmentName}</div>
                      <div className="text-[10px] text-slate-400">{inv.academicYearName} • {inv.campusName}</div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(inv.netAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-600">
                      {formatCurrency(inv.paidAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-rose-600">
                      {formatCurrency(inv.outstandingAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 font-medium">
                      {inv.dueDate}
                    </td>
                    <td className="py-2.5 px-4">
                      <InvoiceStatusBadge status={inv.status} />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-7 text-xs text-blue-600"
                        >
                          <Link to={`/finance/invoices/${inv.id}`}>
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Link>
                        </Button>
                        {inv.outstandingAmount > 0 && (
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => {
                              setSelectedInvoice(inv)
                              setCollectionModalOpen(true)
                            }}
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            Pay
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payment Modal */}
      <PaymentCollectionModal
        isOpen={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        invoice={selectedInvoice}
        onSuccess={() => loadData()}
      />
    </div>
  )
}
