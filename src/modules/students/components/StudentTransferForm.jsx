// src/modules/students/components/StudentTransferForm.jsx
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function StudentTransferForm({ students = [], onSubmit, onCancel }) {
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '')
  const selectedStudent = students.find((s) => s.id === selectedStudentId) || students[0]

  const [formData, setFormData] = useState({
    transferType: 'Internal Campus',
    destinationCampus: 'Hyderabad Main Campus',
    destinationClass: 'Class 11',
    destinationSection: 'Section A',
    reason: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    notes: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedStudent) return
    if (onSubmit) {
      onSubmit({
        studentId: selectedStudent.id,
        studentName: selectedStudent.personal?.fullName || selectedStudent.name,
        studentNumber: selectedStudent.studentId,
        currentCampus: selectedStudent.campusName || 'Hyderabad Main Campus',
        currentClass: selectedStudent.className || 'Class 11',
        currentSection: selectedStudent.sectionName || 'Section A',
        ...formData,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      <div className="space-y-1">
        <label className="font-semibold text-slate-700">Select Enrolled Student *</label>
        <Select
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          {students.map((s) => (
            <option key={s.id} value={s.id}>
              {s.personal?.fullName || s.name} ({s.studentId}) — {s.className} {s.sectionName}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded border border-slate-200">
        <div>
          <span className="text-slate-400">Current Campus:</span>
          <div className="font-semibold text-slate-800">{selectedStudent?.campusName}</div>
        </div>
        <div>
          <span className="text-slate-400">Current Allocation:</span>
          <div className="font-semibold text-slate-800">
            {selectedStudent?.className} — {selectedStudent?.sectionName}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Transfer Type *</label>
          <Select
            value={formData.transferType}
            onChange={(e) => setFormData({ ...formData, transferType: e.target.value })}
          >
            <option value="Internal Campus">Internal Campus Transfer</option>
            <option value="Internal Section">Section Re-allocation</option>
            <option value="External Transfer">External Transfer to Another School</option>
          </Select>
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Effective Date *</label>
          <Input
            type="date"
            required
            value={formData.effectiveDate}
            onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Destination Campus</label>
          <Input
            required
            value={formData.destinationCampus}
            onChange={(e) => setFormData({ ...formData, destinationCampus: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <label className="font-semibold text-slate-700">Destination Class & Section</label>
          <div className="flex gap-2">
            <Input
              placeholder="Class"
              value={formData.destinationClass}
              onChange={(e) => setFormData({ ...formData, destinationClass: e.target.value })}
            />
            <Input
              placeholder="Section"
              value={formData.destinationSection}
              onChange={(e) => setFormData({ ...formData, destinationSection: e.target.value })}
            />
          </div>
        </div>

        <div className="sm:col-span-2 space-y-1">
          <label className="font-semibold text-slate-700">Reason for Transfer *</label>
          <Textarea
            rows={2}
            required
            placeholder="e.g. Parental relocation to Hyderabad Financial District..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
          Submit Transfer Request
        </Button>
      </div>
    </form>
  )
}
