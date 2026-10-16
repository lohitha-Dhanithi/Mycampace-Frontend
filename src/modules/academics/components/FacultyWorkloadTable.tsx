// src/modules/academics/components/FacultyWorkloadTable.jsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { Button } from '@/components/ui/button'
import { UserCheck, Eye, Gauge } from 'lucide-react'
import { FacultyWorkloadProfile } from './FacultyWorkloadProfile'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function FacultyWorkloadTable({ workloads = [], loading = false }) {
  const [selectedFaculty, setSelectedFaculty] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleOpenDetails = (row) => {
    setSelectedFaculty(row)
    setDialogOpen(true)
  }

  const columns = [
    {
      header: 'Educator',
      accessor: 'facultyName',
      sortable: true,
      className: 'min-w-[200px]',
      cell: (r: any) => (
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => handleOpenDetails(r)}
              className="font-bold text-xs text-slate-900 hover:text-blue-600 text-left transition-colors whitespace-nowrap block"
            >
              {r.facultyName}
            </button>
            <div className="text-[10px] text-slate-400 whitespace-nowrap">{r.department}</div>
          </div>
        </div>
      ),
    },
    {
      header: 'Department',
      accessor: 'department',
      sortable: true,
      className: 'whitespace-nowrap min-w-[170px]',
      cell: (r: any) => <span className="text-xs text-slate-700 whitespace-nowrap">{r.department}</span>,
    },
    {
      header: 'Subjects Taught',
      accessor: 'subjectsCount',
      className: 'whitespace-nowrap min-w-[130px]',
      cell: (r: any) => <span className="text-xs font-semibold text-slate-700 whitespace-nowrap">{r.subjectsCount} Subjects</span>,
    },
    {
      header: 'Classes & Sections',
      accessor: 'classesCount',
      className: 'whitespace-nowrap min-w-[160px]',
      cell: (r: any) => (
        <span className="text-xs text-slate-700 whitespace-nowrap">
          {r.classesCount} Classes ({r.sectionsCount} Sec)
        </span>
      ),
    },
    {
      header: 'Teaching Load / Capacity',
      accessor: 'assignedHours',
      className: 'whitespace-nowrap min-w-[160px]',
      cell: (r: any) => {
        const assigned = r.assignedHours || 18
        const cap = r.capacityHours || 22
        const pct = Math.round((assigned / cap) * 100)
        return (
          <div className="space-y-1 w-32">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="font-bold text-slate-800">{assigned} hrs / {cap} hrs</span>
              <span className="text-slate-400">{pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${
                  pct > 100 ? 'bg-red-600' : pct >= 75 ? 'bg-emerald-600' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        )
      },
    },
    {
      header: 'Workload Status',
      accessor: 'status',
      sortable: true,
      className: 'whitespace-nowrap min-w-[130px]',
      cell: (r: any) => {
        const colors = {
          Underutilized: 'bg-amber-50 text-amber-700 border-amber-200',
          Balanced: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          'High Workload': 'bg-red-50 text-red-700 border-red-200',
        }
        return (
          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-bold border whitespace-nowrap ${colors[r.status] || colors.Balanced}`}>
            {r.status}
          </span>
        )
      },
    },
    {
      header: 'Actions',
      className: 'text-right whitespace-nowrap min-w-[150px]',
      cell: (r: any) => (
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOpenDetails(r)}
            className="h-7 text-xs px-2 whitespace-nowrap"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> Workload Breakdown
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={workloads}
        loading={loading}
        searchPlaceholder="Search faculty workload by name, department..."
        emptyTitle="No workload data found"
        emptyDescription="Faculty workloads are dynamically calculated from active teaching assignments."
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-blue-600" />
              Faculty Workload Dossier: {selectedFaculty?.facultyName}
            </DialogTitle>
          </DialogHeader>
          {selectedFaculty && (
            <FacultyWorkloadProfile faculty={selectedFaculty} onClose={() => setDialogOpen(false)} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
