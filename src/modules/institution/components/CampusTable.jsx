// src/modules/institution/components/CampusTable.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building, Eye, Edit, Power, MapPin, Mail, Phone, Calendar } from 'lucide-react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'

export function CampusTable({
  campuses = [],
  loading = false,
  onStatusToggle,
  onDelete,
}) {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredData = campuses.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false
    if (typeFilter !== 'all' && c.type !== typeFilter) return false
    return true
  })

  const columns = [
    {
      header: 'Campus Name',
      accessor: 'name',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 shrink-0">
            <Building className="h-4 w-4" />
          </div>
          <div>
            <button
              onClick={() => navigate(`/institution/campuses/${r.id}`)}
              className="font-semibold text-slate-900 hover:text-blue-600 block text-left transition-colors"
            >
              {r.name}
            </button>
            <span className="text-[11px] text-slate-400 font-mono">ID: {r.id}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Campus Code',
      accessor: 'code',
      sortable: true,
      cell: (r) => <span className="font-mono text-xs font-semibold text-slate-800">{r.code}</span>,
    },
    {
      header: 'Campus Type',
      accessor: 'type',
      sortable: true,
      cell: (r) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
          {r.type}
        </span>
      ),
    },
    {
      header: 'City',
      accessor: 'city',
      sortable: true,
      cell: (r) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800 block">{r.city}</span>
          <span className="text-[11px] text-slate-400">{r.state}</span>
        </div>
      ),
    },
    {
      header: 'Principal / Head',
      accessor: 'headName',
      sortable: true,
      cell: (r) => (
        <div className="text-xs">
          <span className="font-medium text-slate-800 block">{r.head?.name || '—'}</span>
          <span className="text-[11px] text-slate-400 truncate block max-w-[140px]">
            {r.head?.email || ''}
          </span>
        </div>
      ),
    },
    {
      header: 'Contact',
      cell: (r) => (
        <div className="text-xs space-y-0.5">
          <span className="text-slate-800 font-mono block">{r.phone}</span>
          <span className="text-[11px] text-slate-400 truncate block max-w-[140px]">{r.email}</span>
        </div>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Created Date',
      accessor: 'createdDate',
      sortable: true,
      cell: (r) => <span className="text-[11px] text-slate-500 font-mono">{r.createdDate}</span>,
    },
    {
      header: 'Actions',
      cell: (r) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600"
            onClick={() => navigate(`/institution/campuses/${r.id}`)}
            title="View Details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-slate-500 hover:text-slate-900"
            onClick={() => navigate(`/institution/campuses/${r.id}/edit`)}
            title="Edit Campus"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={`h-8 w-8 p-0 ${
              r.status === 'Active'
                ? 'text-slate-400 hover:text-red-600'
                : 'text-slate-400 hover:text-emerald-600'
            }`}
            onClick={() => onStatusToggle && onStatusToggle(r)}
            title={r.status === 'Active' ? 'Deactivate Campus' : 'Activate Campus'}
          >
            <Power className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={filteredData}
      loading={loading}
      searchPlaceholder="Search campuses by name, code, city or head..."
      emptyTitle="No campuses found"
      emptyDescription="Add your first campus to start managing institutional operations."
      actions={
        <Button
          size="sm"
          className="text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => navigate('/institution/campuses/new')}
        >
          Add Campus
        </Button>
      }
      filterComponent={
        <div className="flex items-center gap-2">
          <Select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-9 text-xs w-36 bg-white"
          >
            <option value="all">All Types</option>
            <option value="Main Campus">Main Campus</option>
            <option value="Branch Campus">Branch Campus</option>
            <option value="School">School</option>
            <option value="College">College</option>
            <option value="University">University</option>
          </Select>

          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 text-xs w-28 bg-white"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </Select>
        </div>
      }
    />
  )
}
