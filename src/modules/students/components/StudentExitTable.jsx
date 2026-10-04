// src/modules/students/components/StudentExitTable.jsx
import React, { useState } from 'react'
import { DataTable } from '@/components/tables/DataTable'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { Eye, CheckCircle2, AlertTriangle, LogOut, Clock, ShieldCheck } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

export function StudentExitTable({
  exits = [],
  loading = false,
  onCompleteExit,
}) {
  const [selectedExit, setSelectedExit] = useState(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [confirmCompleteOpen, setConfirmCompleteOpen] = useState(false)

  const handleOpenReview = (exit) => {
    setSelectedExit(exit)
    setViewDialogOpen(true)
  }

  const handleOpenComplete = (exit) => {
    setSelectedExit(exit)
    setConfirmCompleteOpen(true)
  }

  const columns = [
    {
      header: 'Student',
      accessor: 'studentName',
      sortable: true,
      cell: (r) => (
        <div>
          <div className="font-bold text-xs text-slate-900">{r.studentName}</div>
          <div className="text-[10px] text-slate-400 font-mono">
            {r.studentNumber} • {r.admissionNumber || 'ADM-N/A'}
          </div>
        </div>
      ),
    },
    {
      header: 'Current Class',
      accessor: 'currentClass',
      sortable: true,
      cell: (r) => <span className="text-xs font-medium text-slate-700">{r.currentClass || 'Class 12'}</span>,
    },
    {
      header: 'Exit Type',
      accessor: 'exitType',
      sortable: true,
      cell: (r) => {
        const typeColors = {
          Graduation: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          Transfer: 'bg-blue-50 text-blue-700 border-blue-200',
          Withdrawal: 'bg-amber-50 text-amber-700 border-amber-200',
          Expulsion: 'bg-red-50 text-red-700 border-red-200',
          Other: 'bg-slate-100 text-slate-700 border-slate-300',
        }
        return (
          <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${typeColors[r.exitType] || typeColors.Other}`}>
            {r.exitType}
          </span>
        )
      },
    },
    {
      header: 'Clearance Status',
      accessor: 'obligations',
      cell: (r) => {
        const obs = r.obligations || {}
        const total = 4
        const cleared = Object.values(obs).filter(Boolean).length
        const isAllCleared = cleared === total
        return (
          <div className="flex items-center gap-1.5">
            {isAllCleared ? (
              <span className="flex items-center text-[11px] font-semibold text-emerald-600 gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Cleared (4/4)
              </span>
            ) : (
              <span className="flex items-center text-[11px] font-semibold text-amber-600 gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Pending ({cleared}/4)
              </span>
            )}
          </div>
        )
      },
    },
    {
      header: 'Request Date',
      accessor: 'requestDate',
      sortable: true,
      cell: (r) => <span className="text-xs text-slate-600">{r.requestDate}</span>,
    },
    {
      header: 'Effective Date',
      accessor: 'effectiveDate',
      sortable: true,
      cell: (r) => <span className="text-xs text-slate-600 font-medium">{r.effectiveDate || '—'}</span>,
    },
    {
      header: 'Status',
      accessor: 'status',
      sortable: true,
      cell: (r) => <StatusBadge status={r.status} />,
    },
    {
      header: 'Actions',
      accessor: 'actions',
      cell: (r) => (
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenReview(r)}
            className="h-8 px-2 text-xs"
          >
            <Eye className="w-3.5 h-3.5 mr-1" /> Dossier
          </Button>

          {r.status !== 'Completed' && r.status !== 'Rejected' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleOpenComplete(r)}
              className="h-8 px-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" /> Finalize Exit
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <>
      <DataTable
        columns={columns}
        data={exits}
        loading={loading}
        emptyMessage="No student exit dossiers found."
      />

      {/* View Clearance Summary Dialog */}
      {selectedExit && (
        <AlertDialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-red-600" />
              Student Exit & Clearance Review: {selectedExit.studentName}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-3 text-left text-slate-600 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Number</span>
                  <span className="font-mono text-slate-800 font-semibold">{selectedExit.studentNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Exit Type</span>
                  <span className="text-slate-800 font-semibold">{selectedExit.exitType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Effective Date</span>
                  <span className="text-slate-800">{selectedExit.effectiveDate || 'Pending Finalization'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Status</span>
                  <span className="text-slate-800 font-semibold">{selectedExit.status}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-2">Institutional Obligation Clearance</h4>
                <div className="space-y-2 border border-slate-200 rounded-lg p-3 bg-white">
                  <div className="flex items-center justify-between text-xs">
                    <span>Accounts & Outstanding Tuition Fees</span>
                    {selectedExit.obligations?.feesCleared ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Dues Outstanding
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Library Catalog & Book Returns</span>
                    {selectedExit.obligations?.libraryCleared ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                      </span>
                    ) : (
                      <span className="text-red-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> 1 Unreturned Book
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Laboratory Apparatus & Equipment</span>
                    {selectedExit.obligations?.labEquipmentCleared ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Cleared
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Pending Lab Sign-off
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Original Certificates / Documents Returned</span>
                    {selectedExit.obligations?.documentsReturned ? (
                      <span className="text-emerald-600 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Handed Over
                      </span>
                    ) : (
                      <span className="text-amber-600 font-semibold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> Custody with Registrar
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {selectedExit.reason && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Exit Reason / Notes</span>
                  <p className="text-slate-700 italic">{selectedExit.reason}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialog>
      )}

      {/* Confirm Finalize Exit Dialog */}
      {selectedExit && (
        <AlertDialog open={confirmCompleteOpen} onOpenChange={setConfirmCompleteOpen}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600 flex items-center gap-2">
              <LogOut className="w-5 h-5" />
              Confirm Student Final Exit
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2 text-slate-600 text-xs">
              <p>
                Are you sure you want to finalize the departure of{' '}
                <strong className="text-slate-900">{selectedExit.studentName}</strong>?
              </p>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-[11px] leading-relaxed">
                <strong>Important Notice:</strong> Finalizing the exit will mark the student's status as <strong>Exited</strong> across all institutional systems. Existing fee and asset obligations will be archived with the student profile.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (onCompleteExit) onCompleteExit(selectedExit.id)
                setConfirmCompleteOpen(false)
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Confirm Exit Completion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
      )}
    </>
  )
}
