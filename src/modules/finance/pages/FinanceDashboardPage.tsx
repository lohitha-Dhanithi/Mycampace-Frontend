// src/modules/finance/pages/FinanceDashboardPage.jsx
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
import { ReceiptViewerModal } from '../components/ReceiptViewerModal'
import { financeService } from '../services/financeService'
import { receiptService } from '../services/receiptService'
import { formatCurrency } from '../config/financeConfig'
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Layers,
  GraduationCap,
  FileText,
  CreditCard,
  Megaphone,
  Landmark,
  Search,
  ArrowRight,
  Filter,
  Eye,
  Receipt as ReceiptIcon,
} from 'lucide-react'

export function FinanceDashboardPage() {
  const [kpis, setKpis] = useState(null)
  const [chartData, setChartData] = useState([])
  const [categoryBreakdown, setCategoryBreakdown] = useState([])
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState(null)
  const [selectedCampus, setSelectedCampus] = useState('all')
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('2026-27')

  // Modals
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [receiptModalOpen, setReceiptModalOpen] = useState(false)
  const [selectedReceipt, setSelectedReceipt] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [kpiRes, chartRes, catRes, txnRes] = await Promise.all([
        financeService.getDashboardKPIs(),
        financeService.getCollectionChartData(),
        financeService.getCollectionBreakdownByCategory(),
        financeService.getRecentTransactions(8),
      ])
      setKpis(kpiRes)
      setChartData(chartRes)
      setCategoryBreakdown(catRes)
      setTransactions(txnRes)
    } catch (err) {
      console.error('Error loading finance dashboard data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedCampus, selectedAcademicYear])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchQuery.trim()) {
      setSearchResults(null)
      return
    }
    const res = await financeService.unifiedSearch(searchQuery)
    setSearchResults(res)
  }

  const handleViewReceipt = async (receiptId) => {
    if (!receiptId) return
    try {
      const r = await receiptService.getReceiptById(receiptId)
      setSelectedReceipt(r)
      setReceiptModalOpen(true)
    } catch (err) {
      alert('Receipt record not found')
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Institutional Finance & Fee Management"
        description="Core financial ledger, fee structures, payment collections, advertising inventory, and DhanitiPay integrations."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              className="bg-emerald-600 hover:bg-emerald-700 shadow-xs text-xs"
              onClick={() => {
                setSelectedInvoice(null)
                setCollectionModalOpen(true)
              }}
            >
              <CreditCard className="h-3.5 w-3.5 mr-1.5" />
              Collect Payment
            </Button>
            <Button size="sm" variant="outline" asChild className="text-xs">
              <Link to="/finance/fee-structures/new">
                <Layers className="h-3.5 w-3.5 mr-1.5 text-blue-600" />
                New Fee Structure
              </Link>
            </Button>
          </div>
        }
      />

      {/* Global Filter & Unified Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search students, invoices, transactions, receipts, ad campaigns, loan applications..."
            className="pl-9 text-xs"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              if (!e.target.value) setSearchResults(null)
            }}
          />
        </form>

        <div className="flex items-center gap-2">
          <Select value={selectedCampus} onValueChange={setSelectedCampus}>
            <SelectTrigger className="w-36 text-xs h-8">
              <SelectValue placeholder="All Campuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="text-xs">All Campuses</SelectItem>
              <SelectItem value="campus-main" className="text-xs">Main Campus</SelectItem>
              <SelectItem value="campus-south" className="text-xs">South City Campus</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedAcademicYear} onValueChange={setSelectedAcademicYear}>
            <SelectTrigger className="w-32 text-xs h-8">
              <SelectValue placeholder="AY 2026–27" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026-27" className="text-xs">AY 2026–27</SelectItem>
              <SelectItem value="2025-26" className="text-xs">AY 2025–26</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Search Results Display (if active) */}
      {searchResults && (
        <Card className="border-blue-200 bg-blue-50/20">
          <CardHeader className="py-3 px-4 border-b border-blue-100 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold text-blue-900 flex items-center gap-2">
              <Search className="h-3.5 w-3.5 text-blue-600" />
              Unified Search Results for "{searchQuery}"
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setSearchResults(null)} className="h-6 text-[11px] text-slate-500">
              Clear Search
            </Button>
          </CardHeader>
          <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Students */}
            <div>
              <div className="font-bold text-slate-700 mb-1 flex items-center justify-between">
                <span>Students ({searchResults.students.length})</span>
              </div>
              <div className="space-y-1">
                {searchResults.students.slice(0, 3).map((s) => (
                  <Link
                    key={s.studentId}
                    to={`/finance/student-fees/${s.studentId}`}
                    className="block p-2 bg-white rounded border border-slate-200 hover:border-blue-400 transition-colors"
                  >
                    <div className="font-semibold text-slate-900">{s.studentName}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{s.studentId} | {s.programName}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Invoices */}
            <div>
              <div className="font-bold text-slate-700 mb-1">Invoices ({searchResults.invoices.length})</div>
              <div className="space-y-1">
                {searchResults.invoices.slice(0, 3).map((i) => (
                  <Link
                    key={i.id}
                    to={`/finance/invoices/${i.id}`}
                    className="block p-2 bg-white rounded border border-slate-200 hover:border-blue-400 transition-colors"
                  >
                    <div className="font-mono font-semibold text-blue-700">{i.id}</div>
                    <div className="text-[11px] text-slate-600">{i.studentName} — {formatCurrency(i.netAmount)}</div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Payments & Loans */}
            <div>
              <div className="font-bold text-slate-700 mb-1">Transactions & Loans ({searchResults.payments.length + searchResults.loans.length})</div>
              <div className="space-y-1">
                {searchResults.payments.slice(0, 2).map((p) => (
                  <Link
                    key={p.id}
                    to={`/finance/payments/${p.id}`}
                    className="block p-2 bg-white rounded border border-slate-200 hover:border-blue-400 transition-colors"
                  >
                    <div className="font-mono text-emerald-700 font-bold">{p.id} — {formatCurrency(p.amount)}</div>
                    <div className="text-[11px] text-slate-500">{p.studentName} via {p.paymentMethod}</div>
                  </Link>
                ))}
                {searchResults.loans.slice(0, 2).map((l) => (
                  <Link
                    key={l.id}
                    to={`/finance/financial-services/applications/${l.id}`}
                    className="block p-2 bg-white rounded border border-slate-200 hover:border-indigo-400 transition-colors"
                  >
                    <div className="font-mono text-indigo-700 font-bold">{l.id} ({l.currentStatus})</div>
                    <div className="text-[11px] text-slate-500">{l.applicantName} — {l.productName}</div>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Assigned */}
        <Card className="p-3 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Fees Assigned</span>
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-lg font-black text-slate-900 mt-1">
            {formatCurrency(kpis?.totalFeesAssigned || 0)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Net after concessions</div>
        </Card>

        {/* Collected */}
        <Card className="p-3 border-slate-200 shadow-xs bg-emerald-50/20">
          <div className="flex items-center justify-between text-emerald-800 text-[11px] font-semibold uppercase tracking-wider">
            <span>Collected</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-emerald-700 mt-1">
            {formatCurrency(kpis?.collected || 0)}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Bank settled funds</div>
        </Card>

        {/* Outstanding */}
        <Card className="p-3 border-slate-200 shadow-xs bg-amber-50/20">
          <div className="flex items-center justify-between text-amber-800 text-[11px] font-semibold uppercase tracking-wider">
            <span>Outstanding</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-lg font-black text-amber-700 mt-1">
            {formatCurrency(kpis?.outstanding || 0)}
          </div>
          <div className="text-[10px] text-amber-600 mt-0.5">Pending upcoming installments</div>
        </Card>

        {/* Overdue */}
        <Card className="p-3 border-slate-200 shadow-xs bg-rose-50/20">
          <div className="flex items-center justify-between text-rose-800 text-[11px] font-semibold uppercase tracking-wider">
            <span>Overdue Dues</span>
            <AlertTriangle className="h-4 w-4 text-rose-600" />
          </div>
          <div className="text-lg font-black text-rose-700 mt-1">
            {formatCurrency(kpis?.overdue || 0)}
          </div>
          <div className="text-[10px] text-rose-600 mt-0.5">Late fee applicable</div>
        </Card>

        {/* Collection Rate */}
        <Card className="p-3 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Collection Rate</span>
            <TrendingUp className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-lg font-black text-indigo-700 mt-1">
            {kpis?.collectionRate || 0}%
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Target: 85% for Term 1</div>
        </Card>

        {/* Pending Refunds */}
        <Card className="p-3 border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-[11px] font-semibold uppercase tracking-wider">
            <span>Pending Refunds</span>
            <RotateCcw className="h-4 w-4 text-purple-600" />
          </div>
          <div className="text-lg font-black text-purple-700 mt-1">
            {formatCurrency(kpis?.pendingRefunds || 0)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">In accounts review</div>
        </Card>
      </div>

      {/* Operational Highlights Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-3.5 bg-gradient-to-r from-blue-900 to-indigo-900 rounded-lg text-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-blue-200 font-medium">Today's Collections</div>
            <div className="text-xl font-black mt-0.5">{formatCurrency(kpis?.todayCollections || 25000)}</div>
          </div>
          <Badge className="bg-blue-800 text-blue-100 text-[10px]">Real-time Sync</Badge>
        </div>

        <div className="p-3.5 bg-gradient-to-r from-slate-900 to-slate-800 rounded-lg text-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-300 font-medium">This Month's Run Rate</div>
            <div className="text-xl font-black mt-0.5">{formatCurrency(kpis?.thisMonthCollections || 370000)}</div>
          </div>
          <Badge className="bg-slate-700 text-slate-200 text-[10px]">+14% vs Last Year</Badge>
        </div>

        <div className="p-3.5 bg-gradient-to-r from-emerald-950 to-teal-900 rounded-lg text-white shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs text-teal-200 font-medium">Expected Next 30 Days</div>
            <div className="text-xl font-black mt-0.5">{formatCurrency(kpis?.expectedCollections || 330000)}</div>
          </div>
          <Badge className="bg-teal-800 text-teal-100 text-[10px]">Term 2 Schedules</Badge>
        </div>
      </div>

      {/* Visualizations & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Collection Bar Graph (Recharts or Custom CSS Bars) */}
        <Card className="lg:col-span-2 border-slate-200 shadow-xs">
          <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Monthly Fee Collection Trend (Expected vs Collected)
              </CardTitle>
              <p className="text-[11px] text-slate-500 mt-0.5">Tracking reconciliation against institutional billing schedule</p>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono">FY 2026-27</Badge>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-100">
              {chartData.map((cd, idx) => {
                const maxVal = 950000
                const expHeight = Math.round((cd.expected / maxVal) * 100)
                const colHeight = Math.round((cd.collected / maxVal) * 100)
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Expected Bar */}
                      <div
                        style={{ height: `${expHeight}%` }}
                        className="w-3.5 bg-slate-200 rounded-t transition-all group-hover:bg-slate-300"
                        title={`Expected: ${formatCurrency(cd.expected)}`}
                      />
                      {/* Collected Bar */}
                      <div
                        style={{ height: `${colHeight}%` }}
                        className="w-3.5 bg-blue-600 rounded-t transition-all group-hover:bg-blue-700 shadow-xs"
                        title={`Collected: ${formatCurrency(cd.collected)}`}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                      {cd.month.split(' ')[0]}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-center gap-6 pt-3 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-xs bg-slate-300 inline-block" />
                <span>Expected Billing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-xs bg-blue-600 inline-block" />
                <span>Collected & Settled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fee Category Breakdown */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="py-3 px-4 border-b border-slate-100">
            <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Collections by Fee Component
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3.5">
            {categoryBreakdown.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{cat.name}</span>
                  <span className="font-bold text-slate-900">{formatCurrency(cat.value)}</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${(cat.value / 480000) * 100}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="pt-3 border-t border-slate-100">
              <Button variant="outline" size="sm" asChild className="w-full text-xs">
                <Link to="/finance/reports/collections">
                  View Full Collections Report
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Recent Payment Transactions
            </CardTitle>
            <p className="text-[11px] text-slate-500 mt-0.5">Live gateway and counter receipts</p>
          </div>
          <Button variant="outline" size="sm" asChild className="text-xs h-7">
            <Link to="/finance/payments">
              View All Transactions
              <ArrowRight className="h-3 w-3 ml-1" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="py-2.5 px-4">Txn ID</th>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Invoice</th>
                  <th className="py-2.5 px-4">Method & Gateway</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4">Receipt</th>
                  <th className="py-2.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4 font-mono font-medium text-blue-700">
                      <Link to={`/finance/payments/${tx.id}`} className="hover:underline">
                        {tx.id}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">{tx.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{tx.studentId}</div>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      <Link to={`/finance/invoices/${tx.invoiceId}`} className="hover:underline text-blue-600">
                        {tx.invoiceId}
                      </Link>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-slate-800">{tx.paymentMethod}</div>
                      <div className="text-[10px] text-slate-400">{tx.gateway}</div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-2.5 px-4">
                      <InvoiceStatusBadge status={tx.status} />
                    </td>
                    <td className="py-2.5 px-4">
                      {tx.receiptId ? (
                        <button
                          onClick={() => handleViewReceipt(tx.receiptId)}
                          className="font-mono text-purple-700 font-bold hover:underline flex items-center gap-1 text-[11px]"
                        >
                          <ReceiptIcon className="h-3 w-3" />
                          {tx.receiptId}
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[11px]">N/A</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <Button variant="ghost" size="sm" asChild className="h-6 text-xs text-blue-600">
                        <Link to={`/finance/payments/${tx.id}`}>
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
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

      {/* Modals */}
      <PaymentCollectionModal
        isOpen={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        invoice={selectedInvoice}
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
