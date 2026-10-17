// src/platform/auth/PlatformAuthPage.tsx
// Public landing page that hosts the sign-in (/auth) and sign-up (/auth/signup) forms.
import React, { useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  X,
  Play,
  BookOpen,
  Code,
  HelpCircle,
  Layers,
  GraduationCap,
  DollarSign,
  MonitorPlay,
  UserPlus,
  BarChart3,
  Settings,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { AuthCard, type AuthMode } from './AuthForms'
import { AUTH_ROUTES } from './landing'

export function PlatformAuthPage({ mode }: { mode: AuthMode }) {
  const [searchParams] = useSearchParams()
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showSupportModal, setShowSupportModal] = useState(false)

  // Legacy links used /auth?mode=signup.
  if (mode === 'signin' && searchParams.get('mode') === 'signup') {
    return <Navigate to={AUTH_ROUTES.signUp} replace />
  }

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // -------------------------------------------------------------
  // Video Showcase Data (3 Columns with distinct vertical loops)
  // -------------------------------------------------------------
  const col1Videos = [
    {
      id: 'v1',
      title: 'Platform Architecture & Product Hub Walkthrough',
      duration: '05:20',
      category: 'Platform Core',
      tagColor: 'bg-blue-100 text-blue-700',
      thumb: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      description: 'How MyCampace separates platform identity from isolated product applications.',
    },
    {
      id: 'v2',
      title: 'Academics: Curricula, Course Regulations & Credits',
      duration: '07:45',
      category: 'Academics',
      tagColor: 'bg-indigo-100 text-indigo-700',
      thumb: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
      description: 'Setting up multi-board programs, sections and faculty workload rosters.',
    },
    {
      id: 'v3',
      title: 'Finance Automation: Dynamic Fee Structures & Gateways',
      duration: '06:10',
      category: 'Finance',
      tagColor: 'bg-amber-100 text-amber-700',
      thumb: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
      description: 'Configuring split fee heads, automated invoice schedules and reconciliation.',
    },
    {
      id: 'v4',
      title: 'Admissions CRM: Lead Pipelines & Counselling Funnel',
      duration: '04:30',
      category: 'Admissions',
      tagColor: 'bg-emerald-100 text-emerald-700',
      thumb: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
      description: 'Managing walk-in interviews, online forms and merit-list generation.',
    },
  ]

  const col2Videos = [
    {
      id: 'v5',
      title: 'LMS: Interactive Multimedia Modules & Quizzes',
      duration: '08:15',
      category: 'LMS',
      tagColor: 'bg-purple-100 text-purple-700',
      thumb: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=600&auto=format&fit=crop&q=80',
      description: 'Creating blended video lessons, student progress rubrics and test banks.',
    },
    {
      id: 'v6',
      title: 'Product-Specific RBAC: Multi-Product Role Mapping',
      duration: '05:50',
      category: 'Security',
      tagColor: 'bg-blue-100 text-blue-700',
      thumb: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
      description: 'How one user can be an Admin in LMS and a Teacher in Academics without conflicts.',
    },
    {
      id: 'v7',
      title: 'Campus Operations: Hostels, Transport GPS & Libraries',
      duration: '06:40',
      category: 'Operations',
      tagColor: 'bg-teal-100 text-teal-700',
      thumb: 'https://images.unsplash.com/photo-1562774053-701939374585?w=600&auto=format&fit=crop&q=80',
      description: 'Fleet routing, RFID accession registers, and warden gate pass tracking.',
    },
    {
      id: 'v8',
      title: 'REST API & Webhook Integrations for Developers',
      duration: '09:20',
      category: 'Developers',
      tagColor: 'bg-rose-100 text-rose-700',
      thumb: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      description: 'Connecting third-party SIS, payment gateways and ERP data lakes.',
    },
  ]

  const col3Videos = [
    {
      id: 'v9',
      title: 'White Label Deployment: Custom Domains & Theming',
      duration: '04:55',
      category: 'White Label',
      tagColor: 'bg-sky-100 text-sky-700',
      thumb: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      description: 'Branded portal setups, custom email domains, and tenant isolation.',
    },
    {
      id: 'v10',
      title: 'AI Copilot & Predictive Institutional Analytics',
      duration: '06:05',
      category: 'Intelligence',
      tagColor: 'bg-cyan-100 text-cyan-700',
      thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
      description: 'Generating lesson outlines, predicting fee dropouts, and NIRF dashboards.',
    },
    {
      id: 'v11',
      title: 'Student SIS: Digital Enrolments, Exits & Alumni Records',
      duration: '05:30',
      category: 'SIS',
      tagColor: 'bg-indigo-100 text-indigo-700',
      thumb: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&auto=format&fit=crop&q=80',
      description: 'Full student lifecycle management across academic cohorts.',
    },
    {
      id: 'v12',
      title: 'Institutional Audit Logs & SOC2 Compliance Controls',
      duration: '07:15',
      category: 'Compliance',
      tagColor: 'bg-slate-100 text-slate-700',
      thumb: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
      description: 'Maintaining tamper-proof audit trails for government and CBSE accreditations.',
    },
  ]

  return (
    <div className="min-h-screen bg-white text-slate-800 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* ============================================================== */}
      {/* 1. AUTHENTICATION HEADER                                       */}
      {/* ============================================================== */}
      <header className="sticky top-0 z-40 h-14 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md px-4 sm:px-8 flex items-center justify-between">
        {/* Left: Brand */}
        <div className="flex items-center gap-3">
          <Link to="/app" className="flex items-center gap-2.5 group">
            <img
              src="/mycampace-logo.png"
              alt="MyCampace"
              className="h-8 w-8 object-contain drop-shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase leading-tight">
                MYCAMPACE
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                Platform Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Center / Right Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => scrollToSection('learn')}
            className="hover:text-blue-600 transition-colors"
          >
            Learn & Videos
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('knowledge')}
            className="hover:text-blue-600 transition-colors"
          >
            Knowledge Hub
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('api')}
            className="hover:text-blue-600 transition-colors"
          >
            API Docs
          </button>
          <button
            type="button"
            onClick={() => scrollToSection('whitelabel')}
            className="hover:text-blue-600 transition-colors"
          >
            White Label
          </button>
        </nav>

        {/* Right: Support */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowSupportModal(true)}
            className="text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Need help?</span>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 2 & 3. HERO AUTHENTICATION & FLOATING ECOSYSTEM VISUAL         */}
      {/* ============================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-white to-slate-50/30 sm:min-h-[calc(100vh-3.5rem)] flex items-start sm:items-center justify-center py-6 sm:py-10 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        {/* Subtle ambient blur backdrops */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-10 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center">
          {/* Right Column (Desktop) / Primary Form: Authentication Container with Animated Segmented Control */}
          <div className="lg:col-span-6 lg:order-2 flex justify-center">
            <AuthCard mode={mode} />
          </div>

          {/* Left Column (Desktop): Floating MyCampace Ecosystem Visualization */}
          <div className="hidden lg:flex lg:col-span-6 lg:order-1 flex-col items-center justify-center relative select-none">
            <div className="relative w-full max-w-lg h-[410px] flex items-center justify-center">
              {/* Outer decorative ring */}
              <div className="absolute inset-0 rounded-full border border-blue-200/40 animate-pulse pointer-events-none" />
              <div className="absolute inset-10 rounded-full border border-indigo-100/60 pointer-events-none" />

              {/* Connecting Lines SVG */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 410">
                <line x1="250" y1="205" x2="110" y2="80" stroke="#93C5FD" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="205" x2="390" y2="80" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="205" x2="80" y2="205" stroke="#FDE68A" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="205" x2="420" y2="205" stroke="#A7F3D0" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="205" x2="130" y2="340" stroke="#A5F3FC" strokeWidth="1.5" strokeDasharray="4 4" />
                <line x1="250" y1="205" x2="370" y2="340" stroke="#DDD6FE" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>

              {/* Center Core: MyCampace Platform Diamond */}
              <div className="relative z-20 h-22 w-22 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 p-1 shadow-2xl shadow-blue-500/30 flex items-center justify-center">
                <div className="h-full w-full rounded-[22px] bg-slate-900/90 flex flex-col items-center justify-center text-white text-center p-2">
                  <div className="h-6 w-6 rounded-lg bg-blue-500 flex items-center justify-center font-black text-xs">
                    M
                  </div>
                  <span className="text-[10px] font-black tracking-widest uppercase mt-0.5">
                    MYCAMPACE
                  </span>
                  <span className="text-[8px] text-blue-300 font-bold uppercase">Core</span>
                </div>
              </div>

              {/* Floating Node 1: Academics (Top Left) */}
              <div className="absolute top-4 left-10 animate-float-slow">
                <div className="p-2.5 rounded-2xl bg-white border border-blue-200/80 shadow-md shadow-blue-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <GraduationCap className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Academics</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Curriculum & Classes</span>
                  </div>
                </div>
              </div>

              {/* Floating Node 2: LMS (Top Right) */}
              <div className="absolute top-4 right-8 animate-float-medium">
                <div className="p-2.5 rounded-2xl bg-white border border-purple-200/80 shadow-md shadow-purple-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <MonitorPlay className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">LMS</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Digital Learning</span>
                  </div>
                </div>
              </div>

              {/* Floating Node 3: Finance (Mid Left) */}
              <div className="absolute top-40 -left-2 animate-float-fast">
                <div className="p-2.5 rounded-2xl bg-white border border-amber-200/80 shadow-md shadow-amber-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <DollarSign className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Finance</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Fees & Billing</span>
                  </div>
                </div>
              </div>

              {/* Floating Node 4: Admissions (Mid Right) */}
              <div className="absolute top-40 -right-2 animate-float-slow">
                <div className="p-2.5 rounded-2xl bg-white border border-emerald-200/80 shadow-md shadow-emerald-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <UserPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Admissions</h4>
                    <span className="text-[10px] text-slate-400 font-medium">CRM & Leads</span>
                  </div>
                </div>
              </div>

              {/* Floating Node 5: Analytics (Bottom Left) */}
              <div className="absolute bottom-4 left-10 animate-float-medium">
                <div className="p-2.5 rounded-2xl bg-white border border-cyan-200/80 shadow-md shadow-cyan-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center font-bold">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Analytics</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Executive KPIs</span>
                  </div>
                </div>
              </div>

              {/* Floating Node 6: Operations (Bottom Right) */}
              <div className="absolute bottom-4 right-8 animate-float-fast">
                <div className="p-2.5 rounded-2xl bg-white border border-indigo-200/80 shadow-md shadow-indigo-500/5 flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Settings className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Operations</h4>
                    <span className="text-[10px] text-slate-400 font-medium">Campus & Fleet</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom trust banner */}
            <div className="mt-2.5 flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-600">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Single Sign-On Across All Institutional Products</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. LEARN — 3-COLUMN VERTICAL INFINITE VIDEO SHOWCASE            */}
      {/* ============================================================== */}
      <section id="learn" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block mb-3">
              Video Knowledge & Demos
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Learn MyCampace
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-500">
              Product walkthroughs, tutorials and platform updates. Hover any stream to pause and inspect.
            </p>
          </div>

          {/* 3 Columns Showcase with Independent Vertical Movements */}
          <div className="relative h-[620px] overflow-hidden rounded-3xl p-4 bg-white/70 border border-slate-200/90 shadow-lg shadow-slate-200/50 pause-on-hover">
            {/* Top and Bottom gradient masks for smooth seamless fading */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white via-white/80 to-transparent z-20 pointer-events-none" />
            <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white via-white/80 to-transparent z-20 pointer-events-none" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 h-full">
              {/* Column 1: Moves UPWARD continuously */}
              <div className="overflow-hidden relative h-full">
                <div className="animate-scroll-up space-y-4">
                  {[...col1Videos, ...col1Videos].map((video, idx) => (
                    <div
                      key={`col1-${idx}`}
                      onClick={() => setSelectedVideo(video)}
                      className="group cursor-pointer rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-blue-400 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="relative h-40 overflow-hidden bg-slate-100">
                        <img
                          src={video.thumb}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-blue-900/40 transition-colors flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Play className="h-4 w-4 ml-0.5 fill-current" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-mono font-semibold backdrop-blur-xs">
                          {video.duration}
                        </span>
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${video.tagColor}`}
                        >
                          {video.category}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Moves DOWNWARD continuously */}
              <div className="hidden sm:block overflow-hidden relative h-full">
                <div className="animate-scroll-down space-y-4">
                  {[...col2Videos, ...col2Videos].map((video, idx) => (
                    <div
                      key={`col2-${idx}`}
                      onClick={() => setSelectedVideo(video)}
                      className="group cursor-pointer rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-blue-400 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="relative h-40 overflow-hidden bg-slate-100">
                        <img
                          src={video.thumb}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-purple-900/40 transition-colors flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-white/90 text-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-purple-600 group-hover:text-white transition-all">
                            <Play className="h-4 w-4 ml-0.5 fill-current" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-mono font-semibold backdrop-blur-xs">
                          {video.duration}
                        </span>
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${video.tagColor}`}
                        >
                          {video.category}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-purple-600 transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Moves UPWARD continuously */}
              <div className="hidden lg:block overflow-hidden relative h-full">
                <div className="animate-scroll-up space-y-4">
                  {[...col3Videos, ...col3Videos].map((video, idx) => (
                    <div
                      key={`col3-${idx}`}
                      onClick={() => setSelectedVideo(video)}
                      className="group cursor-pointer rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-2xs hover:shadow-xl hover:border-blue-400 hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="relative h-40 overflow-hidden bg-slate-100">
                        <img
                          src={video.thumb}
                          alt={video.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-blue-900/40 transition-colors flex items-center justify-center">
                          <div className="h-10 w-10 rounded-full bg-white/90 text-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                            <Play className="h-4 w-4 ml-0.5 fill-current" />
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-slate-900/80 text-white text-[10px] font-mono font-semibold backdrop-blur-xs">
                          {video.duration}
                        </span>
                        <span
                          className={`absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold ${video.tagColor}`}
                        >
                          {video.category}
                        </span>
                      </div>
                      <div className="p-3.5">
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {video.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                          {video.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 7. KNOWLEDGE HUB                                               */}
      {/* ============================================================== */}
      <section id="knowledge" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              KNOWLEDGE HUB
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Everything you need to get the most out of MyCampace.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Getting Started */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Getting Started</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Fast-track your onboarding with step-by-step institutional configuration tutorials.
                </p>
                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Setup guides & domain verification</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>First steps: Campus hierarchy</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Organization profile & branding</span>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-700">
                <span>Explore Getting Started</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 2: Product Guides */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Product Guides</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Deep-dive manuals for each education product within the MyCampace ecosystem.
                </p>
                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span>Academics: Curricula & Schedules</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span>LMS: Course creation & Rubrics</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span>Finance: Fee structures & Gateways</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    <span>Admissions & Campus Operations</span>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-purple-600 group-hover:text-purple-700">
                <span>Explore Product Guides</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            {/* Card 3: Help Center */}
            <div className="rounded-3xl border border-slate-200/90 bg-white p-7 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between group">
              <div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Help Center</h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  Answers to frequent operational queries, troubleshooting, and enterprise support tickets.
                </p>
                <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Frequently Asked Questions (FAQs)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Troubleshooting & Service Health</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Account Security & 2FA Recovery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>Billing Invoices & Subscriptions</span>
                  </div>
                </div>
              </div>
              <div className="pt-6 mt-6 border-t border-slate-100 flex items-center text-xs font-bold text-emerald-600 group-hover:text-emerald-700">
                <span>Explore Help Center</span>
                <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 8. API DOCUMENTATION — DEVELOPER PLATFORM                      */}
      {/* ============================================================== */}
      <section id="api" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left: Headline & Cards */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                  DEVELOPER PLATFORM
                </span>
                <h2 className="text-3xl font-extrabold text-white tracking-tight mt-3">
                  Build with MyCampace
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
                  Connect your applications, data lakes, and custom workflows with secure RESTful endpoints and real-time event webhooks.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Code className="h-4 w-4 text-blue-400" />
                    <span>API Documentation</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Explore OpenAPI specifications, JWT authorization schemes, and payload parameters.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Layers className="h-4 w-4 text-indigo-400" />
                    <span>API Reference & SDKs</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Browse endpoints for Academics, LMS, Finance Ledgers, and Admissions pipelines.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80">
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-cyan-400" />
                    <span>Developer Guides</span>
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Production integration examples, rate-limiting guidelines, and webhook delivery.
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href="/api/docs"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all"
                >
                  <span>Explore API Documentation</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Right: Developer Code Snippet Visual */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-slate-700 bg-slate-950 p-5 shadow-2xl font-mono text-xs">
                {/* Header dots */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-red-500/80" />
                    <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                    <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-sans">REST • OpenAPI 3.0</span>
                </div>

                {/* Code Body */}
                <div className="space-y-2 text-slate-300">
                  <div className="flex items-center gap-2 text-[11px] text-emerald-400">
                    <span className="bg-emerald-950 px-2 py-0.5 rounded font-bold">POST</span>
                    <span>/api/v1/students/enrolment</span>
                  </div>

                  <p className="text-slate-500 text-[10px]">// Request Payload</p>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-blue-300 overflow-x-auto leading-relaxed">
{`{
  "studentId": "STU-8921",
  "programCode": "CBSE-SR",
  "academicYear": "2026-27",
  "campusId": "camp-hyd-main",
  "productEntitlement": ["academics", "lms"]
}`}
                  </pre>

                  <p className="text-slate-500 text-[10px] pt-1">// Response: 200 OK</p>
                  <pre className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-emerald-300 overflow-x-auto leading-relaxed">
{`{
  "status": "success",
  "enrolmentId": "ENR-2026-9041",
  "provisions": {
    "academics": "Active",
    "lms": "Provisioned",
    "feeLedger": "Generated"
  }
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 9. MYCAMPACE WHITE LABEL                                       */}
      {/* ============================================================== */}
      <section id="whitelabel" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-50/80 border border-blue-200/80 p-8 sm:p-12 shadow-lg shadow-blue-500/5">
          <div className="max-w-2xl">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
              ENTERPRISE SOLUTIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              MyCampace White Label
            </h2>
            <p className="text-base font-semibold text-blue-700 mt-1">
              Your institution. Your brand. Powered by MyCampace.
            </p>
            <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
              Universities, multi-campus groups, and edtech partners can run the entire MyCampace product suite under their own independent institutional branding and custom domains.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-6 text-xs text-slate-700 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Custom logo, favicon & institutional branding</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Custom domain & SSL (e.g. portal.college.edu)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Tailored institutional color palettes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Completely branded student & faculty portal</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                <span>Dedicated SLA & enterprise API support</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setShowSupportModal(true)}
                className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-600/20 transition-all"
              >
                <span>Explore White Label</span>
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowSupportModal(true)}
                className="h-11 px-5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all"
              >
                Talk to our team
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 10. ENTERPRISE FOOTER                                          */}
      {/* ============================================================== */}
      <footer className="py-12 px-4 sm:px-8 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg bg-blue-600 text-white font-black text-xs flex items-center justify-center">
              M
            </div>
            <span className="font-bold text-slate-800">MyCampace Education Operating System</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <Link to="/app" className="hover:text-blue-600">Product Hub</Link>
            <Link to="/app/products" className="hover:text-blue-600">Marketplace</Link>
            <button type="button" onClick={() => scrollToSection('api')} className="hover:text-blue-600">APIs</button>
            <button type="button" onClick={() => scrollToSection('whitelabel')} className="hover:text-blue-600">White Label</button>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
              SOC2 Type II Certified
            </span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-6 pt-6 border-t border-slate-200/80 text-center text-[11px] text-slate-400">
          © 2026 MyCampace Technologies Inc. All rights reserved. Built for modern educational institutions.
        </div>
      </footer>

      {/* ============================================================== */}
      {/* MODAL 1: VIDEO PLAYER MODAL                                    */}
      {/* ============================================================== */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${selectedVideo.tagColor}`}>
                  {selectedVideo.category}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">{selectedVideo.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVideo(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Video Player Mockup / Embed */}
            <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
              <img
                src={selectedVideo.thumb}
                alt={selectedVideo.title}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-6 bg-slate-950/40">
                <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 mb-3 hover:scale-105 transition-transform cursor-pointer">
                  <Play className="h-6 w-6 ml-1 fill-current" />
                </div>
                <p className="text-sm font-bold">{selectedVideo.title}</p>
                <p className="text-xs text-slate-300 mt-1 max-w-md">{selectedVideo.description}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-500">Duration: {selectedVideo.duration} • 1080p Full HD</span>
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 font-bold hover:underline flex items-center gap-1"
              >
                <span>Watch on YouTube</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: NEED HELP / SUPPORT MODAL                             */}
      {/* ============================================================== */}
      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in-0">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <HelpCircle className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">MyCampace Institutional Support</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSupportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600">
              <p>
                Need assistance with onboarding, enterprise Single Sign-On (SSO), or product activation?
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                <p className="font-semibold text-slate-800">Enterprise Support Desk:</p>
                <p className="font-mono text-slate-600">support@mycampace.com</p>
                <p className="font-mono text-slate-600">+91 40 2345 6789 (Mon–Fri, 9am–6pm IST)</p>
              </div>
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="h-9 px-4 rounded-xl bg-blue-600 text-white font-semibold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
