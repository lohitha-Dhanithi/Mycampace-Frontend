// src/modules/academics/components/SectionChangeDialog.jsx
import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ArrowRightLeft, AlertTriangle } from 'lucide-react'

export function SectionChangeDialog({ open, onOpenChange, student, onConfirm }) {
  const [targetSection, setTargetSection] = useState('sec-11B')
  const [effectiveDate, setEffectiveDate] = useState(new Date().toISOString().split('T')[0])
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!student) return null

  const targetSectionNames = {
    'sec-11A': 'Section A (PCM)',
    'sec-11B': 'Section B (PCB / Commerce)',
    'sec-12A': 'Section A (PCM)',
    'sec-12B': 'Section B (PCB)',
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onConfirm(student.studentId || student.id, {
        targetSectionId: targetSection,
        targetSectionName: targetSectionNames[targetSection] || 'New Section',
        effectiveDate,
        reason,
      })
      onOpenChange(false)
    } catch (err) {
      console.error('Section change failed', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-slate-900">
            <ArrowRightLeft className="w-5 h-5 text-blue-600" />
            Reallocate Classroom Section
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
          {/* Student Dossier Summary */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Student:</span>
              <strong className="text-slate-900">{student.studentName || student.personal?.fullName}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Student ID / Roll:</span>
              <span className="font-mono text-slate-800">{student.studentNumber || student.studentId} • {student.rollNumber || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Current Cohort:</span>
              <span className="font-semibold text-slate-800">{student.className} - {student.sectionName}</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Target Section *</label>
            <Select
              value={targetSection}
              onChange={(e) => setTargetSection(e.target.value)}
              required
            >
              <option value="sec-11A">Section A (PCM)</option>
              <option value="sec-11B">Section B (PCB / Commerce)</option>
              <option value="sec-12A">Section A (PCM)</option>
              <option value="sec-12B">Section B (PCB)</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Effective Reallocation Date *</label>
            <Input
              type="date"
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Reallocation Rationale *</label>
            <Input
              placeholder="e.g. Stream elective change, classroom balance..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 text-[11px] leading-relaxed">
            <strong>Historical Integrity:</strong> The previous academic enrollment will remain preserved in historical records. A new academic assignment entry will be stamped with the effective date.
          </div>

          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
              {submitting ? 'Reallocating...' : 'Confirm Section Reallocation'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
