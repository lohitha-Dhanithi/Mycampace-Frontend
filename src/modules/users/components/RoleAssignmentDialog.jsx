// src/modules/users/components/RoleAssignmentDialog.jsx
import React, { useState } from 'react'
import { Shield, Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { USER_ROLE_OPTIONS } from '../data/userMockData'

export function RoleAssignmentDialog({ open, onOpenChange, userId, currentRole, onAssign }) {
  const [selectedRole, setSelectedRole] = useState(currentRole || 'Teacher')

  const handleAssign = () => {
    onAssign && onAssign(selectedRole)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-50 rounded-md">
            <Shield className="h-4 w-4 text-blue-600" />
          </div>
          <DialogTitle>Assign Role</DialogTitle>
        </div>
      </DialogHeader>
      <DialogContent className="space-y-4">
        <p className="text-xs text-slate-500 leading-relaxed">
          Assigning a new role will update this user's access permissions immediately upon their next login.
        </p>
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1">Select Role</label>
          <Select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="h-9 text-xs"
          >
            {USER_ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </Select>
        </div>
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-800">
          <strong>Note:</strong> The backend will enforce this role change. Frontend display is for reference only.
        </div>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button size="sm" onClick={handleAssign}>
          <Plus className="h-3.5 w-3.5 mr-1" /> Assign Role
        </Button>
      </DialogFooter>
    </Dialog>
  )
}
