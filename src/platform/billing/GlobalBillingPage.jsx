// src/platform/billing/GlobalBillingPage.jsx
import React from 'react'
import {
  CreditCard,
  Check,
  ShieldCheck,
  ArrowUpRight,
  Zap,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react'
import { productService } from '@/services/productService'
import { entitlementService } from '@/services/entitlementService'
import { organizationService } from '@/services/organizationService'

export function GlobalBillingPage() {
  const org = organizationService.getOrganization()
  const activeProducts = productService.getOrganizationProducts()
  const entitlements = entitlementService.getEntitlements()

  return (
    <div className="space-y-8 animate-in fade-in-0 duration-200">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600 mb-1">
          <CreditCard className="h-4 w-4" />
          <span>Platform Subscriptions & Monetization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Subscriptions & Product Entitlements
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-slate-500">
          Independent subscription tiers and license plans for each active education product in your workspace.
        </p>
      </div>

      {/* Plan Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Account Status
          </span>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-xl font-bold text-slate-900">Enterprise Foundation</h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2">Unlimited campuses and multi-tenant isolation.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Active Subscribed Products
          </span>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-xl font-bold text-blue-600">{activeProducts.length} Products</h3>
          </div>
          <p className="text-xs text-slate-500 mt-2">Academics, LMS, Finance & Admissions enabled.</p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Next Renewal Cycle
          </span>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-xl font-bold text-slate-900">December 31, 2027</h3>
          </div>
          <p className="text-xs text-slate-500 mt-2">Annual billing consolidated invoice.</p>
        </div>
      </div>

      {/* Per-Product Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">
            Product License Subscriptions
          </h3>
          <span className="text-xs text-blue-600 font-semibold cursor-pointer hover:underline">
            Download Consolidated Invoices
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-6">Product</th>
                <th className="py-3 px-4">Plan Tier</th>
                <th className="py-3 px-4">Entitlement Status</th>
                <th className="py-3 px-4">License Terms</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeProducts.map((p) => {
                const ent = entitlements.find((e) => e.productId === p.id)
                return (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${p.iconBg}`}>
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.categoryName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-slate-700">
                      {ent?.plan || p.plan}
                    </td>
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {ent?.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-500">
                      {ent ? `${ent.startDate} to ${ent.endDate}` : 'Active Institutional Term'}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <button
                        type="button"
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Manage Plan
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
