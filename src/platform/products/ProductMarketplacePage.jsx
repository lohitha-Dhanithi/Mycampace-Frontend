// src/platform/products/ProductMarketplacePage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  MonitorPlay,
  DollarSign,
  UserPlus,
  Users2,
  Receipt,
  Library,
  Bus,
  Home,
  MessageSquare,
  Briefcase,
  Award,
  BarChart3,
  Sparkles,
  Search,
  Check,
  CheckCircle2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { productService, PRODUCT_CATEGORIES } from '@/services/productService'
import { entitlementService } from '@/services/entitlementService'

const ICON_MAP = {
  academics: GraduationCap,
  lms: MonitorPlay,
  finance: DollarSign,
  admissions: UserPlus,
  hrms: Users2,
  payroll: Receipt,
  library: Library,
  transport: Bus,
  hostel: Home,
  communication: MessageSquare,
  placement: Briefcase,
  alumni: Award,
  analytics: BarChart3,
  'ai-assistant': Sparkles,
}

export function ProductMarketplacePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('all')
  const [search, setSearch] = useState('')
  const [, setRefreshKey] = useState(0)

  const products = productService.getProducts()

  const handleActivate = (productId, plan) => {
    entitlementService.grantEntitlement(productId, plan || 'Professional')
    setRefreshKey((k) => k + 1)
  }

  const handleDeactivate = (productId) => {
    if (window.confirm('Are you sure you want to deactivate this product for your organization?')) {
      entitlementService.revokeEntitlement(productId)
      setRefreshKey((k) => k + 1)
    }
  }

  const filtered = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.tagline.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeTab === 'all' || p.category === activeTab
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
            <Zap className="h-4 w-4" />
            <span>Product Catalog & Ecosystem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            MyCampace Product Marketplace
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Activate specialized education applications for your institution with instant provisioning.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products or capabilities..."
            className="w-full h-10 pl-10 pr-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-2xs"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {PRODUCT_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveTab(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              activeTab === cat.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => {
          const Icon = ICON_MAP[product.id] || Sparkles
          const isActive = product.isActive
          const isComingSoon = product.status === 'Coming Soon'

          return (
            <div
              key={product.id}
              className={`rounded-2xl border transition-all flex flex-col justify-between p-6 ${
                isActive
                  ? 'bg-white border-blue-200/80 ring-1 ring-blue-500/20 shadow-md'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${product.iconBg}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        {product.categoryName}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : isComingSoon
                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                        : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}
                  >
                    {isActive ? '✓ Active' : isComingSoon ? 'Coming Soon' : 'Available'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-4">
                  {product.description}
                </p>

                {/* Capabilities */}
                <div className="space-y-1.5 pt-3 border-t border-slate-100 mb-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Features Included:
                  </span>
                  {product.keyCapabilities.slice(0, 3).map((cap, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                      <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span className="truncate">{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                <div className="text-[11px]">
                  <span className="text-slate-400 block">Pricing</span>
                  <span className="font-semibold text-slate-800">{product.pricing}</span>
                </div>

                <div className="flex items-center gap-2">
                  {isActive ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleDeactivate(product.id)}
                        className="text-[11px] font-semibold text-slate-400 hover:text-red-600 px-2 py-1 rounded"
                      >
                        Deactivate
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          productService.recordProductVisit(product.id)
                          navigate(product.route)
                        }}
                        className="h-9 px-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs"
                      >
                        <span>Open</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : isComingSoon ? (
                    <button
                      type="button"
                      disabled
                      className="h-9 px-4 rounded-xl bg-slate-100 text-slate-400 font-semibold text-xs cursor-not-allowed"
                    >
                      Notify Me
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleActivate(product.id, product.plan)}
                      className="h-9 px-4 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add Product</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
