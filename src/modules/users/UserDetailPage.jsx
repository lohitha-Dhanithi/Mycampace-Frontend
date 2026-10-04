// src/modules/users/UserDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Edit, Shield, ShieldOff, Power, ArrowLeft, Mail, Phone,
  Building2, MapPin, Briefcase, CalendarDays, Clock, KeyRound,
  Smartphone, LogIn, UserCheck, AlertTriangle, CheckCircle2,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ActivityTimeline } from '@/components/common/ActivityTimeline'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { UserAvatar } from './components/UserAvatar'
import { UserStatusBadge } from './components/UserStatusBadge'
import { UserStatusDialog } from './components/UserStatusDialog'
import { userService } from './services/userService'

function InfoRow({ label, value, icon: Icon }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      {Icon && <Icon className="h-3.5 w-3.5 text-slate-400 mt-0.5 shrink-0" />}
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-sm font-semibold text-slate-800 mt-0.5 truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

function PermRow({ module, perms }) {
  const ACTIONS = ['view', 'create', 'edit', 'delete', 'export', 'approve']
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
      <span className="text-xs font-medium text-slate-700 w-36 shrink-0">{module}</span>
      <div className="flex gap-2 flex-wrap">
        {ACTIONS.map((act) => (
          perms[act] ? (
            <span key={act} className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium capitalize">
              {act}
            </span>
          ) : null
        ))}
        {!Object.values(perms).some(Boolean) && (
          <span className="text-[10px] text-slate-400 italic">No access</span>
        )}
      </div>
    </div>
  )
}

