// src/modules/users/components/UserStatusDialog.jsx
import React from 'react'
import { AlertTriangle, Power, ShieldOff } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

const ACTION_CONFIG = {
  suspend: {
    icon: ShieldOff,
    iconBg: 'bg-red-50',
    iconColor: 'text-red-600',
    title: 'Suspend Account',
    description: 'This will immediately revoke this user\'s access to the platform. They will be notified via email.',
    confirmText: 'Suspend Account',
    confirmVariant: 'destructive',
    newStatus: 'Suspended',
  },
  activate: {
    icon: Power,
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    title: 'Activate Account',
    description: 'This will restore full access for this user based on their assigned role and permissions.',
    confirmText: 'Activate Account',
    confirmVariant: 'default',
    newStatus: 'Active',
  },
  deactivate: {
    icon: Power,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Deactivate Account',
    description: 'This will disable the user\'s access without deleting their data. They cannot log in until reactivated.',
    confirmText: 'Deactivate Account',
    confirmVariant: 'destructive',
    newStatus: 'Inactive',
  },
}

export function UserStatusDialog({ open, onOpenChange, action = 'suspend', userName, onConfirm }) {
  const config = ACTION_CONFIG[action] || ACTION_CONFIG.suspend
  const Icon = config.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${config.iconBg}`}>
            <Icon className={`h-4 w-4 ${config.iconColor}`} />
          </div>
          <DialogTitle>{config.title}</DialogTitle>
        </div>
      </DialogHeader>
      <DialogContent className="space-y-3">
        {userName && (
          <p className="text-xs font-semibold text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            User: {userName}
          </p>
        )}
        <p className="text-sm text-slate-600 leading-relaxed">{config.description}</p>
        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-[11px] text-amber-800">
            This action will be logged in the system audit trail and the user will be notified.
          </p>
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          variant={config.confirmVariant}
          size="sm"
          onClick={() => {
            onConfirm && onConfirm(config.newStatus)
            onOpenChange(false)
          }}
        >
          {config.confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
