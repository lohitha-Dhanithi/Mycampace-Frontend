// src/modules/admissions/components/LeadProfile.jsx
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
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export interface LeadProfileProps {
  lead: any
  followups?: any[]
  documents?: any[]
  onAdvanceStage?: (stage: any) => void
  onConvertToEnquiry?: (leadId: any) => Promise<void> | void
  onScheduleFollowup?: (lead: any) => void
}

export function LeadProfile({
  lead,
  followups = [],
  documents = [],
  onAdvanceStage,
  onConvertToEnquiry,
  onScheduleFollowup,
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

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate('/admissions/leads')}
          className="gap-1.5 text-xs self-start"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Leads
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admissions/leads/${lead.id}/edit`)}
            className="gap-1.5 text-xs"
          >
            <Edit className="h-3.5 w-3.5" /> Edit Lead
          </Button>
          {!lead.enquiryId && (
            <Button
              size="sm"
              onClick={() => onConvertToEnquiry && onConvertToEnquiry(lead.id)}
              className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5" /> Convert to Enquiry
            </Button>
          )}
          {lead.enquiryId && (
            <span className="text-xs px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              Enquiry Linked: {lead.enquiryId}
            </span>
          )}
        </div>
      </div>

      {/* Header Profile Summary */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-blue-100 text-blue-700 font-extrabold text-xl flex items-center justify-center shrink-0 border-2 border-blue-200">
              {lead.fullName?.slice(0, 2).toUpperCase() || 'LD'}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">{lead.fullName}</h2>
                <StatusBadge status={lead.stage} />
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    lead.priority === 'High'
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {lead.priority} Priority
                </span>
              </div>
              <div className="text-xs text-slate-500 flex items-center gap-4 flex-wrap">
                <span>Lead ID: <strong className="text-slate-700 font-mono">{lead.leadNumber}</strong></span>
                <span>Assigned: <strong className="text-slate-700">{lead.counsellorName || 'Unassigned'}</strong></span>
                <span>Created: {lead.createdDate}</span>
                <span>Source: {lead.source}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto border-t md:border-t-0 pt-3 md:pt-0 w-full md:w-auto justify-between md:justify-end">
            <div className="text-right">
              <div className="text-[11px] text-slate-400">Next Scheduled Follow-up</div>
              <div className="text-xs font-bold text-blue-600">
                {lead.nextFollowup ? `📅 ${lead.nextFollowup}` : 'None scheduled'}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onScheduleFollowup && onScheduleFollowup(lead)}
              className="text-xs h-8 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              + Follow-up
            </Button>
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
                <CardTitle className="text-xs font-bold uppercase text-slate-700">Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">First Name</span>
                  <span className="font-semibold text-slate-800">{lead.firstName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Last Name</span>
                  <span className="font-semibold text-slate-800">{lead.lastName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Date of Birth</span>
                  <span className="font-semibold text-slate-800">{lead.dob || '—'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Gender</span>
                  <span className="font-semibold text-slate-800">{lead.gender || '—'}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-xs">
              <CardHeader className="pb-3 border-b border-slate-100">
                <CardTitle className="text-xs font-bold uppercase text-slate-700">Contact Details</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Mobile Phone</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Phone className="h-3 w-3 text-slate-400" /> {lead.phone}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Email Address</span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                    <Mail className="h-3 w-3 text-slate-400" /> {lead.email}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Alternate Contact</span>
                  <span className="font-semibold text-slate-800">{lead.alternateContact || 'None provided'}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notes Card */}
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase text-slate-700">Counseling & Intake Notes</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200">
                {lead.notes || 'No specific notes recorded for this prospective student.'}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 2. Academic Interest */}
        <TabsContent value="academic" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-xs font-bold uppercase text-slate-700">Configured Academic Target</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">Academic Year</span>
                <div className="font-bold text-slate-900">{lead.academicYearName || '2026-2027'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">Campus Facility</span>
                <div className="font-bold text-slate-900">{lead.campusName || 'Hyderabad Main Campus'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">Program</span>
                <div className="font-bold text-slate-900">{lead.programName || 'Senior Secondary'}</div>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-slate-500 text-[11px]">Course / Stream</span>
                <div className="font-bold text-slate-900">{lead.courseName || 'Science Stream (PCM)'}</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 3. Activity Timeline */}
        <TabsContent value="activity" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardContent className="p-5">
              <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 text-xs">
                <div className="relative">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-blue-600 border-2 border-white" />
                  <div className="font-bold text-slate-800">Lead Registered in CRM</div>
                  <div className="text-[11px] text-slate-500">{lead.createdDate} • Channel: {lead.source}</div>
                </div>
                <div className="relative">
                  <span className="absolute -left-6 top-1 h-3.5 w-3.5 rounded-full bg-amber-500 border-2 border-white" />
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 4. Follow-ups */}
        <TabsContent value="followups" className="mt-4">
          <Card className="border-slate-200 shadow-xs">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <CardTitle className="text-xs font-bold uppercase text-slate-700">Follow-up Schedule</CardTitle>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onScheduleFollowup && onScheduleFollowup(lead)}
                className="text-xs h-7"
              >
                + Schedule Follow-up
              </Button>
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