export function UserDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusDialog, setStatusDialog] = useState({ open: false, action: 'suspend' })
  const [toast, setToast] = useState('')

  const loadUser = async () => {
    try {
      setLoading(true)
      const data = await userService.getUserById(id)
      if (!data) { setError('User not found'); return }
      setUser(data)
    } catch (e) {
      setError('Failed to load user')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadUser() }, [id])

  const handleStatusChange = async (newStatus) => {
    await userService.updateUserStatus(id, newStatus)
    setToast(`Status updated to ${newStatus}.`)
    setTimeout(() => setToast(''), 3000)
    loadUser()
  }

  if (loading) return <LoadingState />
  if (error || !user) return <ErrorState message={error || 'User not found'} />

  const canSuspend = user.status === 'Active' || user.status === 'Invited'

  // Build a sample permission summary from mock role
  const SAMPLE_PERMS = {
    'Dashboard': { view: true, export: true },
    'Students': { view: true, create: user.role !== 'Teacher', edit: true, export: true },
    'Admissions': { view: user.role === 'Admissions Officer' || user.role === 'Institution Admin', create: user.role === 'Admissions Officer', edit: user.role === 'Admissions Officer', export: true },
    'Finance': { view: user.role === 'Accountant' || user.role === 'Institution Admin', create: user.role === 'Accountant', edit: user.role === 'Accountant', delete: user.role === 'Accountant', export: user.role === 'Accountant', approve: user.role === 'Accountant' },
    'Attendance': { view: true, create: user.role !== 'Student', edit: user.role !== 'Student', export: true },
    'Users': { view: ['Super Admin', 'Institution Admin', 'HR Admin'].includes(user.role), create: ['Super Admin', 'Institution Admin'].includes(user.role), edit: ['Super Admin', 'Institution Admin'].includes(user.role), delete: user.role === 'Super Admin', export: ['Super Admin', 'Institution Admin'].includes(user.role) },
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 mt-1" onClick={() => navigate('/users')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-4 pb-5 mb-1 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <UserAvatar name={user.name} size="xl" />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{user.name}</h1>
                <UserStatusBadge status={user.status} />
              </div>
              <p className="text-sm text-slate-500 mt-0.5">{user.email}</p>
              <p className="text-xs text-blue-600 font-semibold mt-1">{user.role} · {user.campus}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:ml-auto flex-wrap">
            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => navigate(`/users/${id}/edit`)}>
              <Edit className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8" onClick={() => navigate(`/users/${id}/access`)}>
              <Shield className="h-3.5 w-3.5 mr-1.5" /> Manage Access
            </Button>
            {canSuspend ? (
              <Button variant="outline" size="sm" className="text-xs h-8 text-red-600 border-red-200 hover:bg-red-50" onClick={() => setStatusDialog({ open: true, action: 'suspend' })}>
                <ShieldOff className="h-3.5 w-3.5 mr-1.5" /> Suspend
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="text-xs h-8 text-emerald-600 border-emerald-200 hover:bg-emerald-50" onClick={() => setStatusDialog({ open: true, action: 'activate' })}>
                <Power className="h-3.5 w-3.5 mr-1.5" /> Activate
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="access">Access</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Personal Information</h3>
                <InfoRow label="Full Name" value={user.name} icon={UserCheck} />
                <InfoRow label="Email" value={user.email} icon={Mail} />
                <InfoRow label="Mobile" value={user.mobile} icon={Phone} />
                <InfoRow label="Designation" value={user.designation} icon={Briefcase} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Organization</h3>
                <InfoRow label="Institution" value={user.institution} icon={Building2} />
                <InfoRow label="Campus" value={user.campus} icon={MapPin} />
                <InfoRow label="Department" value={user.department} icon={Briefcase} />
                <InfoRow label="Role" value={user.role} icon={Shield} />
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Account Details</h3>
                <InfoRow label="Status" value={user.status} icon={UserCheck} />
                <InfoRow label="Created Date" value={user.createdAt} icon={CalendarDays} />
                <InfoRow label="Last Login" value={user.lastLogin} icon={Clock} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Access Tab */}
        <TabsContent value="access" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Assigned Role</h3>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="p-2 bg-blue-100 rounded-md">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{user.role}</p>
                    <p className="text-[11px] text-slate-500">Currently assigned role</p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto text-xs h-7" onClick={() => navigate(`/users/${id}/access`)}>
                    Change
                  </Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Access Scope</h3>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Institution</span>
                    <span className="font-semibold text-slate-800">{user.institution}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Campus</span>
                    <span className="font-semibold text-slate-800">{user.campus}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-500">Department</span>
                    <span className="font-semibold text-slate-800">{user.department || '—'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Permission Summary</h3>
              <div className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                Permissions are inherited from the assigned role. Full matrix available in
                <button className="text-blue-600 font-medium hover:underline ml-0.5" onClick={() => navigate(`/users/${id}/access`)}>
                  Manage Access
                </button>
              </div>
              {Object.entries(SAMPLE_PERMS).map(([module, perms]) => (
                <PermRow key={module} module={module} perms={perms} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Account Activity</h3>
              <ActivityTimeline items={user.activityLog || []} />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-5 space-y-3">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Security Settings</h3>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Two-Factor Authentication</p>
                      <p className="text-[11px] text-slate-500">TOTP / SMS verification</p>
                    </div>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${user.twoFactorEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                    {user.twoFactorEnabled ? 'Enabled' : 'Not Enabled'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Last Password Change</p>
                      <p className="text-[11px] text-slate-500">Account credentials</p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-600">{user.lastPasswordChange}</span>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-2">
                    <LogIn className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Active Sessions</p>
                      <p className="text-[11px] text-slate-500">Concurrent authenticated sessions</p>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold ${user.activeSessions > 0 ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {user.activeSessions} session{user.activeSessions !== 1 ? 's' : ''}
                  </span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <h3 className="text-sm font-semibold text-slate-800 mb-3">Account Requirements</h3>
                <div className="flex items-center gap-2 py-3 border-b border-slate-100">
                  {user.requirePasswordChange ? (
                    <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  )}
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Password change on next login</p>
                    <p className={`text-[11px] ${user.requirePasswordChange ? 'text-amber-600' : 'text-slate-500'}`}>
                      {user.requirePasswordChange ? 'Required — user must set new password' : 'Not required'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 py-3">
                  <CheckCircle2 className={`h-4 w-4 shrink-0 ${user.inviteSent ? 'text-emerald-500' : 'text-slate-300'}`} />
                  <div>
                    <p className="text-xs font-semibold text-slate-800">Welcome email</p>
                    <p className="text-[11px] text-slate-500">
                      {user.inviteSent ? 'Invitation email sent' : 'No invitation sent'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <UserStatusDialog
        open={statusDialog.open}
        onOpenChange={(o) => setStatusDialog((p) => ({ ...p, open: o }))}
        action={statusDialog.action}
        userName={user?.name}
        onConfirm={handleStatusChange}
      />
    </div>
  )
}
