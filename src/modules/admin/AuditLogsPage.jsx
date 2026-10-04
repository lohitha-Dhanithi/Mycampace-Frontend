// src/modules/admin/AuditLogsPage.jsx
import React, { useState } from 'react'
import { History, Shield, Filter, Download } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'

export function AuditLogsPage() {
  const [logs] = useState([
    {
      id: 'log-901',
      timestamp: '2026-10-02 12:45:10',
      user: 'Vikram Aditya (Super Admin)',
      action: 'USER_ROLE_UPDATED',
      module: 'RBAC Security',
      ipAddress: '103.24.88.19',
      details: 'Updated permission matrix for Admissions Officer role.',
      severity: 'Low',
    },
    {
      id: 'log-902',
      timestamp: '2026-10-02 11:32:04',
      user: 'Ananya Sharma (Admissions)',
      action: 'STUDENT_ENROLLED',
      module: 'Admissions CRM',
      ipAddress: '103.24.88.22',
      details: 'Finalized enrollment for Aditya Swaminathan into Class 11-A.',
      severity: 'Normal',
    },
    {
      id: 'log-903',
      timestamp: '2026-10-02 09:15:40',
      user: 'Ramesh Chowdhury (Accountant)',
      action: 'FEE_RECEIPT_GENERATED',
      module: 'Finance',
      ipAddress: '103.24.88.14',
      details: 'Generated receipt #RCP-2026-9420 for ₹80,000 via UPI.',
      severity: 'Normal',
    },
    {
      id: 'log-904',
      timestamp: '2026-10-01 16:20:12',
      user: 'Vikram Aditya (Super Admin)',
      action: 'CAMPUS_ADDED',
      module: 'Institution',
      ipAddress: '103.24.88.19',
      details: 'Added campus record: Pune Hinjawadi Campus.',
      severity: 'Medium',
    },
    {
      id: 'log-905',
      timestamp: '2026-10-01 10:14:55',
      user: 'System Automated Daemon',
      action: 'ATTENDANCE_BIOMETRIC_SYNC',
      module: 'Attendance',
      ipAddress: '127.0.0.1 (Internal)',
      details: 'Synchronized 4,276 student biometric attendance logs.',
      severity: 'Low',
    },
  ])

  const columns = [
    {
      header: 'Timestamp',
      accessor: 'timestamp',
      sortable: true,
      cell: (r) => <span className="font-mono text-[11px] text-slate-600">{r.timestamp}</span>,
    },
    {
      header: 'User Identity',
      accessor: 'user',
      sortable: true,
      cell: (r) => <span className="font-semibold text-xs text-slate-800">{r.user}</span>,
    },
    {
      header: 'Action Code',
      accessor: 'action',
      sortable: true,
      cell: (r) => (
        <span className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded font-semibold text-slate-700">
          {r.action}
        </span>
      ),
    },
    {
      header: 'Module',
      accessor: 'module',
      sortable: true,
      cell: (r) => <span className="text-xs text-blue-700 font-medium">{r.module}</span>,
    },
    {
      header: 'Action Details',
      accessor: 'details',
      cell: (r) => <span className="text-xs text-slate-600 max-w-sm block truncate">{r.details}</span>,
    },
    {
      header: 'IP Address',
      accessor: 'ipAddress',
      cell: (r) => <span className="font-mono text-[11px] text-slate-400">{r.ipAddress}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Institutional Audit Trail & Logs"
        subtitle="Immutable security logs of administrative actions, data modifications and compliance access"
      />

      <DataTable
        columns={columns}
        data={logs}
        searchPlaceholder="Search audit events by user, action code or module..."
        searchKey="action"
      />
    </div>
  )
}
