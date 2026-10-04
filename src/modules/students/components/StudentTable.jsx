// src/modules/students/components/StudentTable.jsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Eye,
  Edit,
  GraduationCap,
  ArrowRightLeft,
  TrendingUp,
  LogOut,
  FileText,
  MoreVertical,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

export function StudentTable({
  students = [],
  loading = false,
  onTransfer,
  onPromote,
  onExit,
}) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Student',
      accessor: 'personal.fullName',
      sortable: true,
      cell: (r) => {
        const name = r.personal?.fullName || r.name || 'Unnamed Student'
        return (
          <div className="flex items-center gap-2.5">
            <Avatar
              src={r.avatar}
              alt={name}
              fallback={name.substring(0, 2).toUpperCase()}
              size="sm"
            />
            <div>
              <button
                type="button"
                onClick={() => navigate(`/students/${r.id}`)}
                className="font-bold text-slate-900 hover:text-blue-600 block text-left transition-colors"
              >
                {name}
              </button>
              <div className="text-[10px] text-slate-400 font-mono">Roll: {r.rollNumber || '—'}</div>
            </div>
          </div>
        )
      },
    },
    {
      header: 'Student ID',
      accessor: 'studentId',
      sortable: true,
      cell: (r) => (
        <span className="font-mono text-xs font-bold text-blue-600">
          {r.studentId}
        </span>
      ),
    },
    {
      header: 'Admission Number',
      accessor: 'admissionNumber',
      sortable: true,
      cell: (r) => (
        <span className="font-mono text-xs text-slate-700 font-semibold">
          {r.admissionNumber || '—'}
        </span>
      ),
    },
    {
      header: 'Program / Course',
      accessor: 'programName',
      sortable: true,
      cell: (r) => (
        <div>
          <div className="font-semibold text-slate-800 text-xs truncate max-w-[170px]">
            {r.programName || 'Senior Secondary'}
          </div>
          <div className="text-[10px] text-slate-400 truncate max-w-[170px]">
            {r.courseName || 'General'}
          </div>
        </div>
      ),
    },
    {
      header: 'Class',
      accessor: 'className',
      sortable: true,
      cell: (r) => (
        <span className="text-xs font-medium text-slate-800">
          {r.className || r.currentClass || 'Class 11'}
        </span>
      ),
    },
    {
      header: 'Section',
      accessor: 'sectionName',
      sortable: true,
      cell: (r) => (
        <span className="text-xs text-slate-600">
          {r.sectionName || r.section || 'Section A'}
        </span>
      ),
    },
    {
      header: 'Campus',
      accessor: 'campusName',
      sortable: true,
      cell: (r) => <span className="text-xs text-slate-600">{r.campusName || r.campus}</span>,
    },
    {
      header: 'Academic Year',
      accessor: 'academicYearName',
      cell: (r) => (
        <span className="text-xs text-slate-600">{r.academicYearName || r.admissionYear || '2026-2027'}</span>
      ),
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Admission Date',
      accessor: 'admissionDate',
      sortable: true,
      cell: (r) => <span className="text-xs text-slate-500">{r.admissionDate || '—'}</span>,
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => navigate(`/students/${r.id}`)}
            title="View Student Dossier"
          >
            <Eye className="h-3.5 w-3.5 mr-1" /> View
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => navigate(`/students/${r.id}/edit`)}
            title="Edit Profile"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                <MoreVertical className="h-4 w-4 text-slate-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 text-xs">
              <DropdownMenuItem onClick={() => navigate(`/students/${r.id}/academic`)}>
                <GraduationCap className="w-3.5 h-3.5 mr-2 text-blue-600" /> Academic Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/students/${r.id}/documents`)}>
                <FileText className="w-3.5 h-3.5 mr-2 text-indigo-600" /> Manage Documents
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onTransfer ? onTransfer(r) : navigate('/students/transfers')}>
                <ArrowRightLeft className="w-3.5 h-3.5 mr-2 text-purple-600" /> Transfer Student
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPromote ? onPromote(r) : navigate('/students/promotions')}>
                <TrendingUp className="w-3.5 h-3.5 mr-2 text-emerald-600" /> Academic Promotion
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onExit ? onExit(r) : navigate('/students/exits')}
                className="text-red-600 focus:text-red-600"
              >
                <LogOut className="w-3.5 h-3.5 mr-2" /> Log Student Exit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={students}
      loading={loading}
      searchPlaceholder="Search by student name, ID, admission number, mobile..."
      emptyTitle="No student records found"
      emptyDescription="Try adjusting your search criteria, class filters or campus selector."
    />
  )
}
