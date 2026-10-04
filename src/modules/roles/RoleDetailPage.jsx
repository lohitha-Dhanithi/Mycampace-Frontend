// src/modules/roles/RoleDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom'
import {
  Shield, ArrowLeft, Edit, Sliders, Copy, Trash2, Users,
  Building2, CheckCircle2, Lock, Clock, Calendar, AlertCircle,
  FileText, ExternalLink, ChevronRight, Check
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { UserAvatar } from '../users/components/UserAvatar'
import { UserStatusBadge } from '../users/components/UserStatusBadge'
import { RoleDeleteDialog } from './components/RoleDeleteDialog'
import { roleService } from './services/roleService'
import { userService } from '../users/services/userService'
import { MOCK_ROLE_AUDIT } from './data/roleMockData'
import { PERMISSION_GROUPS, PERMISSION_ACTIONS, PERMISSION_ACTION_LABELS } from './data/permissionConfig'

export function RoleDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [role, setRole] = useState(null)
  const [assignedUsers, setAssignedUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [toast, setToast] = useState(location.state?.toast || '')
  const [activeTab, setActiveTab] = useState('overview')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  useEffect(() => {
    Promise.all([
      roleService.getRoleById(id),
      userService.getUsers(),
    ]).then(([r, usersList]) => {
      if (!r) {
        setError('Role not found')
      } else {
        setRole(r)
        const matchingUsers = usersList.filter(
          (u) => u.role === r.name || u.roleId === r.id
        )
        setAssignedUsers(matchingUsers)
      }
      setLoading(false)
    }).catch((err) => {
      setError(err.message || 'Error loading role')
      setLoading(false)
    })
  }, [id])

  const handleDeleteSuccess = () => {
    navigate('/roles', {
      state: { toast: `Role "${role.name}" deleted successfully.` },
    })
  }

  const handleDuplicate = async () => {
    try {
      const duplicated = await roleService.duplicateRole(id)
      navigate(`/roles/${duplicated.id}`, {
        state: { toast: `Role duplicated as "${duplicated.name}".` },
      })
    } catch (err) {
      alert(err.message || 'Failed to duplicate role')
    }
  }

  if (loading) return <LoadingState />
  if (error || !role) return <ErrorState message={error || 'Role not found'} />

  // Compute permission statistics
  let totalGranted = 0
  let totalPossible = 0
  const actionCounts = { view: 0, create: 0, edit: 0, delete: 0, export: 0, approve: 0 }

  PERMISSION_GROUPS.forEach((group) => {
    group.modules.forEach((mod) => {
      PERMISSION_ACTIONS.forEach((act) => {
        if (mod.applicableActions.includes(act)) {
          totalPossible++
          if (role.permissions?.[mod.id]?.[act]) {
            totalGranted++
            actionCounts[act]++
          }
        }
      })
    })
  })

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast('')}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-start gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 shrink-0 mt-1"
            onClick={() => navigate('/roles')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl font-bold text-slate-900">{role.name}</h1>
              <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                {role.code}
              </span>
              {role.isSystem ? (
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs font-medium">
                  <Lock className="h-3 w-3 mr-1 inline" />
                  System Role
                </Badge>
              ) : (
                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-xs font-medium">
                  Custom Role
                </Badge>
              )}
              <Badge
                className={
                  role.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }
              >
                {role.status}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {role.description || 'System access role definition and module authority profile.'}
            </p>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Link to={`/roles/${id}/permissions`}>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-sm">
              <Sliders className="h-3.5 w-3.5 mr-1.5" />
              Configure Permissions
            </Button>
          </Link>

          {!role.isSystem && (
            <Link to={`/roles/${id}/edit`}>
              <Button variant="outline" size="sm" className="text-xs text-slate-700">
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Edit Details
              </Button>
            </Link>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDuplicate}
            className="text-xs text-slate-700"
          >
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Duplicate
          </Button>

          {!role.isSystem && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
              className="text-xs text-rose-600 border-rose-200 hover:bg-rose-50"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              Delete
            </Button>
          )}
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Assigned Users
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {assignedUsers.length || role.userCount || 0}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">Active user accounts</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Permissions Coverage
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">
            {totalGranted} <span className="text-sm font-normal text-slate-400">/ {totalPossible}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {totalPossible > 0 ? Math.round((totalGranted / totalPossible) * 100) : 0}% of all modules
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Organizational Scope
          </div>
          <div className="text-base font-bold text-slate-900 mt-1 truncate">
            {role.scope}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            {role.campus || 'Institution-wide'}
          </p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Role Class
          </div>
          <div className="text-base font-bold text-slate-900 mt-1">
            {role.isSystem ? 'System Core' : 'Custom Defined'}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {role.isSystem ? 'Read-only base role' : 'Editable permissions'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="overview" className="text-xs font-medium">
            Overview & Scope
          </TabsTrigger>
          <TabsTrigger value="permissions" className="text-xs font-medium">
            Permissions Summary ({totalGranted})
          </TabsTrigger>
          <TabsTrigger value="users" className="text-xs font-medium">
            Assigned Users ({assignedUsers.length})
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs font-medium">
            Audit Trail
          </TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Role Metadata & Boundaries
              </h2>

              <dl className="divide-y divide-slate-100 text-xs">
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Role Identifier</dt>
                  <dd className="font-mono font-medium text-slate-900">{role.code}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Role Scope</dt>
                  <dd className="font-medium text-slate-900">{role.scope}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Applicable Campus</dt>
                  <dd className="font-medium text-slate-900">{role.campus || 'All Campuses'}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Department</dt>
                  <dd className="font-medium text-slate-900">{role.department || 'All Departments'}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Created At</dt>
                  <dd className="text-slate-700">{role.createdAt || '2024-01-15'}</dd>
                </div>
                <div className="py-2.5 flex justify-between">
                  <dt className="text-slate-500">Last Modified</dt>
                  <dd className="text-slate-700">{role.updatedAt || '2024-03-20'}</dd>
                </div>
              </dl>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Authorities by Action
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {PERMISSION_ACTIONS.map((action) => (
                  <div
                    key={action}
                    className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-center"
                  >
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      {PERMISSION_ACTION_LABELS[action]}
                    </span>
                    <span className="text-xl font-bold text-slate-900 mt-1 block">
                      {actionCounts[action]}
                    </span>
                    <span className="text-[10px] text-slate-400">modules enabled</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">Want to inspect or change exact permissions?</span>
                <Link to={`/roles/${id}/permissions`}>
                  <Button variant="outline" size="sm" className="text-xs text-blue-600 border-blue-200 hover:bg-blue-50">
                    Open Matrix Editor <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* PERMISSIONS SUMMARY TAB */}
        <TabsContent value="permissions" className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Configured Module Access</h2>
                <p className="text-xs text-slate-500">Summary of granted actions per module for this role.</p>
              </div>
              <Link to={`/roles/${id}/permissions`}>
                <Button size="sm" className="text-xs bg-blue-600 hover:bg-blue-700 text-white">
                  <Sliders className="h-3.5 w-3.5 mr-1" />
                  Full Interactive Matrix
                </Button>
              </Link>
            </div>

            <div className="space-y-3">
              {PERMISSION_GROUPS.map((group) => {
                const groupGranted = group.modules.filter((mod) => {
                  const mPerms = role.permissions?.[mod.id] || {}
                  return Object.values(mPerms).some(Boolean)
                })

                if (groupGranted.length === 0) return null

                return (
                  <div key={group.id} className="p-4 bg-slate-50/60 border border-slate-200 rounded-xl space-y-2">
                    <h3 className="font-semibold text-xs text-slate-800 uppercase tracking-wide">
                      {group.label}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                      {groupGranted.map((mod) => {
                        const mPerms = role.permissions?.[mod.id] || {}
                        const grantedActions = PERMISSION_ACTIONS.filter((act) => mPerms[act])

                        return (
                          <div
                            key={mod.id}
                            className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs space-y-1.5 shadow-xs"
                          >
                            <span className="font-semibold text-slate-900 block">{mod.name}</span>
                            <div className="flex flex-wrap gap-1">
                              {grantedActions.map((act) => (
                                <span
                                  key={act}
                                  className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize"
                                >
                                  {act}
                                </span>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </TabsContent>

        {/* ASSIGNED USERS TAB */}
        <TabsContent value="users" className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Users Assigned to {role.name} ({assignedUsers.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Users who inherit this role's authority and permission boundary.
                </p>
              </div>
              <Link to="/users">
                <Button variant="outline" size="sm" className="text-xs text-slate-700">
                  <Users className="h-3.5 w-3.5 mr-1" />
                  Manage In Users Directory
                </Button>
              </Link>
            </div>

            {assignedUsers.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700">No users currently assigned to this role</p>
                <p className="text-xs text-slate-400 mt-1">
                  You can assign this role to any user from the Users Directory.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-2.5 px-4">User</th>
                      <th className="py-2.5 px-4">Campus</th>
                      <th className="py-2.5 px-4">Department</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {assignedUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <UserAvatar name={u.name} size="sm" />
                            <div>
                              <Link
                                to={`/users/${u.id}`}
                                className="font-semibold text-slate-900 hover:text-blue-600"
                              >
                                {u.name}
                              </Link>
                              <div className="text-[11px] text-slate-400">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-slate-700">{u.campus}</td>
                        <td className="py-3 px-4 text-slate-700">{u.department}</td>
                        <td className="py-3 px-4">
                          <UserStatusBadge status={u.status} />
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link to={`/users/${u.id}/access`}>
                            <Button variant="ghost" size="sm" className="h-7 text-xs text-blue-600 hover:bg-blue-50">
                              Manage Access
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* AUDIT TRAIL TAB */}
        <TabsContent value="audit" className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Role Modification History</h2>
            <p className="text-xs text-slate-500">
              Immutable audit log recording permission changes, scope updates, and user assignments.
            </p>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {MOCK_ROLE_AUDIT.map((item) => (
                <div key={item.id} className="relative group">
                  <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-600 shadow-xs" />
                  <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{item.action}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-600">{item.details}</p>
                    <div className="text-[11px] text-slate-400">
                      Modified by: <span className="font-medium text-slate-700">{item.performedBy}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Delete Dialog */}
      <RoleDeleteDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        role={role}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
