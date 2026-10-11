// src/platform/shell/ProductShell.jsx
import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate, Link } from 'react-router-dom'
import {
  Menu,
  Search,
  Bell,
  LogOut,
  ChevronDown,
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Layers,
  DoorOpen,
  Users2,
  Bookmark,
  UserCheck,
  FileSpreadsheet,
  UserPlus,
  Users,
  CalendarDays,
  Gauge,
  CalendarCheck,
  CheckCircle,
  MonitorPlay,
  ClipboardList,
  FolderOpen,
  BarChart3,
  DollarSign,
  Receipt,
  CreditCard,
  RotateCcw,
  Scale,
  Megaphone,
  Landmark,
  Shield,
  FileText,
  Lock,
  ArrowRight,
  Sparkles,
  Clock,
  User,
  ArrowLeftRight,
} from 'lucide-react'
import { ProductSwitcher } from '@/components/layout/ProductSwitcher'
import { ProductLauncherMenu } from '@/components/layout/ProductLauncherMenu'
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal'
import { ContextSelector } from '@/components/layout/ContextSelector'
import { productService } from '@/services/productService'
import { entitlementService } from '@/services/entitlementService'
import { notificationService } from '@/services/notificationService'
import { useAuth } from '@/store/AuthContext'
import { getHrmsPortalMode, hasHrmsAdminAccess, setHrmsPortalMode } from '@/modules/hrms/portalMode'

