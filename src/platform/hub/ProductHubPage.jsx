// src/platform/hub/ProductHubPage.jsx
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  MoreVertical,
  ArrowRight,
  GraduationCap,
  MonitorPlay,
  UserPlus,
  Landmark,
  Users,
  Sparkles,
  Settings,
  Layers,
} from 'lucide-react'
import { productService } from '@/services/productService'
import { useAuth } from '@/store/AuthContext'

export function ProductHubPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const userName = user?.name ? user.name.split(' ')[0] : 'Vikram'

  // Activated products for "Your Products" section
  const yourProducts = [
    {
      id: 'academics',
      name: 'Academics',
      category: 'Core Academic',
      description: 'Manage programs, courses, curriculum and class schedules.',
      icon: GraduationCap,
      iconBg: 'bg-blue-50 text-blue-600',
      status: 'Active',
      route: '/app/academics',
    },
    {
      id: 'lms',
      name: 'LMS',
      category: 'Core Academic',
      description: 'Deliver rich blended learning with self-paced video modules and assessments.',
      icon: MonitorPlay,
      iconBg: 'bg-purple-50 text-purple-600',
      status: 'Active',
      route: '/app/lms',
    },
    {
      id: 'admissions',
      name: 'Admissions',
      category: 'Core Academic',
      description: 'Streamline admissions with lead tracking, counselling and application management.',
      icon: UserPlus,
      iconBg: 'bg-emerald-50 text-emerald-600',
      status: 'Active',
      route: '/app/admissions',
    },
    {
      id: 'finance',
      name: 'Finance',
      category: 'Finance & Administration',
      description: 'Handle fees, billing, payments and financial reporting.',
      icon: ({ className }) => <span className={`font-bold ${className}`}>₹</span>,
      iconBg: 'bg-amber-50 text-amber-600',
      status: 'Active',
      route: '/app/finance',
    },
  ]

  // Products for "Explore Products" section
  const exploreProducts = [
    {
      id: 'admissions-explore',
      name: 'Admissions',
      category: 'Core Academic',
      description: 'Manage enquiries, applications, counselling and admissions.',
      icon: UserPlus,
      iconBg: 'bg-emerald-50 text-emerald-600',
      pricing: 'From ₹40 / lead',
      route: '/app/admissions',
    },
    {
      id: 'campus-operations',
      name: 'Campus Operations',
      category: 'Operations',
      description: 'Manage hostel, transport, facilities and campus operations.',
      icon: Landmark,
      iconBg: 'bg-blue-50 text-blue-600',
      pricing: 'From ₹25 / student / month',
      route: '/app/products',
    },
    {
      id: 'student-engagement',
      name: 'Student Engagement',
      category: 'Student',
      description: 'Enable student communities, events, feedback and support.',
      icon: Users,
      iconBg: 'bg-purple-50 text-purple-600',
      pricing: 'From ₹15 / student / month',
      route: '/app/products',
    },
    {
      id: 'intelligence',
      name: 'Intelligence',
      category: 'AI & Analytics',
      description: 'Get insights from data with dashboards, reports and predictive analytics.',
      icon: Sparkles,
      iconBg: 'bg-cyan-50 text-cyan-600',
      pricing: 'From ₹10 / user / month',
      route: '/app/products',
    },
  ]

  const filterButtons = [
    { id: 'all', label: 'All', icon: null },
    { id: 'academics', label: 'Academics', icon: GraduationCap },
    { id: 'finance', label: 'Finance', icon: ({ className }) => <span className={`font-bold ${className}`}>₹</span> },
    { id: 'operations', label: 'Operations', icon: Settings },
    { id: 'student', label: 'Student', icon: Users },
    { id: 'intelligence', label: 'Intelligence', icon: Sparkles },
  ]

  const handleOpenProduct = (route, productId) => {
    if (productId) productService.recordProductVisit(productId)
    navigate(route)
  }

  // Filter products by search query
  const filteredYourProducts = yourProducts.filter((p) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  })

  const filteredExploreProducts = exploreProducts.filter((p) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
  })

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* 1. Hero Banner Area with Greeting, Search, and 3D Isometric Platform Graphic */}
      <div className="relative rounded-3xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-cyan-50/50 p-6 sm:p-10 border border-blue-100/60 overflow-hidden">
        {/* Soft background ambient glows */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-300/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Text & Big Search Bar */}
          <div className="max-w-xl space-y-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <span>Good morning, {userName}</span>
                <span className="text-2xl">👋</span>
              </h1>
              <p className="mt-1 text-sm text-slate-500 font-medium">
                Everything your institution needs, in one place.
              </p>
            </div>

            {/* Big Search Input */}
            <div className="relative max-w-lg">
              <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products, features or capabilities..."
                className="w-full h-11 pl-11 pr-4 rounded-full border border-slate-200/90 bg-white/95 hover:bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs transition-all"
              />
            </div>
          </div>

          {/* Right: 3D Stacked Platform Illustration */}
          <div className="hidden lg:flex items-center justify-center shrink-0 pr-4">
            <div className="relative w-64 h-48 flex items-center justify-center">
              {/* Radial backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-400/20 via-indigo-300/20 to-cyan-300/20 rounded-full blur-2xl transform scale-90" />

              {/* Floating Badge 1: Top Graduation Cap */}
              <div className="absolute -top-1 left-1/3 transform -translate-x-1/2 h-9 w-9 rounded-xl bg-white border border-blue-100 shadow-md shadow-blue-500/10 flex items-center justify-center text-blue-600 animate-bounce duration-1000">
                <GraduationCap className="h-4 w-4" />
              </div>

              {/* Floating Badge 2: Top Right Users */}
              <div className="absolute top-2 right-4 h-9 w-9 rounded-xl bg-white border border-emerald-100 shadow-md shadow-emerald-500/10 flex items-center justify-center text-emerald-600">
                <Users className="h-4 w-4" />
              </div>

              {/* Floating Badge 3: Left Purple User */}
              <div className="absolute bottom-8 left-2 h-9 w-9 rounded-xl bg-white border border-purple-100 shadow-md shadow-purple-500/10 flex items-center justify-center text-purple-600">
                <UserPlus className="h-4 w-4" />
              </div>

              {/* Floating Badge 4: Right Rupee Finance */}
              <div className="absolute bottom-8 right-2 h-9 w-9 rounded-xl bg-white border border-amber-100 shadow-md shadow-amber-500/10 flex items-center justify-center text-amber-600 font-bold text-sm">
                ₹
              </div>

              {/* Center 3D Isometric Blue Stack Graphic */}
              <svg viewBox="0 0 160 120" className="w-44 h-36 drop-shadow-xl" fill="none">
                {/* Bottom Shadow Plate */}
                <ellipse cx="80" cy="98" rx="55" ry="18" fill="#1E40AF" opacity="0.15" />
                
                {/* Plate 3 (Bottom Layer) */}
                <path
                  d="M25 72 L80 94 L135 72 L135 79 L80 101 L25 79 Z"
                  fill="#2563EB"
                  opacity="0.9"
                />
                <path
                  d="M25 72 L80 50 L135 72 L80 94 Z"
                  fill="#3B82F6"
                  opacity="0.8"
                />

                {/* Plate 2 (Middle Layer) */}
                <path
                  d="M30 58 L80 78 L130 58 L130 65 L80 85 L30 65 Z"
                  fill="#1D4ED8"
                />
                <path
                  d="M30 58 L80 38 L130 58 L80 78 Z"
                  fill="#60A5FA"
                />

                {/* Plate 1 (Top Layer) */}
                <path
                  d="M35 44 L80 62 L125 44 L125 50 L80 68 L35 50 Z"
                  fill="#1E40AF"
                />
                <path
                  d="M35 44 L80 26 L125 44 L80 62 Z"
                  fill="#93C5FD"
                />

                {/* Top Glowing Diamond Star */}
                <circle cx="80" cy="44" r="3.5" fill="#FFFFFF" />
                <path d="M80 38 L82 44 L80 50 L78 44 Z" fill="#FFFFFF" opacity="0.9" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Category Filter Pills Row (All, Academics, Finance, Operations, Student, Intelligence) */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        {filterButtons.map((btn) => {
          const isActive = selectedFilter === btn.id
          const Icon = btn.icon
          return (
            <button
              key={btn.id}
              type="button"
              onClick={() => setSelectedFilter(btn.id)}
              className={`h-9 px-4 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
              }`}
            >
              {Icon && <Icon className="h-3.5 w-3.5" />}
              <span>{btn.label}</span>
            </button>
          )
        })}
      </div>

      {/* 3. Section: "Your Products" */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Your Products
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Products you have already activated for your institution.
            </p>
          </div>
          <Link
            to="/app/products"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredYourProducts.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Icon + Name + Category + 3 dots */}
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="flex items-center gap-3">
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${p.iconBg}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900 leading-tight">
                          {p.name}
                        </h3>
                        <span className="text-[11px] text-slate-400 font-medium">
                          {p.category}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-6 min-h-[36px]">
                    {p.description}
                  </p>
                </div>

                {/* Bottom: Active status dot + Open button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span>{p.status}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleOpenProduct(p.route, p.id)}
                    className="h-8 px-4 rounded-xl border border-blue-500 bg-white hover:bg-blue-50 text-blue-600 font-semibold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                  >
                    <span>Open</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. Section: "Explore Products" */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Explore Products
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Discover more products to enhance your institution's capabilities.
            </p>
          </div>
          <Link
            to="/app/products"
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline"
          >
            <span>View all</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* 4 Explore Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredExploreProducts.map((p) => {
            const Icon = p.icon
            return (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Top: Icon + Name + Category */}
                  <div className="flex items-start gap-3 mb-3.5">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${p.iconBg}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {p.name}
                      </h3>
                      <span className="text-[11px] text-slate-400 font-medium">
                        {p.category}
                      </span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed mb-6 min-h-[36px]">
                    {p.description}
                  </p>
                </div>

                {/* Bottom: Pricing + Activate button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-medium">
                    {p.pricing}
                  </span>

                  <button
                    type="button"
                    onClick={() => navigate('/app/products')}
                    className="h-8 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    <span>Activate</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
