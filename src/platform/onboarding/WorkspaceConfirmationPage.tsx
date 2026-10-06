// src/platform/onboarding/WorkspaceConfirmationPage.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle,
  GraduationCap,
  MonitorPlay,
  DollarSign,
  UserPlus,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
} from 'lucide-react'
import { productService } from '@/services/productService'
import { organizationService } from '@/services/organizationService'

const ICON_MAP = {
  academics: GraduationCap,
  lms: MonitorPlay,
  finance: DollarSign,
  admissions: UserPlus,
}

export function WorkspaceConfirmationPage() {
  const navigate = useNavigate()
  const org = organizationService.getOrganization()
  const activeProducts = productService.getOrganizationProducts()

  const handleEnterWorkspace = () => {
    // Clear pending onboarding flag
    localStorage.removeItem('mycampace_pending_onboarding')
    navigate('/app')
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-6 shadow-xl shadow-emerald-500/10">
          <CheckCircle className="h-8 w-8" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Your MyCampace Workspace is Ready
        </h1>
        <p className="mt-3 text-sm text-slate-400 max-w-md mx-auto">
          We've provisioned the platform tenant for <span className="text-white font-semibold">{org.name}</span> with your selected education products.
        </p>

        {/* Selected Products Cards */}
        <div className="mt-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 text-left shadow-2xl">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Provisioned Products ({activeProducts.length})
            </span>
            <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-full">
              Ready to Launch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {activeProducts.map((p) => {
              const Icon = ICON_MAP[p.id] || Sparkles
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-800/60 border border-slate-750"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${p.iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <span className="text-[11px] text-slate-400">{p.modulesCount} Modules Active</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-900/60 text-xs text-blue-200/90 leading-relaxed mb-6">
            <span className="font-semibold text-white block mb-0.5">Central Product Hub:</span>
            You are entering the MyCampace Product Hub. You can switch between products at any time using the global header launcher.
          </div>

          <button
            type="button"
            onClick={handleEnterWorkspace}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/30"
          >
            <span>Enter MyCampace</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