// Product-specific navigation configurations
const PRODUCT_NAV_CONFIG = {
  academics: {
    name: 'Academics',
    tagline: 'Curricula, Classes & Faculty Schedules',
    color: 'blue',
    sections: [
      {
        title: 'Academic Structure',
        items: [
          { label: 'Overview', path: '/app/academics/overview', icon: LayoutDashboard },
          { label: 'Programs', path: '/app/academics/programs', icon: GraduationCap },
          { label: 'Courses', path: '/app/academics/courses', icon: BookOpen },
          { label: 'Classes', path: '/app/academics/classes', icon: Layers },
          { label: 'Classrooms', path: '/app/academics/classrooms', icon: DoorOpen },
          { label: 'Sections', path: '/app/academics/sections', icon: Users2 },
          { label: 'Subjects', path: '/app/academics/subjects', icon: Bookmark },
        ],
      },
      {
        title: 'Faculty & Workload',
        items: [
          { label: 'Faculty Assignments', path: '/app/academics/faculty-assignments', icon: UserCheck },
          { label: 'Subject Assignments', path: '/app/academics/subject-assignments', icon: FileSpreadsheet },
          { label: 'Class Teachers', path: '/app/academics/class-teachers', icon: UserPlus },
          { label: 'Workload Index', path: '/app/academics/workload', icon: Gauge },
        ],
      },
      {
        title: 'Schedules & Enrolment',
        items: [
          { label: 'Student Enrolments', path: '/app/academics/enrolments', icon: Users },
          { label: 'Academic Calendar', path: '/app/academics/academic-calendar', icon: CalendarDays },
          { label: 'Timetable', path: '/app/academics/timetable', icon: CalendarCheck },
          { label: 'Academic Years', path: '/app/academics/academic-years', icon: CalendarDays },
        ],
      },
    ],
  },
  lms: {
    name: 'LMS',
    tagline: 'Digital Learning & Assessments',
    color: 'violet',
    sections: [
      {
        title: 'Instructional Core',
        items: [
          { label: 'LMS Dashboard', path: '/app/lms', icon: LayoutDashboard },
          { label: 'Course Catalog', path: '/app/lms/courses', icon: MonitorPlay },
          { label: 'Content Library', path: '/app/lms/content-library', icon: FolderOpen },
        ],
      },
      {
        title: 'Assessments',
        items: [
          { label: 'Assignments', path: '/app/lms/assignments', icon: ClipboardList },
          { label: 'Quizzes', path: '/app/lms/quizzes', icon: CheckCircle },
        ],
      },
      {
        title: 'Learner Experience',
        items: [
          { label: 'My Learning Portal', path: '/app/lms/my-learning', icon: BookOpen },
          { label: 'Learning Reports', path: '/app/lms/reports', icon: BarChart3 },
        ],
      },
    ],
  },
  finance: {
    name: 'Finance',
    tagline: 'Fee Structures, Invoices & Banking',
    color: 'amber',
    sections: [
      {
        title: 'Overview',
        items: [
          { label: 'Finance Dashboard', path: '/app/finance/dashboard', icon: LayoutDashboard },
        ],
      },
      {
        title: 'Fee Management',
        items: [
          { label: 'Fee Structures', path: '/app/finance/fee-structures', icon: DollarSign },
          { label: 'Fee Components', path: '/app/finance/fee-components', icon: Layers },
          { label: 'Student Fee Ledgers', path: '/app/finance/student-fees', icon: Users },
        ],
      },
      {
        title: 'Transactions & Dues',
        items: [
          { label: 'Invoices', path: '/app/finance/invoices', icon: Receipt },
          { label: 'Payments', path: '/app/finance/payments', icon: CreditCard },
          { label: 'Receipts', path: '/app/finance/receipts', icon: FileSpreadsheet },
          { label: 'Outstanding Dues', path: '/app/finance/dues', icon: RotateCcw },
          { label: 'Bank Reconciliation', path: '/app/finance/reconciliation', icon: Scale },
        ],
      },
      {
        title: 'Value-Added Services',
        items: [
          { label: 'Institutional Ads', path: '/app/finance/advertising', icon: Megaphone },
          { label: 'DhanitiPay Services', path: '/app/finance/financial-services', icon: Landmark },
          { label: 'Financial Reports', path: '/app/finance/reports', icon: BarChart3 },
        ],
      },
    ],
  },
  admissions: {
    name: 'Admissions',
    tagline: 'Recruitment Funnel & Applications',
    color: 'emerald',
    sections: [
      {
        title: 'Admissions CRM',
        items: [
          { label: 'CRM Dashboard', path: '/app/admissions', icon: LayoutDashboard },
          { label: 'Leads & Enquiries', path: '/app/admissions/leads', icon: UserPlus },
          { label: 'Counselling Pipeline', path: '/app/admissions/counselling', icon: Users2 },
          { label: 'Applications', path: '/app/admissions/applications', icon: FileSpreadsheet },
          { label: 'Documents & Verification', path: '/app/admissions/documents', icon: FileText },
          { label: 'Admissions Reports', path: '/app/admissions/reports', icon: BarChart3 },
        ],
      },
    ],
  },
  students: {
    name: 'Students SIS',
    tagline: 'Student Records & Lifecycle',
    color: 'blue',
    sections: [
      {
        title: 'Student Directory',
        items: [
          { label: 'All Students', path: '/app/students', icon: GraduationCap },
          { label: 'Transfers', path: '/app/students/transfers', icon: RotateCcw },
          { label: 'Promotions', path: '/app/students/promotions', icon: ArrowRight },
          { label: 'Exits & Alumni Sync', path: '/app/students/exits', icon: LogOut },
        ],
      },
    ],
  },
  hrms: {
    name: 'HRMS',
    tagline: 'Staff, Leave & Attendance',
    color: 'indigo',
    sections: [
      {
        title: 'Overview',
        items: [{ label: 'Dashboard', path: '/app/hrms', icon: LayoutDashboard, end: true }],
      },
      {
        title: 'People',
        items: [
          { label: 'Staff Directory', path: '/app/hrms/staff', icon: Users2 },
          { label: 'Categories & Departments', path: '/app/hrms/setup', icon: Layers },
        ],
      },
      {
        title: 'Time & Attendance',
        items: [
          { label: 'Leave Requests', path: '/app/hrms/leaves', icon: CalendarCheck },
          { label: 'Shifts & Attendance', path: '/app/hrms/attendance', icon: Clock },
        ],
      },
    ],
  },
}

const MY_PORTAL_SECTIONS = [
  {
    title: 'My Portal',
    items: [
      { label: 'Home', path: '/app/hrms/me', icon: LayoutDashboard, end: true },
      { label: 'My Profile', path: '/app/hrms/me/profile', icon: User },
      { label: 'My Leave', path: '/app/hrms/me/leave', icon: CalendarCheck },
      { label: 'My Attendance', path: '/app/hrms/me/attendance', icon: Clock },
    ],
  },
]

