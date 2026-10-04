// src/modules/users/components/UserForm.jsx
// Reusable user form — supports both "create" and "edit" modes.

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Building2, MapPin, Briefcase, Shield, Send, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { UserAvatar } from './UserAvatar'
import {
  USER_ROLE_OPTIONS,
  CAMPUS_OPTIONS,
  DEPARTMENT_OPTIONS,
} from '../data/userMockData'

const INITIAL_FORM = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  role: 'Teacher',
  roleId: 'role-004',
  institution: 'MyCampace International School',
  institutionId: 'inst-1',
  campusId: 'camp-1',
  campus: 'Hyderabad Main Campus',
  department: 'Academics',
  designation: '',
  status: 'Active',
  sendInvite: true,
  requirePasswordChange: true,
}

function FieldLabel({ children, required }) {
  return (
    <label className="text-xs font-semibold text-slate-700 mb-1 block">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  )
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <div className="flex items-center gap-2 pb-3 mb-4 border-b border-slate-100">
      <div className="p-1.5 bg-slate-100 rounded-md">
        <Icon className="h-3.5 w-3.5 text-slate-600" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{children}</h3>
    </div>
  )
}

export function UserForm({ user, mode = 'create', onSave, onCancel, loading = false }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (mode === 'edit' && user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        mobile: user.mobile || '',
        role: user.role || 'Teacher',
        roleId: user.roleId || 'role-004',
        institution: user.institution || 'MyCampace International School',
        institutionId: user.institutionId || 'inst-1',
        campusId: user.campusId || 'camp-1',
        campus: user.campus || 'Hyderabad Main Campus',
        department: user.department || '',
        designation: user.designation || '',
        status: user.status || 'Active',
        sendInvite: user.inviteSent || false,
        requirePasswordChange: user.requirePasswordChange || false,
      })
    } else {
      setForm(INITIAL_FORM)
    }
    setErrors({})
  }, [user, mode])

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const validate = () => {
    const errs = {}
    if (!form.firstName.trim()) errs.firstName = 'First name is required'
    if (!form.lastName.trim()) errs.lastName = 'Last name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Invalid email address'
    if (!form.mobile.trim()) errs.mobile = 'Mobile number is required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSave && onSave(form)
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      navigate('/users')
    }
  }

  const previewName = [form.firstName, form.lastName].filter(Boolean).join(' ') || 'New User'

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Avatar Preview */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardContent className="p-6 flex flex-col items-center text-center gap-4">
              <UserAvatar name={previewName} size="xl" />
              <div>
                <p className="text-sm font-bold text-slate-900">{previewName}</p>
                <p className="text-xs text-slate-500">{form.email || 'Email not set'}</p>
                <p className="text-xs text-blue-600 font-medium mt-1">{form.role}</p>
              </div>
              <div className="w-full space-y-2 text-xs">
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-slate-500">Campus</span>
                  <span className="font-medium text-slate-800 truncate max-w-[120px]">{form.campus}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-slate-500">Department</span>
                  <span className="font-medium text-slate-800 truncate max-w-[120px]">{form.department || '—'}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-t border-slate-100">
                  <span className="text-slate-500">Status</span>
                  <span className={`font-semibold ${form.status === 'Active' ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {form.status}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Form sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle icon={User}>Personal Information</SectionTitle>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>First Name</FieldLabel>
                    <Input
                      value={form.firstName}
                      onChange={(e) => set('firstName', e.target.value)}
                      placeholder="e.g. Arjun"
                      className={`h-9 text-xs ${errors.firstName ? 'border-red-400' : ''}`}
                    />
                    {errors.firstName && <p className="text-red-500 text-[11px] mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <FieldLabel required>Last Name</FieldLabel>
                    <Input
                      value={form.lastName}
                      onChange={(e) => set('lastName', e.target.value)}
                      placeholder="e.g. Mehta"
                      className={`h-9 text-xs ${errors.lastName ? 'border-red-400' : ''}`}
                    />
                    {errors.lastName && <p className="text-red-500 text-[11px] mt-1">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Email Address</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => set('email', e.target.value)}
                        placeholder="name@school.edu.in"
                        className={`h-9 text-xs pl-8 ${errors.email ? 'border-red-400' : ''}`}
                      />
                    </div>
                    {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <FieldLabel required>Mobile Number</FieldLabel>
                    <div className="relative">
                      <Phone className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                      <Input
                        type="tel"
                        value={form.mobile}
                        onChange={(e) => set('mobile', e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`h-9 text-xs pl-8 ${errors.mobile ? 'border-red-400' : ''}`}
                      />
                    </div>
                    {errors.mobile && <p className="text-red-500 text-[11px] mt-1">{errors.mobile}</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Organization */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle icon={Building2}>Organization</SectionTitle>
              <div className="space-y-4">
                <div>
                  <FieldLabel>Institution</FieldLabel>
                  <Input
                    value={form.institution}
                    disabled
                    className="h-9 text-xs bg-slate-50 text-slate-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FieldLabel>Campus</FieldLabel>
                    <Select
                      value={form.campusId}
                      onChange={(e) => {
                        const opt = CAMPUS_OPTIONS.find((c) => c.id === e.target.value)
                        set('campusId', e.target.value)
                        set('campus', opt?.name || 'All Campuses')
                      }}
                      className="h-9 text-xs"
                    >
                      {CAMPUS_OPTIONS.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </Select>
                  </div>
                  <div>
                    <FieldLabel>Department</FieldLabel>
                    <Select
                      value={form.department}
                      onChange={(e) => set('department', e.target.value)}
                      className="h-9 text-xs"
                    >
                      <option value="">Select department</option>
                      {DEPARTMENT_OPTIONS.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </Select>
                  </div>
                </div>
                <div>
                  <FieldLabel>Designation</FieldLabel>
                  <div className="relative">
                    <Briefcase className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      value={form.designation}
                      onChange={(e) => set('designation', e.target.value)}
                      placeholder="e.g. Senior Teacher, Campus Principal"
                      className="h-9 text-xs pl-8"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Access */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle icon={Shield}>Access & Permissions</SectionTitle>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FieldLabel required>Role</FieldLabel>
                  <Select
                    value={form.role}
                    onChange={(e) => set('role', e.target.value)}
                    className="h-9 text-xs"
                  >
                    {USER_ROLE_OPTIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </Select>
                </div>
                <div>
                  <FieldLabel>Account Status</FieldLabel>
                  <Select
                    value={form.status}
                    onChange={(e) => set('status', e.target.value)}
                    className="h-9 text-xs"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Setup */}
          <Card>
            <CardContent className="p-6">
              <SectionTitle icon={Send}>Account Setup</SectionTitle>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Send invitation email</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Send a welcome email with login instructions and a one-time access link.
                    </p>
                  </div>
                  <Switch
                    checked={form.sendInvite}
                    onCheckedChange={(val) => set('sendInvite', val)}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Require password change on first login</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Force the user to set a new password before accessing the platform.
                    </p>
                  </div>
                  <Switch
                    checked={form.requirePasswordChange}
                    onCheckedChange={(val) => set('requirePasswordChange', val)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
        <Button type="button" variant="outline" size="sm" onClick={handleCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={loading}>
          {loading
            ? mode === 'edit' ? 'Saving...' : 'Creating...'
            : mode === 'edit' ? 'Save Changes' : 'Create User'}
        </Button>
      </div>
    </form>
  )
}
