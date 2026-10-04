// src/modules/users/UserAccessPage.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Shield, Plus, Trash2, Building2, MapPin,
  CalendarDays, CheckCircle2, Info, Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { UserAvatar } from './components/UserAvatar'
import { UserStatusBadge } from './components/UserStatusBadge'
import { RoleAssignmentDialog } from './components/RoleAssignmentDialog'
import { userService } from './services/userService'
import { roleService } from '../roles/services/roleService'

export function UserAccessPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [roleDialog, setRoleDialog] = useState(false)
  const [scope, setScope] = useState({
    institution: 'MyCampace International School',
    campus: 'Hyderabad Main Campus',
    academicYear: '2026–27',
  })
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  useEffect(() => {
    Promise.all([userService.getUserById(id), roleService.getRoles()]).then(([u, r]) => {
      if (!u) { setError('User not found'); return }
      setUser(u)
      setRoles(r)
      setLoading(false)
    })
  }, [id])

  const handleAssignRole = async (roleName) => {
    const role = roles.find((r) => r.name === roleName)
    await userService.assignRole(id, role?.id || null, roleName)
    setUser((prev) => ({ ...prev, role: roleName, roleId: role?.id }))
    showToast(`Role "${roleName}" assigned to ${user.name}.`)
  }

  const handleRemoveRole = async () => {
    await userService.removeRole(id)
    setUser((prev) => ({ ...prev, role: 'No Role', roleId: null }))
    showToast(`Role removed from ${user.name}.`)
  }

  if (loading) return <LoadingState />
  if (error || !user) return <ErrorState message={error || 'User not found'} />

  const assignedRole = roles.find((r) => r.name === user.role)

  // Compute perm stats from assigned role
  const permStats = { total: 0, view: 0, create: 0, edit: 0, delete: 0, export: 0, approve: 0 }
  if (assignedRole?.permissions) {
    Object.values(assignedRole.permissions).forEach((modPerms) => {
      Object.entries(modPerms).forEach(([action, val]) => {
        if (val) {
          permStats.total++
          permStats[action] = (permStats[action] || 0) + 1
        }
      })
    })
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
          {toast}
        </div>
      )}

      {/* Back + Header */}
      <div className="flex items-center gap-3 pb-5 border-b border-slate-200">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" onClick={() => navigate(`/users/${id}`)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <UserAvatar name={user.name} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900">{user.name}</h1>
              <span className="text-slate-300">·</span>
              <span className="text-sm text-slate-500">Manage Access</span>
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
          <UserStatusBadge status={user.status} className="ml-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Role & Scope */}
        <div className="lg:col-span-2 space-y-5">
          {/* Assigned Roles */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-800">Assigned Roles</h3>
                <Button size="sm" className="text-xs h-8" onClick={() => setRoleDialog(true)}>
                  <Plus className="h-3.5 w-3.5 mr-1" /> Add Role
                </Button>
              </div>

              {user.role && user.role !== 'No Role' ? (
                <div className="flex items-center gap-3 p-3.5 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-md">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{user.role}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {assignedRole?.description || 'Role assigned to this user'}
                    </p>
                    {assignedRole?.scope && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium mt-1 inline-block">
                        Scope: {assignedRole.scope}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleRemoveRole}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                    title="Remove Role"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                  <Shield className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p className="text-xs font-medium">No role assigned</p>
                  <p className="text-[11px] mt-1">This user currently has no access role.</p>
                </div>
              )}

              <div className="mt-3 flex items-start gap-2 p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                <Info className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-500">
                  Role changes take effect on the user's next login or token refresh. To view full permissions, navigate to
                  <button className="text-blue-600 font-medium hover:underline ml-0.5" onClick={() => navigate(`/roles/${assignedRole?.id || ''}`)}>
                    {user.role}
                  </button>.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Access Scope */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-800">Access Scope</h3>
                <span className="text-[11px] text-slate-400">Defines the data boundaries for this user</span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" /> Institution
                  </label>
                  <Select
                    value={scope.institution}
                    onChange={(e) => setScope((p) => ({ ...p, institution: e.target.value }))}
                    className="h-9 text-xs"
                  >
                    <option>MyCampace International School</option>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> Campus
                  </label>
                  <Select
                    value={scope.campus}
                    onChange={(e) => setScope((p) => ({ ...p, campus: e.target.value }))}
                    className="h-9 text-xs"
                  >
                    <option>All Campuses (Platform)</option>
                    <option>Hyderabad Main Campus</option>
                    <option>Secunderabad Campus</option>
                    <option>Jubilee Hills Campus</option>
                    <option>Gachibowli Tech Campus</option>
                  </Select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 mb-1 block flex items-center gap-1.5">
                    <CalendarDays className="h-3.5 w-3.5 text-slate-400" /> Academic Year
                  </label>
                  <Select
                    value={scope.academicYear}
                    onChange={(e) => setScope((p) => ({ ...p, academicYear: e.target.value }))}
                    className="h-9 text-xs"
                  >
                    <option>2026–27</option>
                    <option>2025–26</option>
                    <option>2024–25</option>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button size="sm" className="text-xs h-8" onClick={() => showToast('Access scope updated successfully.')}>
                  <Save className="h-3.5 w-3.5 mr-1.5" /> Save Scope
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Permission stats */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Permission Summary</h3>
              {assignedRole ? (
                <div className="space-y-2">
                  {[
                    { label: 'Total Permissions', value: permStats.total, color: 'text-slate-800' },
                    { label: 'View', value: permStats.view, color: 'text-blue-600' },
                    { label: 'Create', value: permStats.create, color: 'text-emerald-600' },
                    { label: 'Edit', value: permStats.edit, color: 'text-amber-600' },
                    { label: 'Delete', value: permStats.delete, color: 'text-red-600' },
                    { label: 'Export', value: permStats.export, color: 'text-violet-600' },
                    { label: 'Approve', value: permStats.approve, color: 'text-cyan-600' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="flex items-center justify-between py-1.5 border-b border-slate-100 last:border-0">
                      <span className="text-[11px] text-slate-500">{label}</span>
                      <span className={`text-sm font-bold ${color}`}>{value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic text-center py-4">
                  Assign a role to see permission breakdown.
                </p>
              )}
              {assignedRole && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-4 text-xs h-8"
                  onClick={() => navigate(`/roles/${assignedRole.id}/permissions`)}
                >
                  <Shield className="h-3.5 w-3.5 mr-1.5" /> View Full Matrix
                </Button>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Role Profile</h3>
              {assignedRole ? (
                <div className="space-y-2">
                  <div className="text-xs">
                    <span className="text-slate-500">Role Code</span>
                    <p className="font-mono font-semibold text-slate-800 mt-0.5">{assignedRole.code}</p>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-500">Scope</span>
                    <p className="font-semibold text-slate-800 mt-0.5">{assignedRole.scope}</p>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-500">Type</span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {assignedRole.isSystem ? 'System Role' : 'Custom Role'}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2 text-xs h-8"
                    onClick={() => navigate(`/roles/${assignedRole.id}`)}
                  >
                    View Role Details
                  </Button>
                </div>
              ) : (
                <p className="text-[11px] text-slate-400 italic">No role assigned.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <RoleAssignmentDialog
        open={roleDialog}
        onOpenChange={setRoleDialog}
        userId={id}
        currentRole={user.role}
        onAssign={handleAssignRole}
      />
    </div>
  )
}
