// src/modules/students/components/StudentExitForm.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { LogOut, ArrowLeft, AlertTriangle } from 'lucide-react'

export function StudentExitForm({ students = [], onSubmit, onCancel, submitting = false }) {
  const [formData, setFormData] = useState({
    studentId: students[0]?.id || '',
    exitType: 'Graduation',
    effectiveDate: new Date().toISOString().split('T')[0],
    reason: '',
    notes: '',
    feesCleared: false,
    libraryCleared: false,
    labEquipmentCleared: false,
    documentsReturned: false,
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const student = students.find((s) => s.id === formData.studentId)
    const payload = {
      studentId: formData.studentId,
      studentName: student?.personal?.fullName || student?.name || 'Selected Student',
      studentNumber: student?.studentId || 'STU-000',
      admissionNumber: student?.admissionNumber || '',
      currentClass: student?.className || 'Class 12',
      exitType: formData.exitType,
      effectiveDate: formData.effectiveDate,
      reason: formData.reason,
      notes: formData.notes,
      obligations: {
        feesCleared: formData.feesCleared,
        libraryCleared: formData.libraryCleared,
        labEquipmentCleared: formData.labEquipmentCleared,
        documentsReturned: formData.documentsReturned,
      },
    }
    onSubmit(payload)
  }

  return (
    <Card className="border-slate-200 shadow-xs">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <LogOut className="w-4 h-4 text-red-600" />
            Initiate Student Exit & Clearance Request
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Log student departure or graduation. Clearance obligations must be satisfied before permanent exit.
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Select Student *</label>
              <Select
                value={formData.studentId}
                onChange={(e) => handleChange('studentId', e.target.value)}
                required
              >
                <option value="">Select student...</option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.personal?.fullName || s.name} ({s.studentId} • {s.className || 'Class 11'})
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Exit Classification *</label>
              <Select
                value={formData.exitType}
                onChange={(e) => handleChange('exitType', e.target.value)}
              >
                <option value="Graduation">Graduation (Program Completion)</option>
                <option value="Transfer">Transfer to Another Institution</option>
                <option value="Withdrawal">Voluntary Parental Withdrawal</option>
                <option value="Expulsion">Disciplinary Expulsion</option>
                <option value="Other">Other Grounds</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Effective Departure Date *</label>
              <Input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => handleChange('effectiveDate', e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Primary Exit Reason *</label>
              <Input
                placeholder="e.g. Completed grade 12 board examinations with distinction"
                value={formData.reason}
                onChange={(e) => handleChange('reason', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Detailed Remarks / Case Notes</label>
            <textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Additional documentation, migration certificate dispatch details..."
              className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Preliminary Obligation Verification */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">Pre-Departure Obligation Check</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.feesCleared}
                  onChange={(e) => handleChange('feesCleared', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Fee Accounts Cleared (No Dues)</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.libraryCleared}
                  onChange={(e) => handleChange('libraryCleared', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Library Clearances & Returns Completed</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.labEquipmentCleared}
                  onChange={(e) => handleChange('labEquipmentCleared', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>Lab Apparatus & Sports Kits Returned</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.documentsReturned}
                  onChange={(e) => handleChange('documentsReturned', e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <span>TC & Migration Certificates Handed Over</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button type="button" variant="outline" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {submitting ? 'Submitting...' : 'Register Exit Dossier'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
