// src/modules/dashboard/DashboardPage.jsx
import React, { useState } from 'react'
import {
  Users,
  UserPlus,
  CheckCircle2,
  DollarSign,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight,
  Filter,
  FileCheck,
  CreditCard,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  CartesianGrid,
  AreaChart,
  Area,
} from 'recharts'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/charts/StatCard'
import { ChartCard } from '@/components/charts/ChartCard'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Button } from '@/components/ui/button'
import { MOCK_DASHBOARD_DATA } from '@/services/mockData'
import { useTenantContext } from '@/store/TenantContext'
import { useNavigate } from 'react-router-dom'

export function DashboardPage() {
  const { selectedCampus, selectedAcademicYear } = useTenantContext()
  const navigate = useNavigate()
  const data = MOCK_DASHBOARD_DATA

  const kpiIcons = {
    'kpi-students': Users,
    'kpi-admissions': UserPlus,
    'kpi-attendance': CheckCircle2,
    'kpi-fees-col': DollarSign,
    'kpi-fees-pen': AlertCircle,
    'kpi-staff': Briefcase,
  }

  return (
    <div className="space-y-6">
      {/* Page Title & Context Header */}
      <PageHeader
        title="Institutional Executive Dashboard"
        subtitle={`Real-time operations, admissions pipeline, attendance and finance metrics for ${selectedCampus?.name || 'All Campuses'} (AY ${selectedAcademicYear?.name})`}
        badge={
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
          </span>
        }
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => navigate('/admissions')}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" /> Admissions CRM
            </Button>
            <Button
              size="sm"
              className="text-xs"
              onClick={() => navigate('/students')}
            >
              <GraduationCap className="h-3.5 w-3.5 mr-1.5" /> Student Directory
            </Button>
          </>
        }
      />

      {/* 6 Key Enterprise KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
        {data.kpis.map((kpi) => (
          <StatCard
            key={kpi.id}
            title={kpi.label}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            subtitle={kpi.subtitle}
            icon={kpiIcons[kpi.id]}
            color={kpi.color}
          />
        ))}
      </div>

      {/* Primary Analytics Grid: Admissions Pipeline & Enrollment Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Admission Pipeline Breakdown */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Admissions Funnel Conversion"
            subtitle="AY 2026–27 Applicant progression stages from Inquiry to Enrolled"
            action={
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-blue-600 hover:text-blue-700"
                onClick={() => navigate('/admissions')}
              >
                View Pipeline <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            }
          >
            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.admissionsFunnel}
                  margin={{ top: 10, right: 10, left: -20, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="stage"
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                  />
                  <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                      border: 'none',
                    }}
                    formatter={(val) => [`${val} Candidates`, 'Count']}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {data.admissionsFunnel.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Stage Quick Count Bar */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-3 border-t border-slate-100 text-center text-xs">
              {data.admissionsFunnel.map((item, idx) => (
                <div key={idx} className="p-1.5 rounded bg-slate-50">
                  <p className="text-[10px] text-slate-500 truncate">{item.stage}</p>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{item.count}</p>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>

        {/* Student Demographics & Profile Breakdown */}
        <div>
          <ChartCard
            title="Student Demographics"
            subtitle="Gender ratio, fresh intake & attendance alerts"
          >
            <div className="space-y-4 pt-1">
              <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-100 flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-700 font-medium">Total Enrolled Strength</p>
                  <h3 className="text-2xl font-bold text-blue-950 mt-0.5">
                    {data.studentDemographics.total.toLocaleString()}
                  </h3>
                </div>
                <div className="text-right text-xs">
                  <span className="font-semibold text-blue-800">
                    +{data.studentDemographics.newAdmissions}
                  </span>
                  <p className="text-[10px] text-blue-600">New Intake (2026)</p>
                </div>
              </div>

              {/* Gender ratio bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-slate-600 font-medium">
                  <span>
                    Male: <strong className="text-slate-800">{data.studentDemographics.male}</strong> (53%)
                  </span>
                  <span>
                    Female: <strong className="text-slate-800">{data.studentDemographics.female}</strong> (47%)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden flex">
                  <div style={{ width: '53%' }} className="bg-blue-600 h-full" />
                  <div style={{ width: '47%' }} className="bg-purple-500 h-full" />
                </div>
              </div>

              {/* Attendance risk alert box */}
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200/80 flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="font-semibold text-amber-900">Attendance Risk Watchlist</p>
                  <p className="text-amber-700 mt-0.5 leading-relaxed">
                    <strong>{data.studentDemographics.attendanceRiskCount} students</strong> have fallen below the mandatory 75% attendance threshold this term.
                  </p>
                  <button
                    onClick={() => navigate('/students')}
                    className="text-amber-900 font-bold underline mt-1 block hover:text-amber-950"
                  >
                    Review List →
                  </button>
                </div>
              </div>
            </div>
          </ChartCard>
        </div>
      </div>

      {/* Secondary Row: Attendance breakdown, Fee Collection, and Real-time Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attendance Breakdown Widget */}
        <ChartCard
          title="Today's Attendance Status"
          subtitle="Biometric campus check-in sync"
        >
          <div className="flex items-center justify-center h-44">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.attendanceBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {data.attendanceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(val, name, item) => [
                    `${val} students (${item.payload.percentage}%)`,
                    item.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 text-center text-xs">
            {data.attendanceBreakdown.map((item, idx) => (
              <div key={idx} className="p-1.5 rounded bg-slate-50">
                <div className="flex items-center justify-center gap-1">
                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[11px] text-slate-500">{item.name}</span>
                </div>
                <p className="font-bold text-slate-800 text-xs mt-0.5">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Fee Collection Progress */}
        <ChartCard
          title="Institutional Fee Collection"
          subtitle="Q3 Tuition & Auxiliary Revenue Breakdown"
        >
          <div className="space-y-4 pt-1">
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-slate-500">Collected vs Target</span>
                <span className="text-sm font-bold text-slate-900">
                  {data.feeCollectionStatus.percentage}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
                <div
                  style={{ width: `${data.feeCollectionStatus.percentage}%` }}
                  className="bg-emerald-600 h-full rounded-full transition-all"
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                <span>Target: {data.feeCollectionStatus.targetFormatted}</span>
                <span className="text-emerald-700 font-semibold">
                  {data.feeCollectionStatus.collectedFormatted} Collected
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60">
                <p className="text-[11px] text-amber-700 font-medium">Pending Dues</p>
                <h4 className="text-base font-bold text-amber-950 mt-0.5">
                  {data.feeCollectionStatus.pendingFormatted}
                </h4>
                <p className="text-[10px] text-amber-600">Upcoming installments</p>
              </div>
              <div className="p-2.5 rounded-lg bg-red-50/70 border border-red-200/60">
                <p className="text-[11px] text-red-700 font-medium">Overdue Arrears</p>
                <h4 className="text-base font-bold text-red-950 mt-0.5">
                  {data.feeCollectionStatus.overdueFormatted}
                </h4>
                <p className="text-[10px] text-red-600">214 accounts flagged</p>
              </div>
            </div>
          </div>
        </ChartCard>

        {/* Upcoming Institutional Events */}
        <ChartCard
          title="Upcoming Calendar & Exams"
          subtitle="Scheduled institutional events"
        >
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {data.upcomingEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-100/70 transition-colors flex items-start gap-3"
              >
                <div className="flex flex-col items-center justify-center h-10 w-10 rounded bg-white border border-slate-200 text-slate-700 font-bold shrink-0 text-center leading-none p-1">
                  <span className="text-[10px] uppercase text-blue-600">{evt.date.split(' ')[0]}</span>
                  <span className="text-xs font-black">{evt.date.split(' ')[1]?.replace(',', '')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs font-semibold text-slate-900 truncate">{evt.title}</p>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {evt.time}
                    </span>
                    <span>•</span>
                    <span>{evt.campus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Recent System Activity Timeline */}
      <ChartCard
        title="Institutional Audit Trail & Operational Events"
        subtitle="Chronological feed of cross-module transactions"
        action={
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-blue-600 hover:text-blue-700"
            onClick={() => navigate('/audit-logs')}
          >
            Audit Logs <ArrowUpRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        }
      >
        <div className="divide-y divide-slate-100">
          {data.recentActivities.map((act) => (
            <div key={act.id} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-full bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  <FileCheck className="h-4 w-4" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold text-slate-900">{act.title}</h5>
                  <p className="text-xs text-slate-600 mt-0.5">{act.description}</p>
                  <p className="text-[11px] text-slate-400 mt-1">Initiated by: {act.user}</p>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">
                {act.timestamp}
              </span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}
