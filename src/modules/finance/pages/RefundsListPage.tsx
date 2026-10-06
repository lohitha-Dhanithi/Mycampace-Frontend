// src/modules/finance/pages/RefundsListPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { refundService } from '../services/refundService'
import { formatCurrency, REFUND_WORKFLOW_STATUSES } from '../config/financeConfig'
import {
  RotateCcw,
  Search,
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  History,
  ShieldCheck,
} from 'lucide-react'

export function RefundsListPage() {
  const [refunds, setRefunds] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Status Update Modal
  const [selectedRefund, setSelectedRefund] = useState(null)
  const [updateModalOpen, setUpdateModalOpen] = useState(false)
  const [newStatus, setNewStatus] = useState('Approved')
  const [approverNotes, setApproverNotes] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await refundService.getRefunds({
        status: statusFilter,
        search,
      })
      setRefunds(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [statusFilter, search])

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    if (!selectedRefund) return
    try {
      await refundService.updateRefundStatus(selectedRefund.id, newStatus, {
        approvedBy: 'Chief Accounts Officer',
        remarks: approverNotes,
      })
      setUpdateModalOpen(false)
      loadData()
    } catch (err) {
      alert(err.message || 'Failed to update refund status')
    }
  }

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Completed':
        return <Badge variant="success" className="text-[10px]">{st}</Badge>
      case 'Approved':
      case 'Processing':
        return <Badge variant="info" className="text-[10px]">{st}</Badge>
      case 'Refund Requested':
      case 'Under Review':
        return <Badge variant="warning" className="text-[10px]">{st}</Badge>
      case 'Rejected':
      case 'Cancelled':
        return <Badge variant="destructive" className="text-[10px]">{st}</Badge>
      default:
        return <Badge variant="secondary" className="text-[10px]">{st}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Refund & Fee Adjustment Processing"
        description="Formal multi-stage refund authorization workflow covering program withdrawals, hostel room downgrades, and fee adjustments."
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search refund ID, student, reason..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 text-xs h-8">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
              {REFUND_WORKFLOW_STATUSES.map((st) => (
                <SelectItem key={st} value={st} className="text-xs">{st}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Refunds Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Refund ID</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Original Payment</th>
                  <th className="py-2.5 px-4 text-right">Original Amount</th>
                  <th className="py-2.5 px-4 text-right">Refund Amount</th>
                  <th className="py-2.5 px-4">Reason</th>
                  <th className="py-2.5 px-4">Requested By</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {refunds.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-bold text-rose-700">
                      {r.id}
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">{r.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{r.studentId}</div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      <Link to={`/finance/payments/${r.paymentId}`} className="hover:underline text-blue-600">
                        {r.paymentId}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4 text-right text-slate-600">
                      {formatCurrency(r.originalAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-rose-700">
                      {formatCurrency(r.refundAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 max-w-xs truncate" title={r.reason}>
                      {r.reason}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      {r.requestedBy}
                    </td>
                    <td className="py-2.5 px-4">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedRefund(r)
                          setNewStatus(r.status)
                          setUpdateModalOpen(true)
                        }}
                        className="h-7 text-xs"
                      >
                        Review / Advance
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Advance Workflow Status Modal */}
      <Dialog open={updateModalOpen} onOpenChange={setUpdateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-rose-600" />
              Advance Refund Workflow: {selectedRefund?.id}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateStatus} className="space-y-4 py-2">
            <div className="p-3 bg-slate-50 rounded border text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Student:</span>
                <span className="font-semibold text-slate-800">{selectedRefund?.studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Refund Amount:</span>
                <span className="font-bold text-rose-700">{formatCurrency(selectedRefund?.refundAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Reason:</span>
                <span className="text-slate-700">{selectedRefund?.reason}</span>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Update Workflow Status</label>
              <Select value={newStatus} onValueChange={setNewStatus}>
                <SelectTrigger className="text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {REFUND_WORKFLOW_STATUSES.map((st) => (
                    <SelectItem key={st} value={st} className="text-xs">{st}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Approval Notes / Banking Reference</label>
              <Input
                placeholder="e.g. Authorized by Registrar / IMPS Ref REF-HDFC-9912019"
                value={approverNotes}
                onChange={(e) => setApproverNotes(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setUpdateModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-rose-600 hover:bg-rose-700">
                Update Status
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
