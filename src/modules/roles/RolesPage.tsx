// src/modules/roles/RolesPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Shield, Plus, Search, Filter, Lock, Copy, Trash2, Edit,
  Sliders, Eye, CheckCircle2, Users, Building2, Layers,
  AlertCircle, ShieldCheck, KeyRound, Clock, RotateCcw
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { EmptyState } from '@/components/common/EmptyState'
import { PermissionMatrix } from './components/PermissionMatrix'
import { RoleDeleteDialog } from './components/RoleDeleteDialog'
import { roleService } from './services/roleService'
import { MOCK_ROLE_AUDIT } from './data/roleMockData'
import { PERMISSION_GROUPS, PERMISSION_ACTIONS } from './data/permissionConfig'

export function RolesPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [scopeFilter, setScopeFilter] = useState('ALL')
  const [typeFilter, setTypeFilter] = useState('ALL') // ALL | SYSTEM | CUSTOM
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Selected role for inline matrix tab
  const [matrixRoleId, setMatrixRoleId] = useState(null)
  const [matrixPermissions, setMatrixPermissions] = useState<Record<string, any>>({})
  const [matrixSaving, setMatrixSaving] = useState(false)

  // Dialogs and feedback
  const [deleteTargetRole, setDeleteTargetRole] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [toast, setToast] = useState(location.state?.toast || '')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  // Load roles
  const loadRoles = async () => {
    try {
      setLoading(true)
      const data = await roleService.getRoles()
      setRoles(data)
      if (data.length > 0 && !matrixRoleId) {
        // Default inline matrix to Campus Admin or first custom role
        const defaultRole = data.find((r) => r.code === 'CAMPUS_ADMIN') || data[0]
        setMatrixRoleId(defaultRole.id)
        setMatrixPermissions(defaultRole.permissions || {})
      }
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Failed to load roles')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoles()
  }, [])

  // Sync matrix role changes
  useEffect(() => {
    if (matrixRoleId && roles.length > 0) {
      const current = roles.find((r) => r.id === matrixRoleId)
      if (current) {
        setMatrixPermissions(current.permissions || {})
      }
    }
  }, [matrixRoleId, roles])

  // Duplicate Role
  const handleDuplicate = async (roleId) => {
    try {
      const duplicated = await roleService.duplicateRole(roleId)
      await loadRoles()
      showToast(`Role duplicated as "${duplicated.name}".`)
    } catch (err) {
      alert(err.message || 'Failed to duplicate role')
    }
  }

  // Delete Role Trigger
  const handleDeleteClick = (role) => {
    setDeleteTargetRole(role)
    setDeleteModalOpen(true)
  }

  const handleDeleteSuccess = async () => {
    await loadRoles()
    showToast(`Role "${deleteTargetRole?.name}" deleted successfully.`)
  }

  // Save Inline Matrix
  const handleSaveInlineMatrix = async () => {
    const currentRole = roles.find((r) => r.id === matrixRoleId)
    if (!currentRole || currentRole.isSystem) return

    setMatrixSaving(true)
    try {
      await roleService.updateRolePermissions(matrixRoleId, matrixPermissions)
      await loadRoles()
      setMatrixSaving(false)
      showToast(`Permissions for "${currentRole.name}" updated successfully.`)
    } catch (err) {
      setMatrixSaving(false)
      alert(err.message || 'Failed to update permissions')
    }
  }

  // Filtered Roles
  const filteredRoles = useMemo(() => {
    return roles.filter((role) => {
      const matchesSearch =
        searchQuery === '' ||
        role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.description?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesScope =
        scopeFilter === 'ALL' || role.scope === scopeFilter

      const matchesType =
        typeFilter === 'ALL' ||
        (typeFilter === 'SYSTEM' && role.isSystem) ||
        (typeFilter === 'CUSTOM' && !role.isSystem)

      const matchesStatus =
        statusFilter === 'ALL' || role.status === statusFilter

      return matchesSearch && matchesScope && matchesType && matchesStatus
    })
  }, [roles, searchQuery, scopeFilter, typeFilter, statusFilter])

  // Calculate KPIs
  const stats = useMemo(() => {
    const total = roles.length
    const system = roles.filter((r) => r.isSystem).length
    const custom = roles.filter((r) => !r.isSystem).length
    const totalAssignedUsers = roles.reduce((acc, r) => acc + (r.userCount || 0), 0)
    return { total, system, custom, totalAssignedUsers }
  }, [roles])

  // Count granted permissions for a role
  const getRolePermissionCount = (role: any): number => {
    if (!role.permissions) return 0
    return Object.values(role.permissions).reduce<number>(
      (acc: number, mod: any) => acc + Object.values(mod || {}).filter(Boolean).length,
      0
    )
  }

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={loadRoles} />

  const activeMatrixRole = roles.find((r) => r.id === matrixRoleId)

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

      {/* Page Header */}
      <PageHeader
        title="Roles & Permissions"
        subtitle="Manage access roles, operational scopes, and granular module authorization matrices across the institution."
        actions={
          <Link to="/roles/new">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm text-xs font-medium">
              <Plus className="h-4 w-4 mr-1.5" />
              Create Role
            </Button>
          </Link>
        }
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Roles
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Defined security profiles</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            System Core Roles
          </div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{stats.system}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Protected baseline roles</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Custom Roles
          </div>
          <div className="text-2xl font-bold text-blue-600 mt-1">{stats.custom}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Tailored access profiles</p>
        </div>

        <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Assigned User Accounts
          </div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{stats.totalAssignedUsers}</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Across all campuses</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="directory" className="space-y-4">
        <TabsList className="bg-slate-100 p-1 rounded-xl">
          <TabsTrigger value="directory" className="text-xs font-medium">
            <Shield className="h-3.5 w-3.5 mr-1.5" />
            Roles Directory ({roles.length})
          </TabsTrigger>
          <TabsTrigger value="matrix" className="text-xs font-medium">
            <Sliders className="h-3.5 w-3.5 mr-1.5" />
            Permission Matrix Editor
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs font-medium">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Audit & Compliance Log
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: ROLES DIRECTORY */}
        <TabsContent value="directory" className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search roles by title, code or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={scopeFilter}
                onChange={(e) => setScopeFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
              >
                <option value="ALL">All Scopes</option>
                <option value="Institution-wide">Institution-wide</option>
                <option value="Campus-specific">Campus-specific</option>
                <option value="Department-level">Department-level</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
              >
                <option value="ALL">All Role Types</option>
                <option value="SYSTEM">System Protected</option>
                <option value="CUSTOM">Custom Defined</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
              >
                <option value="ALL">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {(searchQuery || scopeFilter !== 'ALL' || typeFilter !== 'ALL' || statusFilter !== 'ALL') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchQuery('')
                    setScopeFilter('ALL')
                    setTypeFilter('ALL')
                    setStatusFilter('ALL')
                  }}
                  className="h-9 text-xs text-slate-600 hover:text-slate-900"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1" />
                  Reset
                </Button>
              )}
            </div>
          </div>

          {/* Roles Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            {filteredRoles.length === 0 ? (
              <div className="p-12 text-center">
                <Shield className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-800">No matching roles found</p>
                <p className="text-xs text-slate-500 mt-1">Try modifying your search or filter options.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                      <th className="py-3 px-4">Role Title & Code</th>
                      <th className="py-3 px-4">Scope Boundary</th>
                      <th className="py-3 px-4">Classification</th>
                      <th className="py-3 px-4">Permissions Active</th>
                      <th className="py-3 px-4">Assigned Users</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRoles.map((role) => {
                      const permCount = getRolePermissionCount(role)

                      return (
                        <tr key={role.id} className="hover:bg-slate-50/70 transition-colors group">
                          {/* Role Name */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`p-2 rounded-lg ${
                                  role.isSystem
                                    ? 'bg-amber-50 text-amber-600 border border-amber-200'
                                    : 'bg-blue-50 text-blue-600 border border-blue-200'
                                }`}
                              >
                                {role.isSystem ? (
                                  <Lock className="h-4 w-4" />
                                ) : (
                                  <Shield className="h-4 w-4" />
                                )}
                              </div>
                              <div>
                                <Link
                                  to={`/roles/${role.id}`}
                                  className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                                >
                                  {role.name}
                                </Link>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                    {role.code}
                                  </span>
                                  {role.campus && role.campus !== 'All Campuses' && (
                                    <span className="text-[11px] text-slate-400">· {role.campus}</span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Scope */}
                          <td className="py-3 px-4 text-slate-700">
                            <span className="font-medium">{role.scope}</span>
                          </td>

                          {/* Classification */}
                          <td className="py-3 px-4">
                            {role.isSystem ? (
                              <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] font-medium">
                                <Lock className="h-3 w-3 mr-1 inline" />
                                System Core
                              </Badge>
                            ) : (
                              <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] font-medium">
                                Custom Defined
                              </Badge>
                            )}
                          </td>

                          {/* Permissions */}
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">{permCount}</span>
                              <span className="text-[11px] text-slate-400">actions</span>
                            </div>
                          </td>

                          {/* Assigned Users */}
                          <td className="py-3 px-4">
                            <Link
                              to={`/roles/${role.id}`}
                              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            >
                              <Users className="h-3 w-3 text-slate-500" />
                              {role.userCount || 0}
                            </Link>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            <Badge
                              className={
                                role.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : 'bg-slate-100 text-slate-600 border-slate-200'
                              }
                            >
                              {role.status}
                            </Badge>
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <Link to={`/roles/${role.id}/permissions`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs text-blue-600 hover:bg-blue-50 px-2"
                                  title="Configure Permissions"
                                >
                                  <Sliders className="h-3.5 w-3.5 mr-1" />
                                  Permissions
                                </Button>
                              </Link>

                              <Link to={`/roles/${role.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 text-xs text-slate-600 hover:bg-slate-100 px-2"
                                  title="View Role Details"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </Button>
                              </Link>

                              {!role.isSystem && (
                                <Link to={`/roles/${role.id}/edit`}>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs text-slate-600 hover:bg-slate-100 px-2"
                                    title="Edit Role Details"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </Button>
                                </Link>
                              )}

                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDuplicate(role.id)}
                                className="h-8 text-xs text-slate-600 hover:bg-slate-100 px-2"
                                title="Duplicate Role"
                              >
                                <Copy className="h-3.5 w-3.5" />
                              </Button>

                              {!role.isSystem && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteClick(role)}
                                  className="h-8 text-xs text-rose-600 hover:bg-rose-50 px-2"
                                  title="Delete Role"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 2: INLINE PERMISSION MATRIX EDITOR */}
        <TabsContent value="matrix" className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-slate-700">Select Role to Inspect/Configure:</label>
              <select
                value={matrixRoleId || ''}
                onChange={(e) => setMatrixRoleId(e.target.value)}
                className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} {r.isSystem ? '(System Core)' : '(Custom)'}
                  </option>
                ))}
              </select>
            </div>

            {activeMatrixRole && !activeMatrixRole.isSystem && (
              <Button
                type="button"
                size="sm"
                onClick={handleSaveInlineMatrix}
                disabled={matrixSaving}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
              >
                {matrixSaving ? 'Saving Policy...' : 'Save Permissions Policy'}
              </Button>
            )}
          </div>

          {activeMatrixRole && (
            <PermissionMatrix
              permissions={matrixPermissions}
              onChange={setMatrixPermissions}
              readOnly={activeMatrixRole.isSystem}
              isSystemRole={activeMatrixRole.isSystem}
              roleName={activeMatrixRole.name}
            />
          )}
        </TabsContent>

        {/* TAB 3: AUDIT TRAIL */}
        <TabsContent value="audit" className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-bold text-slate-900">Institutional Access Audit Trail</h2>
                <p className="text-xs text-slate-500">
                  Comprehensive change log documenting role creations, permission modifications and scope reallocations.
                </p>
              </div>
              <Badge variant="outline" className="text-xs text-slate-600">
                Compliance: ISO 27001 / FERPA
              </Badge>
            </div>

            <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {MOCK_ROLE_AUDIT.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-6 top-1.5 h-3 w-3 rounded-full border-2 border-white bg-blue-600 shadow-xs" />
                  <div className="bg-slate-50/70 border border-slate-200 rounded-lg p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-900">{item.action}</span>
                      <span className="text-[11px] text-slate-400 font-mono">{item.timestamp}</span>
                    </div>
                    <p className="text-slate-600">{(item as any).details || `${item.action} on ${item.target}`}</p>
                    <div className="text-[11px] text-slate-400">
                      Modified by: <span className="font-medium text-slate-700">{(item as any).performedBy || item.actor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Role Delete Dialog */}
      <RoleDeleteDialog
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        role={deleteTargetRole}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
