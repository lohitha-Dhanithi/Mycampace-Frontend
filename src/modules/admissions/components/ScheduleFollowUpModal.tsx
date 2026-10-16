// src/modules/admissions/components/ScheduleFollowUpModal.tsx
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import {
  Calendar,
  Clock,
  Phone,
  MessageSquare,
  Building,
  Mail,
  User,
  Users,
  CheckCircle2,
  Bell,
  Sparkles,
} from 'lucide-react'
import { userService } from '@/services/userService'

export interface ScheduleFollowUpModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  targetProspect: any
  onSaveFollowUp: (followUpData: {
    leadId?: string
    applicationId?: string
    applicantName: string
    applicantContact: string
    assignedToId: string
    assignedToName: string
    followupDate: string
    followupTime: string
    type: string
    purpose: string
    priority: string
    notes?: string
    reminder: boolean
  }) => Promise<void> | void
}

const INTERACTION_MODES = [
  { id: 'Call', label: 'Phone Call', icon: Phone, color: 'text-blue-600' },
  { id: 'WhatsApp', label: 'WhatsApp', icon: MessageSquare, color: 'text-emerald-600' },
  { id: 'Campus Visit', label: 'Campus Visit', icon: Building, color: 'text-amber-600' },
  { id: 'In-Person', label: 'In-Person Counselling', icon: Users, color: 'text-purple-600' },
  { id: 'Email', label: 'Email Outreach', icon: Mail, color: 'text-slate-600' },
]

const AGENDA_PRESETS = [
  'Curriculum & Stream Choice',
  'Fee Structure & Scholarships',
  'Campus Tour & Facility Visit',
  'Document Submission Follow-up',
  'Offer Acceptance & Seat Lock',
  'Application Form Guidance',
]

