// src/modules/finance/pages/FinanceReportsPage.jsx
import React, { useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { financeReportService } from '../services/financeReportService'
import { formatCurrency } from '../config/financeConfig'
import {
  BarChart3,
  Download,
  Calendar,
  Layers,
  CreditCard,
  RotateCcw,
  Megaphone,
  Landmark,
  FileSpreadsheet,
} from 'lucide-react'

export function FinanceReportsPage() {
  const location = useLocation()

  // Determine active tab from URL path if applicable
  const getInitialTab = () => {
    if (location.pathname.includes('/collections')) return 'collections'
    if (location.pathname.includes('/outstanding')) return 'outstanding'
    if (location.pathname.includes('/reconciliation')) return 'payments'
    if (location.pathname.includes('/advertising')) return 'advertising'
    if (location.pathname.includes('/financial-services')) return 'loans'
    return 'collections'
  }

  const [activeTab, setActiveTab] = useState(getInitialTab())
  const [collectionsReport, setCollectionsReport] = useState(null)
  const [outstandingReport, setOutstandingReport] = useState([])
  const [paymentsReport, setPaymentsReport] = useState([])
  const [refundsReport, setRefundsReport] = useState([])
  const [adReport, setAdReport] = useState([])
  const [loanMetrics, setLoanMetrics] = useState(null)
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [colRes, outRes, payRes, refRes, adRes, loanRes] = await Promise.all([
        financeReportService.getCollectionsReport(),
        financeReportService.getOutstandingDuesReport(),
        financeReportService.getPaymentTransactionsReport(),
        financeReportService.getRefundsReport(),
        financeReportService.getAdvertisingRevenueReport(),
        financeReportService.getFinancialServicesMetrics(),
      ])
      setCollectionsReport(colRes)
      setOutstandingReport(outRes)
      setPaymentsReport(payRes)
      setRefundsReport(refRes)
      setAdReport(adRes)
      setLoanMetrics(loanRes)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleExportCSV = (filename, headerRow, rows) => {
    const csvContent = "data:text/csv;charset=utf-8," + [headerRow, ...rows].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${filename}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Institutional Financial Reporting"
        description="Comprehensive audit-ready financial statements, collection run rates, advertising revenues, and operational financial metrics."
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-100 p-1 flex overflow-x-auto no-scrollbar">
          <TabsTrigger value="collections" className="text-xs">
            Fee Collection Report
          </TabsTrigger>
          <TabsTrigger value="outstanding" className="text-xs">
            Student Dues Report
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-xs">
            Payment Transactions
          </TabsTrigger>
          <TabsTrigger value="refunds" className="text-xs">
            Refunds & Adjustments
          </TabsTrigger>
          <TabsTrigger value="advertising" className="text-xs">
            Advertising Revenue
          </TabsTrigger>
          <TabsTrigger value="loans" className="text-xs">
            Financial Services Metrics
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: COLLECTIONS REPORT */}
        <TabsContent value="collections" className="space-y-4">
          {collectionsReport?.summary && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Card className="p-3 border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Expected</div>
                <div className="text-lg font-black text-slate-900 mt-1">{formatCurrency(collectionsReport.summary.expected)}</div>
              </Card>
              <Card className="p-3 border-slate-200 bg-emerald-50/30">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Collected</div>
                <div className="text-lg font-black text-emerald-800 mt-1">{formatCurrency(collectionsReport.summary.collected)}</div>
              </Card>
              <Card className="p-3 border-slate-200 bg-amber-50/30">
                <div className="text-[10px] text-amber-800 font-bold uppercase">Outstanding</div>
                <div className="text-lg font-black text-amber-800 mt-1">{formatCurrency(collectionsReport.summary.outstanding)}</div>
              </Card>
              <Card className="p-3 border-slate-200 bg-rose-50/30">
                <div className="text-[10px] text-rose-800 font-bold uppercase">Overdue</div>
                <div className="text-lg font-black text-rose-800 mt-1">{formatCurrency(collectionsReport.summary.overdue)}</div>
              </Card>
              <Card className="p-3 border-slate-200 bg-blue-50/30">
                <div className="text-[10px] text-blue-800 font-bold uppercase">Collection Rate</div>
                <div className="text-lg font-black text-blue-900 mt-1">{collectionsReport.summary.collectionRate}</div>
              </Card>
            </div>
          )}

          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-2.5 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Fee Collection Audit Ledger
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleExportCSV(
                    'Fee_Collections_Report',
                    'Student,ID,Program,Class,Expected,Collected,Outstanding,Overdue,Status',
                    collectionsReport.rows.map(r => `"${r.student}","${r.studentId}","${r.program}","${r.class}",${r.expected},${r.collected},${r.outstanding},${r.overdue},"${r.status}"`)
                  )
                }
                className="h-7 text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Student</th>
                      <th className="py-2 px-3">Class</th>
                      <th className="py-2 px-3 text-right">Expected</th>
                      <th className="py-2 px-3 text-right">Collected</th>
                      <th className="py-2 px-3 text-right">Outstanding</th>
                      <th className="py-2 px-3 text-right">Overdue</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {collectionsReport?.rows?.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-semibold text-slate-900">{r.student} ({r.studentId})</td>
                        <td className="py-2 px-3 text-slate-600">{r.class}</td>
                        <td className="py-2 px-3 text-right font-medium text-slate-700">{formatCurrency(r.expected)}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-700">{formatCurrency(r.collected)}</td>
                        <td className="py-2 px-3 text-right font-bold text-amber-700">{formatCurrency(r.outstanding)}</td>
                        <td className="py-2 px-3 text-right font-bold text-rose-700">{formatCurrency(r.overdue)}</td>
                        <td className="py-2 px-3"><Badge variant="secondary" className="text-[10px]">{r.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 2: STUDENT DUES REPORT */}
        <TabsContent value="outstanding" className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-2.5 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Student Dues & Aging Statement
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleExportCSV(
                    'Student_Dues_Report',
                    'Student,ID,Program,Class,TotalDue,Paid,Outstanding,Overdue,NextDueDate',
                    outstandingReport.map(r => `"${r.student}","${r.studentId}","${r.program}","${r.class}",${r.totalDue},${r.paid},${r.outstanding},${r.overdue},"${r.nextDueDate}"`)
                  )
                }
                className="h-7 text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Student</th>
                      <th className="py-2 px-3">Class</th>
                      <th className="py-2 px-3 text-right">Total Net Due</th>
                      <th className="py-2 px-3 text-right">Paid</th>
                      <th className="py-2 px-3 text-right">Outstanding</th>
                      <th className="py-2 px-3 text-right">Overdue</th>
                      <th className="py-2 px-3">Next Due Cutoff</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {outstandingReport.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-semibold text-slate-900">{r.student} ({r.studentId})</td>
                        <td className="py-2 px-3 text-slate-600">{r.class}</td>
                        <td className="py-2 px-3 text-right font-medium text-slate-700">{formatCurrency(r.totalDue)}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-700">{formatCurrency(r.paid)}</td>
                        <td className="py-2 px-3 text-right font-bold text-amber-700">{formatCurrency(r.outstanding)}</td>
                        <td className="py-2 px-3 text-right font-bold text-rose-700">{formatCurrency(r.overdue)}</td>
                        <td className="py-2 px-3 text-slate-600 font-medium">{r.nextDueDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 3: PAYMENTS REPORT */}
        <TabsContent value="payments" className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-2.5 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Consolidated Payment Collections Statement
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleExportCSV(
                    'Payments_Report',
                    'TxnID,Student,Invoice,Amount,Gateway,Method,Status,SettlementStatus',
                    paymentsReport.map(r => `"${r.transactionId}","${r.student}","${r.invoice}",${r.amount},"${r.gateway}","${r.method}","${r.status}","${r.settlementStatus}"`)
                  )
                }
                className="h-7 text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Txn ID</th>
                      <th className="py-2 px-3">Student</th>
                      <th className="py-2 px-3">Invoice</th>
                      <th className="py-2 px-3 text-right">Amount</th>
                      <th className="py-2 px-3">Gateway</th>
                      <th className="py-2 px-3">Method</th>
                      <th className="py-2 px-3">Status</th>
                      <th className="py-2 px-3">Settlement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paymentsReport.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-mono font-medium text-blue-700">{r.transactionId}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{r.student}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{r.invoice}</td>
                        <td className="py-2 px-3 text-right font-extrabold text-slate-900">{formatCurrency(r.amount)}</td>
                        <td className="py-2 px-3 text-slate-600">{r.gateway}</td>
                        <td className="py-2 px-3 text-slate-600">{r.method}</td>
                        <td className="py-2 px-3"><Badge variant="success" className="text-[10px]">{r.status}</Badge></td>
                        <td className="py-2 px-3"><Badge variant="secondary" className="text-[10px]">{r.settlementStatus}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: REFUNDS REPORT */}
        <TabsContent value="refunds" className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-2.5 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Institutional Refund Statement
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleExportCSV(
                    'Refunds_Report',
                    'RefundID,PaymentID,Student,OriginalAmount,RefundAmount,Status,Reason',
                    refundsReport.map(r => `"${r.refundId}","${r.originalPayment}","${r.student}",${r.originalAmount},${r.refundAmount},"${r.status}","${r.reason}"`)
                  )
                }
                className="h-7 text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Refund ID</th>
                      <th className="py-2 px-3">Payment ID</th>
                      <th className="py-2 px-3">Student</th>
                      <th className="py-2 px-3 text-right">Original</th>
                      <th className="py-2 px-3 text-right">Refund Amount</th>
                      <th className="py-2 px-3">Reason</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {refundsReport.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-mono font-bold text-rose-700">{r.refundId}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{r.originalPayment}</td>
                        <td className="py-2 px-3 font-semibold text-slate-900">{r.student}</td>
                        <td className="py-2 px-3 text-right text-slate-600">{formatCurrency(r.originalAmount)}</td>
                        <td className="py-2 px-3 text-right font-black text-rose-700">{formatCurrency(r.refundAmount)}</td>
                        <td className="py-2 px-3 text-slate-700 max-w-xs truncate">{r.reason}</td>
                        <td className="py-2 px-3"><Badge variant="secondary" className="text-[10px]">{r.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: ADVERTISING REVENUE */}
        <TabsContent value="advertising" className="space-y-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-2.5 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Commercial Advertising Revenue Statement (Isolated Ledger)
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  handleExportCSV(
                    'Advertising_Revenue_Report',
                    'Campaign,Advertiser,Revenue,Budget,Impressions,Clicks,CTR,Status',
                    adReport.map(r => `"${r.campaign}","${r.advertiser}",${r.revenue},${r.budget},${r.impressions},${r.clicks},"${r.ctr}","${r.status}"`)
                  )
                }
                className="h-7 text-xs"
              >
                <Download className="h-3.5 w-3.5 mr-1" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Campaign</th>
                      <th className="py-2 px-3">Advertiser Sponsor</th>
                      <th className="py-2 px-3 text-right">Budget</th>
                      <th className="py-2 px-3 text-right">Revenue Recognized</th>
                      <th className="py-2 px-3 text-right">Impressions</th>
                      <th className="py-2 px-3 text-right">Clicks (CTR)</th>
                      <th className="py-2 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {adReport.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-semibold text-slate-900">{r.campaign}</td>
                        <td className="py-2 px-3 text-slate-700">{r.advertiser}</td>
                        <td className="py-2 px-3 text-right text-slate-600">{formatCurrency(r.budget)}</td>
                        <td className="py-2 px-3 text-right font-black text-blue-900">{formatCurrency(r.revenue)}</td>
                        <td className="py-2 px-3 text-right font-semibold text-slate-800">{r.impressions.toLocaleString('en-IN')}</td>
                        <td className="py-2 px-3 text-right text-emerald-600 font-semibold">{r.clicks} ({r.ctr})</td>
                        <td className="py-2 px-3"><Badge variant="secondary" className="text-[10px]">{r.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 6: FINANCIAL SERVICES OPERATIONAL METRICS */}
        <TabsContent value="loans" className="space-y-4">
          {loanMetrics && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <Card className="p-3 border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Total Applications</div>
                <div className="text-xl font-black text-slate-900 mt-1">{loanMetrics.total}</div>
              </Card>
              <Card className="p-3 border-slate-200 bg-amber-50/30">
                <div className="text-[10px] text-amber-800 font-bold uppercase">Underwriting In-Progress</div>
                <div className="text-xl font-black text-amber-800 mt-1">{loanMetrics.inProgress}</div>
              </Card>
              <Card className="p-3 border-slate-200 bg-blue-50/30">
                <div className="text-[10px] text-blue-800 font-bold uppercase">Sanctions Approved</div>
                <div className="text-xl font-black text-blue-900 mt-1">{loanMetrics.approved}</div>
              </Card>
              <Card className="p-3 border-slate-200 bg-emerald-50/30">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Disbursed into Escrow</div>
                <div className="text-xl font-black text-emerald-800 mt-1">{loanMetrics.disbursed}</div>
              </Card>
              <Card className="p-3 border-slate-200 bg-rose-50/30">
                <div className="text-[10px] text-rose-800 font-bold uppercase">Declined / Withdrawn</div>
                <div className="text-xl font-black text-rose-800 mt-1">{loanMetrics.rejected}</div>
              </Card>
            </div>
          )}

          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="py-2.5 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                DhanitiPay Operational Pipeline (Strict Non-Credit Assessment)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Application ID</th>
                      <th className="py-2 px-3">DhanitiPay Ref</th>
                      <th className="py-2 px-3">Product</th>
                      <th className="py-2 px-3">Applicant</th>
                      <th className="py-2 px-3 text-right">Requested</th>
                      <th className="py-2 px-3">Current Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {loanMetrics?.rows?.map((r, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70">
                        <td className="py-2 px-3 font-mono font-medium text-blue-700">{r.id}</td>
                        <td className="py-2 px-3 font-mono text-slate-600">{r.externalId}</td>
                        <td className="py-2 px-3 font-medium text-slate-900">{r.product}</td>
                        <td className="py-2 px-3 text-slate-700">{r.applicant}</td>
                        <td className="py-2 px-3 text-right font-black text-slate-900">{formatCurrency(r.requestedAmount)}</td>
                        <td className="py-2 px-3"><Badge variant="secondary" className="text-[10px]">{r.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
