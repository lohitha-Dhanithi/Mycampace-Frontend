// src/modules/admissions/components/EnquiryTable.jsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Calendar, FileText, CheckCircle2, XCircle, Copy, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface EnquiryTableProps {
  enquiries?: any[]
  loading?: boolean
  onScheduleFollowup?: (enquiry: any) => void
  onConvertToApplication?: (enquiryId: any) => Promise<void> | void
  onCloseEnquiry?: (enquiryId: any) => Promise<void> | void
}

export function EnquiryTable({
  enquiries = [],
  loading = false,
  onScheduleFollowup,
  onConvertToApplication,
  onCloseEnquiry,
}: EnquiryTableProps) {
  const navigate = useNavigate()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current))
    }, 2000)
  }

  const columns = [
    {
      header: 'Enquiry ID',
      accessor: 'enquiryNumber',
      sortable: true,
      className: 'whitespace-nowrap min-w-[130px]',
      cell: (row) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <span className="font-mono font-medium text-slate-800 text-xs">
            {row.enquiryNumber}
          </span>
          <button
            type="button"
            onClick={(e) => handleCopyId(e, row.enquiryNumber)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors shrink-0"
            title={copiedId === row.enquiryNumber ? 'Copied!' : 'Copy Enquiry ID'}
            aria-label="Copy Enquiry ID"
          >
            {copiedId === row.enquiryNumber ? (
              <Check className="h-3 w-3 text-emerald-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      ),
    },
    {
      header: 'Applicant Name',
      accessor: 'applicantName',
      sortable: true,
      className: 'whitespace-nowrap min-w-[160px]',
      cell: (row) => (
        <div className="font-semibold text-slate-900 text-xs whitespace-nowrap">
          {row.applicantName}
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'phone',
      className: 'whitespace-nowrap min-w-[130px]',
      cell: (row) => (
        <span className="font-mono text-xs text-slate-700 whitespace-nowrap">
          {row.phone}
        </span>
      ),
    },
    {
      header: 'Program',
      accessor: 'programName',
      sortable: true,
      className: 'whitespace-nowrap min-w-[180px]',
      cell: (row) => (
        <span className="font-medium text-slate-800 text-xs truncate max-w-[200px] block" title={row.programName}>
          {row.programName}
        </span>
      ),
    },
    {
      header: 'Academic Year',
      accessor: 'academicYearName',
      className: 'whitespace-nowrap',
      cell: (row) => <span className="text-slate-600 text-xs whitespace-nowrap">{row.academicYearName}</span>,
    },
    {
      header: 'Counsellor',
      accessor: 'counsellorName',
      sortable: true,
      className: 'whitespace-nowrap min-w-[140px]',
      cell: (row) => <span className="text-slate-700 text-xs font-medium whitespace-nowrap">{row.counsellorName || 'Unassigned'}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      className: 'whitespace-nowrap',
      cell: (row) => <StatusBadge status={row.status} />,
    },
    {
      header: 'Next Follow-up',
      accessor: 'nextFollowup',
      className: 'whitespace-nowrap',
      cell: (row) => (
        <span className={row.nextFollowup ? 'text-blue-600 text-xs font-medium whitespace-nowrap' : 'text-slate-400 text-xs'}>
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
