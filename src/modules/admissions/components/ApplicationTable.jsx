// src/modules/admissions/components/ApplicationTable.jsx
import React from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, CheckSquare, GraduationCap, FileCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { calculateApplicationCompletion } from '../services/applicationService'

export function ApplicationTable({
  applications = [],
  loading = false,
  onReview,
  onConfirmAdmission,
}) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Application No & Date',
      accessor: 'applicationNumber',
      sortable: true,
      cell: (row) => (
        <div>
          <button
            onClick={() => navigate(`/admissions/applications/${row.id}`)}
            className="font-mono font-bold text-blue-600 hover:underline text-left text-xs"
          >
            {row.applicationNumber}
          </button>
          <div className="text-[10px] text-slate-400">Date: {row.applicationDate}</div>
        </div>
      ),
    },
    {
      header: 'Applicant',
      accessor: 'applicantName',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.applicantName}</div>
          <div className="text-[10px] text-slate-400">
            {row.contact?.mobile} • {row.contact?.email}
          </div>
        </div>
      ),
    },
    {
      header: 'Target Program & Campus',
      accessor: 'programName',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-800">
            {row.academicInterest?.programName || 'Senior Secondary'}
          </div>
          <div className="text-[10px] text-slate-500">
            {row.academicInterest?.courseName} • {row.academicInterest?.campusName}
          </div>
        </div>
      ),
    },
    {
      header: 'Academic Year',
      accessor: 'academicYearName',
      cell: (row) => (
        <span className="text-slate-600 text-xs">
          {row.academicInterest?.academicYearName || '2026-2027'}
        </span>
      ),
    },
    {
      header: 'Completion',
      accessor: 'completion',
      cell: (row) => {
        const { percentage } = calculateApplicationCompletion(row)
        return (
          <div className="w-28 space-y-1">
            <div className="flex justify-between text-[10px] font-bold">
              <span className="text-slate-600">Form</span>
              <span className={percentage === 100 ? 'text-emerald-700' : 'text-blue-700'}>
                {percentage}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  percentage === 100 ? 'bg-emerald-600' : 'bg-blue-600'
                }`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Assigned Reviewer',
      accessor: 'assignedReviewerName',
      cell: (row) => (
        <span className="text-slate-700 text-xs font-medium">
          {row.assignedReviewerName || 'Review Committee'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admissions/applications/${row.id}`)}
            className="h-7 px-2 text-xs"
            title="View Application Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>

          {['Submitted', 'Under Review', 'Documents Required'].includes(row.status) && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/admissions/applications/${row.id}/review`)}
              className="h-7 text-[11px] text-amber-700 border-amber-200 hover:bg-amber-50 gap-1"
              title="Review Application"
            >
              <FileCheck className="h-3 w-3" /> Review
            </Button>
          )}

          {row.status === 'Approved' && (
            <Button
              size="sm"
              onClick={() => onConfirmAdmission && onConfirmAdmission(row)}
              className="h-7 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white gap-1"
              title="Confirm Student Admission"
            >
              <GraduationCap className="h-3 w-3" /> Confirm Admission
            </Button>
          )}

          {row.status === 'Admitted' && !row.studentId && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
              Admitted
            </span>
          )}

          {row.status === 'Enrolled' && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
              Enrolled (SIS)
            </span>
          )}
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={applications}
      loading={loading}
      searchPlaceholder="Search applications by number, applicant name, contact..."
      emptyTitle="No applications found"
      emptyDescription="No applications registered or matching the active filters."
    />
  )
}
