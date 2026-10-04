// src/modules/finance/pages/ReconciliationPage.jsx
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
import { reconciliationService } from '../services/reconciliationService'
import { formatCurrency, RECONCILIATION_STATUSES } from '../config/financeConfig'
import {
  Scale,
  Search,
  UploadCloud,
  CheckCircle,
  AlertTriangle,
  FileSpreadsheet,
  Download,
  Eye,
} from 'lucide-react'

export function ReconciliationPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Upload modal
  const [uploadModalOpen, setUploadModalOpen] = useState(false)
  const [uploadResult, setUploadResult] = useState(null)
  const [uploading, setUploading] = useState(false)

  // Mismatch detail modal
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [mismatchModalOpen, setMismatchModalOpen] = useState(false)
  const [reconcileNotes, setReconcileNotes] = useState('')

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await reconciliationService.getReconciliations({
        status: statusFilter,
        search,
      })
      setRecords(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [statusFilter, search])

  const handleUploadSimulate = async () => {
    setUploading(true)
    try {
      const res = await reconciliationService.uploadSettlementBatch('RAZORPAY_SETTLEMENT_20260901.csv', 8)
      setUploadResult(res)
      loadData()
    } catch (err) {
      alert('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleMarkReconciled = async () => {
    if (!selectedRecord) return
    try {
      await reconciliationService.markReconciled(selectedRecord.id, reconcileNotes)
      setMismatchModalOpen(false)
      loadData()
    } catch (err) {
      alert('Failed to mark reconciled')
    }
  }

  const getStatusBadge = (st) => {
    switch (st) {
      case 'Matched':
        return <Badge variant="success" className="text-[10px]">Matched</Badge>
      case 'Reconciled':
        return <Badge variant="info" className="text-[10px]">Reconciled</Badge>
      case 'Mismatch':
        return <Badge variant="destructive" className="text-[10px]">Mismatch</Badge>
      case 'Pending':
        return <Badge variant="warning" className="text-[10px]">Pending (T+2)</Badge>
      default:
        return <Badge variant="secondary" className="text-[10px]">{st}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Gateway Settlement & Bank Reconciliation"
        description="Verify captured student payments against payment gateway settlement files, merchant fee deductions, and bank escrow credits."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => {
                setUploadResult(null)
                setUploadModalOpen(true)
              }}
              className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs"
            >
              <UploadCloud className="h-3.5 w-3.5 mr-1.5" />
              Upload Settlement File
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search txn ID, gateway ref, student..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-44 text-xs h-8">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Statuses</SelectItem>
              {RECONCILIATION_STATUSES.map(st => (
                <SelectItem key={st} value={st} className="text-xs">{st}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Reconciliation Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Internal Txn ID</th>
                  <th className="py-2.5 px-4">Gateway</th>
                  <th className="py-2.5 px-4">Gateway Ref</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4 text-right">Captured (₹)</th>
                  <th className="py-2.5 px-4 text-right">Settled (₹)</th>
                  <th className="py-2.5 px-4">Settlement Date</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-blue-700">
                      <Link to={`/finance/payments/${r.transactionId}`} className="hover:underline">
                        {r.transactionId}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-800">
                      {r.gateway}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {r.gatewayReference}
                    </td>
                    <td className="py-2.5 px-4 font-semibold text-slate-900">
                      {r.studentName}
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(r.amount)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-emerald-700">
                      {formatCurrency(r.settlementAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600">
                      {r.settlementDate ? new Date(r.settlementDate).toLocaleDateString('en-IN') : <span className="text-amber-600 font-medium">Pending Cycle</span>}
                    </td>
                    <td className="py-2.5 px-4">
                      {getStatusBadge(r.status)}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {r.status === 'Mismatch' ? (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedRecord(r)
                            setReconcileNotes('')
                            setMismatchModalOpen(true)
                          }}
                          className="h-7 text-xs"
                        >
                          Resolve Mismatch
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-7 text-xs text-blue-600"
                        >
                          <Link to={`/finance/payments/${r.transactionId}`}>
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Audit
                          </Link>
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Upload Settlement Modal */}
      <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UploadCloud className="h-5 w-5 text-blue-600" />
              Upload Payment Gateway Settlement File
            </DialogTitle>
          </DialogHeader>

          {uploadResult ? (
            <div className="py-4 text-center space-y-3">
              <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-800">Batch Processing Completed</h4>
              <p className="text-xs text-slate-500 font-mono">Batch ID: {uploadResult.batchId}</p>
              <div className="p-3 bg-slate-50 rounded border text-xs text-left space-y-1">
                <div className="flex justify-between">
                  <span>Total Records:</span>
                  <span className="font-bold">{uploadResult.totalRecords}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>Matched & Verified:</span>
                  <span className="font-bold">{uploadResult.matchedCount}</span>
                </div>
                <div className="flex justify-between text-rose-700">
                  <span>Exceptions / Mismatches:</span>
                  <span className="font-bold">{uploadResult.mismatchCount}</span>
                </div>
              </div>
              <Button size="sm" onClick={() => setUploadModalOpen(false)}>
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-4 py-2 text-xs">
              <p className="text-slate-600">
                Upload official bank settlement MIS file (.csv, .xlsx) from Razorpay, BillDesk, CashFree or ICICI Eazypay to auto-match transaction references.
              </p>
              <div className="p-6 border-2 border-dashed border-slate-300 rounded-lg text-center bg-slate-50/50">
                <FileSpreadsheet className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-slate-800">Drag settlement CSV file here</div>
                <div className="text-[11px] text-slate-400 mt-1">or click to browse from desktop</div>
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setUploadModalOpen(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleUploadSimulate} disabled={uploading} className="bg-blue-600 hover:bg-blue-700">
                  {uploading ? 'Processing File...' : 'Upload & Auto-Reconcile'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Resolve Mismatch Modal */}
      <Dialog open={mismatchModalOpen} onOpenChange={setMismatchModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              Settlement Exception: {selectedRecord?.transactionId}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2 space-y-4 text-xs">
            <div className="p-3 bg-rose-50 border border-rose-200 rounded text-rose-900 font-medium">
              {selectedRecord?.mismatch}
            </div>

            <div className="p-3 bg-slate-50 border rounded space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Gateway Ref:</span>
                <span className="font-mono font-semibold">{selectedRecord?.gatewayReference}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Captured Amount:</span>
                <span className="font-bold">{formatCurrency(selectedRecord?.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Bank Settled:</span>
                <span className="font-bold">{formatCurrency(selectedRecord?.settlementAmount)}</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Resolution Justification & Ledger Adjustment Note *
              </label>
              <Input
                placeholder="e.g. Voucher discount credited separately by promo budget"
                value={reconcileNotes}
                onChange={(e) => setReconcileNotes(e.target.value)}
                className="text-xs"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setMismatchModalOpen(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleMarkReconciled} className="bg-emerald-600 hover:bg-emerald-700">
                Mark Reconciled
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
