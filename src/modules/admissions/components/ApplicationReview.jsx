// src/modules/admissions/components/ApplicationReview.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { DocumentTable } from './DocumentTable'
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  FileQuestion,
  HelpCircle,
  AlertTriangle,
  FileCheck,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ApplicationReview({
  application,
  documents = [],
  onVerifyDoc,
  onRejectDoc,
  onSubmitDecision,
}) {
  const navigate = useNavigate()

  const [decision, setDecision] = useState('Approve')
  const [comments, setComments] = useState(application?.reviewData?.reviewerComments || '')
  const [conditionalTerms, setConditionalTerms] = useState(application?.reviewData?.conditionalTerms || '')
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!application) return null

  const handleTriggerDecision = () => {
    setConfirmOpen(true)
  }

  const handleConfirmDecision = () => {
    setConfirmOpen(false)
    if (onSubmitDecision) {
      onSubmitDecision({
        decision,
        comments,
        conditionalTerms,
        reviewerName: 'Dr. Radhakrishnan Murthy (Director)',
      })
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(`/admissions/applications/${application.id}`)}
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Application
        </Button>
        <div className="flex items-center gap-2">
          <StatusBadge status={application.status} />
        </div>
      </div>

      {/* 1. Applicant & Program Summary */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center justify-between">
            <span>Applicant & Academic Target</span>
            <span className="font-mono text-xs text-blue-600 font-semibold">{application.applicationNumber}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500">Applicant:</span>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{application.applicantName}</div>
            <div className="text-[11px] text-slate-500">{application.contact?.mobile}</div>
          </div>
          <div>
            <span className="text-slate-500">Target Program:</span>
            <div className="font-bold text-slate-900 mt-0.5">{application.academicInterest?.programName}</div>
            <div className="text-[11px] text-slate-500">{application.academicInterest?.courseName}</div>
          </div>
          <div>
            <span className="text-slate-500">Target Campus:</span>
            <div className="font-bold text-slate-900 mt-0.5">{application.academicInterest?.campusName}</div>
            <div className="text-[11px] text-slate-500">Academic Year: {application.academicInterest?.academicYearName}</div>
          </div>
          <div>
            <span className="text-slate-500">Prior Academic Record:</span>
            <div className="font-bold text-emerald-700 mt-0.5">{application.previousAcademic?.percentage || '92.5%'}</div>
            <div className="text-[11px] text-slate-500">{application.previousAcademic?.qualification}</div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Document Verification Workspace */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-blue-600" /> Document Verification Workspace
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <DocumentTable
            documents={documents}
            onVerify={onVerifyDoc}
            onReject={onRejectDoc}
            allowActions={true}
          />
        </CardContent>
      </Card>

      {/* 3. Reviewer Evaluation & Decision Panel */}
      <Card className="border-slate-200 shadow-xs bg-slate-50/50">
        <CardHeader className="pb-3 border-b border-slate-200">
          <CardTitle className="text-sm font-bold text-slate-900">
            Admissions Committee Evaluation & Decision
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Official Decision *</label>
            <Select value={decision} onChange={(e) => setDecision(e.target.value)}>
              <option value="Approve">Approve (Offer Full Admission)</option>
              <option value="Conditionally Approve">Conditionally Approve (Provisional Offer)</option>
              <option value="Request Documents">Request Documents (Send Back for Rectification)</option>
              <option value="Reject">Reject (Decline Application)</option>
            </Select>
          </div>

          {decision === 'Conditionally Approve' && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">Conditional Terms *</label>
              <Input
                placeholder="e.g. Subject to original TC and migration certificate submission by Oct 15"
                value={conditionalTerms}
                onChange={(e) => setConditionalTerms(e.target.value)}
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Reviewer Notes & Feedback *</label>
            <Textarea
              rows={4}
              required
              placeholder="Record evaluation rationale, interview score, or feedback for the committee and applicant..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              type="button"
              onClick={handleTriggerDecision}
              className={`text-xs font-semibold gap-1.5 ${
                decision === 'Reject'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : decision === 'Approve'
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Confirm & Submit Decision: {decision}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Alert Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <AlertTriangle className="h-4 w-4 text-amber-600" /> Confirm Admission Decision
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to transition application <strong>{application.applicationNumber}</strong> to <strong>{decision}</strong>? This decision will update the applicant workflow status and dispatch formal communications.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmOpen(false)}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmDecision}
            variant={decision === 'Reject' ? 'destructive' : 'default'}
          >
            Yes, Apply Decision
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  )
}
