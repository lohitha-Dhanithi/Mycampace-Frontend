// src/modules/academics/components/ProgramAcademicTable.jsx
import React from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, GraduationCap, ArrowRight, Layers } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ProgramAcademicTable({ programs = [], loading = false }) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Program Name',
      accessor: 'name',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate(`/academics/programs/${r.id}`)}
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
      cell: (r) => <span className="text-xs text-slate-700 font-medium">{r.department || 'Academics'}</span>,
    },
    {
      header: 'Education Level',
      accessor: 'level',
      sortable: true,
      cell: (r) => <span className="text-xs text-slate-600">{r.level}</span>,
    },
    {
      header: 'Duration',
      accessor: 'duration',
      sortable: true,
      cell: (r) => <span className="text-xs text-slate-600 font-medium">{r.duration}</span>,
    },
    {
      header: 'Active Courses',
      accessor: 'coursesCount',
      cell: (r) => (
        <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {r.coursesCount ?? 3} Courses
        </span>
      ),
    },
    {
      header: 'Total Students',
      accessor: 'studentCount',
      cell: (r) => <span className="text-xs font-mono font-bold text-slate-800">{r.studentCount ?? 665}</span>,
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
            onClick={() => navigate(`/academics/programs/${r.id}`)}
            className="h-7 text-xs px-2 text-slate-700"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View Operational
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/academics/overview')}
            className="h-7 text-xs px-2 text-blue-600 hover:bg-blue-50"
            title="Open Academic Hierarchy"
          >
            <Layers className="w-3.5 h-3.5" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={programs}
      loading={loading}
      searchPlaceholder="Search programs by name, code, education level..."
      emptyTitle="No academic programs found"
      emptyDescription="Programs are configured in Academic Configuration. Operational instances appear here."
    />
  )
}
