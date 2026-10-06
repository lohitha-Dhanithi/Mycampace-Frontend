// src/components/layout/GlobalSearchModal.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Search,
  X,
  GraduationCap,
  MonitorPlay,
  DollarSign,
  UserPlus,
  FileText,
  User,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import { productService } from '@/services/productService'

export function GlobalSearchModal({ isOpen, onClose }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        if (isOpen) onClose()
        else {
          // Open handled by parent or state
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const allProducts = productService.getProducts()

  // Mock index for instant search across ecosystem
  const searchIndex = [
    // Products
    ...allProducts.map((p) => ({
      type: 'Product',
      title: p.name,
      subtitle: p.tagline,
      badge: p.categoryName,
      route: p.route,
      icon: GraduationCap,
    })),
    // Core records
    {
      type: 'Student',
      title: 'Tanya Patel (STU-8921)',
      subtitle: 'Class 11 Science • Active • Due ₹12,000',
      badge: 'Academics & SIS',
      route: '/app/finance/student-fees',
      icon: User,
    },
    {
      type: 'Student',
      title: 'Aditya Swaminathan (APP-2026-091)',
      subtitle: 'Class 11 PCM Application • Under Review',
      badge: 'Admissions',
      route: '/app/admissions/applications',
      icon: User,
    },
    {
      type: 'Course',
      title: 'Advanced Mathematics (MATH-102)',
      subtitle: 'Grade 10 • Term 1 Curriculum',
      badge: 'Academics',
      route: '/app/academics/courses',
      icon: FileText,
    },
    {
      type: 'Course',
      title: 'AP Physics C: Mechanics & Electromagnetism',
      subtitle: '24 Video Lessons • 182 Students Enrolled',
      badge: 'LMS',
      route: '/app/lms/courses',
      icon: MonitorPlay,
    },
    {
      type: 'Finance',
      title: 'Academic Year 2026-27 Fee Structure',
      subtitle: 'Tuition + Lab + Transportation components',
      badge: 'Finance',
      route: '/app/finance/fee-structures',
      icon: DollarSign,
    },
  ]

  const results = searchIndex.filter((item) => {
    if (!query) return true
    const q = query.toLowerCase()
    return (
      item.title.toLowerCase().includes(q) ||
      item.subtitle.toLowerCase().includes(q) ||
      item.badge.toLowerCase().includes(q) ||
      item.type.toLowerCase().includes(q)
    )
  })

  const handleSelect = (route) => {
    onClose()
    navigate(route)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-0">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 border-b border-slate-100">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, students, courses, invoices, applications..."
            className="w-full h-14 px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 divide-y divide-slate-100">
          {results.length > 0 ? (
            results.map((item, idx) => {
              const Icon = item.icon
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelect(item.route)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600">
                          {item.title}
                        </span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </button>
              )
            })
          ) : (
            <div className="py-12 text-center text-slate-400 text-xs">
              No matching products or records found for "{query}".
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with ↵ Enter</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  )
}
