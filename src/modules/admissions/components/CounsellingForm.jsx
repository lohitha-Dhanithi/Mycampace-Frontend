// src/modules/admissions/components/CounsellingForm.jsx
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { userService } from '@/services/userService'
import { leadService } from '../services/leadService'
import { enquiryService } from '../services/enquiryService'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, Save } from 'lucide-react'

export function CounsellingForm({ onSubmit }) {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [counsellors, setCounsellors] = useState([])
  const [selectedCandidateId, setSelectedCandidateId] = useState('')

  const [formData, setFormData] = useState({
    leadId: '',
    enquiryId: '',
    applicantName: '',
    applicantContact: '',
    programName: '',
    campusName: '',
    counsellorId: '',
    counsellorName: '',
    date: new Date().toISOString().split('T')[0],
    time: '11:00 AM',
    mode: 'Campus Visit',
    locationOrLink: 'Admissions Office, Room 102',
    notes: '',
  })

  useEffect(() => {
    const loadResources = async () => {
      const [leads, enquiries, users] = await Promise.all([
        leadService.getLeads(),
        enquiryService.getEnquiries(),
        userService.getUsers({ status: 'Active' }),
      ])

      const candidateList = [
        ...enquiries.map((e) => ({
          type: 'Enquiry',
          id: e.id,
          enquiryId: e.id,
          leadId: e.leadId,
          name: e.applicantName,
          phone: e.phone,
          program: e.programName,
          campus: e.campusName,
        })),
        ...leads.map((l) => ({
          type: 'Lead',
          id: l.id,
          leadId: l.id,
          enquiryId: l.enquiryId,
          name: l.fullName,
          phone: l.phone,
          program: l.programName,
          campus: l.campusName,
        })),
      ]

      setCandidates(candidateList)
      setCounsellors(users)

      if (candidateList.length > 0) {
        const first = candidateList[0]
        setSelectedCandidateId(first.id)
        setFormData((prev) => ({
          ...prev,
          leadId: first.leadId || '',
          enquiryId: first.enquiryId || '',
          applicantName: first.name,
          applicantContact: first.phone,
          programName: first.program || 'Senior Secondary Education',
          campusName: first.campus || 'Hyderabad Main Campus',
          counsellorId: users[0]?.id || '',
          counsellorName: users[0]?.name || '',
        }))
      }
    }
    loadResources()
  }, [])

  const handleCandidateChange = (candId) => {
    setSelectedCandidateId(candId)
    const cand = candidates.find((c) => c.id === candId)
    if (cand) {
      setFormData((prev) => ({
        ...prev,
        leadId: cand.leadId || '',
        enquiryId: cand.enquiryId || '',
        applicantName: cand.name,
        applicantContact: cand.phone,
        programName: cand.program || '',
        campusName: cand.campus || '',
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => navigate('/admissions/counselling')}
          className="gap-1.5 text-xs"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Counselling
        </Button>
        <Button type="submit" size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs">
          <Save className="h-3.5 w-3.5" /> Schedule Session
        </Button>
      </div>

      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">Applicant Selection</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Select Existing Lead or Enquiry *</label>
            <Select
              value={selectedCandidateId}
              onChange={(e) => handleCandidateChange(e.target.value)}
            >
              {candidates.map((c, i) => (
                <option key={`${c.id}-${i}`} value={c.id}>
                  [{c.type}] {c.name} — {c.phone} ({c.program})
                </option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded border border-slate-200">
            <div>
              <span className="text-slate-500">Applicant:</span>{' '}
              <strong className="text-slate-800">{formData.applicantName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Phone:</span>{' '}
              <strong className="text-slate-800">{formData.applicantContact}</strong>
            </div>
            <div>
              <span className="text-slate-500">Program:</span>{' '}
              <strong className="text-slate-800">{formData.programName}</strong>
            </div>
            <div>
              <span className="text-slate-500">Campus:</span>{' '}
              <strong className="text-slate-800">{formData.campusName}</strong>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">Session Schedule & Mode</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Assigned Counsellor *</label>
            <Select
              value={formData.counsellorId}
              onChange={(e) => {
                const usr = counsellors.find((u) => u.id === e.target.value)
                setFormData({
                  ...formData,
                  counsellorId: e.target.value,
                  counsellorName: usr?.name || '',
                })
              }}
            >
              {counsellors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.role})
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Counselling Mode *</label>
            <Select
              value={formData.mode}
              onChange={(e) => setFormData({ ...formData, mode: e.target.value })}
            >
              <option value="Campus Visit">Campus Visit & Tour</option>
              <option value="In Person">In Person (Office Meeting)</option>
              <option value="Video">Video Call (Google Meet / Zoom)</option>
              <option value="Phone">Phone Call</option>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Date *</label>
            <Input
              type="date"
              required
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Time *</label>
            <Input
              type="text"
              required
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              placeholder="e.g. 11:30 AM"
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">Location or Meeting Link</label>
            <Input
              value={formData.locationOrLink}
              onChange={(e) => setFormData({ ...formData, locationOrLink: e.target.value })}
              placeholder="e.g. Room 204 or https://meet.google.com/..."
            />
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-xs font-semibold text-slate-700">Session Notes & Objectives</label>
            <Textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Topics to address: scholarships, syllabus comparison, hostel accommodations..."
            />
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
