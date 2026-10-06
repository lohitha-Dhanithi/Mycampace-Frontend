// src/services/productService.js

export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'All Products' },
  { id: 'core-academic', name: 'Core Academic' },
  { id: 'finance-admin', name: 'Finance & Administration' },
  { id: 'campus-operations', name: 'Campus Operations' },
  { id: 'student-engagement', name: 'Student Engagement' },
  { id: 'intelligence', name: 'Intelligence' },
]

export const PRODUCT_CATALOG = [
  // Core Academic
  {
    id: 'academics',
    name: 'Academics',
    fullName: 'MyCampace Academics',
    category: 'core-academic',
    categoryName: 'Core Academic',
    iconName: 'GraduationCap',
    tagline: 'Academic structures, classes, curricula & faculty workload',
    description: 'Manage academic programs, course regulations, class timetables, faculty assignments, and institutional calendars with multi-board flexibility.',
    keyCapabilities: [
      'Multi-Program & Course Architecture',
      'Curriculum, Subjects & Syllabi',
      'Class & Section Scheduling',
      'Faculty Workload & Timetable Management',
      'Academic Calendar & Examination Terms',
    ],
    pricing: 'Included in Base Platform',
    plan: 'Professional',
    modulesCount: 12,
    defaultStatus: 'Active',
    route: '/app/academics',
    color: 'from-blue-600 to-indigo-600',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    iconBg: 'bg-blue-500/10 text-blue-600',
  },
  {
    id: 'lms',
    name: 'LMS',
    fullName: 'MyCampace LMS',
    category: 'core-academic',
    categoryName: 'Core Academic',
    iconName: 'MonitorPlay',
    tagline: 'Modern digital learning, multimedia lessons & assessments',
    description: 'Deliver rich blended learning with self-paced video modules, quizzes, automated rubrics, and comprehensive student learning progress analytics.',
    keyCapabilities: [
      'Interactive Course Builder & Media Library',
      'Quizzes & Automated Assessment Engine',
      'Student Learning Portal & Progress Dashboard',
      'Assignment Grading with Rubrics',
      'Accreditation-aligned Learning Outcomes',
    ],
    pricing: '₹35 / student / year',
    plan: 'Professional',
    modulesCount: 8,
    defaultStatus: 'Active',
    route: '/app/lms',
    color: 'from-violet-600 to-purple-600',
    badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
    iconBg: 'bg-violet-500/10 text-violet-600',
  },
  {
    id: 'admissions',
    name: 'Admissions',
    fullName: 'MyCampace Admissions',
    category: 'core-academic',
    categoryName: 'Core Academic',
    iconName: 'UserPlus',
    tagline: 'End-to-end recruitment funnel, counselling & digital applications',
    description: 'Transform institutional enrolment with omnichannel lead tracking, multi-stage counselling, digital document verification, and merit list processing.',
    keyCapabilities: [
      'Lead & Enquiry Tracking CRM',
      'Counselling & Walk-in Interviews',
      'Online Application Form & Document Portal',
      'Merit List Generation & Seat Allocation',
      'Conversion Analytics & Source Tracking',
    ],
    pricing: '₹40 / enrolled lead',
    plan: 'Professional',
    modulesCount: 7,
    defaultStatus: 'Active',
    route: '/app/admissions',
    color: 'from-emerald-600 to-teal-600',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    iconBg: 'bg-emerald-500/10 text-emerald-600',
  },
  {
    id: 'examinations',
    name: 'Examinations',
    fullName: 'MyCampace Examinations',
    category: 'core-academic',
    categoryName: 'Core Academic',
    iconName: 'FileSpreadsheet',
    tagline: 'Hall tickets, grading patterns, moderation & digital marksheets',
    description: 'Manage institutional exam schedules, invigilation duty rosters, rubric-based mark entries, GPA/CGPA conversions, and tamper-proof digital transcripts.',
    keyCapabilities: [
      'Exam Timetable & Seating Matrix',
      'Internal & External Assessment Moderation',
      'Automated Grade Calculations & Weightages',
      'Digital Marks Card & Transcript Generator',
    ],
    pricing: 'Add-on License',
    plan: 'Enterprise',
    modulesCount: 6,
    defaultStatus: 'Available',
    route: '/app/examinations',
    color: 'from-cyan-600 to-blue-600',
    badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
    iconBg: 'bg-cyan-500/10 text-cyan-600',
  },

  // Finance & Administration
  {
    id: 'finance',
    name: 'Finance',
    fullName: 'MyCampace Finance',
    category: 'finance-admin',
    categoryName: 'Finance & Administration',
    iconName: 'DollarSign',
    tagline: 'Fee structures, collections, reconciliation & institutional finance',
    description: 'Complete fee billing automation, digital receipts, scholarship concessions, automated payment reminders, and banking reconciliation.',
    keyCapabilities: [
      'Dynamic Multi-Component Fee Structures',
      'Automated Invoice Generation & Reminders',
      'Online Payment Gateways & Offline Receipts',
      'Scholarship & Concession Workflow',
      'Real-time Bank Statement Reconciliation',
      'DhanitiPay Financial Services Integration',
    ],
    pricing: '0.85% payment fee or Flat Plan',
    plan: 'Professional',
    modulesCount: 14,
    defaultStatus: 'Active',
    route: '/app/finance',
    color: 'from-amber-600 to-orange-600',
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    iconBg: 'bg-amber-500/10 text-amber-600',
  },
  {
    id: 'payroll',
    name: 'Payroll',
    fullName: 'MyCampace Payroll',
    category: 'finance-admin',
    categoryName: 'Finance & Administration',
    iconName: 'Receipt',
    tagline: 'Salary computation, PF/ESI compliance, increments & payslips',
    description: 'Process institutional payroll with automated attendance integration, tax deductions, pay slips generation, and direct bank disbursement files.',
    keyCapabilities: [
      'Salary Slabs & Allowance Formulations',
      'Biometric / Bi-weekly Attendance Sync',
      'Statutory Deductions (PF, ESI, TDS, PT)',
      'Bulk Payslip Generation & Staff Self-Service',
    ],
    pricing: '₹30 / employee / month',
    plan: 'Starter',
    modulesCount: 5,
    defaultStatus: 'Available',
    route: '/app/payroll',
    color: 'from-rose-600 to-pink-600',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    iconBg: 'bg-rose-500/10 text-rose-600',
  },
  {
    id: 'hrms',
    name: 'HRMS',
    fullName: 'MyCampace HRMS',
    category: 'finance-admin',
    categoryName: 'Finance & Administration',
    iconName: 'Users2',
    tagline: 'Employee records, leave policies, onboarding & performance',
    description: 'Unified personnel management for teaching and non-teaching staff, track certifications, service history, leaves, and annual appraisal cycles.',
    keyCapabilities: [
      'Staff Profiles & Document Vault',
      'Leave Management & Approval Workflows',
      'Faculty Appraisal & Performance Metrics',
      'Campus Shift Scheduling & Attendance',
    ],
    pricing: '₹40 / staff / month',
    plan: 'Professional',
    modulesCount: 7,
    defaultStatus: 'Available',
    route: '/app/hrms',
    color: 'from-indigo-600 to-blue-700',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    iconBg: 'bg-indigo-500/10 text-indigo-600',
  },

  // Campus Operations
  {
    id: 'library',
    name: 'Library',
    fullName: 'MyCampace Library',
    category: 'campus-operations',
    categoryName: 'Campus Operations',
    iconName: 'Library',
    tagline: 'Cataloging, RFID / barcode circulation, fine calculation & digital journals',
    description: 'Complete KOHA-compatible library management supporting Dewey Decimal/Universal Decimal classification, barcode printing, and OPAC catalogue.',
    keyCapabilities: [
      'Accession Register & Barcode Scanning',
      'Student & Faculty Book Issue / Return',
      'Automated Overdue Reminders & Fines',
      'Digital E-book & Journal Subscriptions',
    ],
    pricing: '₹12,000 / campus / year',
    plan: 'Starter',
    modulesCount: 5,
    defaultStatus: 'Available',
    route: '/app/library',
    color: 'from-teal-600 to-emerald-700',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    iconBg: 'bg-teal-500/10 text-teal-600',
  },
  {
    id: 'transport',
    name: 'Transport',
    fullName: 'MyCampace Transport',
    category: 'campus-operations',
    categoryName: 'Campus Operations',
    iconName: 'Bus',
    tagline: 'Fleet routes, live vehicle GPS tracking, driver logs & safety alerts',
    description: 'Manage school buses and college transport with route optimization, stop allocations, live GPS telemetry, and driver credentials compliance.',
    keyCapabilities: [
      'Fleet & Vehicle Inventory',
      'Route & Pick-up Stop Planning',
      'Live GPS Tracking & Parent ETA Notifications',
      'Driver Roster & Maintenance Logs',
    ],
    pricing: '₹450 / bus / month',
    plan: 'Professional',
    modulesCount: 5,
    defaultStatus: 'Available',
    route: '/app/transport',
    color: 'from-amber-500 to-yellow-600',
    badgeColor: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    iconBg: 'bg-yellow-500/10 text-yellow-600',
  },
  {
    id: 'hostel',
    name: 'Hostel',
    fullName: 'MyCampace Hostel',
    category: 'campus-operations',
    categoryName: 'Campus Operations',
    iconName: 'Home',
    tagline: 'Room allocation, warden gate passes, mess catering & curfew logs',
    description: 'Residential campus management for dormitories, block inventories, biometric gate passes, mess menu billing, and incident logging.',
    keyCapabilities: [
      'Hostel Blocks & Room Bed Matrix',
      'Student Check-in / Out & Leave Pass Approvals',
      'Mess Meal Attendance & Dietary Tracking',
      'Hostel Maintenance & Asset Tracking',
    ],
    pricing: '₹20 / resident / month',
    plan: 'Starter',
    modulesCount: 4,
    defaultStatus: 'Available',
    route: '/app/hostel',
    color: 'from-fuchsia-600 to-purple-600',
    badgeColor: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200',
    iconBg: 'bg-fuchsia-500/10 text-fuchsia-600',
  },

  // Student Engagement
  {
    id: 'communication',
    name: 'Communication',
    fullName: 'MyCampace Communication',
    category: 'student-engagement',
    categoryName: 'Student Engagement',
    iconName: 'MessageSquare',
    tagline: 'Omnichannel SMS, WhatsApp notifications, emergency circulars & push alerts',
    description: 'Instant institutional broadcasts with verified WhatsApp Business API, SMS gateway failovers, and digital notices with read receipts.',
    keyCapabilities: [
      'Targeted Circulars (Class, Campus, Staff)',
      'WhatsApp & SMS Gateway Templates',
      'Automated Attendance & Fee Reminders',
      'Emergency SOS Broadcast Center',
    ],
    pricing: '₹0.18 / SMS or WhatsApp message',
    plan: 'Professional',
    modulesCount: 4,
    defaultStatus: 'Available',
    route: '/app/communication',
    color: 'from-sky-600 to-blue-600',
    badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
    iconBg: 'bg-sky-500/10 text-sky-600',
  },
  {
    id: 'placement',
    name: 'Placement',
    fullName: 'MyCampace Placement',
    category: 'student-engagement',
    categoryName: 'Student Engagement',
    iconName: 'Briefcase',
    tagline: 'Campus recruitment drives, resume builder, recruiter portal & offer letters',
    description: 'Empower placement cells with company job postings, automated student eligibility screening, drive schedules, and offer tracking.',
    keyCapabilities: [
      'Recruiter Registration & Job Openings',
      'Student Resume & Portfolio Builder',
      'Interview Schedules & Round-wise Shortlists',
      'Placement Statistics & NIRF Reports',
    ],
    pricing: '₹25,000 / year',
    plan: 'Enterprise',
    modulesCount: 5,
    defaultStatus: 'Available',
    route: '/app/placement',
    color: 'from-blue-700 to-indigo-800',
    badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
    iconBg: 'bg-blue-600/10 text-blue-700',
  },
  {
    id: 'alumni',
    name: 'Alumni',
    fullName: 'MyCampace Alumni',
    category: 'student-engagement',
    categoryName: 'Student Engagement',
    iconName: 'Award',
    tagline: 'Alumni network, mentoring programs, reunions & institutional endowments',
    description: 'Connect graduating cohorts with mentorship opportunities, directory networking, donation funds, and alumni chapter events.',
    keyCapabilities: [
      'Searchable Alumni Directory & Map',
      'Mentorship Matching Engine',
      'Chapter Events & Ticket Sales',
      'Endowment & Giving Fund Campaigns',
    ],
    pricing: '₹15,000 / year',
    plan: 'Starter',
    modulesCount: 4,
    defaultStatus: 'Available',
    route: '/app/alumni',
    color: 'from-rose-500 to-red-600',
    badgeColor: 'bg-red-50 text-red-700 border-red-200',
    iconBg: 'bg-red-500/10 text-red-600',
  },

  // Intelligence
  {
    id: 'analytics',
    name: 'Analytics',
    fullName: 'MyCampace Executive Analytics',
    category: 'intelligence',
    categoryName: 'Intelligence',
    iconName: 'BarChart3',
    tagline: 'Institutional KPI dashboards, financial forecasts & NIRF/NAAC metrics',
    description: 'Executive intelligence suite for leadership boards, providing predictive enrolment insights, collection velocities, and academic cohort progress.',
    keyCapabilities: [
      'Executive Leadership KPIs',
      'NAAC / NIRF / CBSE Compliance Metrics',
      'Revenue Forecasting & Budget Variances',
      'Student Dropout Risk Indicators',
    ],
    pricing: 'Enterprise Tier',
    plan: 'Enterprise',
    modulesCount: 6,
    defaultStatus: 'Available',
    route: '/app/analytics',
    color: 'from-emerald-700 to-teal-800',
    badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    iconBg: 'bg-emerald-600/10 text-emerald-700',
  },
  {
    id: 'ai-assistant',
    name: 'AI Assistant',
    fullName: 'MyCampace AI Copilot',
    category: 'intelligence',
    categoryName: 'Intelligence',
    iconName: 'Sparkles',
    tagline: 'Generative lesson planning, student doubt resolver & smart reporting',
    description: 'AI-driven copilot for faculty and administrators to summarize student performance, generate lesson plans, and query institutional databases in natural language.',
    keyCapabilities: [
      'Natural Language Database Queries',
      'Curriculum & Syllabus Question Generator',
      'Automated Student Progress Summaries',
      'Administrative Drafting & Translation',
    ],
    pricing: 'Add-on License',
    plan: 'Coming Soon',
    modulesCount: 3,
    defaultStatus: 'Coming Soon',
    route: '/app/ai-assistant',
    color: 'from-purple-600 to-pink-600',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
    iconBg: 'bg-purple-500/10 text-purple-600',
  },
]

