// src/modules/admissions/components/LeadTable.jsx
import React from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, UserCheck, Plus, CheckCircle, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function LeadTable({
  leads = [],
  loading = false,
  onAssign,
  onScheduleFollowup,
  onConvertToEnquiry,
  onArchive,
}) {
  const navigate = useNavigate()

  const columns = [
    {
      header: 'Lead Name & ID',
      accessor: 'fullName',
      sortable: true,
      cell: (row) => (
        <div>
          <button
            onClick={() => navigate(`/admissions/leads/${row.id}`)}
            className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-left"
          >
            {row.fullName}
          </button>
          <div className="text-[10px] text-slate-400 font-mono">{row.leadNumber}</div>
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'phone',
      cell: (row) => (
        <div>
          <div className="font-medium text-slate-800">{row.phone}</div>
          <div className="text-[10px] text-slate-400 truncate max-w-[140px]">{row.email}</div>
        </div>
      ),
    },
    {
      header: 'Source',
      accessor: 'source',
      sortable: true,
      cell: (row) => (
        <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium">
          {row.source}
        </span>
      ),
    },
    {
      header: 'Target Program',
      accessor: 'programName',
      sortable: true,
      cell: (row) => (
        <div>
          <div className="font-semibold text-slate-800 truncate max-w-[180px]">
            {row.programName || 'Senior Secondary'}
          </div>
          <div className="text-[10px] text-slate-400 truncate max-w-[180px]">
            {row.courseName || 'General Stream'}
          </div>
        </div>
      ),
    },
    {
      header: 'Academic Year',
      accessor: 'academicYearName',
      cell: (row) => <span className="text-slate-600">{row.academicYearName || '2026-2027'}</span>,
    },
    {
      header: 'Counsellor',
      accessor: 'counsellorName',
      sortable: true,
      cell: (row) => (
        <span className="text-slate-700 font-medium">{row.counsellorName || 'Unassigned'}</span>
      ),
    },
    {
      header: 'Stage',
      accessor: 'stage',
      sortable: true,
      cell: (row) => <StatusBadge status={row.stage} />,
    },
    {
      header: 'Priority',
      accessor: 'priority',
      sortable: true,
      cell: (row) => (
        <span
          className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
            row.priority === 'High'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : row.priority === 'Medium'
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-slate-100 text-slate-600'
          }`}
        >
          {row.priority}
        </span>
      ),
    },
    {
      header: 'Next Follow-up',
      accessor: 'nextFollowup',
      sortable: true,
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
        <div className="flex items-center justify-end gap-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admissions/leads/${row.id}`)}
            className="h-7 px-2 text-xs"
            title="View Lead Details"
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admissions/leads/${row.id}/edit`)}
            className="h-7 px-2 text-xs"
            title="Edit Lead"
          >
            <Edit className="h-3.5 w-3.5" />
          </Button>

          {!row.enquiryId && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConvertToEnquiry && onConvertToEnquiry(row.id)}
              className="h-7 text-[11px] gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
              title="Convert to Enquiry"
            >
              <CheckCircle className="h-3 w-3" /> Enquiry
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={() => onScheduleFollowup && onScheduleFollowup(row)}
            className="h-7 text-[11px] text-blue-600 border-blue-200 hover:bg-blue-50"
            title="Add Follow-up"
          >
            + Follow-up
          </Button>
        </div>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={leads}
      loading={loading}
      searchPlaceholder="Search leads by student name, phone, email, source..."
      emptyTitle="No prospective leads found"
      emptyDescription="No leads match your current search criteria or campus filters."
    />
  )
}
