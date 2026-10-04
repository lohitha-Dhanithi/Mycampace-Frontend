// src/modules/students/components/GuardianTable.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Edit, Trash2, CheckCircle, Star, Phone, Mail } from 'lucide-react'
import { GuardianForm } from './GuardianForm'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function GuardianTable({
  guardians = [],
  studentId,
  onAddGuardian,
  onUpdateGuardian,
  onSetPrimary,
  onRemoveGuardian,
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGuardian, setEditingGuardian] = useState(null)

  const handleOpenAdd = () => {
    setEditingGuardian(null)
    setModalOpen(true)
  }

  const handleOpenEdit = (grd) => {
    setEditingGuardian(grd)
    setModalOpen(true)
  }

  const handleFormSubmit = (data) => {
    if (editingGuardian) {
      onUpdateGuardian && onUpdateGuardian(editingGuardian.id, data)
    } else {
      onAddGuardian && onAddGuardian({ ...data, studentId })
    }
    setModalOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Parents & Legal Guardians</h4>
          <p className="text-[11px] text-slate-500">Emergency contacts and student portal account authority</p>
        </div>
        <Button size="sm" onClick={handleOpenAdd} className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-3.5 w-3.5" /> Add Guardian
        </Button>
      </div>

      <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Guardian Name</th>
                <th className="px-4 py-3">Relationship</th>
                <th className="px-4 py-3">Contact Number</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Occupation</th>
                <th className="px-4 py-3">Primary</th>
                <th className="px-4 py-3">Emergency</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {guardians.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-slate-400">
                    No guardians registered for this student. Click "Add Guardian" to create.
                  </td>
                </tr>
              ) : (
                guardians.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900 flex items-center gap-1.5">
                      {g.name}
                      {g.isPrimary && (
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500 shrink-0" />
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">{g.relationship}</td>
                    <td className="px-4 py-3 font-mono">{g.mobile}</td>
                    <td className="px-4 py-3 text-slate-600">{g.email || '—'}</td>
                    <td className="px-4 py-3 text-slate-600">{g.occupation || '—'}</td>
                    <td className="px-4 py-3">
                      {g.isPrimary ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          Primary
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onSetPrimary && onSetPrimary(g.id)}
                          className="h-6 text-[10px] text-slate-500 hover:text-blue-600 p-0 px-1"
                        >
                          Make Primary
                        </Button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {g.isEmergencyContact ? (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                          Yes
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[11px]">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenEdit(g)}
                          className="h-7 px-2 text-xs"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRemoveGuardian && onRemoveGuardian(g.id)}
                          disabled={g.isPrimary && guardians.length === 1}
                          className="h-7 px-2 text-xs text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guardian Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {editingGuardian ? 'Edit Guardian Details' : 'Add New Guardian'}
            </DialogTitle>
          </DialogHeader>
          <GuardianForm
            initialData={editingGuardian}
            onSubmit={handleFormSubmit}
            onCancel={() => setModalOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
