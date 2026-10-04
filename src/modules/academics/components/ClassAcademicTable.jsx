// src/modules/academics/components/ClassAcademicTable.jsx
import React from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, Layers, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ClassAcademicTable({ classes = [], loading = false }) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Class / Grade',
      accessor: 'name',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate(`/academics/classes/${r.id}`)}
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
      header: 'Program Framework',
      accessor: 'program',
      sortable: true,
      cell: (r) => <span className="text-xs text-slate-700 font-medium">{r.program || 'Senior Secondary'}</span>,
    },
    {
      header: 'Sections',
      accessor: 'sectionsCount',
      cell: (r) => (
        <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          {r.sectionsCount || 4} Sections
        </span>
      ),
    },
    {
      header: 'Total Enrolled',
      accessor: 'totalStudents',
      cell: (r) => <span className="text-xs font-mono font-bold text-slate-800">{r.totalStudents} Students</span>,
    },
    {
      header: 'Campus',
      accessor: 'campus',
      cell: (r) => <span className="text-xs text-slate-600">{r.campus || 'Hyderabad Main Campus'}</span>,
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
            onClick={() => navigate(`/academics/classes/${r.id}`)}
            className="h-7 text-xs px-2"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View Operational
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={classes}
      loading={loading}
      searchPlaceholder="Search classes by name, grade code..."
      emptyTitle="No classes found"
      emptyDescription="Classes are configured under Academic Configuration."
    />
  )
}
