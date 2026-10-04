// src/modules/finance/pages/ReceiptsListPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { ReceiptViewerModal } from '../components/ReceiptViewerModal'
import { receiptService } from '../services/receiptService'
import { formatCurrency } from '../config/financeConfig'
import {
  Receipt as ReceiptIcon,
  Search,
  Printer,
  Download,
  Eye,
  CheckCircle,
  FileCheck,
} from 'lucide-react'

export function ReceiptsListPage() {
  const { id: routeReceiptId } = useParams()
  const [receipts, setReceipts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedReceipt, setSelectedReceipt] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await receiptService.getReceipts({ search })
      setReceipts(data)
      if (routeReceiptId) {
        const found = data.find(r => r.id === routeReceiptId || r.receiptNumber === routeReceiptId)
        if (found) {
          setSelectedReceipt(found)
          setModalOpen(true)
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
  }, [search, routeReceiptId])

  const handleOpenReceipt = (receipt) => {
    setSelectedReceipt(receipt)
    setModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Official Fee Receipts"
        description="Tamper-proof digitally signed electronic receipts generated upon successful fee settlement."
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search receipt number, student name..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing {receipts.length} verified receipts
        </div>
      </div>

      {/* Receipts Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Receipt Number</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Program & Class</th>
                  <th className="py-2.5 px-4">Payment Method</th>
                  <th className="py-2.5 px-4 text-right">Settled Amount</th>
                  <th className="py-2.5 px-4">Date Issued</th>
                  <th className="py-2.5 px-4">Verification</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {receipts.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-purple-700">
                      <button
                        onClick={() => handleOpenReceipt(r)}
                        className="hover:underline flex items-center gap-1.5"
                      >
                        <ReceiptIcon className="h-3.5 w-3.5" />
                        {r.receiptNumber}
                      </button>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">{r.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{r.studentId}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      <div>{r.programName}</div>
                      <div className="text-[10px] text-slate-400">{r.className}</div>
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 font-medium">
                      {r.paymentMethod}
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(r.amount)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 font-medium">
                      {new Date(r.paymentDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-2.5 px-4">
                      <Badge variant="success" className="text-[10px]">
                        Digitally Signed
                      </Badge>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenReceipt(r)}
                          className="h-7 text-xs text-purple-700 hover:text-purple-800"
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenReceipt(r)}
                          className="h-7 text-xs text-slate-600"
                        >
                          <Printer className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <ReceiptViewerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        receipt={selectedReceipt}
      />
    </div>
  )
}
