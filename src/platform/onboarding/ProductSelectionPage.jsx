// src/platform/onboarding/ProductSelectionPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  GraduationCap,
  MonitorPlay,
  UserPlus,
  DollarSign,
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
  CheckCircle2,
  Check,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Layers,
} from 'lucide-react'
import { productService, PRODUCT_CATEGORIES } from '@/services/productService'

const ICON_MAP = {
  GraduationCap,
  MonitorPlay,
  UserPlus,
  DollarSign,
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
}

export function ProductSelectionPage() {
  const navigate = useNavigate()
  const allProducts = productService.getProducts()

  // Default initial selected products
  const [selectedProductIds, setSelectedProductIds] = useState(['academics', 'lms', 'finance'])
  const [activeCategory, setActiveCategory] = useState('all')

  const toggleProduct = (productId) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(selectedProductIds.filter((id) => id !== productId))
    } else {
      setSelectedProductIds([...selectedProductIds, productId])
    }
  }

  const handleContinue = () => {
    productService.setInitialSelectedProducts(selectedProductIds)
    navigate('/onboarding/team')
  }

  const filteredProducts = allProducts.filter((p) => {
    if (activeCategory === 'all') return true
    return p.category === activeCategory
  })

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 pb-32">
      <div className="max-w-6xl mx-auto">
        {/* Stepper Header */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">
              Step 2 of 4: Product Selection
            </span>
            <span className="text-xs text-slate-400 font-medium">Next: Invite Team</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-2/4 rounded-full transition-all duration-300" />
          </div>
        </div>

        {/* Title & Headline */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20 mb-3">
            <Layers className="h-3.5 w-3.5" /> MyCampace Product Ecosystem
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Choose the products your institution needs
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-400">
            You can add or activate products anytime. Each product operates independently with dedicated dashboards, workflows, and role permissions.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((product) => {
            const Icon = ICON_MAP[product.iconName] || Layers
            const isSelected = selectedProductIds.includes(product.id)
            const isComingSoon = product.status === 'Coming Soon'

            return (
              <div
                key={product.id}
                onClick={() => !isComingSoon && toggleProduct(product.id)}
                className={`group relative rounded-2xl p-6 transition-all border flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900/90 border-blue-500 ring-2 ring-blue-500/40 shadow-xl shadow-blue-500/10'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                } ${isComingSoon ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <div>
                  {/* Top Bar: Icon + Category + Checkbox */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center ${product.iconBg}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {product.categoryName}
                        </span>
                        <h3 className="text-lg font-bold text-white leading-tight">
                          {product.name}
                        </h3>
                      </div>
                    </div>

                    {!isComingSoon ? (
                      <div
                        className={`h-6 w-6 rounded-lg flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-blue-600 border-blue-500 text-white'
                            : 'border-slate-700 bg-slate-800 text-transparent'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                    ) : (
                      <span className="text-[10px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full">
                        Soon
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {/* Key Capabilities */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-800/80 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Key Capabilities:
                    </span>
                    {product.keyCapabilities.slice(0, 4).map((cap, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Plan / Pricing & Select Button */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between mt-auto">
                  <div className="text-[11px]">
                    <span className="text-slate-500 block font-medium">Pricing Plan</span>
                    <span className="font-semibold text-slate-300">{product.pricing}</span>
                  </div>

                  <button
                    type="button"
                    disabled={isComingSoon}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {isComingSoon ? 'Coming Soon' : isSelected ? '✓ Selected' : '+ Select Product'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Floating Sticky Summary Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 p-4 sm:px-8 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400">
              {selectedProductIds.length}
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {selectedProductIds.length} Products Selected
              </p>
              <p className="text-xs text-slate-400 hidden sm:block">
                Selected products will be provisioned in your MyCampace workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/onboarding/organization')}
              className="h-11 px-4 rounded-xl border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700"
            >
              Back
            </button>
            <button
              type="button"
              disabled={selectedProductIds.length === 0}
              onClick={handleContinue}
              className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30 disabled:opacity-50"
            >
              <span>Continue to Invite Team</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