export function ProductShell({ productId }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const [collapsed, setCollapsed] = useState(false)
  const [portalMode, setPortalMode] = useState<'admin' | 'self'>(() => (
    productId === 'hrms' ? getHrmsPortalMode(user) : 'admin'
  ))
  const adminAccess = productId === 'hrms' && hasHrmsAdminAccess(user)

  useEffect(() => {
    if (productId !== 'hrms') return
    const mode = getHrmsPortalMode(user)
    setPortalMode(mode)
    const onSelf = location.pathname === '/app/hrms/me' || location.pathname.startsWith('/app/hrms/me/')
    if (mode === 'self' && !onSelf) navigate('/app/hrms/me', { replace: true })
    if (mode === 'admin' && onSelf) navigate('/app/hrms', { replace: true })
  }, [productId, user, location.pathname, navigate])

  const [mobileOpen, setMobileOpen] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications] = useState(notificationService.getNotifications())

  // Check product access & entitlements
  const accessCheck = productService.checkProductAccess(productId)
  const baseNav = PRODUCT_NAV_CONFIG[productId] || {
    name: productId.charAt(0).toUpperCase() + productId.slice(1),
    tagline: 'Educational Module',
    color: 'blue',
    sections: [
      {
        title: 'Module',
        items: [{ label: 'Dashboard', path: `/app/${productId}`, icon: LayoutDashboard }],
      },
    ],
  }
  const currentNav = productId === 'hrms' && portalMode === 'self'
    ? { ...baseNav, name: 'My Portal', tagline: 'Leave, attendance, and profile', sections: MY_PORTAL_SECTIONS }
    : baseNav

  const switchPortal = () => {
    const next = portalMode === 'self' ? 'admin' : 'self'
    if (next === 'admin' && !adminAccess) return
    setHrmsPortalMode(next)
    setPortalMode(next)
    setMobileOpen(false)
    navigate(next === 'self' ? '/app/hrms/me' : '/app/hrms')
  }
  const showPortalSwitch = productId === 'hrms' && (portalMode === 'admin' || adminAccess)
  const portalSwitchLabel = portalMode === 'self' ? 'Switch to Admin Portal' : 'Switch to My Portal'

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // If product is locked / not entitled / coming soon
  if (!accessCheck.allowed) {
    const productInfo = productService.getProductById(productId) || {
      name: productId.toUpperCase(),
      description: 'Educational capability for your institutional operations.',
      keyCapabilities: ['Multi-Campus Governance', 'Automated Workflows', 'Audit Trail'],
      pricing: 'Contact Sales',
    }

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {/* Header with Switcher */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <ProductSwitcher currentProductId={productId} />
            <ProductLauncherMenu />
          </div>
          <Link
            to="/app"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            ← Back to Product Hub
          </Link>
        </header>

        {/* Upgrade / Unlock Screen */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-xl bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-xl text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-blue-50 text-blue-600 mb-6">
              <Lock className="h-8 w-8" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block mb-3">
              Product Not Active
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Unlock {productInfo.name}
            </h1>
            <p className="mt-2 text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              This product is not currently enabled for your organization workspace.
            </p>

            <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                What's included in {productInfo.name}:
              </span>
              <div className="space-y-2">
                {productInfo.keyCapabilities?.map((cap, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{cap}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  entitlementService.grantEntitlement(productId)
                  window.location.reload()
                }}
                className="w-full sm:w-auto h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <Sparkles className="h-4 w-4" />
                <span>Activate {productInfo.name} for Organization</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/app')}
                className="w-full sm:w-auto h-11 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all"
              >
                Back to Hub
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Product-Specific Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col border-r border-slate-200 bg-white transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-64'
        } sticky top-0 h-screen z-20`}
      >
        {/* Sidebar Product Brand Banner */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200 shrink-0">
          {!collapsed ? (
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentNav.name.charAt(0)}
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-extrabold text-slate-900 tracking-wide">
                  {currentNav.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
                  {currentNav.tagline}
                </span>
              </div>
            </div>
          ) : (
            <div className="h-8 w-8 mx-auto rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {currentNav.name.charAt(0)}
            </div>
          )}
        </div>

        {/* Product Navigation Items */}
        <div className="flex-1 overflow-y-auto p-3 space-y-5">
          {currentNav.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!collapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1.5">
                  {section.title}
                </span>
              )}
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={Boolean(item.end)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-50 text-blue-700 shadow-2xs font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      } ${collapsed ? 'justify-center px-0' : ''}`
                    }
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0 text-slate-500" />
                    {!collapsed && <span>{item.label}</span>}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-200 shrink-0 space-y-1">
          {showPortalSwitch && (
            <button
              type="button"
              onClick={switchPortal}
              title={portalSwitchLabel}
              className={`flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-2 text-left text-xs font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 ${
                collapsed ? 'justify-center' : ''
              }`}
            >
              <ArrowLeftRight className="h-4 w-4 shrink-0 text-blue-600" />
              {!collapsed && <span>{portalSwitchLabel}</span>}
            </button>
          )}
          <Link
            to="/app"
            className={`flex items-center gap-2.5 p-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors ${
              collapsed ? 'justify-center p-2' : ''
            }`}
          >
            <Layers className="h-4 w-4 shrink-0 text-blue-600" />
            {!collapsed && <span>Return to Product Hub</span>}
          </Link>
        </div>
      </aside>

      {/* Product-Specific Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-slate-200 transform lg:hidden transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              {currentNav.name.charAt(0)}
            </div>
            <span className="text-sm font-bold text-slate-900">{currentNav.name}</span>
          </div>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 p-3 space-y-4 overflow-y-auto">
          {currentNav.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                {section.title}
              </span>
              {section.items.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={Boolean(item.end)}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'
                      }`
                    }
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>
          ))}
        </div>
        {showPortalSwitch && (
          <div className="p-3 border-t border-slate-200">
            <button
              type="button"
              onClick={switchPortal}
              className="flex w-full items-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50 p-2 text-left text-xs font-semibold text-slate-700"
            >
              <ArrowLeftRight className="h-4 w-4 shrink-0 text-blue-600" />
              <span>{portalSwitchLabel}</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 shadow-2xs">
          {/* Left: Mobile hamburger & Product Switcher & Tenant Selector */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 1024) setMobileOpen(!mobileOpen)
                else setCollapsed(!collapsed)
              }}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
              title="Toggle Sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Product Switcher Dropdown */}
            <ProductSwitcher currentProductId={productId} />

            {/* Waffle Launcher */}
            <ProductLauncherMenu />

            {/* Context Selector */}
            <div className="hidden md:block">
              <ContextSelector />
            </div>
          </div>

          {/* Right: Search, Notifications, User */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => setShowSearchModal(true)}
              className="flex items-center gap-2 h-9 px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-500 transition-all shadow-2xs"
            >
              <Search className="h-4 w-4 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
            </button>

            {/* Notifications Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-1">
                    <span className="font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">
                      Mark read
                    </span>
                  </div>
                  <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                    {notifications.slice(0, 3).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          setShowNotifications(false)
                          if (n.link) navigate(n.link)
                        }}
                        className="py-2 px-1 hover:bg-slate-50 rounded cursor-pointer"
                      >
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${n.badgeColor}`}
                        >
                          {n.productName}
                        </span>
                        <p className="font-semibold text-slate-800 mt-1">{n.title}</p>
                        <p className="text-[11px] text-slate-500">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="relative border-l border-slate-200 pl-3 ml-1">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 rounded-xl p-1 hover:bg-slate-100 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                  {user?.name ? user.name.charAt(0) : 'A'}
                </div>
                <div className="hidden sm:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-slate-900 truncate max-w-[100px]">
                    {user?.name || 'Administrator'}
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    {user?.productRoles?.[productId] || user?.platformRole || 'Admin'}
                  </span>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 text-xs">
                  <div className="p-2 border-b border-slate-100 mb-1">
                    <p className="font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/app"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    <Layers className="h-4 w-4 text-blue-600" />
                    <span>Product Hub</span>
                  </Link>
                  <Link
                    to="/app/organization"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                  >
                    <span>Organization</span>
                  </Link>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      navigate('/auth')
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-left font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Product View */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {productId === 'hrms' && portalMode === 'self' && adminAccess && (
            <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-2.5 text-xs text-indigo-900 shadow-2xs">
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                <span>
                  <strong>Employee Self-Service Mode:</strong> Viewing your personal employee portal.
                </span>
              </div>
              <button
                type="button"
                onClick={switchPortal}
                className="font-bold text-indigo-700 hover:text-indigo-900 hover:underline shrink-0"
              >
                Switch to HR Admin &rarr;
              </button>
            </div>
          )}
          <Outlet />
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </div>
  )
}
