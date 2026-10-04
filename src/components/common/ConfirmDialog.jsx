// src/components/common/ConfirmDialog.jsx
import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function ConfirmDialog({
  open,
  onOpenChange,
  title = 'Confirm Action',
  description = 'Are you sure you want to perform this action? This operation may be irreversible.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'destructive',
  onConfirm,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-red-50 text-red-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <DialogTitle>{title}</DialogTitle>
        </div>
      </DialogHeader>
      <DialogContent>
        <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          size="sm"
          onClick={() => {
            onConfirm && onConfirm()
            onOpenChange(false)
          }}
        >
          {confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
