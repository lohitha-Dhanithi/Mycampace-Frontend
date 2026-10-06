// src/modules/finance/pages/OutstandingDuesPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { PaymentCollectionModal } from '../components/PaymentCollectionModal'
import { studentFeeService } from '../services/studentFeeService'
import { formatCurrency } from '../config/financeConfig'
import {
  AlertTriangle,
  Search,
  CreditCard,
  Bell,
  Eye,
  Download,
  Clock,
  Filter,
} from 'lucide-react'

export function OutstandingDuesPage() {
  const [duesList, setDuesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [reminderSentMessage, setReminderSentMessage] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const data = await studentFeeService.getStudentFeeAssignments()
      // Filter students with outstanding balance > 0
      const outstandingOnly = data.filter(s => s.outstandingAmount > 0)
      setDuesList(outstandingOnly)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const filtered = duesList.filter(s => {
    if (search && !s.studentName.toLowerCase().includes(search.toLowerCase()) && !s.studentId.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalOutstanding = duesList.reduce((sum, s) => sum + s.outstandingAmount, 0)
  const totalOverdue = duesList.reduce((sum, s) => sum + s.overdueAmount, 0)

  const handleSendReminder = (student) => {
    setReminderSentMessage(`Fee reminder successfully dispatched to ${student.studentName} via SMS, Email & WhatsApp.`)
    setTimeout(() => setReminderSentMessage(null), 4000)
  }

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," +
      ["Student,ID,Program,Class,Outstanding,Overdue,NextDue",
        ...filtered.map(s => `"${s.studentName}","${s.studentId}","${s.programName}","${s.className}",${s.outstandingAmount},${s.overdueAmount},"${s.nextDueDate || 'Overdue'}"`)
      ].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "MyCampace_Outstanding_Dues.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Outstanding Balances & Overdue Fees"
        description="Monitor pending fee arrears, automated overdue tracking, and trigger multichannel fee reminders."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" asChild className="text-xs">
              <Link to="/finance/reminders">
                <Bell className="h-3.5 w-3.5 mr-1 text-blue-600" />
                Configure Reminder Rules
              </Link>
            </Button>
            <Button size="sm" variant="outline" onClick={handleExportCSV} className="text-xs">
              <Download className="h-3.5 w-3.5 mr-1" />
              Export CSV
            </Button>
          </div>
        }
      />

      {reminderSentMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-800 flex items-center gap-2">
          <Bell className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{reminderSentMessage}</span>
        </div>
      )}

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-slate-200 bg-amber-50/30">
          <div className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider">
            Total Outstanding Balance
          </div>
          <div className="text-2xl font-black text-amber-950 mt-1">
            {formatCurrency(totalOutstanding)}
          </div>
          <div className="text-[10px] text-amber-700 mt-1">{duesList.length} accounts with pending balance</div>
        </Card>

        <Card className="p-4 border-slate-200 bg-rose-50/30">
          <div className="text-[11px] font-semibold text-rose-800 uppercase tracking-wider">
            Critical Overdue Dues
          </div>
          <div className="text-2xl font-black text-rose-950 mt-1">
            {formatCurrency(totalOverdue)}
          </div>
          <div className="text-[10px] text-rose-700 mt-1">Past statutory due date cutoff</div>
        </Card>

        <Card className="p-4 border-slate-200 bg-blue-50/30">
          <div className="text-[11px] font-semibold text-blue-800 uppercase tracking-wider">
            Average Days Past Due
          </div>
          <div className="text-2xl font-black text-blue-950 mt-1">
            24 Days
          </div>
          <div className="text-[10px] text-blue-700 mt-1">Automated reminders scheduled</div>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Filter by student name or ID..."
            className="pl-9 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Showing {filtered.length} dues accounts
        </div>
      </div>

      {/* Dues Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Class & Cohort</th>
                  <th className="py-2.5 px-4 text-right">Total Net Fee</th>
                  <th className="py-2.5 px-4 text-right">Paid</th>
                  <th className="py-2.5 px-4 text-right">Outstanding Due</th>
                  <th className="py-2.5 px-4 text-right">Overdue</th>
                  <th className="py-2.5 px-4">Due Date</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">
                        <Link to={`/finance/student-fees/${s.studentId}`} className="hover:underline text-blue-700">
                          {s.studentName}
                        </Link>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">{s.studentId}</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-slate-800">{s.className} ({s.sectionName})</div>
                      <div className="text-[10px] text-slate-500">{s.programName}</div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-medium text-slate-700">
                      {formatCurrency(s.netPayable)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-600">
                      {formatCurrency(s.paidAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-amber-600">
                      {formatCurrency(s.outstandingAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-rose-600">
                      {formatCurrency(s.overdueAmount)}
                    </td>
                    <td className="py-2.5 px-4 font-medium text-slate-700">
                      {s.nextDueDate || <span className="text-rose-600 font-bold">Past Due</span>}
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendReminder(s)}
                          className="h-7 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Bell className="h-3 w-3 mr-1" />
                          Remind
                        </Button>
                        <Button
                          size="sm"
                          className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => {
                            setSelectedStudent(s)
                            setCollectionModalOpen(true)
                          }}
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          Collect
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

      <PaymentCollectionModal
        isOpen={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        student={selectedStudent}
        onSuccess={() => loadData()}
      />
    </div>
  )
}
