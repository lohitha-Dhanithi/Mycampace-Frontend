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
  onAssignFaculty?: (sub: any) => void
  onAssignToClass?: (sub: any) => void
}

export function SubjectAcademicTable({
  subjects = [],
  loading = false,
  onAssignFaculty,
  onAssignToClass,
}: SubjectAcademicTableProps) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Subject',
      accessor: 'name',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-700 border border-amber-200">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate(`/academics/subjects/${r.id}`)}
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
      cell: (r) => <span className="text-xs text-slate-700 font-medium">{r.department}</span>,
    },
    {
      header: 'Subject Type',
      accessor: 'type',
      sortable: true,
      cell: (r) => <span className="text-xs text-slate-600">{r.type}</span>,
    },
    {
      header: 'Credits',
      accessor: 'credits',
      sortable: true,
      cell: (r) => <span className="text-xs font-mono font-bold text-slate-700">{r.credits} Credits</span>,
    },
    {
      header: 'Active Classes',
      accessor: 'classes',
      cell: () => <span className="text-xs font-semibold text-slate-700">Class 11, 12</span>,
    },
    {
      header: 'Assigned Faculty',
      accessor: 'faculty',
      cell: (r) => (
        <span className="text-xs text-slate-800 font-medium">
          {r.id === 'sub-phy' ? 'Pooja Iyer, Dr. Suresh' : r.id === 'sub-math' ? 'Arvind Swamy' : 'Kavita Chawla'}
        </span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/academics/subjects/${r.id}`)}
            className="h-7 text-xs px-2"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/academics/faculty-assignments')}
            className="h-7 text-xs px-2 text-blue-600"
            title="Assign Faculty to this Subject"
          >
            <UserPlus className="w-3.5 h-3.5 mr-1" /> Assign Faculty
          </Button>
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
