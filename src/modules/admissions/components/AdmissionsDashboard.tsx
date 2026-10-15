// src/modules/admissions/components/AdmissionsDashboard.tsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  GraduationCap,
  Percent,
  BarChart3,
  PieChart as PieIcon,
  ArrowUpRight,
  ShieldCheck,
  AlertCircle,
  Building2,
  DollarSign,
  Calendar,
} from 'lucide-react'
import { formatCurrency } from '@/modules/finance/config/financeConfig'

export function AdmissionsDashboard() {
  const [timeframe, setTimeframe] = useState('2026-27')

  // Core Analytics Metrics
  const summaryMetrics = [
    {
      title: 'Total Inquiries & Leads',
      value: '128',
      change: '+24.5%',
      isPositive: true,
      subtext: 'vs previous academic cycle',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Applications Submitted',
      value: '94',
      change: '+16.2%',
      isPositive: true,
      subtext: '73.4% enquiry-to-app rate',
      icon: GraduationCap,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
    },
    {
      title: 'Document Clearance Rate',
      value: '84.6%',
      change: '+6.8%',
      isPositive: true,
      subtext: 'Avg. 1.2 days turnaround',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Fee Collection Realization',
      value: '₹34.85 L',
      change: '74.2%',
      isPositive: true,
      subtext: 'Of ₹47.0 L total projected fees',
      icon: CreditCard,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
  ]

  // End-to-End Pipeline Funnel
  const funnelStages = [
    { label: 'Leads Generated', count: 128, percentage: '100%', dropOff: null, color: 'bg-blue-600' },
    { label: 'Qualified Inquiries', count: 96, percentage: '75.0%', dropOff: '25% drop', color: 'bg-indigo-600' },
    { label: 'Counselling Completed', count: 82, percentage: '64.1%', dropOff: '14.5% drop', color: 'bg-purple-600' },
    { label: 'Applications Filed', count: 68, percentage: '53.1%', dropOff: '17.0% drop', color: 'bg-sky-600' },
    { label: 'Documents Verified', count: 58, percentage: '45.3%', dropOff: '14.7% drop', color: 'bg-teal-600' },
    { label: 'Admission Fee Collected', count: 48, percentage: '37.5%', dropOff: '17.2% drop', color: 'bg-emerald-600' },
    { label: 'Enrolled to SIS', count: 42, percentage: '32.8%', dropOff: '12.5% drop', color: 'bg-green-700' },
  ]

  // Fee Analytics
  const feeStatusBreakdown = [
    { status: 'Fully Paid', count: 38, amount: 2840000, percentage: 60.4, color: 'bg-emerald-500' },
    { status: 'Partially Paid', count: 14, amount: 645000, percentage: 13.7, color: 'bg-amber-500' },
    { status: 'Pending Collection', count: 18, amount: 980000, percentage: 20.8, color: 'bg-blue-500' },
    { status: 'Overdue Dues', count: 4, amount: 235000, percentage: 5.1, color: 'bg-red-500' },
  ]

  // Document Verification Health
  const documentHealth = [
    { type: 'Identity Proof (Aadhaar/Passport)', verified: 64, pending: 4, rejected: 0, compliance: '94.1%' },
    { type: 'Previous Academic Marksheet', verified: 58, pending: 7, rejected: 3, compliance: '85.3%' },
    { type: 'Transfer / Migration Certificate', verified: 46, pending: 18, rejected: 4, compliance: '67.6%' },
    { type: 'Address Proof & Utility Bill', verified: 62, pending: 6, rejected: 0, compliance: '91.2%' },
    { type: 'Passport Size Photographs', verified: 66, pending: 2, rejected: 0, compliance: '97.0%' },
  ]

  // Program Demand vs Available Capacity
  const programDemand = [
    { program: 'B.Tech Computer Science & AI', applications: 34, capacity: 40, fillRatio: '85.0%', status: 'Fast Filling' },
    { program: 'Senior Secondary Science (PCM / PCB)', applications: 28, capacity: 35, fillRatio: '80.0%', status: 'Healthy' },
    { program: 'Commerce with Applied Mathematics', applications: 22, capacity: 30, fillRatio: '73.3%', status: 'Healthy' },
    { program: 'B.Tech Electronics & Communication', applications: 18, capacity: 30, fillRatio: '60.0%', status: 'Available' },
    { program: 'Humanities & Public Policy', applications: 14, capacity: 25, fillRatio: '56.0%', status: 'Available' },
    { program: 'B.Sc Biotechnology & Life Sciences', applications: 12, capacity: 20, fillRatio: '60.0%', status: 'Available' },
  ]

  // Counsellor Performance
  const counsellorPerformance = [
    { name: 'Dr. Radhakrishnan Murthy', assigned: 48, converted: 26, rate: '54.2%', speed: '1.4 days', collections: '₹18.4 L' },
    { name: 'Ananya Sharma', assigned: 42, converted: 20, rate: '47.6%', speed: '1.8 days', collections: '₹14.2 L' },
    { name: 'Pooja Iyer', assigned: 38, converted: 18, rate: '47.3%', speed: '2.1 days', collections: '₹12.6 L' },
  ]

  // Lead Acquisition Sources
  const leadSources = [
    { source: 'Institutional Website & Direct Search', share: 42, count: 54, conversion: '38.2%' },
    { source: 'Education Portals & Aggregators', share: 24, count: 31, conversion: '32.1%' },
    { source: 'Digital Ad Campaigns (Google / Meta)', share: 18, count: 23, conversion: '26.0%' },
    { source: 'Campus Walk-in & Open Day Events', share: 11, count: 14, conversion: '57.1%' },
    { source: 'Alumni & Faculty Referrals', share: 5, count: 6, conversion: '66.7%' },
  ]

  return (
    <div className="space-y-6">
      {/* Analytics Dashboard Header Banner */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-semibold">
              <BarChart3 className="h-3.5 w-3.5 text-blue-400" /> Executive Admissions Intelligence
            </div>
            <h2 className="text-xl font-black tracking-tight">Admissions Performance & Conversion Analytics</h2>
            <p className="text-xs text-slate-300 max-w-2xl">
              Real-time quantitative tracking of student application velocity, verification throughput, and admission fee collection realization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-800/80 backdrop-blur-xs p-1 rounded-xl border border-slate-700 flex items-center gap-1 text-xs">
              <button
                onClick={() => setTimeframe('2026-27')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  timeframe === '2026-27'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Cycle 2026–27
              </button>
              <button
                onClick={() => setTimeframe('last30')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  timeframe === 'last30'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setTimeframe('all')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  timeframe === 'all'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All Cycles
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 1. Core Executive KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryMetrics.map((m, idx) => {
          const Icon = m.icon
          return (
            <Card key={idx} className="border-slate-200/90 shadow-xs hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      {m.title}
                    </span>
                    <div className="text-2xl font-black text-slate-900 tracking-tight">{m.value}</div>
                  </div>
                  <div className={`p-2.5 rounded-xl ${m.bgColor} ${m.borderColor} border`}>
                    <Icon className={`h-5 w-5 ${m.color}`} />
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 font-bold text-emerald-600">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    {m.change}
                  </span>
                  <span className="text-slate-400 text-[11px]">{m.subtext}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* 2. Interactive Conversion Pipeline Funnel */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              Admissions Conversion Funnel & Velocity
            </CardTitle>
            <p className="text-xs text-slate-500">
              End-to-end conversion progression from prospect inquiry to fee payment and formal SIS enrollment
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            32.8% Overall Conversion Yield
          </span>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {funnelStages.map((stage, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-[11px] font-mono font-bold text-slate-400">0{idx + 1}</span>
                    <span className="font-bold text-slate-800">{stage.label}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {stage.dropOff && (
                      <span className="text-[10px] text-rose-500 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                        {stage.dropOff}
                      </span>
                    )}
                    <span className="font-mono font-black text-slate-900 text-sm">{stage.count}</span>
                    <span className="font-semibold text-slate-500 w-12 text-right">({stage.percentage})</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5">
                  <div
                    className={`${stage.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: stage.percentage }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 3. Fee Collection Intelligence & Document Verification Health */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* A. Admissions Fee Collection & Realization */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-emerald-600" />
                Admissions Fee Collection Intelligence
              </CardTitle>
              <p className="text-xs text-slate-500">Realized admission fee receipts vs outstanding balances</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                74.2% Collected
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-4 space-y-5">
            {/* Realization Progress */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-600">Total Projected Fee Commitment</span>
                <span className="font-black text-slate-900 font-mono text-sm">₹47,00,000</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Fee Realized (Paid / Partial)
                </span>
                <span className="font-black text-emerald-700 font-mono text-sm">₹34,85,000</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '74.2%' }} />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Outstanding Balance: <strong className="text-slate-800 font-mono">₹12,15,000</strong></span>
                <span>Active Paying Students: <strong className="text-slate-800 font-mono">52 / 68</strong></span>
              </div>
            </div>

            {/* Status Breakdown Table */}
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                Collection Status Distribution
              </span>
              <div className="space-y-2">
                {feeStatusBreakdown.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-slate-100 hover:bg-slate-50 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="font-bold text-slate-800">{item.status}</span>
                      <span className="text-slate-400">({item.count} students)</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-slate-900 block">
                        ₹{(item.amount / 100000).toFixed(2)} L
                      </span>
                      <span className="text-[10px] text-slate-400">{item.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* B. Document Verification Turnaround & Compliance */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                Document Verification Health & Compliance
              </CardTitle>
              <p className="text-xs text-slate-500">Institutional verification throughput by document credential</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
              Avg 1.2d Review Speed
            </span>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3">
              {documentHealth.map((doc, idx) => (
                <div key={idx} className="p-3 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{doc.type}</span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      {doc.compliance} Verified
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <CheckCircle2 className="h-3 w-3" /> {doc.verified} Verified
                    </span>
                    <span className="flex items-center gap-1 text-amber-700">
                      <Clock className="h-3 w-3" /> {doc.pending} Under Review
                    </span>
                    {doc.rejected > 0 && (
                      <span className="flex items-center gap-1 text-rose-700">
                        <AlertCircle className="h-3 w-3" /> {doc.rejected} Re-upload Needed
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong>Primary Bottleneck:</strong> Transfer / Migration Certificates currently have 18 pending submissions due to state board release schedules.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Program Demand & Seat Capacity Utilization */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-600" />
              Program Application Demand & Seat Capacity Utilization
            </CardTitle>
            <p className="text-xs text-slate-500">
              Applications filed vs sanctioned intake capacity across academic courses
            </p>
          </div>
          <span className="text-[11px] text-slate-400 font-medium">Academic Cycle 2026–2027</span>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Academic Program / Course Stream</th>
                  <th className="px-4 py-3 text-center">Applications</th>
                  <th className="px-4 py-3 text-center">Sanctioned Seats</th>
                  <th className="px-4 py-3 text-center">Fill Ratio</th>
                  <th className="px-4 py-3 text-right">Intake Velocity</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {programDemand.map((p, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-4 py-3 font-bold text-slate-900">{p.program}</td>
                    <td className="px-4 py-3 text-center font-mono font-semibold">{p.applications}</td>
                    <td className="px-4 py-3 text-center font-mono text-slate-500">{p.capacity} seats</td>
                    <td className="px-4 py-3 text-center">
                      <div className="inline-flex items-center gap-2">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-full rounded-full"
                            style={{ width: p.fillRatio }}
                          />
                        </div>
                        <span className="font-bold text-slate-900 font-mono text-[11px]">{p.fillRatio}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold ${
                          p.status === 'Fast Filling'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Acquisition Sources & Counsellor Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Acquisition Channels */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="h-4 w-4 text-blue-600" />
              Lead Acquisition Channels & Attribution
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3.5">
            {leadSources.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-800">{s.source}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-600 font-bold">{s.count} leads</span>
                    <span className="font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">
                      {s.conversion} conv.
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${s.share}%` }} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Counsellor Conversion Leaderboard */}
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" />
              Counsellor Conversion & Revenue Realization
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="px-3 py-2">Counsellor</th>
                    <th className="px-3 py-2 text-center">Assigned</th>
                    <th className="px-3 py-2 text-center">Converted</th>
                    <th className="px-3 py-2 text-center">Rate</th>
                    <th className="px-3 py-2 text-right">Fee Generated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {counsellorPerformance.map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="px-3 py-2.5 font-bold text-slate-900">{c.name}</td>
                      <td className="px-3 py-2.5 text-center font-mono">{c.assigned}</td>
                      <td className="px-3 py-2.5 text-center font-mono font-bold text-emerald-700">{c.converted}</td>
                      <td className="px-3 py-2.5 text-center font-bold text-blue-700">{c.rate}</td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-900">{c.collections}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
