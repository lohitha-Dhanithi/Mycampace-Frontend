// src/components/layout/AppSidebar.jsx
import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  MapPin,
  CalendarDays,
  Database,
  GraduationCap,
  Users2,
  UserCheck,
  ShieldCheck,
  BookOpen,
  CalendarCheck,
  CheckCircle,
  FileSpreadsheet,
  MonitorPlay,
  UserPlus,
  FileText,
  DollarSign,
  UserCog,
  Coins,
  Library,
  Bus,
  Home,
  MessageSquare,
  BarChart3,
  LineChart,
  PieChart,
  Settings,
  History,
  ChevronRight,
  Sparkles,
  Layers,
  DoorOpen,
  Bookmark,
  Gauge,
  Users,
  HelpCircle,
  ClipboardList,
  CreditCard,
  Receipt,
  AlertTriangle,
  RotateCcw,
  Scale,
  Megaphone,
  Landmark,
  FolderOpen,
} from 'lucide-react'

export interface AppSidebarProps {
  collapsed?: boolean;
  onCloseMobile?: () => void;
}

export function AppSidebar({ collapsed = false, onCloseMobile }: AppSidebarProps) {
  const location = useLocation()
  const isLMSActive = location.pathname.startsWith('/lms')

  const navGroups = [
    {
      group: 'CORE',
      items: [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'INSTITUTION',
      items: [
        { label: 'Institution Profile', path: '/institution', icon: Building2 },
        { label: 'Campuses', path: '/institution/campuses', icon: MapPin },
        { label: 'Academic Config', path: '/academics/academic-years', icon: CalendarDays },
        { label: 'Master Data', path: '/master-data', icon: Database },
      ],
    },
    {
      group: 'PEOPLE',
      items: [
        { label: 'Students', path: '/students', icon: GraduationCap },
        { label: 'Staff Directory', path: '/staff', icon: Users2, badge: 'Soon' },
        { label: 'Users', path: '/users', icon: UserCheck },
        { label: 'Roles & Permissions', path: '/roles', icon: ShieldCheck },
      ],
    },
    {
      group: 'ACADEMICS',
      items: [
        { label: 'Academic Overview', path: '/academics/overview', icon: LayoutDashboard },
        { label: 'Programs', path: '/academics/programs', icon: GraduationCap },
        { label: 'Courses', path: '/academics/courses', icon: BookOpen },
        { label: 'Classes', path: '/academics/classes', icon: Layers },
        { label: 'Classrooms', path: '/academics/classrooms', icon: DoorOpen },
        { label: 'Sections', path: '/academics/sections', icon: Users2 },
        { label: 'Subjects', path: '/academics/subjects', icon: Bookmark },
        { label: 'Faculty Assignments', path: '/academics/faculty-assignments', icon: UserCheck },
        { label: 'Subject Assignments', path: '/academics/subject-assignments', icon: FileSpreadsheet },
        { label: 'Class Teachers', path: '/academics/class-teachers', icon: UserPlus },
        { label: 'Enrolments', path: '/academics/enrolments', icon: Users },
        { label: 'Academic Calendar', path: '/academics/academic-calendar', icon: CalendarDays },
        { label: 'Workload Index', path: '/academics/workload', icon: Gauge },
        { label: 'Timetable', path: '/academics/timetable', icon: CalendarCheck },
        { label: 'Attendance', path: '/academics/attendance', icon: CheckCircle, badge: 'Soon' },
        { label: 'Examinations', path: '/academics/examinations', icon: FileSpreadsheet, badge: 'Soon' },
        { label: 'LMS (Learning System)', path: '/lms', icon: MonitorPlay },
      ],
    },
    ...(isLMSActive
      ? [
          {
            group: 'LMS NAVIGATION',
            items: [
              { label: 'LMS Dashboard', path: '/lms', icon: LayoutDashboard },
              { label: 'Courses', path: '/lms/courses', icon: BookOpen },
              { label: 'My Learning (Student)', path: '/lms/my-learning', icon: GraduationCap },
              { label: 'Assignments', path: '/lms/assignments', icon: ClipboardList },
              { label: 'Quizzes', path: '/lms/quizzes', icon: HelpCircle },
              { label: 'Content Library', path: '/lms/content-library', icon: FolderOpen },
              { label: 'LMS Reports', path: '/lms/reports', icon: BarChart3 },
            ],
          },
        ]
      : []),
    {
      group: 'ADMISSIONS',
      items: [
        { label: 'Admissions Dashboard', path: '/admissions', icon: LayoutDashboard },
        { label: 'Leads', path: '/admissions/leads', icon: UserPlus },
        { label: 'Enquiries', path: '/admissions/enquiries', icon: MessageSquare },
        { label: 'Counselling', path: '/admissions/counselling', icon: CalendarDays },
        { label: 'Applications', path: '/admissions/applications', icon: FileText },
        { label: 'Documents', path: '/admissions/documents', icon: FileSpreadsheet },
        { label: 'Follow-ups', path: '/admissions/follow-ups', icon: CheckCircle },
        { label: 'Reports', path: '/admissions/reports', icon: BarChart3 },
      ],
    },
    {
      group: 'FINANCE',
      items: [
        { label: 'Finance Dashboard', path: '/finance/dashboard', icon: LayoutDashboard },
        { label: 'Fees & Fee Structures', path: '/finance/fee-structures', icon: Layers },
        { label: 'Student Fees', path: '/finance/student-fees', icon: GraduationCap },
        { label: 'Invoices', path: '/finance/invoices', icon: FileText },
        { label: 'Payments', path: '/finance/payments', icon: CreditCard },
        { label: 'Receipts', path: '/finance/receipts', icon: Receipt },
        { label: 'Dues', path: '/finance/dues', icon: AlertTriangle },
        { label: 'Refunds', path: '/finance/refunds', icon: RotateCcw },
        { label: 'Reconciliation', path: '/finance/reconciliation', icon: Scale },
        { label: 'Advertising', path: '/finance/advertising', icon: Megaphone },
        { label: 'Financial Services', path: '/finance/financial-services', icon: Landmark },
        { label: 'Reports', path: '/finance/reports', icon: BarChart3 },
      ],
    },
    {
      group: 'OPERATIONS',
      items: [
        { label: 'HRMS', path: '/operations/hrms', icon: UserCog, badge: 'Soon' },
        { label: 'Payroll', path: '/operations/payroll', icon: Coins, badge: 'Soon' },
        { label: 'Library', path: '/operations/library', icon: Library, badge: 'Soon' },
        { label: 'Transport', path: '/operations/transport', icon: Bus, badge: 'Soon' },
        { label: 'Hostel', path: '/operations/hostel', icon: Home, badge: 'Soon' },
      ],
    },
    {
      group: 'ENGAGEMENT',
      items: [
        { label: 'Communication', path: '/engagement/communication', icon: MessageSquare, badge: 'Soon' },
      ],
    },
    {
      group: 'ANALYTICS',
      items: [
        { label: 'Reports', path: '/analytics/reports', icon: BarChart3, badge: 'Soon' },
        { label: 'Analytics', path: '/analytics/overview', icon: LineChart, badge: 'Soon' },
        { label: 'Executive Board', path: '/analytics/executive', icon: PieChart, badge: 'Soon' },
      ],
    },
    {
      group: 'ADMINISTRATION',
      items: [
        { label: 'Settings', path: '/settings', icon: Settings },
        { label: 'Audit Logs', path: '/audit-logs', icon: History },
      ],
    },
  ]

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-slate-900 text-slate-300 transition-all duration-300 border-r border-slate-800 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center px-4 border-b border-slate-800/80 bg-slate-950/60 justify-between">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden font-bold tracking-tight text-white hover:opacity-90 transition-opacity"
        >
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 shadow-sm text-white font-black text-base">
            M
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-sm tracking-wide font-extrabold text-white flex items-center gap-1.5">
                MyCampace
                <span className="text-[10px] uppercase font-semibold tracking-wider px-1.5 py-0.2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded">
                  OS
                </span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Education ERP</span>
            </div>
          )}
        </NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-5">
        {navGroups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <h4 className="px-3 text-[10px] font-bold tracking-wider text-slate-300 uppercase">
                {group.group}
              </h4>
            )}
            <div className="space-y-0.5">
              {group.items.map((item, iIdx) => {
                const Icon = item.icon
                const isActive =
                  location.pathname === item.path ||
                  (item.path !== '/dashboard' &&
                    location.pathname.startsWith(item.path) &&
                    !['/academics/academic-years', '/academics/programs', '/academics/classes', '/academics/subjects'].includes(item.path)) ||
                  (item.path === location.pathname)

                return (
                  <NavLink
                    key={iIdx}
                    to={item.path}
                    onClick={onCloseMobile}
                    title={collapsed ? item.label : undefined}
                    className={({ isActive: navActive }) => {
                      const active = navActive || location.pathname === item.path
                      return `flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                        active
                          ? 'bg-blue-600 text-white shadow-xs font-semibold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      } ${collapsed ? 'justify-center px-0 py-2.5' : ''}`
                    }}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <span className="flex-1 truncate">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded font-medium bg-slate-800 text-slate-400 border border-slate-700">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar Footer info */}
      {!collapsed && (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-300 flex items-center justify-between">
          <span>v2.4.0 (Enterprise)</span>
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> AWS RDS Live
          </span>
        </div>
      )}
    </aside>
  )
}
