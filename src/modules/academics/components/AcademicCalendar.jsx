// src/modules/academics/components/AcademicCalendar.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  Users,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Filter,
  CheckCircle2,
  Trash2,
  XCircle,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { EVENT_TYPES } from '../config/academicEventConfig'
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'

export function AcademicCalendar({
  events = [],
  loading = false,
  onPublishEvent,
  onCancelEvent,
  onDeleteEvent,
}) {
  const navigate = useNavigate()
  const [viewMode, setViewMode] = useState('list') // 'month', 'week', 'list'
  const [selectedType, setSelectedType] = useState('all')
  const [targetEvent, setTargetEvent] = useState(null)
  const [confirmPublishOpen, setConfirmPublishOpen] = useState(false)
  const [confirmCancelOpen, setConfirmCancelOpen] = useState(false)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)

  const filteredEvents = events.filter((e) => {
    if (selectedType !== 'all' && e.eventType !== selectedType) return false
    return true
  })

  const getEventBadge = (type) => {
    const found = EVENT_TYPES.find((t) => t.id === type)
    return found ? (
      <span className={`inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border ${found.color}`}>
        {found.label}
      </span>
    ) : (
      <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700">
        Academic Event
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <CalendarDays className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Institutional Academic Calendar</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Master schedule of term sessions, examinations, holidays, and stakeholder conferences for AY 2026–2027.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1.5 rounded-md transition-all ${viewMode === 'month' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'}`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-md transition-all ${viewMode === 'week' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'}`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md transition-all ${viewMode === 'list' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-600'}`}
            >
              List Agenda
            </button>
          </div>

          <Button
            size="sm"
            onClick={() => navigate('/academics/academic-calendar/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-9"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Schedule Event
          </Button>
        </div>
      </div>

      {/* Type Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-3 py-1 rounded-full font-semibold border transition-all ${
            selectedType === 'all'
              ? 'bg-slate-900 text-white border-slate-900'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          }`}
        >
          All Events ({events.length})
        </button>
        {EVENT_TYPES.slice(0, 6).map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`px-3 py-1 rounded-full font-semibold border transition-all ${
              selectedType === t.id
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* List / Month / Week View */}
      {viewMode === 'list' && (
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-slate-500" />
              Scheduled Milestones ({filteredEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-100">
            {filteredEvents.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">No scheduled events match current filter.</div>
            ) : (
              filteredEvents.map((evt) => (
                <div key={evt.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-3.5">
                    <div className="text-center p-2.5 bg-slate-100 rounded-xl border border-slate-200 min-w-[60px]">
                      <span className="text-[10px] uppercase font-bold text-slate-500 block">
                        {new Date(evt.startDate).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-black text-slate-900 block leading-tight">
                        {new Date(evt.startDate).getDate()}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-xs text-slate-900">{evt.eventName}</h4>
                        {getEventBadge(evt.eventType)}
                        <StatusBadge status={evt.status} />
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1">{evt.description}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {evt.startTime} - {evt.endTime}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {evt.campusName || 'Hyderabad Main'}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" /> Audience: {evt.audience || 'All'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {evt.status === 'Draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setTargetEvent(evt)
                          setConfirmPublishOpen(true)
                        }}
                        className="text-xs h-7 text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                      >
                        Publish
                      </Button>
                    )}

                    {evt.status === 'Published' && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setTargetEvent(evt)
                          setConfirmCancelOpen(true)
                        }}
                        className="text-xs h-7 text-amber-700 hover:bg-amber-50"
                      >
                        Cancel Event
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        setTargetEvent(evt)
                        setConfirmDeleteOpen(true)
                      }}
                      className="text-xs h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Month / Week Grid Calendar Demonstration */}
      {(viewMode === 'month' || viewMode === 'week') && (
        <Card className="border-slate-200 shadow-xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 w-7 p-0"><ChevronLeft className="w-3.5 h-3.5" /></Button>
              <span className="font-bold text-xs text-slate-800">October 2026</span>
              <Button variant="outline" size="sm" className="h-7 w-7 p-0"><ChevronRight className="w-3.5 h-3.5" /></Button>
            </div>
            <span className="text-[11px] text-slate-400">Academic Term 1 Active</span>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 mb-2">
              <div>SUN</div><div>MON</div><div>TUE</div><div>WED</div><div>THU</div><div>FRI</div><div>SAT</div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-xs">
              {Array.from({ length: 31 }).map((_, i) => {
                const day = i + 1
                const hasExam = day >= 12 && day <= 20
                const hasHoliday = day >= 21 && day <= 25
                const hasPTM = day === 28
                return (
                  <div
                    key={day}
                    className={`min-h-[70px] p-1.5 rounded-lg border text-left flex flex-col justify-between ${
                      hasExam
                        ? 'bg-red-50/50 border-red-200'
                        : hasHoliday
                        ? 'bg-amber-50/50 border-amber-200'
                        : hasPTM
                        ? 'bg-purple-50/50 border-purple-200'
                        : 'bg-slate-50/40 border-slate-100'
                    }`}
                  >
                    <span className="font-bold text-slate-700 text-[11px]">{day}</span>
                    {hasExam && (
                      <span className="text-[9px] font-bold text-red-700 bg-red-100 px-1 py-0.5 rounded truncate">
                        Midterm Exam
                      </span>
                    )}
                    {hasHoliday && (
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1 py-0.5 rounded truncate">
                        Recess
                      </span>
                    )}
                    {hasPTM && (
                      <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-1 py-0.5 rounded truncate">
                        PTM
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Publish Confirmation */}
      {targetEvent && (
        <AlertDialog open={confirmPublishOpen} onOpenChange={setConfirmPublishOpen}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-emerald-700">Publish Academic Event</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600">
              Publishing "{targetEvent.eventName}" will notify educators and display this event on public student calendars.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (onPublishEvent) onPublishEvent(targetEvent.id)
                setConfirmPublishOpen(false)
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              Publish Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
      )}

      {/* Cancel Confirmation */}
      {targetEvent && (
        <AlertDialog open={confirmCancelOpen} onOpenChange={setConfirmCancelOpen}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-amber-700">Cancel Academic Event</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600">
              Are you sure you want to mark "{targetEvent.eventName}" as Cancelled?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Dismiss</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (onCancelEvent) onCancelEvent(targetEvent.id)
                setConfirmCancelOpen(false)
              }}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              Cancel Event
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
      )}

      {/* Delete Confirmation */}
      {targetEvent && (
        <AlertDialog open={confirmDeleteOpen} onOpenChange={setConfirmDeleteOpen}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Delete Event</AlertDialogTitle>
            <AlertDialogDescription className="text-xs text-slate-600">
              Are you sure you want to permanently remove "{targetEvent.eventName}" from the calendar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (onDeleteEvent) onDeleteEvent(targetEvent.id)
                setConfirmDeleteOpen(false)
              }}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialog>
      )}
    </div>
  )
}
