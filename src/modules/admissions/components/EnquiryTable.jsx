// src/modules/admissions/components/EnquiryTable.jsx
import React from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Calendar, FileText, CheckCircle2, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function EnquiryTable({
  enquiries = [],
  loading = false,
  onScheduleFollowup,
  onConvertToApplication,
  onCloseEnquiry,
}) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Enquiry ID',
      accessor: 'enquiryNumber',
      sortable: true,
      cell: (row) => (
        <span className="font-mono font-bold text-blue-600 text-xs">
          {row.enquiryNumber}
        </span>
      ),
    },
    {
      header: 'Applicant Name',
      accessor: 'applicantName',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-bold text-slate-900">{row.applicantName}</div>
          <div className="text-[10px] text-slate-400">{row.phone} • {row.email}</div>
        </div>
      ),
    },
    {
      header: 'Program & Campus',
      accessor: 'programName',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-800">{row.programName}</div>
          <div className="text-[10px] text-slate-500">{row.campusName}</div>
        </div>
      ),
    },
    {
      header: 'Academic Year',
      accessor: 'academicYearName',
      cell: (row) => <span className="text-slate-600">{row.academicYearName}</span>,
    },
    {
      header: 'Counsellor',
      accessor: 'counsellorName',
      sortable: true,
      cell: (row) => <span className="text-slate-700 font-medium">{row.counsellorName || 'Unassigned'}</span>,
    },
    {
      header: 'Enquiry Date',
      accessor: 'enquiryDate',
      sortable: true,
      cell: (row) => <span className="text-slate-600">{row.enquiryDate}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Next Follow-up',
      accessor: 'nextFollowup',
      cell: (row) => (
        <span className={row.nextFollowup ? 'text-blue-600 font-medium' : 'text-slate-400'}>
          {row.nextFollowup || '—'}
        </span>
      ),
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (row) => (
        <div className="flex items-center justify-end gap-1.5">
          {!row.applicationId && row.status !== 'Closed' && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConvertToApplication && onConvertToApplication(row.id)}
              className="h-7 text-[11px] gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
              title="Convert to Application"
            >
              <FileText className="h-3 w-3" /> To App
            </Button>
          )}

          {row.applicationId && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              App Created
            </span>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => onScheduleFollowup && onScheduleFollowup(row)}
            className="h-7 text-[11px] text-slate-700 hover:bg-slate-50"
            title="Schedule Follow-up"
          >
            <Calendar className="h-3 w-3 mr-1" /> Follow-up
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={enquiries}
      loading={loading}
      searchPlaceholder="Search enquiries by applicant, ID, phone..."
      emptyTitle="No enquiries found"
      emptyDescription="No enquiries currently registered or matching the filters."
    />
  )
}
