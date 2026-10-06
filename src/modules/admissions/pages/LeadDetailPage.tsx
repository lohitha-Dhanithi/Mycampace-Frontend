// src/modules/admissions/pages/LeadDetailPage.jsx
import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { LeadProfile } from '../components/LeadProfile'
import { leadService } from '../services/leadService'
import { followUpService } from '../services/followUpService'
import { documentService } from '../services/documentService'
import { enquiryService } from '../services/enquiryService'
import { LoadingState } from '@/components/common/LoadingState'

export function LeadDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [lead, setLead] = useState(null)
  const [followups, setFollowups] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadLead = async () => {
    setLoading(true)
    try {
      const l = await leadService.getLeadById(id)
      if (l) {
        setLead(l)
        const [fols, docs] = await Promise.all([
          followUpService.getFollowUps({ search: l.fullName }),
          documentService.getAllDocuments({ search: l.fullName }),
        ])
        setFollowups(fols)
        setDocuments(docs)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLead()
  }, [id])

  const handleConvertToEnquiry = async (leadId) => {
    if (!lead) return
    const newEnq = await enquiryService.createEnquiry({
      leadId: lead.id,
      applicantName: lead.fullName,
      email: lead.email,
      phone: lead.phone,
      campusId: lead.campusId,
      campusName: lead.campusName,
      academicYearId: lead.academicYearId,
      academicYearName: lead.academicYearName,
      programId: lead.programId,
      programName: lead.programName,
      courseId: lead.courseId,
      courseName: lead.courseName,
      counsellorId: lead.counsellorId,
      counsellorName: lead.counsellorName,
      notes: lead.notes,
    })
    await leadService.convertLeadToEnquiry(leadId)
    loadLead()
  }

  if (loading) {
    return <LoadingState message="Loading candidate profile..." />
  }

  if (!lead) {
    return (
      <div className="p-8 text-center text-slate-500">
        Lead not found.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <LeadProfile
        lead={lead}
        followups={followups}
        documents={documents}
        onConvertToEnquiry={handleConvertToEnquiry}
      />
    </div>
  )
}
