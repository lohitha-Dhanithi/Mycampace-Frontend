// src/modules/admissions/components/LeadProfile.tsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { CommunicationTimeline } from './CommunicationTimeline'
import { DocumentTable } from './DocumentTable'
import {
  User,
  Phone,
  Mail,
  Calendar,
  Building2,
  GraduationCap,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Plus,
  Edit,
  UserX,
  RotateCcw,
  FileCheck2,
  AlertCircle,
  CalendarPlus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface LeadProfileProps {
  lead: any
  followups?: any[]
  documents?: any[]
  onAdvanceStage?: (stage: any) => void
  onConvertToApplication?: (lead: any) => Promise<void> | void
  onScheduleFollowup?: (lead: any) => void
  onCloseLead?: (lead: any) => void
  onReopenLead?: (lead: any) => void
}

export function LeadProfile({
  lead,
  followups = [],
  documents = [],
  onAdvanceStage,
  onConvertToApplication,
  onScheduleFollowup,
  onCloseLead,
  onReopenLead,
}: LeadProfileProps) {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('overview')
  const [comms, setComms] = useState([
    {
      id: 'comm-lead-1',
      type: 'Phone',
      recipient: lead?.phone || '',
      sentBy: lead?.counsellorName || 'Admissions Desk',
      date: lead?.lastContact || '2026-09-30',
      status: 'Delivered',
      subject: 'Initial Inbound Inquiry Call',
      message: lead?.notes || 'Discussion regarding curriculum tracks and intake requirements.',
    },
  ])

  if (!lead) return null

  const isClosed = lead.status === 'Closed' || lead.stage === 'Lost'
  const isConverted = lead.stage === 'Converted' || Boolean(lead.applicationId)

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/app/admissions/leads')}
          className="gap-1.5 text-xs self-start border-slate-200 text-slate-700 hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Leads
        </Button>

        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/app/admissions/leads/${lead.id}/edit`)}
            className="gap-1.5 text-xs border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            <Edit className="h-3.5 w-3.5" /> Edit Lead
          </Button>

          {isClosed ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onReopenLead && onReopenLead(lead)}
              className="gap-1.5 text-xs text-slate-700 border-slate-200 hover:bg-slate-50 font-medium"
            >
              <RotateCcw className="h-3.5 w-3.5" /> Re-open Lead
            </Button>
          ) : isConverted ? (
            <Button
              size="sm"
              onClick={() => navigate('/app/admissions/applications')}
              className="gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium"
            >
              <FileCheck2 className="h-3.5 w-3.5" /> View Application
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onScheduleFollowup && onScheduleFollowup(lead)}
                className="gap-1.5 text-xs border-slate-200 text-slate-700 hover:bg-slate-50 font-medium"
              >
                <CalendarPlus className="h-3.5 w-3.5 text-slate-500" /> Schedule Follow-up
              </Button>

              <Button
                size="sm"
                onClick={() => onConvertToApplication && onConvertToApplication(lead)}
                className="gap-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium shadow-xs"
              >
                <CheckCircle2 className="h-3.5 w-3.5" /> Convert to Application
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => onCloseLead && onCloseLead(lead)}
                className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              >
                <UserX className="h-3.5 w-3.5" /> Close Lead
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Closure Banner if Closed */}
      {isClosed && (
        <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5 text-red-800">
            <UserX className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">
                Lead Closed as Lost on {lead.closedDate || 'Recent'}
              </div>
              <div className="text-[11px] text-red-700 mt-0.5">
                <strong>Reason:</strong> {lead.closureReason || 'Dropped from pipeline'}{' '}
                {lead.competitorName && `(Competitor: ${lead.competitorName})`}
                {lead.closureNotes && ` — "${lead.closureNotes}"`}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onReopenLead && onReopenLead(lead)}
            className="h-7 text-xs border-red-200 bg-white text-red-800 hover:bg-red-50 font-medium shrink-0"
          >
            Re-open This Lead
          </Button>
        </div>
      )}

      {/* Header Profile Summary */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-slate-900 text-white font-extrabold text-xl flex items-center justify-center shrink-0">
              {lead.fullName?.slice(0, 2).toUpperCase() || 'LD'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">{lead.fullName}</h2>
                {isClosed ? (
                  <span className="text-[11px] font-semibold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                    Closed (Lost)
                  </span>
                ) : (
                  <StatusBadge status={lead.stage} />
                )}
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    lead.priority === 'High'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-slate-100 text-slate-700 border border-slate-200'
                  }`}
                >
                  {lead.priority} Priority
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-4 flex-wrap">
                <span>
                  Lead ID: <strong className="text-slate-700 font-mono">{lead.leadNumber}</strong>
                </span>
                <span>
                  Assigned: <strong className="text-slate-700">{lead.counsellorName || 'Unassigned'}</strong>
                </span>
                <span>Created: {lead.createdDate}</span>
                <span>Source: {lead.source}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Next Scheduled Follow-up</div>
              <div className="text-xs font-bold text-slate-800">
                {lead.nextFollowup ? `📅 ${lead.nextFollowup}` : 'None scheduled'}
              </div>
            </div>
            {!isClosed && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onScheduleFollowup && onScheduleFollowup(lead)}
                className="text-xs h-8 text-slate-700 border-slate-200 hover:bg-slate-50"
              >
                + Follow-up
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="academic">Academic Interest</TabsTrigger>
          <TabsTrigger value="activity">Activity Timeline</TabsTrigger>
          <TabsTrigger value="followups">Follow-ups ({followups.length})</TabsTrigger>
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="documents">Documents ({documents.length})</TabsTrigger>
        </TabsList>

        {/* 1. Overview */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" /> Personal & Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-500">Full Name</span>
                  <span className="font-semibold text-slate-800">{lead.fullName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-500">Primary Mobile</span>
                  <span className="font-mono text-slate-800">{lead.phone}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-500">Email Address</span>
                  <span className="text-slate-800">{lead.email || '—'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-500">Gender & DOB</span>
                  <span className="text-slate-800">{lead.gender || '—'} • {lead.dob || '—'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-slate-500" /> Academic & Program Preference
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-500">Target Campus</span>
                  <span className="font-semibold text-slate-800">{lead.campusName || 'Hyderabad Main Campus'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-500">Academic Session</span>
                  <span className="text-slate-800">{lead.academicYearName || '2026–27'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-500">Program / Level</span>
                  <span className="font-semibold text-slate-800">{lead.programName || 'Senior Secondary'}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <span className="text-slate-500">Stream / Course</span>
                  <span className="text-slate-800">{lead.courseName || 'Science Stream (PCM / PCB)'}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* 2. Academic Interest */}
        <TabsContent value="academic" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="p-5 text-xs space-y-3">
              <h3 className="font-bold text-slate-800">Academic Background & Expectations</h3>
              <p className="text-slate-600">
                Candidate is interested in admission for <strong>{lead.courseName || 'Senior Secondary'}</strong> track under <strong>{lead.campusName || 'Main Campus'}</strong>.
              </p>
              {lead.notes && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 mt-2">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase">Counselling Note:</div>
                  <div className="text-slate-700 mt-1">{lead.notes}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Activity Timeline */}
        <TabsContent value="activity" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="p-5">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
                <div className="relative">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-slate-900 border-2 border-white" />
                  <div className="font-bold text-slate-800">Lead Registered in CRM</div>
                  <div className="text-[11px] text-slate-500">{lead.createdDate} • Channel: {lead.source}</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-slate-600 border-2 border-white" />
                  <div className="font-bold text-slate-800">Assigned to Counsellor {lead.counsellorName}</div>
                  <div className="text-[11px] text-slate-500">Auto-routed via Admissions workload distribution</div>
                </div>
                {lead.lastContact && (
                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-emerald-600 border-2 border-white" />
                    <div className="font-bold text-slate-800">Contact / Interaction Logged</div>
                    <div className="text-[11px] text-slate-500">{lead.lastContact} • Stage: {lead.stage}</div>
                  </div>
                )}
                {isClosed && (
                  <div className="relative">
                    <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-red-600 border-2 border-white" />
                    <div className="font-bold text-red-700">Lead Closed (Lost)</div>
                    <div className="text-[11px] text-red-600">
                      {lead.closedDate} • Reason: {lead.closureReason}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Follow-ups */}
        <TabsContent value="followups" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase text-slate-700">Follow-up Schedule</CardTitle>
              {!isClosed && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onScheduleFollowup && onScheduleFollowup(lead)}
                  className="text-xs h-7 border-slate-200 hover:bg-slate-50"
                >
                  + Schedule Follow-up
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-4">
              {followups.length === 0 ? (
                <div className="text-center p-6 text-slate-400 text-xs">
                  No follow-ups recorded for this lead yet.
                </div>
              ) : (
                <div className="space-y-3">
                  {followups.map((fol) => (
                    <div
                      key={fol.id}
                      className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="font-semibold text-slate-800 flex items-center gap-2">
                          <span>{fol.type}</span>
                          <span className="text-slate-400">•</span>
                          <span>{fol.followupDate} at {fol.followupTime}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{fol.purpose}</p>
                        {fol.notes && <p className="text-[10px] text-slate-400 mt-0.5">{fol.notes}</p>}
                      </div>
                      <StatusBadge status={fol.status} />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 5. Communication */}
        <TabsContent value="communication" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="p-5">
              <CommunicationTimeline
                communications={comms}
                onSendMessage={(newComm) => setComms([newComm, ...comms])}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* 6. Documents */}
        <TabsContent value="documents" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase text-slate-700">Uploaded Applicant Records</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <DocumentTable documents={documents} allowActions={true} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
