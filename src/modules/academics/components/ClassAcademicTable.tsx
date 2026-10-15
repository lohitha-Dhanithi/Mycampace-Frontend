import React from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, Layers, Edit, Power } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ClassAcademicTable({
  classes = [],
  loading = false,
  onEdit,
  onToggleStatus,
}: {
  classes?: any[]
  loading?: boolean
  onEdit?: (cls: any) => void
  onToggleStatus?: (cls: any) => void
}) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Class / Academic Level',
      accessor: 'name',
      sortable: true,
      cell: (r: any) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-purple-50 text-purple-700 border border-purple-200">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate(`/app/academics/classes/${r.id}`)}
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
      header: 'Program / Pathway',
      accessor: 'program',
      sortable: true,
      cell: (r: any) => <span className="text-xs text-slate-700 font-medium">{r.program || 'Academics'}</span>,
    },
    {
      header: 'Sections',
      accessor: 'sectionsCount',
      cell: (r: any) => (
        <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          {r.sectionsCount ?? 0} Sections
        </span>
      ),
    },
    {
      header: 'Total Enrolled',
      accessor: 'totalStudents',
      cell: (r: any) => <span className="text-xs font-mono font-bold text-slate-800">{r.totalStudents ?? 0} Students</span>,
    },
    {
      header: 'Campus',
      accessor: 'campus',
      sortable: true,
      cell: (r: any) => <span className="text-xs text-slate-600">{r.campus || 'Hyderabad Main Campus'}</span>,
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
            onClick={() => navigate(`/app/academics/classes/${r.id}`)}
            className="h-7 text-xs px-2 text-slate-700"
            title="View Class Roster"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View
          </Button>

          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(r)}
              className="h-7 text-xs px-2 text-slate-700 hover:bg-slate-50"
              title="Edit Class"
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
              title={r.status === 'Active' ? 'Deactivate Class' : 'Activate Class'}
            >
              <Power className="w-3.5 h-3.5" />
            </Button>
          )}
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
      emptyDescription="Classes represent academic levels/cohorts (e.g. Class 10, Class 12, Semester 1) referencing courses."
    />
  )
}