export function ScheduleFollowUpModal({
  open,
  onOpenChange,
  targetProspect,
  onSaveFollowUp,
}: ScheduleFollowUpModalProps) {
  const [users, setUsers] = useState<any[]>([])
  const [assignedToId, setAssignedToId] = useState('')
  const [assignedToName, setAssignedToName] = useState('')

  // Date and Time calculation helpers
  const getTomorrowDate = () => {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d.toISOString().split('T')[0]
  }

  const getDateAfterDays = (days: number) => {
    const d = new Date()
    d.setDate(d.getDate() + days)
    return d.toISOString().split('T')[0]
  }

  const getNextMondayDate = () => {
    const d = new Date()
    const day = d.getDay()
    const diff = d.getDate() + (day === 0 ? 1 : 8 - day)
    d.setDate(diff)
    return d.toISOString().split('T')[0]
  }

  const [followupDate, setFollowupDate] = useState(getTomorrowDate())
  const [followupTime, setFollowupTime] = useState('10:30 AM')
  const [type, setType] = useState('Call')
  const [purpose, setPurpose] = useState(AGENDA_PRESETS[0])
  const [customPurpose, setCustomPurpose] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [notes, setNotes] = useState('')
  const [reminder, setReminder] = useState(true)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadStaff = async () => {
      const staffUsers = await userService.getUsers({ status: 'Active' })
      setUsers(staffUsers)

      // Default assigned counsellor to target prospect's counsellor if found
      const match = staffUsers.find(
        (u) =>
          u.id === targetProspect?.counsellorId ||
          u.name === targetProspect?.counsellorName
      )
      if (match) {
        setAssignedToId(match.id)
        setAssignedToName(match.name)
      } else if (staffUsers.length > 0) {
        setAssignedToId(staffUsers[0].id)
        setAssignedToName(staffUsers[0].name)
      }
    }
    loadStaff()
  }, [targetProspect])

  if (!targetProspect) return null

  const applicantName =
    targetProspect.fullName ||
    targetProspect.applicantName ||
    `${targetProspect.firstName || ''} ${targetProspect.lastName || ''}`.trim() ||
    'Prospective Applicant'

  const applicantPhone =
    targetProspect.phone ||
    targetProspect.contact?.mobile ||
    targetProspect.applicantContact ||
    ''

  const prospectProgram =
    targetProspect.programName ||
    targetProspect.appliedCourse ||
    targetProspect.academicInterest?.courseName ||
    'General Program'

  const prospectId =
    targetProspect.leadNumber ||
    targetProspect.applicationNumber ||
    targetProspect.id

  const handleApplyPreset = (presetDays: number, timeStr: string) => {
    setFollowupDate(getDateAfterDays(presetDays))
    setFollowupTime(timeStr)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSaveFollowUp({
        leadId: targetProspect.leadNumber ? targetProspect.id : undefined,
        applicationId: targetProspect.applicationNumber ? targetProspect.id : undefined,
        applicantName,
        applicantContact: applicantPhone,
        assignedToId,
        assignedToName,
        followupDate,
        followupTime,
        type,
        purpose: customPurpose || purpose,
        priority,
        notes,
        reminder,
      })
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md sm:max-w-xl p-0 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-sm font-bold text-slate-900">
                Schedule Admissions Follow-up
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Set a clear touchpoint agenda and reminder for candidate counselling.
              </DialogDescription>
            </div>
          </div>

          {/* Prospect Summary Strip */}
          <div className="mt-3.5 p-3 rounded-xl bg-white border border-slate-200 text-xs flex flex-wrap items-center justify-between gap-2 shadow-2xs">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center">
                {applicantName.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-slate-900">{applicantName}</div>
                <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5 font-mono">
                  <span>{prospectId}</span>
                  <span>•</span>
                  <span>{applicantPhone}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {prospectProgram}
              </span>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Assigned: {assignedToName || 'Unassigned'}
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[75vh] overflow-y-auto">
          {/* Quick Date & Time Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-slate-700">
              <label className="font-semibold flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-slate-500" /> Quick Date Presets
              </label>
              <span className="text-[10px] text-slate-400">One-click scheduling</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleApplyPreset(1, '10:00 AM')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-[11px] font-medium text-slate-700 text-left transition-colors"
              >
                <div className="font-semibold text-slate-900">Tomorrow</div>
                <div className="text-[10px] text-slate-400">10:00 AM</div>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(1, '03:00 PM')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-[11px] font-medium text-slate-700 text-left transition-colors"
              >
                <div className="font-semibold text-slate-900">Tomorrow</div>
                <div className="text-[10px] text-slate-400">03:00 PM</div>
              </button>
              <button
                type="button"
                onClick={() => handleApplyPreset(2, '11:30 AM')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-[11px] font-medium text-slate-700 text-left transition-colors"
              >
                <div className="font-semibold text-slate-900">In 2 Days</div>
                <div className="text-[10px] text-slate-400">11:30 AM</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  setFollowupDate(getNextMondayDate())
                  setFollowupTime('10:00 AM')
                }}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-900 hover:bg-slate-50 text-[11px] font-medium text-slate-700 text-left transition-colors"
              >
                <div className="font-semibold text-slate-900">Next Monday</div>
                <div className="text-[10px] text-slate-400">10:00 AM</div>
              </button>
            </div>
          </div>

          {/* Date & Time Input Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-slate-400" /> Follow-up Date *
              </label>
              <Input
                type="date"
                required
                value={followupDate}
                onChange={(e) => setFollowupDate(e.target.value)}
                className="text-xs h-8 bg-white"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> Follow-up Time *
              </label>
              <Select
                value={followupTime}
                onChange={(e) => setFollowupTime(e.target.value)}
                className="text-xs h-8 bg-white"
              >
                <option value="09:30 AM">09:30 AM (Morning Slot)</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="10:30 AM">10:30 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="12:30 PM">12:30 PM</option>
                <option value="02:00 PM">02:00 PM (Afternoon Slot)</option>
                <option value="03:00 PM">03:00 PM</option>
                <option value="04:00 PM">04:00 PM</option>
                <option value="05:00 PM">05:00 PM (Evening Slot)</option>
                <option value="06:00 PM">06:00 PM</option>
              </Select>
            </div>
          </div>

          {/* Interaction Mode / Channel */}
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-slate-700">Follow-up Channel / Mode *</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {INTERACTION_MODES.map((mode) => {
                const Icon = mode.icon
                const isSelected = type === mode.id
                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setType(mode.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-colors text-left ${
                      isSelected
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isSelected ? 'text-white' : mode.color}`} />
                    <span className="truncate">{mode.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Agenda / Topic Selection */}
          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-slate-700">Follow-up Agenda / Focus Topic *</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {AGENDA_PRESETS.map((p) => {
                const isSelected = purpose === p && !customPurpose
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPurpose(p)
                      setCustomPurpose('')
                    }}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {p}
                  </button>
                )
              })}
            </div>
            <Input
              placeholder="Or enter custom objective (e.g. Discuss hostel accommodation)..."
              value={customPurpose}
              onChange={(e) => setCustomPurpose(e.target.value)}
              className="text-xs h-8"
            />
          </div>

          {/* Assigned Counsellor & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700 flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-slate-400" /> Assigned Counsellor *
              </label>
              <Select
                value={assignedToId}
                onChange={(e) => {
                  setAssignedToId(e.target.value)
                  const u = users.find((usr) => usr.id === e.target.value)
                  if (u) setAssignedToName(u.name)
                }}
                className="text-xs h-8"
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role || 'Counsellor'})
                  </option>
                ))}
              </Select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Priority Level</label>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="text-xs h-8"
              >
                <option value="High">High (Immediate Conversion Potential)</option>
                <option value="Medium">Medium (Regular Pipeline)</option>
                <option value="Low">Low (General Inquiry)</option>
              </Select>
            </div>
          </div>

          {/* Conversation Remarks / Context */}
          <div className="space-y-1 pt-1">
            <label className="font-semibold text-slate-700">
              Interaction Context / Notes (Optional)
            </label>
            <Textarea
              placeholder="Add summary from previous conversation, parent concerns, or specific questions to address..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="text-xs"
            />
          </div>

          {/* Automated Reminder Toggle */}
          <div className="pt-1">
            <label className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 cursor-pointer hover:bg-slate-50">
              <input
                type="checkbox"
                checked={reminder}
                onChange={(e) => setReminder(e.target.checked)}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <Bell className="h-3.5 w-3.5 text-amber-600" />
              <span className="font-medium text-slate-700 text-xs">
                Send reminder alert to counsellor 15 minutes before follow-up
              </span>
            </label>
          </div>

          {/* Action Buttons */}
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
              className="text-xs h-8 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-none gap-1.5"
            >
              <Calendar className="h-3.5 w-3.5" />
              {loading ? 'Saving Follow-up...' : 'Schedule Follow-up'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
