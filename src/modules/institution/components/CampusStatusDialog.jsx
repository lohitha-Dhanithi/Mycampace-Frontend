// src/modules/institution/components/CampusStatusDialog.jsx
import React from 'react'
import { AlertTriangle, Power } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function CampusStatusDialog({ open, onOpenChange, campus, onConfirm }) {
  if (!campus) return null

  const isDeactivating = campus.status === 'Active'
  const actionTitle = isDeactivating ? 'Deactivate Campus' : 'Activate Campus'
  const actionVerb = isDeactivating ? 'Deactivate' : 'Activate'
  const confirmVariant = isDeactivating ? 'destructive' : 'default'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div
            className={`p-2 rounded-full ${
              isDeactivating ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
            }`}
          >
            {isDeactivating ? <AlertTriangle className="h-5 w-5" /> : <Power className="h-5 w-5" />}
          </div>
          <DialogTitle>{actionTitle}</DialogTitle>
        </div>
      </DialogHeader>

      <DialogContent>
        <p className="text-sm text-slate-600 leading-relaxed">
          Are you sure you want to {actionVerb.toLowerCase()}{' '}
          <strong className="text-slate-900 font-semibold">{campus.name}</strong>?
        </p>
        <p className="text-xs text-slate-500 mt-2">
          {isDeactivating
            ? 'Deactivating will mark this branch inactive for admissions and academic scheduling. Existing records will remain intact and will not be deleted.'
            : 'Activating will re-enable this campus across course allocations, attendance, and admissions workflows.'}
        </p>
      </DialogContent>

      <DialogFooter>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          variant={confirmVariant}
          size="sm"
          onClick={() => {
            onConfirm && onConfirm(campus)
            onOpenChange(false)
          }}
        >
          {actionVerb}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
