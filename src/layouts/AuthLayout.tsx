// src/layouts/AuthLayout.jsx
import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { ShieldCheck, Award, Lock, Sparkles } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900">
      {/* Left Banner (Desktop) */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-12 text-white flex-col justify-between border-r border-slate-800">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center font-black text-xl text-white shadow-lg shadow-blue-500/30">
              M
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight">MyCampace</h2>
              <p className="text-xs text-blue-300 font-medium">Enterprise Education Operating System</p>
            </div>
          </div>

          <div className="mt-20 max-w-md space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-300 border border-blue-500/20">
              <Sparkles className="h-3.5 w-3.5" /> Next-Gen Multi-Campus ERP
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Unified governance for schools, colleges & university ecosystems.
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              Consolidating Admissions CRM, Academic Configuration, Multi-Tenant Campus Management, Real-time Attendance, and SIS in one mission-critical platform.
            </p>
          </div>
        </div>

        {/* Security badges */}
        <div className="pt-8 border-t border-slate-800/80 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>SOC2 Type II & ISO 27001</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-blue-400 shrink-0" />
              <span>Role-Based RBAC Security</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-400">
            © 2026 MyCampace Technologies. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-slate-50">
        <div className="w-full max-w-md">
          {/* Mobile Brand */}
          <div className="md:hidden flex items-center gap-2.5 mb-8 justify-center">
            <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white shadow-md">
              M
            </div>
            <div className="text-left">
              <h2 className="text-lg font-bold text-slate-900 leading-none">MyCampace</h2>
              <span className="text-[11px] text-slate-500">Education Operating System</span>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  )
}
