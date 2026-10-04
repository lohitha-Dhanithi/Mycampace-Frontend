// src/modules/users/UsersListPage.jsx
import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UserPlus, Eye, Edit, Shield, ShieldOff, Power, KeyRound,
  Users, UserCheck, UserX, Clock, Search, Filter, ChevronDown,
  CheckSquare, XSquare, Mail,
} from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { LoadingState } from '@/components/common/LoadingState'
import { EmptyState } from '@/components/common/EmptyState'
import { UserAvatar } from './components/UserAvatar'
import { UserStatusBadge } from './components/UserStatusBadge'
import { UserStatusDialog } from './components/UserStatusDialog'
import { userService } from './services/userService'
import { USER_ROLE_OPTIONS, USER_STATUS_OPTIONS, CAMPUS_OPTIONS } from './data/userMockData'

function KpiCard({ icon: Icon, label, value, color = 'blue', sub }) {
  const colors = {
    blue: 'text-blue-600 bg-blue-50',
    emerald: 'text-emerald-600 bg-emerald-50',
    slate: 'text-slate-500 bg-slate-100',
    amber: 'text-amber-600 bg-amber-50',
    red: 'text-red-600 bg-red-50',
  }
  return (
    <Card className="border-slate-200">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xl font-bold text-slate-900 leading-none">{value}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
          {sub && <p className="text-[10px] text-slate-400">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  )
}

export function UsersListPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0, invited: 0, suspended: 0 })
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [campusFilter, setCampusFilter] = useState('all')
  const [selected, setSelected] = useState([])
  const [statusDialog, setStatusDialog] = useState({ open: false, action: 'suspend', user: null })
  const [toast, setToast] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const loadData = useCallback(async () => {
    setLoading(true)
    const [data, s] = await Promise.all([
      userService.getUsers({ role: roleFilter, status: statusFilter, campus: campusFilter, search }),
      userService.getUserStats(),
    ])
    setUsers(data)
    setStats(s)
    setSelected([])
    setLoading(false)
  }, [roleFilter, statusFilter, campusFilter, search])

  useEffect(() => {
    const t = setTimeout(loadData, search ? 300 : 0)
    return () => clearTimeout(t)
  }, [loadData])

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])
  }

  const selectAll = () => setSelected(users.map((u) => u.id))
  const clearAll = () => setSelected([])

  const handleBulkStatus = async (status) => {
    await Promise.all(selected.map((id) => userService.updateUserStatus(id, status)))
    showToast(`${selected.length} user(s) ${status.toLowerCase()}.`)
    loadData()
  }

  const handleStatusChange = async (newStatus) => {
    if (statusDialog.user) {
      await userService.updateUserStatus(statusDialog.user.id, newStatus)
      showToast(`${statusDialog.user.name} has been ${newStatus.toLowerCase()}.`)
      loadData()
    }
  }

  const openStatusDialog = (user, action) => {
    setStatusDialog({ open: true, action, user })
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage users, access, roles and account status across the institution."
        actions={
          <Button size="sm" onClick={() => navigate('/users/new')} className="text-xs">
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            Add User
          </Button>
        }
      />

      {/* Toast */}
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-emerald-600 shrink-0" />
          {toast}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard icon={Users} label="Total Users" value={stats.total} color="blue" />
        <KpiCard icon={UserCheck} label="Active Users" value={stats.active} color="emerald" />
        <KpiCard icon={UserX} label="Inactive" value={stats.inactive} color="slate" />
        <KpiCard icon={Clock} label="Pending Invites" value={stats.invited} color="amber" />
      </div>

      {/* Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-3 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, mobile or role..."
              className="h-9 pl-8 text-xs"
            />
          </div>
          <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="h-9 text-xs w-40">
            <option value="all">All Roles</option>
            {USER_ROLE_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </Select>
          <Select value={campusFilter} onChange={(e) => setCampusFilter(e.target.value)} className="h-9 text-xs w-44">
            <option value="all">All Campuses</option>
            {CAMPUS_OPTIONS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </Select>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="h-9 text-xs w-36">
            <option value="all">All Status</option>
            {USER_STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        </CardContent>
      </Card>

      {/* Bulk actions */}
      {selected.length > 0 && (
        <div className="flex items-center gap-2 p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
          <span className="font-semibold">{selected.length} selected</span>
          <span className="text-blue-300">|</span>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-emerald-700 hover:bg-emerald-50 px-2" onClick={() => handleBulkStatus('Active')}>
            <UserCheck className="h-3.5 w-3.5 mr-1" /> Activate
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-amber-700 hover:bg-amber-50 px-2" onClick={() => handleBulkStatus('Inactive')}>
            <UserX className="h-3.5 w-3.5 mr-1" /> Deactivate
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-slate-600 hover:bg-slate-100 px-2 ml-auto" onClick={clearAll}>
            <XSquare className="h-3.5 w-3.5 mr-1" /> Clear
          </Button>
        </div>
      )}

      {/* Table */}
      <Card className="border-slate-200">
        {loading ? (
          <CardContent className="p-8"><LoadingState /></CardContent>
        ) : users.length === 0 ? (
          <CardContent className="p-12">
            <EmptyState
              title="No users found"
              description="No users match your current filters. Try adjusting search criteria or add a new user."
              action={
                <Button size="sm" onClick={() => navigate('/users/new')}>
                  <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Add User
                </Button>
              }
            />
          </CardContent>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">
                    <Checkbox
                      checked={selected.length === users.length && users.length > 0}
                      onChange={selected.length === users.length ? clearAll : selectAll}
                    />
                  </th>
                  <th className="px-4 py-3 font-semibold text-slate-600 uppercase text-[11px] tracking-wider">User</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 uppercase text-[11px] tracking-wider">Mobile</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 uppercase text-[11px] tracking-wider">Role</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 uppercase text-[11px] tracking-wider hidden md:table-cell">Campus</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 uppercase text-[11px] tracking-wider">Status</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 uppercase text-[11px] tracking-wider hidden lg:table-cell">Last Login</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 uppercase text-[11px] tracking-wider hidden lg:table-cell">Created</th>
                  <th className="px-4 py-3 font-semibold text-slate-600 uppercase text-[11px] tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => (
                  <tr key={user.id} className={`hover:bg-slate-50/60 transition-colors ${selected.includes(user.id) ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selected.includes(user.id)}
                        onChange={() => toggleSelect(user.id)}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <UserAvatar name={user.name} size="sm" />
                        <div>
                          <button
                            onClick={() => navigate(`/users/${user.id}`)}
                            className="font-semibold text-slate-900 hover:text-blue-600 transition-colors text-left"
                          >
                            {user.name}
                          </button>
                          <p className="text-[11px] text-slate-400 font-mono">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-slate-600">{user.mobile}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700">
                        <Shield className="h-3 w-3 text-blue-500 shrink-0" />
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-slate-600 text-[11px]">{user.campus}</span>
                    </td>
                    <td className="px-4 py-3">
                      <UserStatusBadge status={user.status} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-slate-500 text-[11px]">{user.lastLogin}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-slate-500 text-[11px]">{user.createdAt}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          title="View Profile"
                          onClick={() => navigate(`/users/${user.id}`)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          title="Edit User"
                          onClick={() => navigate(`/users/${user.id}/edit`)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          title="Manage Access"
                          onClick={() => navigate(`/users/${user.id}/access`)}
                          className="p-1.5 rounded-md text-slate-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
                        >
                          <Shield className="h-3.5 w-3.5" />
                        </button>
                        {user.status === 'Active' || user.status === 'Invited' ? (
                          <button
                            title="Suspend Account"
                            onClick={() => openStatusDialog(user, 'suspend')}
                            className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <ShieldOff className="h-3.5 w-3.5" />
                          </button>
                        ) : (
                          <button
                            title="Activate Account"
                            onClick={() => openStatusDialog(user, 'activate')}
                            className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                          >
                            <Power className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Status Dialog */}
      <UserStatusDialog
        open={statusDialog.open}
        onOpenChange={(o) => setStatusDialog((p) => ({ ...p, open: o }))}
        action={statusDialog.action}
        userName={statusDialog.user?.name}
        onConfirm={handleStatusChange}
      />
    </div>
  )
}
