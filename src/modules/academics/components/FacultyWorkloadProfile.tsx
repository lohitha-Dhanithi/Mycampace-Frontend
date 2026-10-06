// src/modules/academics/components/FacultyWorkloadProfile.jsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { UserCheck, Clock, Bookmark, Layers } from 'lucide-react'

export function FacultyWorkloadProfile({ faculty, onClose }) {
  if (!faculty) return null

  const assignments = faculty.assignments || []

  const chartData = assignments.map((a) => ({
    name: a.subjectName.split(' ')[0],
    hours: a.weeklyHours,
  }))

  return (
    <div className="space-y-5 pt-2 text-xs">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Department</span>
          <div className="text-slate-900 font-bold mt-1 truncate">{faculty.department}</div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Total Subjects</span>
          <div className="text-slate-900 font-bold text-lg mt-0.5">{faculty.subjectsCount}</div>
        </div>

        <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
          <span className="text-slate-400 font-bold uppercase text-[10px]">Total Classes</span>
          <div className="text-slate-900 font-bold text-lg mt-0.5">{faculty.classesCount}</div>
        </div>

        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <span className="text-blue-700 font-bold uppercase text-[10px]">Weekly Hours</span>
          <div className="text-blue-800 font-black text-lg mt-0.5">{faculty.assignedHours} / {faculty.capacityHours} hrs</div>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50">
          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Weekly Hours per Subject Assignment
          </span>
          <div className="h-36 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="hours" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Assignments Table */}
      <div>
        <span className="text-xs font-bold text-slate-800 block mb-2">Active Teaching Allocations</span>
        <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
          <div className="p-2.5 bg-slate-100 font-bold text-slate-600 grid grid-cols-12 text-[11px]">
            <div className="col-span-5">Subject</div>
            <div className="col-span-3">Class & Section</div>
            <div className="col-span-2">Weekly Hours</div>
            <div className="col-span-2 text-right">Role Type</div>
          </div>
          {assignments.map((ass, idx) => (
            <div key={idx} className="p-2.5 grid grid-cols-12 items-center hover:bg-slate-50/50">
              <div className="col-span-5 font-semibold text-slate-800">{ass.subjectName}</div>
              <div className="col-span-3 text-slate-600">{ass.className} ({ass.sectionName})</div>
              <div className="col-span-2 font-mono text-slate-800">{ass.weeklyHours} hrs</div>
              <div className="col-span-2 text-right">
                <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {ass.assignmentType}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button variant="outline" size="sm" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  )
}
