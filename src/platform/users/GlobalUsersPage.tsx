// src/platform/users/GlobalUsersPage.jsx
import React, { useState, useEffect } from 'react'
import {
  Users2,
  Shield,
  Search,
  Plus,
  Edit2,
  Check,
  X,
  Mail,
  Lock,
  ChevronDown,
  UserCheck,
  UserX,
  Layers,
} from 'lucide-react'
import { userService } from '@/services/userService'
import { productService } from '@/services/productService'

export function GlobalUsersPage() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [productFilter, setProductFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isEditingRbac, setIsEditingRbac] = useState(false)
  const [editPlatformRole, setEditPlatformRole] = useState('')
  const [editProductRoles, setEditProductRoles] = useState<Record<string, any>>({})

  const activeProducts = productService.getOrganizationProducts()

  const loadUsers = async () => {
    setLoading(true)
    const data = await userService.getUsers({ search, product: productFilter })
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => {
    loadUsers()
  }, [search, productFilter])

  const handleOpenRbacModal = (user) => {
    setSelectedUser(user)
    setEditPlatformRole(user.platformRole || 'Member')
    setEditProductRoles({ ...(user.productRoles || {}) })
    setIsEditingRbac(true)
  }

  const handleSaveRbac = async () => {
    if (!selectedUser) return
    await userService.updateUserProductRoles(selectedUser.id, editProductRoles, editPlatformRole)
    setIsEditingRbac(false)
    loadUsers()
  }

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Users2 className="h-4 w-4" />
            <span>Platform Identity & Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Global User Management & Product RBAC
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            A single identity across MyCampace with independent, product-specific roles and permissions.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or role..."
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-semibold whitespace-nowrap">Filter by Product:</span>
          <select
            value={productFilter}
            onChange={(e) => setProductFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Products</option>
            {activeProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">User Identity</th>
                <th className="py-3.5 px-4">Platform Role</th>
                <th className="py-3.5 px-4">Product-Specific Access</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-4 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                        {u.name ? u.name.charAt(0) : 'U'}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{u.name}</p>
                        <p className="text-[11px] text-slate-400 font-mono">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                        u.platformRole === 'Organization Admin'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <Shield className="h-3 w-3" />
                      {u.platformRole || 'Member'}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1.5 max-w-md">
                      {Object.entries(u.productRoles || {}).map(([prodId, roleName]) => {
                        if (roleName === 'No Access') return null
                        return (
                          <div
                            key={prodId}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px]"
                          >
                            <span className="font-bold uppercase text-slate-500">{prodId}:</span>
                            <span className="font-medium text-slate-800">{String(roleName)}</span>
                          </div>
                        )
                      })}
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {u.status}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleOpenRbacModal(u)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-blue-500 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold text-xs transition-all"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Manage Product Roles</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RBAC Modal */}
      {isEditingRbac && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Configure Roles for {selectedUser.name}
                </h3>
                <p className="text-xs text-slate-500">{selectedUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingRbac(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Platform Role */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Platform Role
                </label>
                <select
                  value={editPlatformRole}
                  onChange={(e) => setEditPlatformRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Organization Admin">Organization Admin (Full Platform Control)</option>
                  <option value="Member">Member (Product-Specific Access Only)</option>
                </select>
              </div>

              {/* Product-Specific Roles */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Product-Specific Roles & Entitlement
                </label>
                <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                  {activeProducts.map((prod) => {
                    const currentRole = editProductRoles[prod.id] || 'No Access'
                    return (
                      <div
                        key={prod.id}
                        className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50/60"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-800">{prod.name}</span>
                          <span className="text-[10px] text-slate-400">({prod.categoryName})</span>
                        </div>

                        <select
                          value={currentRole}
                          onChange={(e) =>
                            setEditProductRoles({
                              ...editProductRoles,
                              [prod.id]: e.target.value,
                            })
                          }
                          className="h-8 px-2.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="No Access">No Access</option>
                          <option value="Administrator">Administrator</option>
                          <option value="Teacher">Teacher / Faculty</option>
                          <option value="Instructor">Instructor / Trainer</option>
                          <option value="Finance Controller">Finance Controller</option>
                          <option value="Admissions Officer">Admissions Officer</option>
                          <option value="Viewer">Viewer (Read Only)</option>
                        </select>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setIsEditingRbac(false)}
                className="h-10 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRbac}
                className="h-10 px-5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
              >
                <Check className="h-4 w-4" />
                <span>Save Product Roles</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
