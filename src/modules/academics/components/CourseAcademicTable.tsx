import React from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, BookOpen, Edit, Power, CheckCircle2, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function CourseAcademicTable({
  courses = [],
  loading = false,
  onEdit,
  onToggleStatus,
}: {
  courses?: any[]
  loading?: boolean
  onEdit?: (course: any) => void
  onToggleStatus?: (course: any) => void
}) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Course Offering',
      accessor: 'name',
      sortable: true,
      cell: (r: any) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate(`/app/academics/courses/${r.id}`)}
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
      cell: (r: any) => <span className="text-xs text-slate-700 font-medium">{r.department || 'Academics'}</span>,
    },
    {
      header: 'Credits',
      accessor: 'credits',
      sortable: true,
      cell: (r: any) => <span className="text-xs font-mono font-bold text-slate-700">{r.credits ?? 4} Credits</span>,
    },
    {
      header: 'Admissions Intake',
      accessor: 'intakeCapacity',
      cell: (r: any) => (
        <div className="text-xs">
          <span className="font-mono font-bold text-slate-800">{r.intakeCapacity ?? 60} Seats</span>
          <div className="text-[10px] text-slate-400">
            {r.admissionAvailable !== false ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                <CheckCircle2 className="w-2.5 h-2.5 inline" /> Open
              </span>
            ) : (
              <span className="text-slate-400 font-semibold flex items-center gap-0.5">
                <XCircle className="w-2.5 h-2.5 inline" /> Closed
              </span>
            )}
          </div>
        </div>
      ),
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
            onClick={() => navigate(`/app/academics/courses/${r.id}`)}
            className="h-7 text-xs px-2 text-slate-700"
            title="View Course Dossier"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> View
          </Button>

          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(r)}
              className="h-7 text-xs px-2 text-slate-700 hover:bg-slate-50"
              title="Edit Course"
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
              title={r.status === 'Active' ? 'Deactivate Course' : 'Activate Course'}
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
      data={courses}
      loading={loading}
      searchPlaceholder="Search courses by name, code, department..."
      emptyTitle="No courses found"
      emptyDescription="Courses represent distinct curriculum offerings within programs (e.g. Higher Secondary Science, B.Tech CSE)."
    />
  )
}
