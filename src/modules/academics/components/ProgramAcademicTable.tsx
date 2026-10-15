import React from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, GraduationCap, Layers, Edit, Power } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ProgramAcademicTable({
  programs = [],
  loading = false,
  onEdit,
  onToggleStatus,
}: {
  programs?: any[]
  loading?: boolean
  onEdit?: (program: any) => void
  onToggleStatus?: (program: any) => void
}) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Program Name',
      accessor: 'name',
      sortable: true,
      cell: (r: any) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate(`/app/academics/programs/${r.id}`)}
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
      header: 'Education Level',
      accessor: 'level',
      sortable: true,
      cell: (r: any) => <span className="text-xs text-slate-600 font-medium">{r.level}</span>,
    },
    {
      header: 'Duration',
      accessor: 'duration',
      sortable: true,
      cell: (r: any) => <span className="text-xs text-slate-600 font-medium">{r.duration || `${r.durationYears} Years`}</span>,
    },
    {
      header: 'Active Courses',
      accessor: 'coursesCount',
      cell: (r: any) => (
        <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
          {r.coursesCount ?? 2} Courses
        </span>
      ),
    },
    {
      header: 'Intake Capacity',
      accessor: 'intakeCapacity',
      cell: (r: any) => <span className="text-xs font-mono font-bold text-slate-800">{r.intakeCapacity ?? 120} Seats</span>,
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
            onClick={() => navigate(`/app/academics/programs/${r.id}`)}
            className="h-7 text-xs px-2 text-slate-700"
            title="View Program Details"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View
          </Button>

          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(r)}
              className="h-7 text-xs px-2 text-slate-700 hover:bg-slate-50"
              title="Edit Program"
            >
              <Edit className="w-3.5 h-3.5 mr-1" /> Edit
            </Button>
          )}

          {onToggleStatus && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleStatus(r)}
              className={`h-7 text-xs px-2 ${r.status === 'Active' ? 'text-rose-600 hover:bg-rose-50' : 'text-emerald-600 hover:bg-emerald-50'}`}
              title={r.status === 'Active' ? 'Deactivate Program' : 'Activate Program'}
            >
              <Power className="w-3.5 h-3.5" />
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/app/academics/overview')}
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
      emptyDescription="Academic programs define the overall pathway or qualification (e.g. CBSE Senior Secondary, B.Tech)."
    />
  )
}
