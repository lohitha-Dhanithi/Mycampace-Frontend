// src/modules/admissions/components/LeadPipeline.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import { LEAD_STAGES, LEAD_STAGE_TRANSITIONS } from '../config/admissionStatusConfig'
import {
  User,
  Phone,
  Mail,
  Calendar,
  ArrowRight,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function LeadPipeline({ leads = [], onStageChange }) {
  const navigate = useNavigate()
  const [selectedLeadForMove, setSelectedLeadForMove] = useState(null)

  const handleAdvance = (lead) => {
    const validNextStages = LEAD_STAGE_TRANSITIONS[lead.stage] || []
    if (validNextStages.length > 0) {
      const nextStage = validNextStages[0]
      if (onStageChange) {
        onStageChange(lead.id, nextStage)
      }
    }
  }

  const handleStageSelect = (leadId, targetStage) => {
    if (onStageChange) {
      onStageChange(leadId, targetStage)
    }
    setSelectedLeadForMove(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Click stage arrows or badges to advance candidate through the CRM pipeline</span>
        <span>Showing {leads.length} total active candidates</span>
      </div>

      {/* Kanban Board Container with horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-1 min-h-[500px]">
        {LEAD_STAGES.map((stage) => {
          const stageLeads = leads.filter(
            (l) => l.stage?.toLowerCase() === stage.id.toLowerCase()
          )

          return (
            <div
              key={stage.id}
              className="flex-shrink-0 w-72 bg-slate-100/70 border border-slate-200/90 rounded-lg flex flex-col max-h-[700px]"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-slate-200 bg-white/70 rounded-t-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">{stage.label}</span>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700">
                    {stageLeads.length}
                  </span>
                </div>
              </div>

              {/* Lead Cards List */}
              <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                {stageLeads.length === 0 ? (
                  <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded">
                    No candidates in {stage.label}
                  </div>
                ) : (
                  stageLeads.map((lead) => {
                    const validNext = LEAD_STAGE_TRANSITIONS[lead.stage] || []

                    return (
                      <Card
                        key={lead.id}
                        className="border-slate-200 hover:border-blue-400 transition-all shadow-2xs hover:shadow-xs bg-white"
                      >
                        <CardContent className="p-3 space-y-2">
                          {/* Card top */}
                          <div className="flex items-start justify-between gap-1">
                            <div>
                              <h4
                                onClick={() => navigate(`/admissions/leads/${lead.id}`)}
                                className="text-xs font-bold text-slate-900 hover:text-blue-600 cursor-pointer truncate max-w-[160px]"
                              >
                                {lead.fullName}
                              </h4>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {lead.leadNumber}
                              </span>
                            </div>
                            <span
                              className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${
                                lead.priority === 'High'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : lead.priority === 'Medium'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600 border border-slate-200'
                              }`}
                            >
                              {lead.priority}
                            </span>
                          </div>

                          {/* Program & Source */}
                          <div className="space-y-0.5 text-[11px]">
                            <div className="text-slate-700 font-medium truncate">
                              {lead.programName || 'Academic Program'}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center justify-between">
                              <span>Src: {lead.source || 'Website'}</span>
                              <span>{lead.campusName?.split(' ')[0] || 'Campus'}</span>
                            </div>
                          </div>

                          {/* Counsellor & Next Followup */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                            <span className="truncate max-w-[110px]" title={lead.counsellorName}>
                              👤 {lead.counsellorName || 'Unassigned'}
                            </span>
                            {lead.nextFollowup && (
                              <span className="text-blue-600 font-medium">
                                📅 {lead.nextFollowup}
                              </span>
                            )}
                          </div>

                          {/* Quick stage transition button */}
                          {validNext.length > 0 && (
                            <div className="pt-1 flex items-center justify-between gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleAdvance(lead)}
                                className="h-6 text-[10px] w-full text-blue-600 border-blue-200 hover:bg-blue-50 gap-1"
                              >
                                Advance to {validNext[0]} <ArrowRight className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
