// src/modules/students/components/StudentAcademicProfile.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { BookOpen, Calendar, MapPin, Award, CheckCircle2 } from 'lucide-react'

export function StudentAcademicProfile({ currentRecord, academicHistory = [] }) {
  return (
    <div className="space-y-6">
      {/* 1. Current Academic Enrolment */}
      <Card className="border-slate-200 shadow-xs bg-white">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase text-slate-700 flex items-center gap-1.5">
            <BookOpen className="h-4 w-4 text-blue-600" /> Current Academic Enrolment
          </CardTitle>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active Enrolment
          </span>
        </CardHeader>
        <CardContent className="pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-400 text-[11px]">Academic Year</span>
            <div className="font-bold text-slate-900 mt-0.5">{currentRecord?.academicYearName || '2026-2027'}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-400 text-[11px]">Campus</span>
            <div className="font-bold text-slate-900 mt-0.5">{currentRecord?.campusName || 'Hyderabad Main Campus'}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-400 text-[11px]">Class & Section</span>
            <div className="font-bold text-slate-900 mt-0.5">{currentRecord?.className} — {currentRecord?.sectionName}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="text-slate-400 text-[11px]">Roll Number</span>
            <div className="font-mono font-bold text-blue-600 mt-0.5">{currentRecord?.rollNumber || '—'}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200 sm:col-span-2">
            <span className="text-slate-400 text-[11px]">Program</span>
            <div className="font-bold text-slate-900 mt-0.5">{currentRecord?.programName}</div>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200 sm:col-span-2">
            <span className="text-slate-400 text-[11px]">Course / Stream</span>
            <div className="font-bold text-slate-900 mt-0.5">{currentRecord?.courseName}</div>
          </div>
        </CardContent>
      </Card>

      {/* 2. Versioned Academic History Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Academic History & Progress</CardTitle>
            <p className="text-[11px] text-slate-500">
              Institutional progression record versioned per academic year
            </p>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Academic Year</th>
                  <th className="px-3 py-2.5">Program</th>
                  <th className="px-3 py-2.5">Class</th>
                  <th className="px-3 py-2.5">Section</th>
                  <th className="px-3 py-2.5">Campus</th>
                  <th className="px-3 py-2.5">Status</th>
                  <th className="px-3 py-2.5">Enrolment Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {academicHistory.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-slate-400">
                      No academic history records found.
                    </td>
                  </tr>
                ) : (
                  academicHistory.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50/60">
                      <td className="px-3 py-2.5 font-bold text-slate-900">{rec.academicYearName}</td>
                      <td className="px-3 py-2.5 font-medium text-slate-800">{rec.programName}</td>
                      <td className="px-3 py-2.5 font-semibold text-slate-800">{rec.className}</td>
                      <td className="px-3 py-2.5 text-slate-600">{rec.sectionName}</td>
                      <td className="px-3 py-2.5 text-slate-600">{rec.campusName}</td>
                      <td className="px-3 py-2.5">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            rec.status === 'Current'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {rec.status}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-500 font-mono text-[11px]">{rec.enrolmentDate || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
