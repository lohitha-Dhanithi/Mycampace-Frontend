// src/modules/academicConfiguration/components/SetCurrentYearDialog.jsx
import React from 'react'
import { AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function SetCurrentYearDialog({
  open,
  onOpenChange,
  targetYear,
  onConfirm,
  loading = false,
}) {
  if (!targetYear) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Switch Current Academic Year?
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Confirm changing the active institutional operational cycle.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-3 text-xs text-slate-600 space-y-3">
          <p>
            You are about to set <strong>{targetYear.name} ({targetYear.code})</strong> as the{' '}
            <span className="text-blue-700 font-semibold">Current Academic Year</span> for the entire
            institution.
          </p>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 space-y-1">
            <span className="font-bold block">System Implications:</span>
            <ul className="list-disc list-inside space-y-0.5">
              <li>All dashboards and default reports will filter to this academic year.</li>
              <li>Attendance logs, timetable engines, and class rosters will point to this cycle.</li>
              <li>Any previously active academic year will be automatically marked non-current.</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onConfirm}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
          >
            {loading ? 'Switching...' : 'Yes, Set as Current'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
