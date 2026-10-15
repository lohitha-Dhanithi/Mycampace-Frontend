// src/modules/admissions/components/LeadTable.jsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, Edit, UserCheck, Plus, CheckCircle, ArrowRight, Copy, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface LeadTableProps {
  leads?: any[]
  loading?: boolean
  onAssign?: (lead: any) => void
  onScheduleFollowup?: (lead: any) => void
  onConvertToEnquiry?: (leadId: any) => Promise<void> | void
  onArchive?: (leadId: any) => void
}

export function LeadTable({
  leads = [],
  loading = false,
  onAssign,
  onScheduleFollowup,
  onConvertToEnquiry,
  onArchive,
}: LeadTableProps) {
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
      header: 'Lead ID',
      accessor: 'leadNumber',
      sortable: true,
      className: 'whitespace-nowrap min-w-[130px]',
      cell: (row) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <button
            onClick={() => navigate(`/admissions/leads/${row.id}`)}
            className="font-mono font-medium text-slate-800 hover:text-blue-600 transition-colors text-xs"
          >
            {row.leadNumber}
          </button>
          <button
            type="button"
            onClick={(e) => handleCopyId(e, row.leadNumber)}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors shrink-0"
            title={copiedId === row.leadNumber ? 'Copied!' : 'Copy Lead ID'}
            aria-label="Copy Lead ID"
          >
            {copiedId === row.leadNumber ? (
              <Check className="h-3 w-3 text-emerald-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </button>
        </div>
      ),
    },
    {
      header: 'Lead Name',
      accessor: 'fullName',
      sortable: true,
      className: 'whitespace-nowrap min-w-[160px]',
      cell: (row) => (
        <div className="font-semibold text-slate-900 text-xs whitespace-nowrap">
          {row.fullName}
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
      header: 'Source',
      accessor: 'source',
      sortable: true,
      className: 'whitespace-nowrap',
      cell: (row) => (
        <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap">
          {row.source}
        </span>
      ),
    },
    {
      header: 'Target Program',
      accessor: 'programName',
      sortable: true,
      className: 'whitespace-nowrap min-w-[180px]',
      cell: (row) => (
        <span className="font-medium text-slate-800 text-xs truncate max-w-[200px] block" title={row.programName || 'Senior Secondary'}>
          {row.programName || 'Senior Secondary'}
        </span>
      ),
    },
    {
      header: 'Academic Year',
      accessor: 'academicYearName',
      className: 'whitespace-nowrap',
      cell: (row) => <span className="text-slate-600 text-xs whitespace-nowrap">{row.academicYearName || '2026-2027'}</span>,
    },
    {
      header: 'Counsellor',
      accessor: 'counsellorName',
      sortable: true,
      className: 'whitespace-nowrap min-w-[140px]',
      cell: (row) => (
        <span className="text-slate-700 text-xs font-medium whitespace-nowrap">{row.counsellorName || 'Unassigned'}</span>
      ),
    },
    {
      header: 'Stage',
      accessor: 'stage',
      sortable: true,
      className: 'whitespace-nowrap',
      cell: (row) => <StatusBadge status={row.stage} />,
    },
    {
      header: 'Priority',
      accessor: 'priority',
      sortable: true,
      className: 'whitespace-nowrap',
      cell: (row) => <StatusBadge status={row.priority} />,
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
