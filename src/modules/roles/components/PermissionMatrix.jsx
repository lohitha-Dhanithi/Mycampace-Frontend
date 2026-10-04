// src/modules/roles/components/PermissionMatrix.jsx
import React, { useState, useMemo } from 'react'
import {
  Shield, CheckSquare, Square, Search, ChevronDown, ChevronRight,
  Sparkles, Info, Lock, Eye, PlusCircle, Edit3, Trash2, Download,
  CheckCircle2, RotateCcw, AlertTriangle, Layers, Filter
} from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  PERMISSION_GROUPS,
  PERMISSION_ACTIONS,
  PERMISSION_ACTION_LABELS,
  getAllModules,
  getSuperAdminPermissions,
  getEmptyPermissions,
} from '../data/permissionConfig'

const ACTION_ICONS = {
  view: Eye,
  create: PlusCircle,
  edit: Edit3,
  delete: Trash2,
  export: Download,
  approve: CheckCircle2,
}

const ACTION_COLORS = {
  view: 'text-blue-600 bg-blue-50 border-blue-200',
  create: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  edit: 'text-amber-600 bg-amber-50 border-amber-200',
  delete: 'text-rose-600 bg-rose-50 border-rose-200',
  export: 'text-indigo-600 bg-indigo-50 border-indigo-200',
  approve: 'text-purple-600 bg-purple-50 border-purple-200',
}

