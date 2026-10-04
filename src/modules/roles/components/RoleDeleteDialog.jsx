// src/modules/roles/components/RoleDeleteDialog.jsx
import React from 'react'
import { Trash2, Users, AlertTriangle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export function RoleDeleteDialog({ open, onOpenChange, role, onDelete, onViewUsers }) {
  if (!role) return null
  const hasUsers = role.userCount > 0

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className={`p-1.5 rounded-md ${hasUsers ? 'bg-amber-50' : 'bg-red-50'}`}>
            {hasUsers ? (
              <Users className="h-4 w-4 text-amber-600" />
            ) : (
              <Trash2 className="h-4 w-4 text-red-600" />
            )}
          </div>
          <DialogTitle>
            {hasUsers ? 'Cannot Delete Role' : `Delete Role: ${role.name}`}
          </DialogTitle>
        </div>
      </DialogHeader>
      <DialogContent className="space-y-3">
        {hasUsers ? (
          <>
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-sm text-amber-800">
                The role <strong>"{role.name}"</strong> is currently assigned to{' '}
                <strong>{role.userCount} user{role.userCount !== 1 ? 's' : ''}</strong> and cannot be deleted.
              </p>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              To delete this role, you must first reassign all users to a different role or deactivate the role.
            </p>
          </>
        ) : (
          <>
            <p className="text-sm text-slate-600 leading-relaxed">
              Are you sure you want to delete the role <strong>"{role.name}"</strong>? This action cannot be undone.
            </p>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <p className="text-[11px] text-red-700">
                All permission configurations associated with this role will be permanently removed.
              </p>
            </div>
          </>
        )}
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          {hasUsers ? 'Close' : 'Cancel'}
        </Button>
        {hasUsers ? (
          <Button size="sm" variant="outline" onClick={() => { onViewUsers && onViewUsers(); onOpenChange(false) }}>
            <Users className="h-3.5 w-3.5 mr-1" /> View Assigned Users
          </Button>
        ) : (
          <Button variant="destructive" size="sm" onClick={() => { onDelete && onDelete(); onOpenChange(false) }}>
            <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete Role
          </Button>
        )}
      </DialogFooter>
    </Dialog>
  )
}
