// src/modules/students/components/StudentFeeSummary.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { DollarSign, ArrowRight, Receipt, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function StudentFeeSummary({ feeSummary, receipts = [] }) {
  const navigate = useNavigate()

  const summary = feeSummary || {
    totalFees: 165000,
    paidAmount: 165000,
    pendingAmount: 0,
    overdueAmount: 0,
    status: 'Fully Paid',
  }

  const sampleReceipts = receipts.length > 0 ? receipts : [
    { receiptNo: 'RCP-2026-8812', term: 'Term 1 Tuition & Transport', amount: 85000, date: '2026-06-10', mode: 'Net Banking', status: 'Paid' },
    { receiptNo: 'RCP-2026-9420', term: 'Term 2 Tuition & STEM Labs', amount: 80000, date: '2026-09-12', mode: 'UPI', status: 'Paid' },
  ]

  return (
    <div className="space-y-6">
      {/* 4 Financial Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Annual Fees</span>
            <div className="text-xl font-bold text-slate-900">₹{Number(summary.totalFees).toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">AY 2026-2027 Schedule</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Total Paid</span>
            <div className="text-xl font-bold text-emerald-700">₹{Number(summary.paidAmount).toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">Reconciled via Accounts</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Pending Balance</span>
            <div className="text-xl font-bold text-slate-800">₹{Number(summary.pendingAmount).toLocaleString()}</div>
            <div className="text-[10px] text-slate-400">Installments remaining</div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-xs">
          <CardContent className="p-4 space-y-1">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">Fee Standing</span>
            <div className="pt-0.5">
              <StatusBadge status={summary.status} />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">Status verified</div>
          </CardContent>
        </Card>
      </div>

      {/* Receipts Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Payment Transactions & Invoices</CardTitle>
            <p className="text-[11px] text-slate-500">Official fee payment acknowledgments</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/finance/fees')}
            className="text-xs h-7 gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            View Finance Details <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Date</th>
                  <th className="px-3 py-2.5">Receipt #</th>
                  <th className="px-3 py-2.5">Description</th>
                  <th className="px-3 py-2.5">Payment Mode</th>
                  <th className="px-3 py-2.5 text-right">Amount</th>
                  <th className="px-3 py-2.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleReceipts.map((r, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2.5 text-slate-600">{r.date}</td>
                    <td className="px-3 py-2.5 font-mono font-bold text-blue-600">{r.receiptNo}</td>
                    <td className="px-3 py-2.5 font-medium text-slate-900">{r.term}</td>
                    <td className="px-3 py-2.5 text-slate-600">{r.mode}</td>
                    <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">
                      ₹{Number(r.amount).toLocaleString()}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="font-bold text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {r.status || 'Paid'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
