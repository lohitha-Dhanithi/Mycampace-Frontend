// src/modules/admissions/components/LeadTable.tsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import {
  Eye,
  Edit,
  UserX,
  RotateCcw,
  Plus,
  ArrowRight,
  Copy,
  Check,
  Calendar,
  CalendarPlus,
  FileCheck2,
  AlertCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface LeadTableProps {
  leads?: any[]
  loading?: boolean
  onAssign?: (lead: any) => void
  onScheduleFollowup?: (lead: any) => void
  onCloseLead?: (lead: any) => void
  onReopenLead?: (lead: any) => void
  onConvertToApplication?: (lead: any) => Promise<void> | void
  onArchive?: (leadId: any) => void
}

export function LeadTable({
  leads = [],
  loading = false,
  onAssign,
  onScheduleFollowup,
  onCloseLead,
  onReopenLead,
  onConvertToApplication,
  onArchive,
}: LeadTableProps) {
  const navigate = useNavigate()
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'followup_due' | 'converted' | 'closed'>('all')

  const handleCopyId = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
    setCopiedId(id)
    setTimeout(() => {
      setCopiedId((current) => (current === id ? null : current))
    }, 2000)
  }

  const todayStr = new Date().toISOString().split('T')[0]

  // Filter leads based on selected tab
  const filteredLeads = leads.filter((lead) => {
    const isClosed = lead.status === 'Closed' || lead.stage === 'Lost'
    const isConverted = lead.stage === 'Converted' || Boolean(lead.applicationId)

    if (statusFilter === 'all') return true
    if (statusFilter === 'closed') return isClosed
    if (statusFilter === 'converted') return isConverted
    if (statusFilter === 'active') return !isClosed && !isConverted
    if (statusFilter === 'followup_due') {
      return !isClosed && lead.nextFollowup && lead.nextFollowup <= todayStr
    }
    return true
  })

  const columns = [
    {
      header: 'Lead ID',
      accessor: 'leadNumber',
      sortable: true,
      className: 'whitespace-nowrap min-w-[130px]',
      cell: (row: any) => (
        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <button
            onClick={() => navigate(`/app/admissions/leads/${row.id}`)}
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
      cell: (row: any) => (
        <div>
          <div className="font-semibold text-slate-900 text-xs whitespace-nowrap">
            {row.fullName}
          </div>
          {row.closureReason && (
            <div className="text-[10px] text-red-600 truncate max-w-[160px]" title={row.closureReason}>
              Reason: {row.closureReason}
            </div>
          )}
        </div>
      ),
    },
    {
      header: 'Contact',
      accessor: 'phone',
      className: 'whitespace-nowrap min-w-[130px]',
      cell: (row: any) => (
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
      cell: (row: any) => (
        <span className="text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap">
          {row.source}
        </span>
      ),
    },
    {
      header: 'Target Program',
      accessor: 'programName',
      sortable: true,
      className: 'whitespace-nowrap min-w-[170px]',
      cell: (row: any) => (
        <span className="font-medium text-slate-800 text-xs truncate max-w-[190px] block" title={row.programName || row.courseName || 'Senior Secondary'}>
          {row.programName || row.courseName || 'Senior Secondary'}
        </span>
      ),
    },
    {
      header: 'Counsellor',
      accessor: 'counsellorName',
      sortable: true,
      className: 'whitespace-nowrap min-w-[130px]',
      cell: (row: any) => (
        <span className="text-slate-700 text-xs font-medium whitespace-nowrap">{row.counsellorName || 'Unassigned'}</span>
      ),
    },
    {
      header: 'Stage',
      accessor: 'stage',
      sortable: true,
      className: 'whitespace-nowrap',
      cell: (row: any) => {
        if (row.status === 'Closed' || row.stage === 'Lost') {
          return (
            <span
              className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded"
              title={row.closureReason ? `Closed: ${row.closureReason}` : 'Closed Lead'}
            >
              <UserX className="h-3 w-3 text-red-500" /> Closed (Lost)
            </span>
          )
        }
        if (row.stage === 'Converted' || row.applicationId) {
          return (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              <Check className="h-3 w-3 text-emerald-600" /> Converted
            </span>
          )
        }
        return <StatusBadge status={row.stage} />
      },
    },
    {
      header: 'Priority',
      accessor: 'priority',
      sortable: true,
      className: 'whitespace-nowrap',
      cell: (row: any) => <StatusBadge status={row.priority} />,
    },
    {
      header: 'Next Follow-up',
      accessor: 'nextFollowup',
      sortable: true,
      className: 'whitespace-nowrap min-w-[140px]',
      cell: (row: any) => {
        const isClosed = row.status === 'Closed' || row.stage === 'Lost'
        if (isClosed) {
          return <span className="text-slate-400 text-xs">—</span>
        }

        if (!row.nextFollowup) {
          return (
            <button
              type="button"
              onClick={() => onScheduleFollowup && onScheduleFollowup(row)}
              className="text-[11px] text-slate-500 hover:text-slate-900 flex items-center gap-1 font-medium transition-colors"
            >
              <CalendarPlus className="h-3 w-3 text-slate-400" /> + Schedule
            </button>
          )
        }

        const isOverdue = row.nextFollowup < todayStr
        const isToday = row.nextFollowup === todayStr

        if (isOverdue) {
          return (
            <button
              type="button"
              onClick={() => onScheduleFollowup && onScheduleFollowup(row)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded hover:bg-amber-100 transition-colors"
              title="Follow-up overdue. Click to reschedule."
            >
              <AlertCircle className="h-3 w-3 text-amber-600" /> Overdue ({row.nextFollowup})
            </button>
          )
        }

        if (isToday) {
          return (
            <button
              type="button"
              onClick={() => onScheduleFollowup && onScheduleFollowup(row)}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded hover:bg-blue-100 transition-colors"
            >
              <Calendar className="h-3 w-3 text-blue-600" /> Today
            </button>
          )
        }

        return (
          <button
            type="button"
            onClick={() => onScheduleFollowup && onScheduleFollowup(row)}
            className="text-xs font-medium text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            <Calendar className="h-3 w-3 text-slate-400" /> {row.nextFollowup}
          </button>
        )
      },
    },
    {
      header: 'Actions',
      className: 'text-right min-w-[190px]',
      cell: (row: any) => {
        const isClosed = row.status === 'Closed' || row.stage === 'Lost'
        const isConverted = row.stage === 'Converted' || Boolean(row.applicationId)

        return (
          <div className="flex items-center justify-end gap-1">
            {/* View Profile */}
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate(`/app/admissions/leads/${row.id}`)}
              className="h-7 px-2 text-xs text-slate-600 border-slate-200 hover:bg-slate-50"
              title="View Lead Details"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>

            {/* If Closed: Option to Reopen */}
            {isClosed ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onReopenLead && onReopenLead(row)}
                className="h-7 text-[11px] gap-1 text-slate-700 border-slate-200 hover:bg-slate-50 font-medium"
                title="Reopen Closed Lead"
              >
                <RotateCcw className="h-3 w-3 text-slate-500" /> Re-open
              </Button>
            ) : isConverted ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => navigate('/app/admissions/applications')}
                className="h-7 text-[11px] gap-1 text-emerald-700 border-emerald-200 hover:bg-emerald-50 font-medium"
                title="View Converted Application"
              >
                <FileCheck2 className="h-3 w-3" /> Application
              </Button>
            ) : (
              <>
                {/* Active Lead: Schedule Follow-up */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onScheduleFollowup && onScheduleFollowup(row)}
                  className="h-7 text-[11px] text-slate-800 border-slate-200 bg-white hover:bg-slate-50 font-medium gap-1"
                  title="Schedule Follow-up"
                >
                  <Calendar className="h-3 w-3 text-slate-500" /> Follow-up
                </Button>

                {/* Direct Convert to Application */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onConvertToApplication && onConvertToApplication(row)}
                  className="h-7 text-[11px] text-slate-800 border-slate-200 bg-white hover:bg-slate-50 font-medium gap-1"
                  title="Convert Lead directly to Application"
                >
                  Convert
                </Button>

                {/* Close Lead (Lost / Dropped) */}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCloseLead && onCloseLead(row)}
                  className="h-7 px-1.5 text-xs text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 border-slate-200"
                  title="Close Lead as Lost / Dropped"
                >
                  <UserX className="h-3.5 w-3.5" />
                </Button>
              </>
            )}
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-3">
      {/* Quick Status Sub-Filter Tabs */}
      <div className="flex items-center gap-1 text-xs border-b border-slate-100 pb-2">
        <button
          type="button"
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          All Leads ({leads.length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('active')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            statusFilter === 'active'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Active Pipeline ({leads.filter((l) => l.status !== 'Closed' && l.stage !== 'Lost' && l.stage !== 'Converted').length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('followup_due')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            statusFilter === 'followup_due'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Follow-up Due ({leads.filter((l) => l.status !== 'Closed' && l.nextFollowup && l.nextFollowup <= todayStr).length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('converted')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            statusFilter === 'converted'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Converted ({leads.filter((l) => l.stage === 'Converted' || Boolean(l.applicationId)).length})
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter('closed')}
          className={`px-3 py-1 rounded-lg font-medium transition-colors ${
            statusFilter === 'closed'
              ? 'bg-slate-900 text-white shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Closed / Lost ({leads.filter((l) => l.status === 'Closed' || l.stage === 'Lost').length})
        </button>
      </div>

      <DataTable
        columns={columns}
        data={filteredLeads}
        loading={loading}
        searchPlaceholder="Search leads by student name, phone, email, source..."
        emptyTitle="No prospective leads found"
        emptyDescription="No leads match your current search criteria or status filter."
      />
    </div>
  )
}
