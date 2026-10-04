// src/modules/students/components/StudentTransferTable.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ArrowRightLeft, Plus, CheckCircle, Eye } from 'lucide-react'
import { StudentTransferForm } from './StudentTransferForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function StudentTransferTable({
  transfers = [],
  students = [],
  loading = false,
  onRequestTransfer,
  onCompleteTransfer,
}) {
  const [modalOpen, setModalOpen] = useState(false)

  const columns = [
    {
      header: 'Student',
      accessor: 'studentName',
      sortable: true,
      cell: (r) => (
        <div>
          <div className="font-bold text-slate-900">{r.studentName}</div>
          <span className="text-[10px] text-slate-400 font-mono">{r.studentNumber}</span>
        </div>
      ),
    },
    {
      header: 'Transfer Type',
      accessor: 'transferType',
      sortable: true,
      cell: (r) => (
        <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
          {r.transferType}
        </span>
      ),
    },
    {
      header: 'Current Allocation',
      accessor: 'currentCampus',
      cell: (r) => (
        <div className="text-xs">
          <div className="font-medium text-slate-800">{r.currentCampus}</div>
          <div className="text-[10px] text-slate-500">{r.currentClass} - {r.currentSection}</div>
        </div>
      ),
    },
    {
      header: 'Destination Allocation',
      accessor: 'destinationCampus',
      cell: (r) => (
        <div className="text-xs">
          <div className="font-medium text-blue-700">{r.destinationCampus}</div>
          <div className="text-[10px] text-slate-500">{r.destinationClass} - {r.destinationSection}</div>
        </div>
      ),
    },
    {
      header: 'Request Date',
      accessor: 'requestDate',
      sortable: true,
      cell: (r) => <span className="text-slate-600 text-xs">{r.requestDate}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          {r.status === 'Requested' || r.status === 'Under Review' ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onCompleteTransfer && onCompleteTransfer(r.id)}
              className="h-7 text-[11px] text-emerald-700 border-emerald-200 hover:bg-emerald-50"
            >
              Approve & Complete Transfer
            </Button>
          ) : (
            <span className="text-[11px] text-slate-400 italic">Completed</span>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Student Transfer Management</h3>
          <p className="text-xs text-slate-500">Internal campus transfers, section re-allocations and external departures</p>
        </div>
        <Button size="sm" onClick={() => setModalOpen(true)} className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs">
          <Plus className="h-3.5 w-3.5" /> Request Transfer
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={transfers}
        loading={loading}
        searchPlaceholder="Search transfers by student, campus, status..."
        emptyTitle="No transfer requests found"
        emptyDescription="All student assignments are currently stable."
      />

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Request Student Transfer</DialogTitle>
          </DialogHeader>
          <StudentTransferForm
            students={students}
            onSubmit={(data) => {
              onRequestTransfer && onRequestTransfer(data)
              setModalOpen(false)
            }}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