export function PermissionMatrix({
  permissions = {},
  onChange,
  readOnly = false,
  isSystemRole = false,
  roleName = 'Role',
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeGroupFilter, setActiveGroupFilter] = useState('ALL')
  const [collapsedGroups, setCollapsedGroups] = useState({})
  const [viewMode, setViewMode] = useState('matrix') // 'matrix' | 'cards'

  const allModules = useMemo(() => getAllModules(), [])

  // Calculate stats
  const stats = useMemo(() => {
    let totalPossible = 0
    let totalGranted = 0
    const perAction = { view: 0, create: 0, edit: 0, delete: 0, export: 0, approve: 0 }
    const possiblePerAction = { view: 0, create: 0, edit: 0, delete: 0, export: 0, approve: 0 }

    allModules.forEach((mod) => {
      PERMISSION_ACTIONS.forEach((action) => {
        if (mod.applicableActions.includes(action)) {
          totalPossible++
          possiblePerAction[action]++
          if (permissions?.[mod.id]?.[action]) {
            totalGranted++
            perAction[action]++
          }
        }
      })
    })

    const percentage = totalPossible > 0 ? Math.round((totalGranted / totalPossible) * 100) : 0
    return { totalPossible, totalGranted, percentage, perAction, possiblePerAction }
  }, [allModules, permissions])

  // Filter groups and modules
  const filteredGroups = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return PERMISSION_GROUPS.map((group) => {
      if (activeGroupFilter !== 'ALL' && group.id !== activeGroupFilter) {
        return null
      }

      const matchingModules = group.modules.filter((mod) => {
        if (!query) return true
        return (
          mod.name.toLowerCase().includes(query) ||
          mod.description.toLowerCase().includes(query) ||
          group.label.toLowerCase().includes(query)
        )
      })

      if (matchingModules.length === 0) return null

      return {
        ...group,
        modules: matchingModules,
      }
    }).filter(Boolean)
  }, [searchQuery, activeGroupFilter])

  // Toggle single permission
  const handleToggle = (moduleId, action) => {
    if (readOnly || isSystemRole) return
    const currentModulePerms = permissions[moduleId] || {}
    const updatedModulePerms = {
      ...currentModulePerms,
      [action]: !currentModulePerms[action],
    }

    const updated = {
      ...permissions,
      [moduleId]: updatedModulePerms,
    }
    onChange && onChange(updated)
  }

  // Quick preset: Select all applicable in group
  const handleSelectGroup = (groupId) => {
    if (readOnly || isSystemRole) return
    const group = PERMISSION_GROUPS.find((g) => g.id === groupId)
    if (!group) return

    const updated = { ...permissions }
    group.modules.forEach((mod) => {
      if (!updated[mod.id]) updated[mod.id] = {}
      mod.applicableActions.forEach((act) => {
        updated[mod.id][act] = true
      })
    })
    onChange && onChange(updated)
  }

  // Quick preset: Clear all in group
  const handleClearGroup = (groupId) => {
    if (readOnly || isSystemRole) return
    const group = PERMISSION_GROUPS.find((g) => g.id === groupId)
    if (!group) return

    const updated = { ...permissions }
    group.modules.forEach((mod) => {
      if (!updated[mod.id]) updated[mod.id] = {}
      mod.applicableActions.forEach((act) => {
        updated[mod.id][act] = false
      })
    })
    onChange && onChange(updated)
  }

  // Presets
  const handleGrantFullAccess = () => {
    if (readOnly || isSystemRole) return
    onChange && onChange(getSuperAdminPermissions())
  }

  const handleGrantReadOnly = () => {
    if (readOnly || isSystemRole) return
    const readOnlyPerms = {}
    allModules.forEach((mod) => {
      readOnlyPerms[mod.id] = {}
      PERMISSION_ACTIONS.forEach((act) => {
        readOnlyPerms[mod.id][act] = act === 'view' && mod.applicableActions.includes('view')
      })
    })
    onChange && onChange(readOnlyPerms)
  }

  const handleClearAll = () => {
    if (readOnly || isSystemRole) return
    onChange && onChange(getEmptyPermissions())
  }

  // Toggle group collapse
  const toggleGroupCollapse = (groupId) => {
    setCollapsedGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  const collapseAll = () => {
    const all = {}
    PERMISSION_GROUPS.forEach((g) => {
      all[g.id] = true
    })
    setCollapsedGroups(all)
  }

  const expandAll = () => {
    setCollapsedGroups({})
  }

  return (
    <div className="space-y-4">
      {/* System Role Notice */}
      {isSystemRole && (
        <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl flex items-start gap-3">
          <Lock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-800">
            <span className="font-semibold">System Protected Role:</span> Permissions for{' '}
            <strong className="font-bold">{roleName}</strong> are predefined by the platform core to preserve
            security integrity and operational compliance. They cannot be edited directly. To customize, use{' '}
            <strong>Duplicate Role</strong> to create an editable custom role.
          </div>
        </div>
      )}

      {/* Control Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
        {/* Top line: Search, Filter, View Mode, Stats */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search modules or permissions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>
            <select
              value={activeGroupFilter}
              onChange={(e) => setActiveGroupFilter(e.target.value)}
              className="h-9 px-3 rounded-lg border border-slate-200 bg-slate-50 text-xs font-medium text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Functional Groups</option>
              {PERMISSION_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.label} ({g.modules.length})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Presets (if not readOnly) */}
          <div className="flex items-center gap-2 flex-wrap">
            {!readOnly && !isSystemRole && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGrantFullAccess}
                  className="h-8 text-xs font-medium text-blue-700 bg-blue-50 border-blue-200 hover:bg-blue-100"
                >
                  <Sparkles className="h-3.5 w-3.5 mr-1 text-blue-600" />
                  Grant Full Access
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGrantReadOnly}
                  className="h-8 text-xs font-medium text-slate-700 hover:bg-slate-100"
                >
                  <Eye className="h-3.5 w-3.5 mr-1 text-slate-500" />
                  Read-Only All
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleClearAll}
                  className="h-8 text-xs font-medium text-rose-700 hover:bg-rose-50 border-rose-200"
                >
                  <RotateCcw className="h-3.5 w-3.5 mr-1 text-rose-500" />
                  Clear All
                </Button>
              </>
            )}

            <div className="h-5 w-[1px] bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('matrix')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'matrix' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Matrix
              </button>
              <button
                type="button"
                onClick={() => setViewMode('cards')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  viewMode === 'cards' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cards
              </button>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800">Coverage:</span>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                {stats.totalGranted} / {stats.totalPossible}
              </span>
              <span className="text-slate-500">({stats.percentage}% granted)</span>
            </div>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block border border-slate-200">
              <div
                className="h-full bg-blue-600 rounded-full transition-all duration-300"
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>

          {/* Action pills breakdown */}
          <div className="flex items-center gap-2 flex-wrap">
            {PERMISSION_ACTIONS.map((act) => (
              <span
                key={act}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-slate-50 border border-slate-200 text-slate-600"
              >
                <span className="capitalize font-medium">{act}:</span>
                <strong className="text-slate-900 font-semibold">
                  {stats.perAction[act]}
                </strong>
                <span className="text-slate-400">/{stats.possiblePerAction[act]}</span>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <button
              type="button"
              onClick={expandAll}
              className="text-blue-600 hover:underline font-medium"
            >
              Expand All
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={collapseAll}
              className="text-blue-600 hover:underline font-medium"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* MATRIX VIEW */}
      {viewMode === 'matrix' ? (
        <div className="space-y-4">
          {filteredGroups.map((group) => {
            const isCollapsed = collapsedGroups[group.id]
            const groupGrantedCount = group.modules.reduce((acc, mod) => {
              const modPerms = permissions?.[mod.id] || {}
              return acc + Object.values(modPerms).filter(Boolean).length
            }, 0)
            const groupPossibleCount = group.modules.reduce(
              (acc, mod) => acc + mod.applicableActions.length,
              0
            )

            return (
              <div
                key={group.id}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm transition-all"
              >
                {/* Group Header */}
                <div className="bg-slate-50/80 px-4 py-3 flex items-center justify-between border-b border-slate-200">
                  <div
                    className="flex items-center gap-2.5 cursor-pointer select-none"
                    onClick={() => toggleGroupCollapse(group.id)}
                  >
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-slate-200 text-slate-500 transition-colors"
                    >
                      {isCollapsed ? (
                        <ChevronRight className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{group.label}</span>
                        <Badge variant="outline" className="text-[10px] bg-white font-normal text-slate-600">
                          {group.modules.length} {group.modules.length === 1 ? 'module' : 'modules'}
                        </Badge>
                        <span className="text-[11px] font-medium text-slate-500">
                          ({groupGrantedCount}/{groupPossibleCount} enabled)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{group.description}</p>
                    </div>
                  </div>

                  {/* Group Quick Toggles */}
                  {!readOnly && !isSystemRole && (
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSelectGroup(group.id)}
                        className="h-7 text-[11px] font-medium text-blue-700 hover:bg-blue-50 px-2"
                      >
                        Select Group
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleClearGroup(group.id)}
                        className="h-7 text-[11px] font-medium text-slate-600 hover:bg-slate-200 px-2"
                      >
                        Clear Group
                      </Button>
                    </div>
                  )}
                </div>

                {/* Group Matrix Table */}
                {!isCollapsed && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                      <thead>
                        <tr className="bg-slate-100/70 text-[11px] font-semibold text-slate-600 border-b border-slate-200">
                          <th className="py-2.5 px-4 w-[280px]">Functional Module</th>
                          {PERMISSION_ACTIONS.map((action) => {
                            const Icon = ACTION_ICONS[action]
                            return (
                              <th
                                key={action}
                                className="py-2.5 px-3 text-center w-[100px] select-none"
                              >
                                <div className="inline-flex items-center gap-1 font-semibold text-slate-700">
                                  <Icon className="h-3 w-3 text-slate-400" />
                                  <span>{PERMISSION_ACTION_LABELS[action]}</span>
                                </div>
                              </th>
                            )
                          })}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {group.modules.map((mod) => {
                          const modPerms = permissions?.[mod.id] || {}
                          return (
                            <tr
                              key={mod.id}
                              className="hover:bg-blue-50/20 transition-colors group"
                            >
                              <td className="py-3 px-4">
                                <div className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">
                                  {mod.name}
                                </div>
                                <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                                  {mod.description}
                                </div>
                              </td>

                              {PERMISSION_ACTIONS.map((action) => {
                                const isApplicable = mod.applicableActions.includes(action)
                                const isChecked = !!modPerms[action]

                                if (!isApplicable) {
                                  return (
                                    <td
                                      key={action}
                                      className="py-3 px-3 text-center bg-slate-50/40"
                                    >
                                      <span className="text-slate-300 text-xs">—</span>
                                    </td>
                                  )
                                }

                                return (
                                  <td
                                    key={action}
                                    className={`py-3 px-3 text-center transition-colors ${
                                      isChecked ? 'bg-blue-50/30' : ''
                                    }`}
                                  >
                                    <div className="flex items-center justify-center">
                                      <Checkbox
                                        checked={isChecked}
                                        disabled={readOnly || isSystemRole}
                                        onChange={() => handleToggle(mod.id, action)}
                                        aria-label={`${mod.name} ${action}`}
                                        className={
                                          isChecked
                                            ? 'border-blue-600 bg-blue-600 text-white'
                                            : 'border-slate-300'
                                        }
                                      />
                                    </div>
                                  </td>
                                )
                              })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        /* CARDS VIEW (Responsive mobile-friendly view) */
        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{group.label}</h3>
                  <p className="text-[11px] text-slate-500">{group.description}</p>
                </div>
                {!readOnly && !isSystemRole && (
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSelectGroup(group.id)}
                      className="h-7 text-xs text-blue-700"
                    >
                      All
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleClearGroup(group.id)}
                      className="h-7 text-xs text-slate-600"
                    >
                      Clear
                    </Button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.modules.map((mod) => {
                  const modPerms = permissions?.[mod.id] || {}
                  return (
                    <div
                      key={mod.id}
                      className="p-3 bg-slate-50/70 border border-slate-200 rounded-lg space-y-2 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="font-semibold text-xs text-slate-900">{mod.name}</span>
                          <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                            {mod.description}
                          </p>
                        </div>
                      </div>

                      {/* Action toggle chips */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {PERMISSION_ACTIONS.map((action) => {
                          const isApplicable = mod.applicableActions.includes(action)
                          if (!isApplicable) return null
                          const isChecked = !!modPerms[action]
                          const Icon = ACTION_ICONS[action]

                          return (
                            <button
                              type="button"
                              key={action}
                              disabled={readOnly || isSystemRole}
                              onClick={() => handleToggle(mod.id, action)}
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium border transition-all ${
                                isChecked
                                  ? ACTION_COLORS[action] + ' font-semibold shadow-xs'
                                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                              } ${readOnly || isSystemRole ? 'cursor-default' : 'cursor-pointer'}`}
                            >
                              <Icon className="h-3 w-3" />
                              <span>{PERMISSION_ACTION_LABELS[action]}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredGroups.length === 0 && (
        <div className="p-8 text-center bg-white border border-slate-200 rounded-xl">
          <Filter className="h-8 w-8 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-800">No matching permissions or modules found</p>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search query or reset group filters.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setSearchQuery('')
              setActiveGroupFilter('ALL')
            }}
            className="mt-3 text-xs"
          >
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  )
}
