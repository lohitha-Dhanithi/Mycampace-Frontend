// src/components/layout/ProductSwitcher.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  ChevronDown,
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
  Building2,
  Settings,
  LogOut,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { productService } from '@/services/productService'
import { useAuth } from '@/store/AuthContext'

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

export function ProductSwitcher({ currentProductId }) {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const { logout } = useAuth()
  const activeProducts = productService.getOrganizationProducts()

  const currentProduct = productService.getProductById(currentProductId)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSwitch = (product) => {
    setOpen(false)
    productService.recordProductVisit(product.id)
    navigate(product.route)
  }

  const CurrentIcon = currentProduct ? ICON_MAP[currentProduct.id] || Layers : Layers

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-2xs group"
      >
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs text-white">
            M
          </div>
          <span className="text-xs font-black tracking-wide text-slate-900 uppercase">
            MYCAMPACE
          </span>
        </div>

        {currentProduct && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
            <span className="text-xs font-bold text-slate-800">{currentProduct.name}</span>
          </div>
        )}

        <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 text-xs">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Your Active Products
            </p>
          </div>

          <div className="space-y-0.5 max-h-60 overflow-y-auto py-1">
            {activeProducts.map((p) => {
              const Icon = ICON_MAP[p.id] || Sparkles
              const isCurrent = p.id === currentProductId
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSwitch(p)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all text-left ${
                    isCurrent
                      ? 'bg-blue-50 text-blue-900 font-bold border border-blue-100'
                      : 'hover:bg-slate-50 text-slate-700 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${p.iconBg}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs">{p.name}</p>
                      <span className="text-[10px] text-slate-400 font-normal">{p.tagline.slice(0, 26)}...</span>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                      Current
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="my-1.5 border-t border-slate-100" />

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              navigate('/app')
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-left"
          >
            <Layers className="h-4 w-4 text-slate-400" />
            <span className="font-semibold">MyCampace Product Hub</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              navigate('/app/products')
            }}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-left"
          >
            <span className="font-medium">All Products & Marketplace</span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              navigate('/app/organization')
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-left"
          >
            <Building2 className="h-4 w-4 text-slate-400" />
            <span>Organization Profile</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              navigate('/app/settings')
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors text-left"
          >
            <Settings className="h-4 w-4 text-slate-400" />
            <span>Platform Settings</span>
          </button>

          <div className="my-1.5 border-t border-slate-100" />

          <button
            type="button"
            onClick={() => {
              setOpen(false)
              logout()
              navigate('/auth')
            }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors text-left font-medium"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  )
}
