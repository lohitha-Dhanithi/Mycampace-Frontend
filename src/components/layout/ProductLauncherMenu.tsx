// src/components/layout/ProductLauncherMenu.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
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
  ArrowRight,
  ExternalLink,
  Plus,
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

export function ProductLauncherMenu() {
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()
  const activeProducts = productService.getOrganizationProducts()

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLaunchProduct = (product) => {
    setOpen(false)
    productService.recordProductVisit(product.id)
    navigate(product.route)
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors relative focus:outline-none"
        title="MyCampace Products Launcher"
      >
        <Grid className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 sm:left-0 sm:right-auto top-full mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl z-50 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div>
              <span className="text-[10px] font-bold tracking-wider uppercase text-blue-600">
                MYCAMPACE
              </span>
              <h3 className="text-xs font-bold text-slate-900">Your Institutional Products</h3>
            </div>
            <Link
              to="/app"
              onClick={() => setOpen(false)}
              className="text-[11px] font-semibold text-blue-600 hover:text-blue-700 hover:underline"
            >
              Hub Home
            </Link>
          </div>

          <div className="grid grid-cols-3 gap-2 py-1 max-h-72 overflow-y-auto">
            {activeProducts.map((p) => {
              const Icon = ICON_MAP[p.id] || Sparkles
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleLaunchProduct(p)}
                  className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-slate-50 transition-colors text-center group border border-transparent hover:border-slate-200"
                >
                  <div
                    className={`h-11 w-11 rounded-xl flex items-center justify-center mb-2 shadow-xs group-hover:scale-105 transition-transform ${p.iconBg}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                    {p.name}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-medium">
                    {p.modulesCount} modules
                  </span>
                </button>
              )
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between">
            <Link
              to="/app/products"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-slate-700 hover:text-blue-600 flex items-center gap-1.5"
            >
              <Plus className="h-3.5 w-3.5 text-blue-600" />
              <span>Explore Marketplace</span>
            </Link>

            <Link
              to="/app/products"
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All Products</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
