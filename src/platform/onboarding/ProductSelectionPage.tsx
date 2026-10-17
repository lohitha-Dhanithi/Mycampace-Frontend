// src/platform/onboarding/ProductSelectionPage.tsx
// Step 3 of 5: products to provision for the organization (POST /onboarding/products).
import React, { useEffect, useRef, useState } from 'react'
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
  ArrowLeft,
  ArrowRight,
  Layers,
} from 'lucide-react'
import { productService, PRODUCT_CATEGORIES } from '@/services/productService'
import { ONBOARDING_PRODUCT_IDS, onboardingService, usePlatformApi } from '@/services/onboardingService'
import { FormAlert } from '@/platform/FormField'
import { describeApiError } from '@/platform/validation'
import { OnboardingProgress, PrimaryButton, useOnboardingReturnTo, useRefreshProfile, useSavedApplication } from './OnboardingChrome'

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

const DEFAULT_SELECTION = ['academics', 'lms', 'finance']

export function ProductSelectionPage() {
  const navigate = useNavigate()
  const platform = usePlatformApi()
  const refreshProfile = useRefreshProfile()
  const { returnTo, editingFromReview } = useOnboardingReturnTo()
  const allProducts = productService.getProducts()
  // With the backend, only products it can provision are selectable.
  const isSelectable = (p: { id: string; status: string }) =>
    p.status !== 'Coming Soon' && (!platform || ONBOARDING_PRODUCT_IDS.includes(p.id))

  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(DEFAULT_SELECTION)
  const [activeCategory, setActiveCategory] = useState('all')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const inFlight = useRef(false)

  // Products already saved on the server win over the defaults (refresh / coming back from a later step).
  const saved = useSavedApplication(platform)
  useEffect(() => {
    const ids = saved.data?.products.map((p) => p.productId).filter((id) => ONBOARDING_PRODUCT_IDS.includes(id))
    if (ids?.length) setSelectedProductIds(ids)
  }, [saved.data])

  const toggleProduct = (productId: string) => {
    setError('')
    setSelectedProductIds((ids) => (ids.includes(productId) ? ids.filter((id) => id !== productId) : [...ids, productId]))
  }

  const handleContinue = async () => {
    if (inFlight.current) return
    if (selectedProductIds.length === 0) {
      setError('Select at least one product to continue.')
      return
    }
    inFlight.current = true
    setSaving(true)
    setError('')
    try {
      if (platform) {
        await onboardingService.saveProducts(selectedProductIds)
        await refreshProfile()
      }
      productService.setInitialSelectedProducts(selectedProductIds)
      navigate(returnTo ?? '/onboarding/team', { replace: !!returnTo })
    } catch (err) {
      setError(describeApiError(err, 'Could not save your product selection. Please try again.'))
    } finally {
      inFlight.current = false
      setSaving(false)
    }
  }

  const filteredProducts = allProducts.filter((p) => activeCategory === 'all' || p.category === activeCategory)
  const count = selectedProductIds.length

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-28 pt-6 text-slate-800 sm:px-6 sm:pb-32 sm:pt-10 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl">
          <OnboardingProgress step={3} title="Product Selection" next="Upload Documents" />
        </div>

        <div className="mx-auto mb-6 max-w-2xl text-center sm:mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" /> MyCampace Product Ecosystem
          </div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-4xl">Choose the products your organization needs</h1>
          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            Select at least one product. You can add or activate products anytime. Each product operates independently with dedicated dashboards,
            workflows, and role permissions.
          </p>
          {editingFromReview && (
            <p className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-800">
              You are editing from review. Continue returns to your application summary with the updated product list.
            </p>
          )}
        </div>

        <div
          className="-mx-4 mb-6 flex items-center gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mb-8 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0"
          role="group"
          aria-label="Filter products by category"
        >
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              aria-pressed={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 whitespace-nowrap rounded-xl px-4 py-2 text-xs font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3" role="group" aria-label="Products">
          {filteredProducts.map((product) => {
            const Icon = ICON_MAP[product.iconName] || Layers
            const selectable = isSelectable(product)
            const isSelected = selectable && selectedProductIds.includes(product.id)

            return (
              <div
                key={product.id}
                role="checkbox"
                aria-checked={isSelected}
                aria-disabled={!selectable}
                aria-label={`${product.name}${selectable ? '' : ' (coming soon)'}`}
                tabIndex={selectable ? 0 : -1}
                onClick={() => selectable && toggleProduct(product.id)}
                onKeyDown={(e) => {
                  if (selectable && (e.key === ' ' || e.key === 'Enter')) {
                    e.preventDefault()
                    toggleProduct(product.id)
                  }
                }}
                className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all sm:p-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                  isSelected
                    ? 'border-blue-500 bg-white shadow-xl shadow-blue-500/10 ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
                } ${selectable ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
              >
                <div>
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${product.iconBg}`}>
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{product.categoryName}</span>
                        <h3 className="text-lg font-bold leading-tight text-slate-900">{product.name}</h3>
                      </div>
                    </div>

                    {selectable ? (
                      <div
                        aria-hidden="true"
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border transition-all ${
                          isSelected ? 'border-blue-500 bg-blue-600 text-white' : 'border-slate-300 bg-white text-transparent'
                        }`}
                      >
                        <Check className="h-4 w-4" />
                      </div>
                    ) : (
                      <span className="shrink-0 rounded-full border border-purple-200 bg-purple-50 px-2 py-0.5 text-[10px] font-semibold text-purple-700">
                        Soon
                      </span>
                    )}
                  </div>

                  <p className="mb-4 text-xs leading-relaxed text-slate-600">{product.description}</p>

                  <div className="mb-4 space-y-1.5 border-t border-slate-100 pt-3">
                    <span className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-slate-500">Key Capabilities:</span>
                    {product.keyCapabilities.slice(0, 4).map((cap, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-500">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-600" aria-hidden="true" />
                        <span className="line-clamp-1">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-3">
                  <div className="text-[11px]">
                    <span className="block font-medium text-slate-500">Pricing Plan</span>
                    <span className="font-semibold text-slate-700">{product.pricing}</span>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                    }`}
                  >
                    {!selectable ? 'Coming Soon' : isSelected ? '✓ Selected' : '+ Select Product'}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Sticky summary bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur-md sm:p-4 sm:px-8">
        <div className="mx-auto max-w-6xl space-y-2">
          <FormAlert message={error} />
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-3" aria-live="polite">
              <div className="hidden h-10 w-10 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 font-bold text-blue-600 sm:flex">{count}</div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  {count} <span className="hidden sm:inline">{count === 1 ? 'Product' : 'Products'} </span>
                  <span className="sm:hidden">selected</span>
                  <span className="hidden sm:inline">Selected</span>
                </p>
                <p className="hidden text-xs text-slate-500 sm:block">Selected products will be provisioned in your MyCampace workspace</p>
              </div>
            </div>

            <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none sm:gap-3">
              <button
                type="button"
                onClick={() => navigate(returnTo ?? '/onboarding/institutions', returnTo ? { state: { returnTo } } : undefined)}
                className="flex h-11 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs sm:px-4 font-semibold text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> Back
              </button>
              <PrimaryButton type="button" onClick={handleContinue} loading={saving} disabled={count === 0 || saved.loading} className="text-xs sm:text-sm">
                <span>
                  {saving
                    ? 'Saving…'
                    : returnTo
                      ? 'Save and return to review'
                      : 'Continue'}
                </span>
                {!saving && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
              </PrimaryButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
