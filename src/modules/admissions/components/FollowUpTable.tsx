// src/modules/admissions/components/FollowUpTable.jsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  Phone,
  Mail,
  MessageSquare,
  CheckCircle,
  Plus,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

export function FollowUpTable({
  followUps = [],
  loading = false,
  onCompleteFollowUp,
}) {
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [activeFollowUp, setActiveFollowUp] = useState(null)
  const [outcome, setOutcome] = useState('')
  const [extraNotes, setExtraNotes] = useState('')

  const handleOpenComplete = (fol) => {
    setActiveFollowUp(fol)
    setOutcome('')
    setExtraNotes('')
    setCompleteDialogOpen(true)
  }

  const handleConfirmComplete = () => {
    if (onCompleteFollowUp && activeFollowUp) {
      onCompleteFollowUp(activeFollowUp.id, outcome, extraNotes)
    }
    setCompleteDialogOpen(false)
  }

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'call':
        return <Phone className="h-3.5 w-3.5 text-blue-600" />
      case 'whatsapp':
        return <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
      case 'email':
        return <Mail className="h-3.5 w-3.5 text-indigo-600" />
      default:
        return <Calendar className="h-3.5 w-3.5 text-slate-500" />
    }
  }

  const columns = [
    {
      header: 'Applicant',
      accessor: 'applicantName',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.applicantName}</div>
          <div className="text-[10px] text-slate-400">{row.applicantContact}</div>
        </div>
      ),
    },
    {
      header: 'Assigned To',
      accessor: 'assignedToName',
      sortable: true,
      cell: (row) => <span className="text-slate-800 font-medium">{row.assignedToName}</span>,
    },
    {
      header: 'Date & Time',
      accessor: 'followupDate',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-800">{row.followupDate}</div>
          <div className="text-[10px] text-slate-500">{row.followupTime}</div>
        </div>
      ),
    },
    {
      header: 'Type',
      accessor: 'type',
      sortable: true,
      cell: (row) => (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
          {getTypeIcon(row.type)} {row.type}
        </span>
      ),
    },
    {
      header: 'Purpose & Notes',
      accessor: 'purpose',
      cell: (row) => (
        <div className="max-w-xs">
          <div className="text-slate-800 font-medium truncate">{row.purpose}</div>
          {row.notes && <div className="text-[10px] text-slate-500 truncate">{row.notes}</div>}
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Outcome',
      accessor: 'outcome',
      cell: (row) => (
        row.outcome ? (
          <span className="text-[11px] text-slate-700">{row.outcome}</span>
        ) : (
          <span className="text-slate-400 italic text-[10px]">Pending resolution</span>
        )
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {row.status !== 'Completed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleOpenComplete(row)}
              className="h-7 text-[11px] text-emerald-700 border-emerald-200 hover:bg-emerald-50 gap-1"
            >
              <CheckCircle className="h-3 w-3" /> Mark Completed
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-4">
      <DataTable
        columns={columns}
        data={followUps}
        loading={loading}
        searchPlaceholder="Search follow-ups by applicant, counsellor, purpose..."
        emptyTitle="No follow-ups found"
        emptyDescription="All follow-ups have been resolved or none are scheduled."
      />

      {/* Complete follow-up dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Follow-up</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Record outcome for follow-up with <strong>{activeFollowUp?.applicantName}</strong>.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Follow-up Outcome *</label>
              <Input
                required
                placeholder="e.g. Discussed fee terms. Scheduled campus tour."
                value={outcome}
                onChange={(e) => setOutcome(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Additional Notes</label>
              <Textarea
                rows={3}
                placeholder="Log any additional details or requirements mentioned..."
                value={extraNotes}
                onChange={(e) => setExtraNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setCompleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleConfirmComplete}
              disabled={!outcome.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Complete Follow-up
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
