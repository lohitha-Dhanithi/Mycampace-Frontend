// src/components/layout/ProductSwitcher.jsx
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronDown,
  Grid,
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
} from 'lucide-react'
import { productService } from '@/services/productService'

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

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="h-9 flex items-center gap-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-2xs group focus:outline-none"
        title="Switch MyCampace Product"
      >
        <div className="h-5 w-5 rounded-md bg-blue-600 flex items-center justify-center text-white shrink-0">
          <Grid className="h-3 w-3" />
        </div>
        <span className="text-xs font-bold text-slate-800">
          {currentProduct ? currentProduct.name : 'Apps'}
        </span>
        <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95 text-xs">
          <div className="px-3 py-2 border-b border-slate-100 mb-1">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Your Active Products
            </p>
          </div>

          <div className="space-y-0.5 max-h-80 overflow-y-auto py-1">
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
                    <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${p.iconBg}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{p.name}</p>
                      <span className="text-[10px] text-slate-400 font-normal line-clamp-1">{p.tagline}</span>
                    </div>
                  </div>
                  {isCurrent && (
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">
                      Current
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
