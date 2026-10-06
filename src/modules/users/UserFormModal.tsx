// src/modules/users/UserFormModal.jsx
import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { useTenantContext } from '@/store/TenantContext'

export function UserFormModal({ open, onOpenChange, user, onSave }) {
  const { campuses } = useTenantContext()

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    role: 'Teacher',
    campus: 'Hyderabad Main Campus',
    campusId: 'camp-1',
    status: 'Active',
    department: 'Academics',
  })

  useEffect(() => {
    if (user) {
      setForm({ ...user })
    } else {
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        role: 'Teacher',
        campus: 'Hyderabad Main Campus',
        campusId: 'camp-1',
        status: 'Active',
        department: 'Academics',
      })
    }
  }, [user, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave && onSave(form)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <DialogTitle>{user ? 'Edit Institutional User' : 'Add New System User'}</DialogTitle>
        <DialogDescription>
          Assign institutional role, campus binding, and contact parameters.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit}>
        <DialogContent className="space-y-3.5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">First Name</label>
              <Input
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="e.g. Ramesh"
                className="h-9 text-xs mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Last Name</label>
              <Input
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="e.g. Sharma"
                className="h-9 text-xs mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Official Email</label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="name@abcschool.edu.in"
                className="h-9 text-xs mt-1"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Mobile Number</label>
              <Input
                type="tel"
                value={form.mobile}
                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                placeholder="+91 98000 00000"
                className="h-9 text-xs mt-1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">System Role</label>
              <Select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="h-9 text-xs mt-1"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Institution Admin">Institution Admin</option>
                <option value="Principal">Principal</option>
                <option value="Teacher">Teacher</option>
                <option value="Accountant">Accountant</option>
                <option value="HR Admin">HR Admin</option>
                <option value="Admissions Officer">Admissions Officer</option>
                <option value="Student">Student</option>
                <option value="Parent">Parent</option>
              </Select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Campus Allocation</label>
              <Select
                value={form.campusId}
                onChange={(e) => {
                  const c = campuses.find((x) => x.id === e.target.value)
                  setForm({
                    ...form,
                    campusId: e.target.value,
                    campus: c ? c.name : 'All Campuses',
                  })
                }}
                className="h-9 text-xs mt-1"
              >
                <option value="all">All Campuses (Enterprise)</option>
                {campuses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700">Department</label>
              <Input
                value={form.department || ''}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                placeholder="e.g. Science Dept"
                className="h-9 text-xs mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700">Status</label>
              <Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="h-9 text-xs mt-1"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </Select>
            </div>
          </div>
        </DialogContent>

        <DialogFooter>
          <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" size="sm">
            {user ? 'Save Changes' : 'Create User'}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  )
}
