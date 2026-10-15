// src/modules/admissions/components/CloseLeadModal.tsx
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import {
  UserX,
  AlertCircle,
  Building2,
  Calendar,
  Phone,
  BookOpen,
} from 'lucide-react'

export interface CloseLeadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  lead: any
  onConfirmClose: (leadId: string, closureData: {
    reason: string
    notes?: string
    competitorName?: string
    futureRetargeting?: boolean
  }) => Promise<void> | void
}

export const LEAD_CLOSURE_REASONS = [
  { id: 'fee_budget', label: 'Fee / Budget Constraints', description: 'Institution fee structure beyond parent budget' },
  { id: 'competitor', label: 'Opted for Competitor Institution', description: 'Enrolled in another school/college' },
  { id: 'academic_ineligible', label: 'Academic Ineligibility / Low Cutoff', description: 'Did not meet qualifying marks criteria' },
  { id: 'distance_relocation', label: 'Distance / Commute / Relocation', description: 'Campus location or transport inconvenient' },
  { id: 'course_unavailable', label: 'Preferred Course / Stream Not Available', description: 'Requested specialisation not offered' },
  { id: 'not_interested', label: 'Student / Parent Not Interested', description: 'Decided not to pursue admissions' },
  { id: 'unresponsive', label: 'Unresponsive / Contact Exhausted', description: 'No response after multiple follow-up attempts' },
  { id: 'duplicate_invalid', label: 'Duplicate / Invalid Lead', description: 'Redundant entry or incorrect phone/email' },
  { id: 'other', label: 'Other', description: 'Custom reason specified in remarks' },
]

export function CloseLeadModal({
  open,
  onOpenChange,
  lead,
  onConfirmClose,
}: CloseLeadModalProps) {
  const [reason, setReason] = useState(LEAD_CLOSURE_REASONS[0].label)
  const [competitorName, setCompetitorName] = useState('')
  const [notes, setNotes] = useState('')
  const [futureRetargeting, setFutureRetargeting] = useState(false)
  const [loading, setLoading] = useState(false)

  if (!lead) return null

  const isCompetitorReason = reason === 'Opted for Competitor Institution'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onConfirmClose(lead.id, {
        reason,
        notes,
        competitorName: isCompetitorReason ? competitorName : undefined,
        futureRetargeting,
      })
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-lg p-0 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
              <UserX className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-slate-900">
                Close Prospective Lead
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Record drop-off reason to keep admissions conversion funnel analytics accurate.
              </DialogDescription>
            </div>
          </div>

          {/* Lead Summary Strip */}
          <div className="mt-3.5 p-3 rounded-xl bg-white border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2">
            <div>
              <div className="font-bold text-slate-900">{lead.fullName}</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-mono">
                <span>{lead.leadNumber}</span>
                <span>•</span>
                <span>{lead.phone}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {lead.programName || lead.appliedCourse || 'General Track'}
              </span>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Counsellor: {lead.counsellorName || 'Unassigned'}
              </div>
            </div>
          </div>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Reason Select */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800 flex items-center justify-between">
              <span>Primary Reason for Closure *</span>
              <span className="text-[10px] text-slate-400 font-normal">Required for reporting</span>
            </label>
            <Select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full text-xs"
            >
              {LEAD_CLOSURE_REASONS.map((r) => (
                <option key={r.id} value={r.label}>
                  {r.label}
                </option>
              ))}
            </Select>
          </div>

          {/* If Competitor Reason */}
          {isCompetitorReason && (
            <div className="space-y-1 animate-in fade-in-0 duration-150">
              <label className="font-semibold text-slate-800">
                Competitor Institution Name (Optional)
              </label>
              <Input
                placeholder="e.g. Oakridge International, Narayana Jr College..."
                value={competitorName}
                onChange={(e) => setCompetitorName(e.target.value)}
                className="text-xs h-8"
              />
            </div>
          )}

          {/* Specific Remarks / Notes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">
              Closure Remarks / Conversation Summary
            </label>
            <Textarea
              placeholder="Add notes from phone conversation or visit, explaining why student is dropping out..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="text-xs"
            />
          </div>

          {/* Future Retargeting Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50 transition-colors">
              <input
                type="checkbox"
                checked={futureRetargeting}
                onChange={(e) => setFutureRetargeting(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <div>
                <span className="font-semibold text-slate-800 block">
                  Eligible for Future Intake Retargeting
                </span>
                <span className="text-[11px] text-slate-500">
                  Keep candidate on marketing list for future batches or next academic year campaigns.
                </span>
              </div>
            </label>
          </div>

          {/* Warning Banner */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-800 text-[11px]">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              This will update lead status to <strong>Closed (Lost)</strong> and cancel any pending reminders. You can re-open this lead at any time if the student reconnects.
            </span>
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="text-xs h-8 border-slate-200 hover:bg-slate-50"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white font-medium"
            >
              {loading ? 'Closing Lead...' : 'Close Lead'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
