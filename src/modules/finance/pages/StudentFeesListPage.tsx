// src/modules/finance/pages/StudentFeesListPage.jsx
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
import { InvoiceStatusBadge } from '../components/InvoiceStatusBadge'
import { PaymentCollectionModal } from '../components/PaymentCollectionModal'
import { studentFeeService } from '../services/studentFeeService'
import { feeStructureService } from '../services/feeStructureService'
import { formatCurrency } from '../config/financeConfig'
import {
  GraduationCap,
  Search,
  Filter,
  CreditCard,
  Layers,
  Eye,
  Plus,
  Tag,
  DollarSign,
} from 'lucide-react'

export function StudentFeesListPage() {
  const [assignments, setAssignments] = useState([])
  const [feeStructures, setFeeStructures] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Assign Fee Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false)
  const [newStudentId, setNewStudentId] = useState('')
  const [newStudentName, setNewStudentName] = useState('')
  const [selectedStructureId, setSelectedStructureId] = useState('')

  // Collect Payment Modal
  const [collectionModalOpen, setCollectionModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState(null)

  const loadData = async () => {
    setLoading(true)
    try {
      const [listRes, fsRes] = await Promise.all([
        studentFeeService.getStudentFeeAssignments({
          status: statusFilter,
          search,
        }),
        feeStructureService.getFeeStructures(),
      ])
      setAssignments(listRes)
      setFeeStructures(fsRes)
      if (fsRes.length > 0 && !selectedStructureId) {
        setSelectedStructureId(fsRes[0].id)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [statusFilter, search])

  const handleAssignFee = async (e) => {
    e.preventDefault()
    if (!newStudentId || !newStudentName || !selectedStructureId) {
      alert('Please fill all student details')
      return
    }
    try {
      await studentFeeService.assignFeeStructure(newStudentId, selectedStructureId, {
        studentName: newStudentName,
      })
      setAssignModalOpen(false)
      setNewStudentId('')
      setNewStudentName('')
      loadData()
    } catch (err) {
      alert(err.message || 'Failed to assign fee')
    }
  }

  return (
    <div className="space-y-6">
      <FinanceNavigation />

      <PageHeader
        title="Student Fee Assignments & Accounts"
        description="Individual student billing accounts, cohort fee structure assignments, outstanding dues, and ledger tracking."
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => setAssignModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Assign Fee Structure
            </Button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-slate-400" />
          <Input
            placeholder="Search student name, roll number, or ID..."
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
              <SelectItem value="Paid" className="text-xs">Paid</SelectItem>
              <SelectItem value="Partially Paid" className="text-xs">Partially Paid</SelectItem>
              <SelectItem value="Overdue" className="text-xs">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table of Student Fee Assignments */}
      <Card className="border-slate-200 shadow-xs">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Student</th>
                  <th className="py-2.5 px-4">Class & Section</th>
                  <th className="py-2.5 px-4">Assigned Fee Schedule</th>
                  <th className="py-2.5 px-4 text-right">Net Payable</th>
                  <th className="py-2.5 px-4 text-right">Paid</th>
                  <th className="py-2.5 px-4 text-right">Outstanding</th>
                  <th className="py-2.5 px-4 text-right">Overdue</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {assignments.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-2.5 px-4">
                      <div className="font-semibold text-slate-900">
                        <Link to={`/finance/student-fees/${s.studentId}`} className="hover:underline text-blue-700">
                          {s.studentName}
                        </Link>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {s.studentId} {s.rollNumber && `| ${s.rollNumber}`}
                      </div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-slate-800">{s.className}</div>
                      <div className="text-[11px] text-slate-500">{s.sectionName} ({s.programName})</div>
                    </td>
                    <td className="py-2.5 px-4">
                      <div className="font-medium text-slate-700 line-clamp-1">{s.feeStructureName}</div>
                      <div className="text-[10px] text-slate-400">{s.academicYearName} • {s.campusName}</div>
                    </td>
                    <td className="py-2.5 px-4 text-right font-extrabold text-slate-900">
                      {formatCurrency(s.netPayable)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-emerald-600">
                      {formatCurrency(s.paidAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-amber-600">
                      {formatCurrency(s.outstandingAmount)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-bold text-rose-600">
                      {formatCurrency(s.overdueAmount)}
                    </td>
                    <td className="py-2.5 px-4">
                      <InvoiceStatusBadge status={s.status} />
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="h-7 text-xs text-blue-600"
                        >
                          <Link to={`/finance/student-fees/${s.studentId}`}>
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Link>
                        </Button>
                        {s.outstandingAmount > 0 && (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                            onClick={() => {
                              setSelectedStudent(s)
                              setCollectionModalOpen(true)
                            }}
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            Collect
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

      {/* Assign Fee Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-900">
              Assign Fee Structure to Student
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAssignFee} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Student ID *</label>
              <Input
                placeholder="e.g. STU-2026-0045"
                value={newStudentId}
                onChange={(e) => setNewStudentId(e.target.value)}
                required
                className="text-xs font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Student Full Name *</label>
              <Input
                placeholder="e.g. Vikram Malhotra"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                required
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Select Fee Structure *</label>
              <Select value={selectedStructureId} onValueChange={setSelectedStructureId}>
                <SelectTrigger className="text-xs">
                  <SelectValue placeholder="Select fee schedule" />
                </SelectTrigger>
                <SelectContent>
                  {feeStructures.map((fs) => (
                    <SelectItem key={fs.id} value={fs.id} className="text-xs">
                      {fs.name} ({formatCurrency(fs.totalAnnualAmount)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setAssignModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Confirm Assignment
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Collect Payment Modal */}
      <PaymentCollectionModal
        isOpen={collectionModalOpen}
        onClose={() => setCollectionModalOpen(false)}
        student={selectedStudent}
        onSuccess={() => loadData()}
      />
    </div>
  )
}
