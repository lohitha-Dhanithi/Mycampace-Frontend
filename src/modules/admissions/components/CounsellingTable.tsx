// src/modules/admissions/components/CounsellingTable.jsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  MapPin,
  Video,
  CheckCircle,
  Eye,
  CheckCircle2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { COUNSELLING_OUTCOMES } from '../config/admissionStatusConfig'

export function CounsellingTable({
  sessions = [],
  loading = false,
  onCompleteSession,
}) {
  const [completeDialogOpen, setCompleteDialogOpen] = useState(false)
  const [activeSession, setActiveSession] = useState(null)
  const [outcome, setOutcome] = useState('Interested')
  const [nextAction, setNextAction] = useState('')
  const [notes, setNotes] = useState('')

  const handleOpenComplete = (sess) => {
    setActiveSession(sess)
    setOutcome('Interested')
    setNextAction('')
    setNotes(sess.notes || '')
    setCompleteDialogOpen(true)
  }

  const handleConfirmComplete = () => {
    if (onCompleteSession && activeSession) {
      onCompleteSession(activeSession.id, outcome, nextAction, notes)
    }
    setCompleteDialogOpen(false)
  }

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'Video':
        return <Video className="h-3.5 w-3.5 text-blue-600" />
      case 'Campus Visit':
      case 'In Person':
        return <MapPin className="h-3.5 w-3.5 text-emerald-600" />
      default:
        return <Clock className="h-3.5 w-3.5 text-slate-500" />
    }
  }

  const columns = [
    {
      header: 'Applicant',
      accessor: 'applicantName',
      sortable: true,
      className: 'whitespace-nowrap min-w-[160px]',
      cell: (row) => (
        <div className="font-semibold text-slate-900 text-xs whitespace-nowrap">{row.applicantName}</div>
      ),
    },
    {
      header: 'Counsellor',
      accessor: 'counsellorName',
      sortable: true,
      className: 'whitespace-nowrap min-w-[140px]',
      cell: (row) => <span className="text-slate-700 text-xs font-medium whitespace-nowrap">{row.counsellorName}</span>,
    },
    {
      header: 'Program',
      accessor: 'programName',
      className: 'whitespace-nowrap min-w-[180px]',
      cell: (row) => (
        <span className="font-medium text-slate-800 text-xs truncate max-w-[200px] block" title={row.programName}>
          {row.programName}
        </span>
      ),
    },
    {
      header: 'Schedule',
      accessor: 'date',
      sortable: true,
      className: 'whitespace-nowrap min-w-[150px]',
      cell: (row) => (
        <span className="text-slate-700 text-xs whitespace-nowrap">
          {row.date} ({row.time})
        </span>
      ),
    },
    {
      header: 'Mode',
      accessor: 'mode',
      sortable: true,
      className: 'whitespace-nowrap',
      cell: (row) => (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium whitespace-nowrap">
          {getModeIcon(row.mode)} {row.mode}
        </span>
      ),
    },
    {
      header: 'Outcome',
      accessor: 'outcome',
      className: 'whitespace-nowrap',
      cell: (row) => (
        row.outcome ? (
          <StatusBadge status={row.outcome} />
        ) : (
          <span className="text-slate-400 italic text-[11px] whitespace-nowrap">Pending Decision</span>
        )
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
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
              <CheckCircle className="h-3 w-3" /> Record Outcome
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
        data={sessions}
        loading={loading}
        searchPlaceholder="Search counselling sessions by applicant, counsellor, mode..."
        emptyTitle="No counselling sessions found"
        emptyDescription="Schedule a new session using the + Schedule Counselling action above."
      />

      {/* Outcome recording dialog */}
      <Dialog open={completeDialogOpen} onOpenChange={setCompleteDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Counselling Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Record outcome for applicant <strong>{activeSession?.applicantName}</strong>.
            </p>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Session Outcome *</label>
              <Select value={outcome} onChange={(e) => setOutcome(e.target.value)}>
                {COUNSELLING_OUTCOMES.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Next Action Item</label>
              <Input
                placeholder="e.g. Send application form link, wait for 10th mark sheet..."
                value={nextAction}
                onChange={(e) => setNextAction(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Session Notes & Summary</label>
              <Textarea
                rows={3}
                placeholder="Summarize key points discussed during the counseling session..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
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
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Complete & Save Outcome
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
