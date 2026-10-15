// src/modules/academics/components/SubjectAcademicTable.jsx
import React from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, Bookmark, UserPlus, Layers } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface SubjectAcademicTableProps {
  subjects?: any[]
  loading?: boolean
  onEdit?: (sub: any) => void
  onToggleStatus?: (sub: any) => void
  onAssignFaculty?: (sub: any) => void
  onAssignToClass?: (sub: any) => void
}

export function SubjectAcademicTable({
  subjects = [],
  loading = false,
  onEdit,
  onToggleStatus,
  onAssignFaculty,
  onAssignToClass,
}: SubjectAcademicTableProps) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Subject',
      accessor: 'name',
      sortable: true,
      cell: (r: any) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate(`/app/academics/subjects/${r.id}`)}
              className="font-bold text-xs text-slate-900 hover:text-blue-600 text-left transition-colors"
            >
              {r.name}
            </button>
            <div className="text-[10px] text-slate-400 font-mono">{r.code}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      sortable: true,
      cell: (r: any) => <span className="text-xs text-slate-700 font-medium">{r.department}</span>,
    },
    {
      header: 'Subject Type',
      accessor: 'type',
      sortable: true,
      cell: (r: any) => <span className="text-xs text-slate-600">{r.type}</span>,
    },
    {
      header: 'Credits',
      accessor: 'credits',
      sortable: true,
      cell: (r: any) => <span className="text-xs font-mono font-bold text-slate-700">{r.credits} Credits</span>,
    },
    {
      header: 'Weekly Hours',
      accessor: 'weeklyHours',
      sortable: true,
      cell: (r: any) => <span className="text-xs text-slate-600">{r.weeklyHours || 4} hrs/wk</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (r: any) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (r: any) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/app/academics/subjects/${r.id}`)}
            className="h-7 text-xs px-2 text-slate-700"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View
          </Button>

          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(r)}
              className="h-7 text-xs px-2 text-slate-700 hover:bg-slate-50"
              title="Edit Subject Details"
            >
              Edit
            </Button>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/app/academics/faculty-assignments')}
            className="h-7 text-xs px-2 text-blue-600"
            title="Assign Faculty to this Subject"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" /> Assign Faculty
          </Button>

          {onToggleStatus && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(r)}
              className={`h-7 text-xs px-2 ${r.status === 'Active' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
              title={r.status === 'Active' ? 'Deactivate Subject' : 'Activate Subject'}
            >
              {r.status === 'Active' ? 'Deactivate' : 'Activate'}
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={subjects}
      loading={loading}
      searchPlaceholder="Search subjects by title, code, department..."
      emptyTitle="No subjects found"
      emptyDescription="Subjects are defined in Academic Configuration."
    />
  )
}
