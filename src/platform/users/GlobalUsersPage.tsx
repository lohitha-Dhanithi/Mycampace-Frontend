// src/platform/users/GlobalUsersPage.tsx
import React, { useState, useEffect, useMemo } from 'react'
import {
  Users2,
  Shield,
  Search,
  Plus,
  Edit2,
  Check,
  X,
  Mail,
  Phone,
  Building2,
  Layers,
  Copy,
  Trash2,
  AlertTriangle,
  Lock,
  CheckCircle2,
  Sparkles,
  Filter,
  UserPlus,
  Sliders,
  ChevronRight,
  ShieldAlert,
  Info,
  RefreshCw,
  ExternalLink,
} from 'lucide-react'
import { userService, UserRecord } from '@/services/userService'
import { roleService, ProductRole } from '@/services/roleService'
import { permissionService, Permission } from '@/services/permissionService'
import { productService } from '@/services/productService'
import { entitlementService } from '@/services/entitlementService'
import { MOCK_ORGANIZATIONS } from '@/services/mockData'

export function GlobalUsersPage() {
  // --- Active Organization Context ---
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org-1')
  const currentOrg = useMemo(() => {
    return MOCK_ORGANIZATIONS.find((o) => o.id === selectedOrgId) || MOCK_ORGANIZATIONS[0]
  }, [selectedOrgId])

  // --- Active Tab ---
  const [activeTab, setActiveTab] = useState<'users' | 'roles'>('users')

  // --- State for Users Directory ---
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [search, setSearch] = useState('')
  const [productFilter, setProductFilter] = useState('all')
  const [platformRoleFilter, setPlatformRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  // --- State for Roles & Permissions ---
  const [roles, setRoles] = useState<ProductRole[]>([])
  const [selectedRoleProduct, setSelectedRoleProduct] = useState<string>('all')
  const [roleTypeFilter, setRoleTypeFilter] = useState<'all' | 'system' | 'custom'>('all')

  // --- Modals State ---
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isManageRolesOpen, setIsManageRolesOpen] = useState(false)
  const [selectedUserForRoles, setSelectedUserForRoles] = useState<UserRecord | null>(null)
  const [userRoleDraft, setUserRoleDraft] = useState<Record<string, string>>({})
  const [userPlatformRoleDraft, setUserPlatformRoleDraft] = useState<UserRecord['platformRole']>('Member')

  // --- Add User Form State ---
  const [newUserForm, setNewUserForm] = useState({
    name: '',
    email: '',
    mobile: '',
    platformRole: 'Member' as UserRecord['platformRole'],
    productRoles: {} as Record<string, string>,
    status: 'Active' as UserRecord['status'],
  })
  const [addUserError, setAddUserError] = useState<string | null>(null)

  // --- Role Builder / Editor Modal State ---
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<ProductRole | null>(null)
  const [roleForm, setRoleForm] = useState({
    name: '',
    description: '',
    productId: 'academics',
    permissionIds: [] as string[],
  })
  const [roleFormError, setRoleFormError] = useState<string | null>(null)

  // --- Clone Role Modal State ---
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false)
  const [roleToClone, setRoleToClone] = useState<ProductRole | null>(null)
  const [cloneRoleName, setCloneRoleName] = useState('')

  // --- Manage Org Products Modal State ---
  const [isManageProductsOpen, setIsManageProductsOpen] = useState(false)
  const [orgEntitlements, setOrgEntitlements] = useState<string[]>([])

  // --- Notification Toast ---
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // --- Collapsible User Product Roles State ---
  const [expandedUserRoles, setExpandedUserRoles] = useState<Record<string, boolean>>({})
  const toggleExpandUserRoles = (userId: string) => {
    setExpandedUserRoles((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text })
    setTimeout(() => setToastMessage(null), 3500)
  }

  // --- Catalog & Entitlements ---
  const allProducts = useMemo(() => productService.getProducts(), [])

  // Load entitlements for selected organization
  const loadEntitlements = () => {
    const ents = entitlementService.getEntitlements(selectedOrgId)
    // List of active/trial product IDs for this org
    const activeIds = ents
      .filter((e) => e.status === 'Active' || e.status === 'Trial')
      .map((e) => e.productId)
    // Fallback default: at least academics, lms, admissions if empty
    setOrgEntitlements(activeIds.length > 0 ? activeIds : ['academics', 'lms', 'finance', 'admissions'])
  }

  // Load Users
  const loadUsers = async () => {
    setLoadingUsers(true)
    try {
      const data = await userService.getUsers({
        organizationId: selectedOrgId,
        search,
        product: productFilter,
        role: platformRoleFilter,
        status: statusFilter,
      })
      setUsers(data)
    } finally {
      setLoadingUsers(false)
    }
  }

  // Load Roles
  const loadRoles = () => {
    const list = roleService.getRoles(selectedRoleProduct, selectedOrgId)
    setRoles(list)
  }

  useEffect(() => {
    loadEntitlements()
  }, [selectedOrgId])

  useEffect(() => {
    loadUsers()
  }, [selectedOrgId, search, productFilter, platformRoleFilter, statusFilter])

  useEffect(() => {
    loadRoles()
  }, [selectedOrgId, selectedRoleProduct])

  // Enabled products list for the current org
  const enabledProducts = useMemo(() => {
    return allProducts.filter((p) => orgEntitlements.includes(p.id))
  }, [allProducts, orgEntitlements])

  // Metrics for Banner
  const totalOrgUsers = useMemo(() => {
    return userService.getUsers({ organizationId: selectedOrgId })
  }, [selectedOrgId, users])

  const orgAdminCount = useMemo(() => {
    return users.filter((u) => u.platformRole === 'Organization Admin').length
  }, [users])

  // --- Handle Add User ---
  const handleOpenAddUser = () => {
    // Initial product roles set to 'No Access'
    const initialRoles: Record<string, string> = {}
    enabledProducts.forEach((p) => {
      initialRoles[p.id] = 'No Access'
    })

    setNewUserForm({
      name: '',
      email: '',
      mobile: '',
      platformRole: 'Member',
      productRoles: initialRoles,
      status: 'Active',
    })
    setAddUserError(null)
    setIsAddUserOpen(true)
  }

  const handleSaveNewUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserForm.name.trim() || !newUserForm.email.trim()) {
      setAddUserError('Please provide both user full name and a valid email address.')
      return
    }

    try {
      await userService.createUser({
        name: newUserForm.name,
        email: newUserForm.email,
        mobile: newUserForm.mobile,
        organizationId: selectedOrgId,
        platformRole: newUserForm.platformRole,
        productRoles: newUserForm.productRoles,
        status: newUserForm.status,
      })
      setIsAddUserOpen(false)
      showToast(`User ${newUserForm.name} added successfully!`)
      loadUsers()
    } catch (err: any) {
      setAddUserError(err.message || 'Failed to create user.')
    }
  }

  // --- Handle Manage User Product Roles ---
  const handleOpenManageRoles = (user: UserRecord) => {
    setSelectedUserForRoles(user)
    setUserPlatformRoleDraft(user.platformRole)
    setUserRoleDraft({ ...(user.productRoles || {}) })
    setIsManageRolesOpen(true)
  }

  const handleSaveUserProductRoles = async () => {
    if (!selectedUserForRoles) return
    try {
      await userService.updateUserProductRoles(
        selectedUserForRoles.id,
        userRoleDraft,
        userPlatformRoleDraft
      )
      setIsManageRolesOpen(false)
      showToast(`Roles updated for ${selectedUserForRoles.name}`)
      loadUsers()
    } catch (err: any) {
      showToast(err.message || 'Failed to update roles', 'error')
    }
  }

  // --- Toggle User Status ---
  const handleToggleUserStatus = async (user: UserRecord) => {
    try {
      const updated = await userService.toggleUserStatus(user.id)
      showToast(`User ${user.name} is now ${updated.status}`)
      loadUsers()
    } catch (err: any) {
      showToast('Failed to toggle user status', 'error')
    }
  }

  // --- Delete User ---
  const handleDeleteUser = async (user: UserRecord) => {
    if (confirm(`Are you sure you want to remove user "${user.name}"? This action cannot be undone.`)) {
      try {
        await userService.deleteUser(user.id)
        showToast(`User ${user.name} removed`)
        loadUsers()
      } catch (err: any) {
        showToast('Failed to delete user', 'error')
      }
    }
  }

  // --- Handle Create / Edit Role ---
  const handleOpenCreateRole = () => {
    setEditingRole(null)
    setRoleForm({
      name: '',
      description: '',
      productId: enabledProducts[0]?.id || 'academics',
      permissionIds: [],
    })
    setRoleFormError(null)
    setIsRoleModalOpen(true)
  }

  const handleOpenEditRole = (role: ProductRole) => {
    setEditingRole(role)
    setRoleForm({
      name: role.name,
      description: role.description,
      productId: role.productId,
      permissionIds: [...role.permissionIds],
    })
    setRoleFormError(null)
    setIsRoleModalOpen(true)
  }

  const handleSaveRole = (e: React.FormEvent) => {
    e.preventDefault()
    if (!roleForm.name.trim()) {
      setRoleFormError('Role name is required.')
      return
    }

    try {
      if (editingRole) {
        // Updating existing role
        roleService.updateRole(editingRole.id, {
          name: editingRole.isSystem ? editingRole.name : roleForm.name,
          description: roleForm.description,
          permissionIds: roleForm.permissionIds,
        })
        showToast(`Role "${editingRole.name}" updated successfully!`)
      } else {
        // Creating new custom role
        roleService.createRole({
          name: roleForm.name,
          description: roleForm.description,
          productId: roleForm.productId,
          organizationId: selectedOrgId,
          permissionIds: roleForm.permissionIds,
        })
        showToast(`Custom role "${roleForm.name}" created!`)
      }
      setIsRoleModalOpen(false)
      loadRoles()
    } catch (err: any) {
      setRoleFormError(err.message || 'Failed to save role.')
    }
  }

  // --- Clone Role ---
  const handleOpenCloneRole = (role: ProductRole) => {
    setRoleToClone(role)
    setCloneRoleName(`${role.name} (Custom Copy)`)
    setIsCloneModalOpen(true)
  }

  const handleConfirmClone = () => {
    if (!roleToClone || !cloneRoleName.trim()) return
    try {
      roleService.cloneRole(roleToClone.id, cloneRoleName.trim(), selectedOrgId)
      setIsCloneModalOpen(false)
      showToast(`Cloned into "${cloneRoleName.trim()}"!`)
      loadRoles()
    } catch (err: any) {
      showToast(err.message || 'Failed to clone role', 'error')
    }
  }

  // --- Toggle Role Status ---
  const handleToggleRoleStatus = (role: ProductRole) => {
    try {
      const updated = roleService.toggleRoleStatus(role.id)
      showToast(`Role "${role.name}" is now ${updated.status}`)
      loadRoles()
    } catch (err: any) {
      showToast(err.message || 'Failed to update role status', 'error')
    }
  }

  // --- Permission Builder Helpers ---
  const availablePermissionsForSelectedProduct = useMemo(() => {
    return permissionService.getPermissions(roleForm.productId)
  }, [roleForm.productId])

  const groupedPermissions = useMemo(() => {
    return permissionService.getGroupedPermissions(roleForm.productId)
  }, [roleForm.productId])

  const togglePermission = (permId: string) => {
    setRoleForm((prev) => {
      const exists = prev.permissionIds.includes(permId)
      return {
        ...prev,
        permissionIds: exists
          ? prev.permissionIds.filter((id) => id !== permId)
          : [...prev.permissionIds, permId],
      }
    })
  }

  const toggleSelectAllInGroup = (groupPerms: Permission[]) => {
    const groupIds = groupPerms.map((p) => p.id)
    const allSelected = groupIds.every((id) => roleForm.permissionIds.includes(id))

    setRoleForm((prev) => {
      if (allSelected) {
        return {
          ...prev,
          permissionIds: prev.permissionIds.filter((id) => !groupIds.includes(id)),
        }
      } else {
        const set = new Set([...prev.permissionIds, ...groupIds])
        return {
          ...prev,
          permissionIds: Array.from(set),
        }
      }
    })
  }

  // --- Product Entitlement Toggle Handler ---
  const handleToggleOrgProduct = (productId: string) => {
    const isCurrentlyActive = orgEntitlements.includes(productId)

    // Dependency check: LMS requires Academics
    if (productId === 'academics' && isCurrentlyActive && orgEntitlements.includes('lms')) {
      alert('Dependency Warning: "MyCampace LMS" requires "Academics" to remain active for course schedules and student rosters.')
      return
    }

    const next = isCurrentlyActive
      ? orgEntitlements.filter((id) => id !== productId)
      : [...orgEntitlements, productId]

    setOrgEntitlements(next)
    showToast(`Updated product activation for ${currentOrg.name}`)
  }

  // Filtered roles list
  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      if (roleTypeFilter === 'system' && !r.isSystem) return false
      if (roleTypeFilter === 'custom' && r.isSystem) return false
      return true
    })
  }, [roles, roleTypeFilter])

  return (
    <div className="space-y-6 animate-in fade-in-0 duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-xs font-semibold text-white animate-in slide-in-from-bottom-2 ${
            toastMessage.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Global User Management & Product RBAC
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Manage user identities, global platform authority, and extensible product-specific roles across your entire tenant.
          </p>
        </div>

        {/* Top Right Header Actions */}
        <div className="flex items-center gap-3">
          {/* Subtle organization switcher */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-2xs">
            <Building2 className="h-3.5 w-3.5 text-slate-400" />
            <select
              aria-label="Active Organization"
              value={selectedOrgId}
              onChange={(e) => setSelectedOrgId(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              {MOCK_ORGANIZATIONS.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} ({org.code})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleOpenAddUser}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-xs hover:shadow transition-all shrink-0 cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Tenant Metrics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">TOTAL USERS</p>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{users.length}</p>
          <p className="text-xs text-slate-400 mt-1">Assigned to {currentOrg.code}</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">ACTIVE PRODUCTS</p>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">{orgEntitlements.length}</p>
          <p className="text-xs text-slate-400 mt-1">Enabled for this tenant</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CONFIGURED ROLES</p>
          <p className="text-3xl font-extrabold text-purple-600 mt-2">{roles.length}</p>
          <p className="text-xs text-slate-400 mt-1">System templates & custom</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">PLATFORM ADMINS</p>
          <p className="text-3xl font-extrabold text-amber-600 mt-2">{orgAdminCount}</p>
          <p className="text-xs text-slate-400 mt-1">Full governance authority</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-slate-200">
        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 transition-all -mb-px cursor-pointer ${
            activeTab === 'users'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users2 className="h-4 w-4" />
          <span>Global Users Directory</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('roles')}
          className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 transition-all -mb-px cursor-pointer ${
            activeTab === 'roles'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="h-4 w-4" />
          <span>Product Roles & Permission Matrix</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: USERS DIRECTORY */}
      {/* ========================================================================= */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
            {/* Search Input */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email, role or phone..."
                className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Dropdowns & Toolbar Actions */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
              {/* Product Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Product:</span>
                <select
                  aria-label="Filter by Product"
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">All Products</option>
                  {enabledProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Platform Role Filter */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-500 font-medium">Role:</span>
                <select
                  aria-label="Filter by Platform Role"
                  value={platformRoleFilter}
                  onChange={(e) => setPlatformRoleFilter(e.target.value)}
                  className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  <option value="all">Role</option>
                  <option value="Organization Admin">Organization Admin</option>
                  <option value="Member">Member</option>
                  <option value="Campus Admin">Campus Admin</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                aria-label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Manage Roles Button (matches blue button on right of toolbar) */}
              <button
                type="button"
                onClick={() => setIsManageProductsOpen(true)}
                className="h-10 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <span>Manage Roles</span>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">USER IDENTITY</th>
                    <th className="py-3.5 px-4">PLATFORM AUTHORITY</th>
                    <th className="py-3.5 px-4">PRODUCT ROLES</th>
                    <th className="py-3.5 px-4">STATUS</th>
                    <th className="py-3.5 px-4 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400">
                        <Users2 className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p className="text-sm font-semibold text-slate-600">No users found</p>
                        <p className="text-xs text-slate-400 mt-1">
                          No user records match your search or filters for {currentOrg.name}.
                        </p>
                        <button
                          type="button"
                          onClick={handleOpenAddUser}
                          className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add New User</span>
                        </button>
                      </td>
                    </tr>
                  ) : (
                    users.map((u) => {
                      const assignedProducts = Object.entries(u.productRoles || {}).filter(
                        ([_, role]) => role && role !== 'No Access'
                      )
                      const isExpanded = expandedUserRoles[u.id]
                      const displayedProducts = isExpanded ? assignedProducts : assignedProducts.slice(0, 2)
                      const hiddenCount = assignedProducts.length - 2

                      return (
                        <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                          {/* USER IDENTITY */}
                          <td className="py-4 px-4 sm:px-6">
                            <div className="flex items-center gap-3.5">
                              <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm shrink-0">
                                {u.name ? u.name.charAt(0).toUpperCase() : 'U'}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 text-sm leading-snug">{u.name}</p>
                                <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-400 mt-0.5">
                                  <span className="inline-flex items-center gap-1 font-mono">
                                    <Mail className="h-3 w-3 text-slate-400 shrink-0" />
                                    <span>{u.email}</span>
                                  </span>
                                  {u.mobile && (
                                    <span className="inline-flex items-center gap-1 text-slate-400">
                                      <Phone className="h-3 w-3 text-slate-400 shrink-0" />
                                      <span>{u.mobile}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* PLATFORM AUTHORITY */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                              <Shield className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                              <span>{u.platformRole || 'Member'}</span>
                            </span>
                          </td>

                          {/* PRODUCT ROLES */}
                          <td className="py-4 px-4">
                            {assignedProducts.length === 0 ? (
                              <span className="text-xs text-slate-400 italic">No Product Access</span>
                            ) : (
                              <div className="flex flex-wrap items-center gap-1.5 max-w-lg">
                                {displayedProducts.map(([prodId, roleName]) => (
                                  <div
                                    key={prodId}
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs"
                                  >
                                    <span className="font-bold uppercase text-slate-500 text-[10px]">
                                      {prodId}:
                                    </span>
                                    <span className="font-semibold text-slate-800 text-[11px]">
                                      {String(roleName)}
                                    </span>
                                  </div>
                                ))}

                                {hiddenCount > 0 && !isExpanded && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandUserRoles(u.id)}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[11px] font-bold text-slate-600 transition-colors cursor-pointer"
                                  >
                                    +{hiddenCount} more
                                  </button>
                                )}

                                {isExpanded && assignedProducts.length > 2 && (
                                  <button
                                    type="button"
                                    onClick={() => toggleExpandUserRoles(u.id)}
                                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 border border-slate-200 text-[10px] font-bold text-slate-500 transition-colors cursor-pointer"
                                  >
                                    Show less
                                  </button>
                                )}
                              </div>
                            )}
                          </td>

                          {/* STATUS */}
                          <td className="py-4 px-4 whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => handleToggleUserStatus(u)}
                              title="Click to toggle status"
                              className={`px-3 py-0.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                                u.status === 'Active'
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
                              }`}
                            >
                              {u.status}
                            </button>
                          </td>

                          {/* ACTIONS */}
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenManageRoles(u)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs transition-all shadow-2xs cursor-pointer"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                <span>Manage Roles</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteUser(u)}
                                title="Remove User"
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-colors cursor-pointer"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: ROLES & PERMISSIONS MATRIX */}
      {/* ========================================================================= */}
      {activeTab === 'roles' && (
        <div className="space-y-5">
          {/* Roles Header & Creation Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Product Role Templates & Custom Roles
              </h2>
              <p className="text-xs text-slate-500">
                System templates are global baselines. Create or clone custom roles to define granular action sets per product for {currentOrg.name}.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Product Filter */}
              <select
                aria-label="Filter roles by Product"
                value={selectedRoleProduct}
                onChange={(e) => setSelectedRoleProduct(e.target.value)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Products</option>
                {allProducts.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              {/* Role Type Filter */}
              <select
                aria-label="Filter roles by Type"
                value={roleTypeFilter}
                onChange={(e) => setRoleTypeFilter(e.target.value as any)}
                className="h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="system">System Templates</option>
                <option value="custom">Custom Org Roles</option>
              </select>

              {/* + Create Custom Role */}
              <button
                type="button"
                onClick={handleOpenCreateRole}
                className="h-9 px-3.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>+ Create Custom Role</span>
              </button>
            </div>
          </div>

          {/* Roles Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Role Name & Type</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Description</th>
                    <th className="py-3 px-4">Permissions</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredRoles.map((role) => {
                    const isCustom = !role.isSystem
                    return (
                      <tr key={role.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* Role Name */}
                        <td className="py-3.5 px-4 sm:px-6">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{role.name}</span>
                            {role.isSystem ? (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                                System
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                                Custom Org
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Product */}
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase border border-slate-200">
                            {role.productId}
                          </span>
                        </td>

                        {/* Description */}
                        <td className="py-3.5 px-4 max-w-xs text-slate-500 text-[11px] leading-relaxed">
                          {role.description}
                        </td>

                        {/* Permissions Count */}
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="h-3 w-3" />
                            {role.permissionIds.length} permissions
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <button
                            type="button"
                            onClick={() => handleToggleRoleStatus(role)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition-all ${
                              role.status === 'Active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {role.status}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* View / Edit Permissions Matrix */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditRole(role)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs shadow-2xs transition-all"
                            >
                              <Sliders className="h-3 w-3" />
                              <span>{isCustom ? 'Edit Matrix' : 'View Permissions'}</span>
                            </button>

                            {/* Clone Role Button */}
                            <button
                              type="button"
                              onClick={() => handleOpenCloneRole(role)}
                              title="Clone as Custom Role"
                              className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg border border-slate-200 hover:border-purple-400 bg-white hover:bg-purple-50 text-slate-700 hover:text-purple-700 font-semibold text-xs shadow-2xs transition-all"
                            >
                              <Copy className="h-3 w-3" />
                              <span>Clone</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: + ADD USER */}
      {/* ========================================================================= */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <UserPlus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Add New User Identity
                  </h3>
                  <p className="text-xs text-slate-500">
                    Assign to {currentOrg.name} ({currentOrg.code})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddUserOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveNewUser} className="space-y-4 pt-4 overflow-y-auto pr-1 flex-1">
              {addUserError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{addUserError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Rajesh Kumar"
                  value={newUserForm.name}
                  onChange={(e) => setNewUserForm({ ...newUserForm, name: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Email & Mobile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@institution.edu"
                    value={newUserForm.email}
                    onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98480 00000"
                    value={newUserForm.mobile}
                    onChange={(e) => setNewUserForm({ ...newUserForm, mobile: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Platform Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Platform Authority Role
                </label>
                <select
                  value={newUserForm.platformRole}
                  onChange={(e) =>
                    setNewUserForm({
                      ...newUserForm,
                      platformRole: e.target.value as UserRecord['platformRole'],
                    })
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Member">Member (Product-Specific Permissions Only)</option>
                  <option value="Organization Admin">Organization Admin (Full Tenant Control)</option>
                  <option value="Campus Admin">Campus Admin (Branch / Campus Authority)</option>
                </select>
              </div>

              {/* Product Role Assignments */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Product-Specific RBAC Role Assignments
                  </label>
                  <span className="text-[10px] text-slate-400">
                    {enabledProducts.length} Products Active in Org
                  </span>
                </div>

                <div className="space-y-2 border border-slate-200 rounded-xl p-3 bg-slate-50/50 max-h-52 overflow-y-auto">
                  {enabledProducts.map((prod) => {
                    const availableRoles = roleService.getRolesByProduct(prod.id, selectedOrgId)
                    return (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200/80"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800">{prod.name}</span>
                          <span className="text-[10px] text-slate-400">({prod.categoryName})</span>
                        </div>

                        <select
                          value={newUserForm.productRoles[prod.id] || 'No Access'}
                          onChange={(e) =>
                            setNewUserForm({
                              ...newUserForm,
                              productRoles: {
                                ...newUserForm.productRoles,
                                [prod.id]: e.target.value,
                              },
                            })
                          }
                          className="h-8 px-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[180px]"
                        >
                          <option value="No Access">No Access</option>
                          {availableRoles
                            .filter((r) => r.status === 'Active')
                            .map((r) => (
                              <option key={r.id} value={r.name}>
                                {r.name} {r.isSystem ? '' : '(Custom)'}
                              </option>
                            ))}
                        </select>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="h-4 w-4" />
                  <span>Create User</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MANAGE USER PRODUCT ROLES */}
      {/* ========================================================================= */}
      {isManageRolesOpen && selectedUserForRoles && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  {selectedUserForRoles.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Configure Product Roles for {selectedUserForRoles.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">{selectedUserForRoles.email}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManageRolesOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4 overflow-y-auto pr-1 flex-1">
              {/* Platform Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Platform Authority Role
                </label>
                <select
                  value={userPlatformRoleDraft}
                  onChange={(e) =>
                    setUserPlatformRoleDraft(e.target.value as UserRecord['platformRole'])
                  }
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Organization Admin">Organization Admin (Full Tenant Control)</option>
                  <option value="Member">Member (Product-Specific Access Only)</option>
                  <option value="Campus Admin">Campus Admin (Branch / Campus Authority)</option>
                </select>
              </div>

              {/* Dynamic Product Roles */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Active Product Role Entitlements
                  </label>
                  <span className="text-[10px] text-slate-400">
                    Showing products enabled for {currentOrg.code}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {enabledProducts.map((prod) => {
                    const currentVal = userRoleDraft[prod.id] || 'No Access'
                    const availableRoles = roleService.getRolesByProduct(prod.id, selectedOrgId)

                    // Find matched role description
                    const matchedRole = availableRoles.find((r) => r.name === currentVal)

                    return (
                      <div
                        key={prod.id}
                        className="p-3 rounded-xl border border-slate-200 bg-slate-50/70"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-slate-800">{prod.name}</span>
                            <span className="text-[10px] text-slate-400">({prod.categoryName})</span>
                          </div>

                          <select
                            value={currentVal}
                            onChange={(e) =>
                              setUserRoleDraft({
                                ...userRoleDraft,
                                [prod.id]: e.target.value,
                              })
                            }
                            className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px]"
                          >
                            <option value="No Access">No Access</option>
                            {availableRoles
                              .filter((r) => r.status === 'Active')
                              .map((r) => (
                                <option key={r.id} value={r.name}>
                                  {r.name} {r.isSystem ? '' : '(Custom)'}
                                </option>
                              ))}
                          </select>
                        </div>

                        {matchedRole && (
                          <p className="mt-1.5 text-[11px] text-slate-500 leading-normal border-t border-slate-200/60 pt-1.5">
                            {matchedRole.description}
                          </p>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsManageRolesOpen(false)}
                className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveUserProductRoles}
                className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Check className="h-4 w-4" />
                <span>Save Role Assignments</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: PERMISSION BUILDER / ROLE CREATOR */}
      {/* ========================================================================= */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 max-h-[92vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Sliders className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {editingRole
                      ? editingRole.isSystem
                        ? `System Role Permissions: ${editingRole.name}`
                        : `Edit Custom Role: ${editingRole.name}`
                      : 'Create Custom Product Role'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Define granular resource actions and security boundaries.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4 pt-4 overflow-y-auto pr-1 flex-1">
              {roleFormError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{roleFormError}</span>
                </div>
              )}

              {/* Role Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Role Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={editingRole?.isSystem}
                    placeholder="e.g. Senior Course Coordinator"
                    value={roleForm.name}
                    onChange={(e) => setRoleForm({ ...roleForm, name: e.target.value })}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  {editingRole?.isSystem && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      System template titles cannot be edited. Clone to create a custom variant.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Product <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={Boolean(editingRole)}
                    value={roleForm.productId}
                    onChange={(e) =>
                      setRoleForm({
                        ...roleForm,
                        productId: e.target.value,
                        permissionIds: [], // reset selections
                      })
                    }
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 disabled:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                  >
                    {allProducts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.fullName})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description & Governance Scope
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain the administrative scope of this role..."
                  value={roleForm.description}
                  onChange={(e) => setRoleForm({ ...roleForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Permission Matrix Builder */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Permission Matrix ({roleForm.permissionIds.length} Granted)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    Product: <strong className="uppercase">{roleForm.productId}</strong>
                  </span>
                </div>

                <div className="space-y-3 border border-slate-200 rounded-xl p-3 bg-slate-50/60 max-h-72 overflow-y-auto">
                  {Object.entries(groupedPermissions).map(([groupTitle, perms]) => {
                    const allInGroupSelected = perms.every((p) =>
                      roleForm.permissionIds.includes(p.id)
                    )

                    return (
                      <div
                        key={groupTitle}
                        className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                      >
                        <div className="flex items-center justify-between px-3 py-2 bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-700">
                          <span>{groupTitle}</span>
                          <button
                            type="button"
                            onClick={() => toggleSelectAllInGroup(perms)}
                            className="text-[10px] text-purple-600 hover:text-purple-800 font-bold"
                          >
                            {allInGroupSelected ? 'Deselect All' : 'Select All'}
                          </button>
                        </div>

                        <div className="p-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {perms.map((p) => {
                            const isChecked = roleForm.permissionIds.includes(p.id)
                            return (
                              <label
                                key={p.id}
                                className={`flex items-start gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                                  isChecked
                                    ? 'bg-purple-50/60 border-purple-200 text-purple-900'
                                    : 'bg-white border-slate-200/80 hover:bg-slate-50 text-slate-700'
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => togglePermission(p.id)}
                                  className="mt-0.5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                                />
                                <div className="flex-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-slate-900">{p.name}</span>
                                    {p.isSensitive && (
                                      <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                        <ShieldAlert className="h-2.5 w-2.5" />
                                        Sensitive
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                                    {p.description}
                                  </p>
                                </div>
                              </label>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-10 px-5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                >
                  <Check className="h-4 w-4" />
                  <span>{editingRole ? 'Update Role' : 'Create Custom Role'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CLONE ROLE */}
      {/* ========================================================================= */}
      {isCloneModalOpen && roleToClone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                Clone Role: {roleToClone.name}
              </h3>
              <button
                type="button"
                onClick={() => setIsCloneModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-3">
              <p className="text-xs text-slate-500">
                This will create a new custom role for <strong>{currentOrg.name}</strong> pre-populated with all {roleToClone.permissionIds.length} permissions of the original role.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Custom Role Name
                </label>
                <input
                  type="text"
                  value={cloneRoleName}
                  onChange={(e) => setCloneRoleName(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsCloneModalOpen(false)}
                className="h-9 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmClone}
                className="h-9 px-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>Confirm Clone</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: MANAGE ORG PRODUCTS (ENTITLEMENTS) */}
      {/* ========================================================================= */}
      {isManageProductsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-7 animate-in zoom-in-95 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Product Entitlements & Activation
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enable or disable platform products for {currentOrg.name} ({currentOrg.code})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManageProductsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 overflow-y-auto pr-1 flex-1">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <span>
                  Disabling a product hides its role configurations and prevents non-admin staff from accessing that product's features.
                </span>
              </div>

              <div className="space-y-2">
                {allProducts.map((prod) => {
                  const isEnabled = orgEntitlements.includes(prod.id)
                  const userCount = userService.countUsersWithProductRole(prod.id, undefined, selectedOrgId)

                  return (
                    <div
                      key={prod.id}
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isEnabled
                          ? 'bg-white border-blue-200 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 opacity-75'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{prod.name}</span>
                          <span className="text-[10px] text-slate-400">({prod.categoryName})</span>
                          {isEnabled && (
                            <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{prod.tagline}</p>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                          <span>{userCount} users currently assigned</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleOrgProduct(prod.id)}
                        className={`h-8 px-3 rounded-lg text-xs font-bold transition-all ${
                          isEnabled
                            ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isEnabled ? 'Disable' : 'Enable Product'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsManageProductsOpen(false)}
                className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
