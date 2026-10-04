// src/modules/finance/components/FinanceNavigation.jsx
import React from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Layers,
  GraduationCap,
  FileText,
  CreditCard,
  Receipt,
  AlertTriangle,
  RotateCcw,
  Scale,
  Megaphone,
  Landmark,
  BarChart3,
} from 'lucide-react'

export function FinanceNavigation() {
  const navTabs = [
    { label: 'Dashboard', path: '/finance/dashboard', icon: LayoutDashboard },
    { label: 'Fee Structures', path: '/finance/fee-structures', icon: Layers },
    { label: 'Student Fees', path: '/finance/student-fees', icon: GraduationCap },
    { label: 'Invoices', path: '/finance/invoices', icon: FileText },
    { label: 'Payments', path: '/finance/payments', icon: CreditCard },
    { label: 'Receipts', path: '/finance/receipts', icon: Receipt },
    { label: 'Outstanding Dues', path: '/finance/dues', icon: AlertTriangle },
    { label: 'Refunds', path: '/finance/refunds', icon: RotateCcw },
    { label: 'Reconciliation', path: '/finance/reconciliation', icon: Scale },
    { label: 'Advertising', path: '/finance/advertising', icon: Megaphone },
    { label: 'Financial Services', path: '/finance/financial-services', icon: Landmark },
    { label: 'Reports', path: '/finance/reports', icon: BarChart3 },
  ]

  return (
    <div className="w-full bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs mb-6 -mt-2">
      <div className="flex items-center overflow-x-auto no-scrollbar px-4 gap-1 py-1.5">
        {navTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{tab.label}</span>
            </NavLink>
          )
        })}
      </div>
    </div>
  )
}
