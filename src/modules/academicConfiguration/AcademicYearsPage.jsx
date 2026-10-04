// src/modules/academicConfiguration/AcademicYearsPage.jsx
import React, { useState, useEffect, useMemo } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  CalendarDays,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
  Edit,
  Eye,
  Check,
  RotateCcw,
  Power,
  ChevronRight,
  Star,
} from 'lucide-react'
import { AcademicConfigurationHeader } from './components/AcademicConfigurationHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { LoadingState } from '@/components/common/LoadingState'
import { ErrorState } from '@/components/common/ErrorState'
import { SetCurrentYearDialog } from './components/SetCurrentYearDialog'
import { academicYearService } from './services/academicYearService'
import { useTenantContext } from '@/store/TenantContext'

export function AcademicYearsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setSelectedAcademicYear } = useTenantContext()

  const [academicYears, setAcademicYears] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [currentFilter, setCurrentFilter] = useState('ALL') // ALL | CURRENT | NON_CURRENT

  // Set as Current Confirmation Modal
  const [currentModalTarget, setCurrentModalTarget] = useState(null)
  const [switchingCurrent, setSwitchingCurrent] = useState(false)
  const [toast, setToast] = useState(location.state?.toast || '')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 4000)
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await academicYearService.getAcademicYears()
      setAcademicYears(data)
      setLoading(false)
    } catch (err) {
      setError(err.message || 'Failed to load academic years')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleConfirmSetCurrent = async () => {
    if (!currentModalTarget) return
    setSwitchingCurrent(true)
    try {
      const updated = await academicYearService.setCurrentAcademicYear(currentModalTarget.id)
      setSelectedAcademicYear(updated)
      await loadData()
      setSwitchingCurrent(false)
      setCurrentModalTarget(null)
      showToast(`Academic Year "${updated.name}" is now the active operational cycle.`)
    } catch (err) {
      setSwitchingCurrent(false)
      alert(err.message || 'Failed to set current academic year')
    }
  }

  const handleToggleStatus = async (ay) => {
    const nextStatus = ay.status === 'Active' ? 'Inactive' : 'Active'
    try {
      await academicYearService.updateAcademicYearStatus(ay.id, nextStatus)
      await loadData()
      showToast(`Academic year "${ay.name}" status changed to ${nextStatus}.`)
    } catch (err) {
      alert(err.message || 'Failed to update status')
    }
  }

  // Filtered
  const filteredYears = useMemo(() => {
    return academicYears.filter((ay) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        searchQuery === '' ||
        ay.name.toLowerCase().includes(q) ||
        ay.code.toLowerCase().includes(q) ||
        ay.description?.toLowerCase().includes(q)

      const matchesStatus = statusFilter === 'ALL' || ay.status === statusFilter
      const matchesCurrent =
        currentFilter === 'ALL' ||
        (currentFilter === 'CURRENT' && ay.isCurrent) ||
        (currentFilter === 'NON_CURRENT' && !ay.isCurrent)

      return matchesSearch && matchesStatus && matchesCurrent
    })
  }, [academicYears, searchQuery, statusFilter, currentFilter])

  if (loading) return <LoadingState />
  if (error) return <ErrorState message={error} onRetry={loadData} />

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span className="font-medium">{toast}</span>
          </div>
          <button
            type="button"
            onClick={() => setToast('')}
            className="text-emerald-700 hover:text-emerald-900 font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      <AcademicConfigurationHeader
        title="Academic Years"
        subtitle="Manage academic years, session cycles, term dates, and active system-wide operational boundaries."
        actions={
          <Link to="/academic-configuration/academic-years/new">
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs">
              <Plus className="h-4 w-4 mr-1.5" />
              Add Academic Year
            </Button>
          </Link>
        }
      />

      {/* Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search academic year name, code, or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="ALL">All Status</option>
            <option value="Active">Active</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Inactive">Inactive</option>
          </select>

          <select
            value={currentFilter}
            onChange={(e) => setCurrentFilter(e.target.value)}
            className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white"
          >
            <option value="ALL">Current & Historical</option>
            <option value="CURRENT">Current Session Only</option>
            <option value="NON_CURRENT">Non-Current</option>
          </select>

          {(searchQuery || statusFilter !== 'ALL' || currentFilter !== 'ALL') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('ALL')
                setCurrentFilter('ALL')
              }}
              className="h-9 text-xs text-slate-600 hover:text-slate-900"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1" />
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        {filteredYears.length === 0 ? (
          <div className="p-12 text-center">
            <CalendarDays className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-800">No academic years found</p>
            <p className="text-xs text-slate-500 mt-1">
              Add an academic year or adjust your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <th className="py-3 px-4">Academic Year</th>
                  <th className="py-3 px-4">Code</th>
                  <th className="py-3 px-4">Term Dates</th>
                  <th className="py-3 px-4">Operational Role</th>
                  <th className="py-3 px-4">Admissions Default</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredYears.map((ay) => (
                  <tr key={ay.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            ay.isCurrent
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Calendar className="h-4 w-4" />
                        </div>
                        <div>
                          <Link
                            to={`/academic-configuration/academic-years/${ay.id}`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors"
                          >
                            {ay.name}
                          </Link>
                          <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                            {ay.description || 'Configured academic term'}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {ay.code}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <div className="font-medium text-slate-900">
                        {ay.startDate} → {ay.endDate}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      {ay.isCurrent ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          <Star className="h-3 w-3 fill-blue-600 text-blue-600" />
                          Current Active
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Standard</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {ay.defaultForAdmissions ? (
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                          Admissions Default
                        </Badge>
                      ) : (
                        <span className="text-slate-400 text-xs">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <Badge
                        className={
                          ay.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ay.status === 'Upcoming'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }
                      >
                        {ay.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link to={`/academic-configuration/academic-years/${ay.id}`}>
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-600 hover:bg-slate-100 px-2">
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            View
                          </Button>
                        </Link>

                        <Link to={`/academic-configuration/academic-years/${ay.id}/edit`}>
                          <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-600 hover:bg-slate-100 px-2">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </Link>

                        {!ay.isCurrent && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentModalTarget(ay)}
                            className="h-8 text-xs text-blue-600 hover:bg-blue-50 px-2 font-medium"
                            title="Set as Current Academic Year"
                          >
                            Set Current
                          </Button>
                        )}

                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleStatus(ay)}
                          className={`h-8 text-xs px-2 ${
                            ay.status === 'Active'
                              ? 'text-slate-500 hover:bg-slate-100'
                              : 'text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={ay.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <SetCurrentYearDialog
        open={!!currentModalTarget}
        onOpenChange={(open) => !open && setCurrentModalTarget(null)}
        targetYear={currentModalTarget}
        onConfirm={handleConfirmSetCurrent}
        loading={switchingCurrent}
      />
    </div>
  )
}
