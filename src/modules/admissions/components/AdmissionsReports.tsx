// src/modules/admissions/components/AdmissionsReports.jsx
import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { admissionsReportService } from '../services/admissionsReportService'
import {
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Users,
  CheckCircle2,
} from 'lucide-react'

export function AdmissionsReports() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const res = await admissionsReportService.getReportData()
      setData(res)
      setLoading(false)
    }
    load()
  }, [])

  if (loading || !data) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading admissions reports...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* 1. Lead Sources */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-blue-600" /> Lead Acquisition Sources
            </CardTitle>
            <span className="text-[11px] text-slate-400 font-medium">120 Total Leads</span>
          </CardHeader>
          <CardContent className="pt-4 space-y-3">
            {data.leadSources.map((s, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-semibold text-slate-800">{s.name}</span>
                  <span className="text-slate-500 font-medium">{s.count} leads ({s.percentage})</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{ width: s.percentage }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* 2. Application Status Breakdown */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-emerald-600" /> Application Status Breakdown
            </CardTitle>
            <span className="text-[11px] text-slate-400 font-medium">93 Total Applications</span>
          </CardHeader>
          <CardContent className="pt-4 space-y-2.5">
            {data.applicationStatusBreakdown.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-50">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-800">{item.status}</span>
                </div>
                <span className="font-mono font-bold text-slate-700">{item.count}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 3. Program Demand & Capacity */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-purple-600" /> Program Application Demand & Seat Utilization
          </CardTitle>
          <span className="text-[11px] text-slate-400">Academic Intake 2026-2027</span>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2">Academic Program / Stream</th>
                  <th className="px-3 py-2 text-center">Applications</th>
                  <th className="px-3 py-2 text-center">Available Capacity</th>
                  <th className="px-3 py-2 text-right">Fill Ratio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.programDemand.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 font-semibold text-slate-900">{p.program}</td>
                    <td className="px-3 py-2.5 text-center font-mono">{p.applications}</td>
                    <td className="px-3 py-2.5 text-center font-mono">{p.capacity} seats</td>
                    <td className="px-3 py-2.5 text-right">
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {p.fillRatio}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Counsellor Activity & Conversion Performance */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <CardTitle className="text-xs font-bold uppercase text-slate-700 flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-600" /> Counsellor Activity & Conversion Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2">Counsellor</th>
                  <th className="px-3 py-2 text-center">Assigned Leads</th>
                  <th className="px-3 py-2 text-center">Follow-ups Logged</th>
                  <th className="px-3 py-2 text-center">Applications Generated</th>
                  <th className="px-3 py-2 text-center">Admissions Converted</th>
                  <th className="px-3 py-2 text-right">Conversion Efficiency</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.counsellorActivity.map((c, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="px-3 py-2.5 font-bold text-slate-900">{c.counsellor}</td>
                    <td className="px-3 py-2.5 text-center font-mono">{c.leadsAssigned}</td>
                    <td className="px-3 py-2.5 text-center font-mono">{c.followupsCompleted}</td>
                    <td className="px-3 py-2.5 text-center font-mono">{c.applicationsGenerated}</td>
                    <td className="px-3 py-2.5 text-center font-mono text-emerald-700 font-bold">{c.admissionsConverted}</td>
                    <td className="px-3 py-2.5 text-right font-bold text-blue-700">{c.conversionRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
