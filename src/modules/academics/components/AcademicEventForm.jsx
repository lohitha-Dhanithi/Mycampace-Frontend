// src/modules/academics/components/AcademicEventForm.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { CalendarDays, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { EVENT_TYPES, AUDIENCE_TYPES } from '../config/academicEventConfig'

export function AcademicEventForm({ onSubmit, onCancel, submitting = false }) {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'academic_event',
    description: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startTime: '09:00 AM',
    endTime: '12:00 PM',
    campusId: 'camp-1',
    campusName: 'Hyderabad Main Campus',
    scope: 'Campus Wide',
    audience: 'all',
    status: 'Published',
  })

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="border-slate-200 shadow-xs bg-white">
      <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-600" />
            Schedule New Academic Event
          </CardTitle>
          <p className="text-xs text-slate-500 mt-0.5">
            Create academic milestones, examination terms, conferences, or recess holidays.
          </p>
        </div>
      </CardHeader>
      <CardContent className="pt-5">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Event Identification */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
              1. Event Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Event Name *</label>
                <Input
                  placeholder="e.g. Mid-Term Examination Assessment Term 1"
                  value={formData.eventName}
                  onChange={(e) => handleChange('eventName', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Event Classification *</label>
                <Select
                  value={formData.eventType}
                  onChange={(e) => handleChange('eventType', e.target.value)}
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Description / Notes</label>
              <textarea
                rows={2}
                placeholder="Detailed objectives, guidelines for parents or educators..."
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full text-xs rounded-lg border border-slate-200 p-2.5 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* 2. Schedule */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
              2. Schedule & Duration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Start Date *</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">End Date *</label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Start Time</label>
                <Input
                  placeholder="09:00 AM"
                  value={formData.startTime}
                  onChange={(e) => handleChange('startTime', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">End Time</label>
                <Input
                  placeholder="12:30 PM"
                  value={formData.endTime}
                  onChange={(e) => handleChange('endTime', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* 3. Scope & Audience */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-1">
              3. Scope & Target Stakeholders
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Campus Location</label>
                <Select
                  value={formData.campusId}
                  onChange={(e) => handleChange('campusId', e.target.value)}
                >
                  <option value="all">All Campuses</option>
                  <option value="camp-1">Hyderabad Main Campus</option>
                  <option value="camp-2">Bangalore Campus</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Academic Scope</label>
                <Select
                  value={formData.scope}
                  onChange={(e) => handleChange('scope', e.target.value)}
                >
                  <option value="Campus Wide">Campus Wide</option>
                  <option value="Senior Secondary">Senior Secondary (Grades 11-12)</option>
                  <option value="Secondary">Secondary (Grades 6-10)</option>
                  <option value="Primary">Primary (Grades 1-5)</option>
                </Select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Target Audience</label>
                <Select
                  value={formData.audience}
                  onChange={(e) => handleChange('audience', e.target.value)}
                >
                  {AUDIENCE_TYPES.map((a) => (
                    <option key={a.id} value={a.id}>{a.label}</option>
                  ))}
                </Select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel || (() => navigate('/academics/academic-calendar'))}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold"
            >
              {submitting ? 'Scheduling...' : 'Save & Publish Event'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
