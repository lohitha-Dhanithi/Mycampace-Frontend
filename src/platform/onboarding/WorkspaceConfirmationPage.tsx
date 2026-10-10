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
  const institutions = organizationService.getInstitutions()
  const campuses = organizationService.getCampuses()
  const invites = organizationService.getTeamInvites()
  const activeProducts = productService.getOrganizationProducts()

  const handleEnterWorkspace = () => {
    // Clear pending onboarding flag
    localStorage.removeItem('mycampace_pending_onboarding')
    navigate('/app')
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-2xl text-center">
        {/* Success Icon */}
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 mb-6 shadow-xl shadow-emerald-100">
          <CheckCircle className="h-8 w-8" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Your MyCampace Workspace is Ready
        </h1>
        <p className="mt-3 text-sm text-slate-500 max-w-md mx-auto">
          We've provisioned the platform tenant for <span className="text-slate-900 font-semibold">{org.name}</span> with your selected education products.
        </p>

        {/* Selected Products Cards */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 text-left shadow-xl shadow-slate-200/70">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Provisioned Products ({activeProducts.length})
            </span>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              Ready to Launch
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {activeProducts.map((p) => {
              const Icon = ICON_MAP[p.id] || Sparkles
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${p.iconBg}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{p.name}</h4>
                    <span className="text-[11px] text-slate-500">{p.modulesCount} Modules Active</span>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="space-y-3 mb-6 text-xs text-slate-600">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">Organization</p>
              <p className="text-sm font-semibold text-slate-900">{org.legalName || org.name}</p>
              <p className="mt-1 text-slate-500">{org.address}, {org.city}, {org.state} {org.postalCode}</p>
              <p className="mt-1 text-slate-500">{org.primaryContact?.name} · {org.primaryContact?.email} · {org.taxId}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Institutions ({institutions.length}) and campuses ({campuses.length})
              </p>
              {institutions.map((inst) => (
                <p key={inst.id} className="text-slate-900 font-medium mt-1">{inst.name} · {inst.affiliation}</p>
              ))}
              {campuses.map((campus) => (
                <p key={campus.id} className="text-slate-500">{campus.name} ({campus.code}) — {campus.city}</p>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Team invites ({invites.length})
              </p>
              {invites.length === 0 ? (
                <p className="text-slate-500">No teammates invited yet. You can add them from the workspace later.</p>
              ) : (
                invites.map((member) => (
                  <p key={member.id} className="text-slate-900">{member.email} · {member.role}</p>
                ))
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-800 leading-relaxed mb-6">
            <span className="font-semibold text-slate-900 block mb-0.5">Central Product Hub:</span>
            You are entering the MyCampace Product Hub. You can switch between products at any time using the global header launcher.
          </div>

          <button
            type="button"
            onClick={handleEnterWorkspace}
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-600/20"
          >
            <span>Enter MyCampace</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
