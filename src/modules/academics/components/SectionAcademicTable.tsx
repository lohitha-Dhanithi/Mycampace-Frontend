// src/modules/academics/components/SectionAcademicTable.jsx
import React from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, Users2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function SectionAcademicTable({ sections = [], loading = false }) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Section',
      accessor: 'name',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
            <Users2 className="w-4 h-4" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate(`/academics/sections/${r.id}`)}
              className="font-bold text-xs text-slate-900 hover:text-blue-600 text-left transition-colors"
            >
              {r.name}
            </button>
            <div className="text-[10px] text-slate-400">{r.room || 'Standard Classroom'}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Class / Grade',
      accessor: 'className',
      sortable: true,
      cell: (r) => <span className="text-xs font-semibold text-slate-800">{r.className}</span>,
    },
    {
      header: 'Academic Year',
      accessor: 'academicYear',
      cell: () => <span className="text-xs text-slate-600">2026–2027</span>,
    },
    {
      header: 'Campus',
      accessor: 'campus',
      cell: () => <span className="text-xs text-slate-600">Hyderabad Main</span>,
    },
    {
      header: 'Class Teacher',
      accessor: 'classTeacher',
      sortable: true,
      cell: (r) => <span className="text-xs text-slate-800 font-medium">{r.classTeacher || 'Assigned Mentor'}</span>,
    },
    {
      header: 'Student Capacity',
      accessor: 'currentStrength',
      cell: (r) => {
        const current = r.currentStrength ?? 0
        const max = r.capacity ?? 40
        const percentage = Math.round((current / max) * 100)
        return (
          <div className="space-y-1 w-28">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-slate-800">{current} / {max}</span>
              <span className="text-slate-400">{percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  percentage >= 95 ? 'bg-amber-500' : 'bg-teal-600'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      header: 'Subjects',
      accessor: 'subjectsCount',
      cell: () => <span className="text-xs font-mono text-slate-700">5 Subjects</span>,
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
            onClick={() => navigate(`/academics/sections/${r.id}`)}
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
      data={sections}
      loading={loading}
      searchPlaceholder="Search sections by name, room, class teacher..."
      emptyTitle="No sections found"
      emptyDescription="Sections are homerooms linked to classes."
    />
  )
}
