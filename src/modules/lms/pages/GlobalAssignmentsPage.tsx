// src/modules/lms/pages/GlobalAssignmentsPage.jsx
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  ClipboardList,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ChevronRight,
  Calendar,
} from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { lmsAssignmentService } from '../services/lmsAssignmentService'
import { AssignmentCard } from '../components/AssignmentCard'

export function GlobalAssignmentsPage() {
  const [assignments, setAssignments] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAssignments()
  }, [])

  const loadAssignments = async () => {
    setLoading(true)
    try {
      const data = await lmsAssignmentService.getAllAssignments()
      setAssignments(data)
    } finally {
      setLoading(false)
    }
  }

  const filtered = assignments.filter((a) => {
    if (!search) return true
    return (
      a.title.toLowerCase().includes(a) ||
      a.instructions.toLowerCase().includes(a)
    )
  })

  return (
    <div className="space-y-6">
      <LMSNavigation />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded">
            Institutional Assessments
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Assignments & Problem Sets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor and grade student submissions across all academic programs.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments by title or instructions..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((asg) => (
          <AssignmentCard key={asg.id} assignment={asg} />
        ))}
      </div>
    </div>
  )
}
