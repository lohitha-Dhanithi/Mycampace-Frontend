// src/components/layout/ContextSelector.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Building2, ChevronDown, Check, School, MapPin, Calendar, Layers } from 'lucide-react'
import { useTenantContext } from '@/store/TenantContext'

export function ContextSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const {
    institutions,
    campuses,
    academicYears,
    selectedInstitution,
    setSelectedInstitution,
    selectedCampus,
    setSelectedCampus,
    selectedAcademicYear,
    setSelectedAcademicYear,
  } = useTenantContext()

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const availableCampuses = campuses.filter(
    (c) => !selectedInstitution || c.institutionId === selectedInstitution.id
  )

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 flex items-center gap-2 px-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-left transition-all shadow-2xs group focus:outline-none"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-blue-50 text-blue-600 shrink-0">
          <Building2 className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-bold text-slate-800 truncate max-w-[150px] sm:max-w-[200px]">
          {selectedInstitution?.name || 'Select Institution'}
        </span>
        <span className="text-slate-300 hidden sm:inline">/</span>
        <span className="text-xs text-slate-600 font-medium truncate max-w-[110px] hidden sm:inline">
          {selectedCampus?.name?.replace(' Campus', '') || 'Campus'}
        </span>
        <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60 shrink-0 hidden md:inline-block">
          AY {selectedAcademicYear?.name}
        </span>
        <ChevronDown className={`h-3.5 w-3.5 text-slate-400 ml-0.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover Selector Panel */}
      {isOpen && (
        <div className="absolute left-0 sm:right-auto sm:left-0 top-full mt-2 w-80 sm:w-96 rounded-xl border border-slate-200 bg-white p-4 shadow-xl z-50 animate-in fade-in-0 zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-blue-600" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                Institutional Context
              </h4>
            </div>
            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-200">
              Multi-Tenant
            </span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Institution Selector */}
            <div>
              <label className="flex items-center gap-1.5 font-medium text-slate-600 mb-1.5">
                <School className="h-3.5 w-3.5 text-slate-400" />
                <span>Institution</span>
              </label>
              <div className="space-y-1">
                {institutions.map((inst) => (
                  <button
                    key={inst.id}
                    type="button"
                    onClick={() => setSelectedInstitution(inst)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
                      selectedInstitution?.id === inst.id
                        ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{inst.name}</span>
                    {selectedInstitution?.id === inst.id && (
                      <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Campus Selector */}
            <div>
              <label className="flex items-center gap-1.5 font-medium text-slate-600 mb-1.5">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>Campus Location</span>
              </label>
              <div className="space-y-1 max-h-36 overflow-y-auto">
                {availableCampuses.map((camp) => (
                  <button
                    key={camp.id}
                    type="button"
                    onClick={() => setSelectedCampus(camp)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left transition-colors ${
                      selectedCampus?.id === camp.id
                        ? 'bg-blue-50 text-blue-900 font-semibold border border-blue-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{camp.name}</span>
                    {selectedCampus?.id === camp.id && (
                      <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Academic Year */}
            <div>
              <label className="flex items-center gap-1.5 font-medium text-slate-600 mb-1.5">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>Academic Session</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {academicYears.map((ay) => (
                  <button
                    key={ay.id}
                    type="button"
                    onClick={() => setSelectedAcademicYear(ay)}
                    className={`px-2 py-1.5 text-center rounded-md border text-xs transition-colors ${
                      selectedAcademicYear?.id === ay.id
                        ? 'bg-blue-600 text-white font-semibold border-blue-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {ay.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Org: Apex Global Ed.</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-blue-600 hover:underline font-semibold"
            >
              Apply Context
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