// Default enabled products for the initial organization
const INITIAL_ENABLED_PRODUCTS = ['academics', 'lms', 'finance', 'admissions']

class ProductService {
  storageKey: string
  recentsKey: string

  constructor() {
    this.storageKey = 'mycampace_active_products'
    this.recentsKey = 'mycampace_recent_products'
    this.init()
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(INITIAL_ENABLED_PRODUCTS))
    }
  }

  // Get full catalog
  getProducts() {
    const activeIds = this.getActiveProductIds()
    return PRODUCT_CATALOG.map((p) => {
      let status = p.defaultStatus
      if (activeIds.includes(p.id)) {
        status = 'Active'
      }
      return {
        ...p,
        status,
        isActive: activeIds.includes(p.id),
      }
    })
  }

  getActiveProductIds() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : INITIAL_ENABLED_PRODUCTS
    } catch (e) {
      return INITIAL_ENABLED_PRODUCTS
    }
  }

  // Get product by ID
  getProductById(id) {
    const products = this.getProducts()
    return products.find((p) => p.id === id) || null
  }

  // Get only enabled products for current organization
  getOrganizationProducts() {
    const products = this.getProducts()
    return products.filter((p) => p.isActive)
  }

  // Activate a product for organization
  activateProduct(id) {
    const active = this.getActiveProductIds()
    if (!active.includes(id)) {
      const updated = [...active, id]
      localStorage.setItem(this.storageKey, JSON.stringify(updated))
    }
    return this.getProductById(id)
  }

  // Deactivate product
  deactivateProduct(id) {
    const active = this.getActiveProductIds()
    const updated = active.filter((pId) => pId !== id)
    localStorage.setItem(this.storageKey, JSON.stringify(updated))
    return true
  }

  // Check product access for organization & user
  checkProductAccess(productId) {
    const product = this.getProductById(productId)
    if (!product) return { allowed: false, reason: 'not_found' }
    if (product.defaultStatus === 'Coming Soon') {
      return { allowed: false, reason: 'coming_soon', product }
    }
    const active = this.getActiveProductIds()
    if (!active.includes(productId)) {
      return { allowed: false, reason: 'not_enabled', product }
    }
    return { allowed: true, product }
  }

  // Track recently used products
  recordProductVisit(productId) {
    try {
      let recents = this.getRecentlyUsedProductIds()
      recents = [productId, ...recents.filter((id) => id !== productId)].slice(0, 5)
      localStorage.setItem(this.recentsKey, JSON.stringify(recents))
    } catch (e) {
      // ignore
    }
  }

  getRecentlyUsedProductIds() {
    try {
      const stored = localStorage.getItem(this.recentsKey)
      return stored ? JSON.parse(stored) : ['academics', 'lms', 'finance']
    } catch (e) {
      return ['academics', 'lms', 'finance']
    }
  }

  getRecentlyUsedProducts() {
    const recentIds = this.getRecentlyUsedProductIds()
    const activeProducts = this.getOrganizationProducts()
    return recentIds
      .map((id) => activeProducts.find((p) => p.id === id))
      .filter(Boolean)
  }

  setInitialSelectedProducts(productIds) {
    if (Array.isArray(productIds) && productIds.length > 0) {
      localStorage.setItem(this.storageKey, JSON.stringify(productIds))
    }
  }
}

export const productService = new ProductService()
