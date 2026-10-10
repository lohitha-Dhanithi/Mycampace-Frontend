// src/modules/academics/components/CourseAcademicTable.jsx
import React from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, BookOpen, Layers, Bookmark } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function CourseAcademicTable({ courses = [], loading = false }) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Course Stream',
      accessor: 'name',
      sortable: true,
      cell: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <button
              type="button"
              onClick={() => navigate(`/academics/courses/${r.id}`)}
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
      header: 'Credits',
      accessor: 'credits',
      sortable: true,
      cell: (r) => <span className="text-xs font-mono font-bold text-slate-700">{r.credits} Credits</span>,
    },
    {
      header: 'Classes',
      accessor: 'classesCount',
      cell: (r) => <span className="text-xs font-semibold text-slate-700">{r.classesCount ?? 2} Classes</span>,
    },
    {
      header: 'Subjects',
      accessor: 'subjectsCount',
      cell: (r) => (
        <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          {r.subjectsCount ?? 5} Subjects
        </span>
      ),
    },
    {
      header: 'Students',
      accessor: 'studentsCount',
      cell: (r) => <span className="text-xs font-mono font-bold text-slate-800">{r.studentsCount ?? 345}</span>,
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
            onClick={() => navigate(`/academics/courses/${r.id}`)}
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
      data={courses}
      loading={loading}
      searchPlaceholder="Search courses by name, code, department..."
      emptyTitle="No courses found"
      emptyDescription="Courses are linked to programs configured in Academic Configuration."
    />
  )
}
