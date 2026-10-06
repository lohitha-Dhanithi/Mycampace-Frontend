// src/components/tables/DataTable.jsx
import React, { useState, useMemo } from 'react'
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Search,
  Download,
  Filter,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingState } from '@/components/common/LoadingState'

export interface ColumnDef<T = any> {
  header: any;
  accessor?: any;
  cell?: (row: T, index?: number) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  cellClassName?: string;
  align?: 'left' | 'center' | 'right';
  [key: string]: any;
}

export interface DataTableProps<T = any> {
  columns: ColumnDef<T>[];
  data?: T[];
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKey?: string;
  onSearchChange?: (val: string) => void;
  filterComponent?: React.ReactNode;
  onExport?: (data?: any[]) => void;
  actions?: React.ReactNode;
  pageSize?: number;
  enableSelection?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  selectedIds?: Set<any>;
  onSelectionChange?: (selected: Set<any>) => void;
}

export function DataTable<T = any>({
  columns,
  data = [],
  loading = false,
  searchable = true,
  searchPlaceholder = 'Search records...',
  searchKey,
  onSearchChange,
  filterComponent,
  onExport,
  actions,
  pageSize = 10,
  enableSelection = false,
  emptyTitle,
  emptyDescription,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState(new Set())

  // Handle client-side search if not handled by parent
  const filteredData = useMemo(() => {
    if (!internalSearch) return data
    const query = internalSearch.toLowerCase()
    return data.filter((row) => {
      if (searchKey && row[searchKey]) {
        return String(row[searchKey]).toLowerCase().includes(query)
      }
      return Object.values(row).some((val) => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(query)
        }
        return false
      })
    })
  }, [data, internalSearch, searchKey])

  // Sorting
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if (aVal === bVal) return 0
      if (aVal === null || aVal === undefined) return 1
      if (bVal === null || bVal === undefined) return -1
      if (typeof aVal === 'string') {
        const res = aVal.localeCompare(String(bVal))
        return sortConfig.direction === 'asc' ? res : -res
      }
      return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
    })
  }, [filteredData, sortConfig])

  // Pagination
  const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize))
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
      }
      return { key, direction: 'asc' }
    })
  }

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginatedData.map((r: any, i) => r.id || i)))
    }
  }

  const handleToggleRow = (id: any) => {
    const next = new Set(selectedIds)
    if (next.has(id)) {
      next.delete(id)
    } else {
      next.add(id)
    }
    setSelectedIds(next)
  }

  const handleExportCSV = () => {
    if (onExport) {
      onExport(sortedData)
      return
    }
    // Default CSV exporter
    if (!sortedData.length) return
    const keys = columns.map((c) => c.accessor || c.header).filter(Boolean)
    const headers = columns.map((c) => c.header).join(',')
    const rows = sortedData.map((row: any) =>
      keys.map((k: any) => `"${String(row[k] || '').replace(/"/g, '""')}"`).join(',')
    )
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `export_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-3">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          {searchable && (
            <div className="relative w-full">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder={searchPlaceholder}
                value={internalSearch}
                onChange={(e) => {
                  setInternalSearch(e.target.value)
                  setCurrentPage(1)
                  onSearchChange && onSearchChange(e.target.value)
                }}
                className="pl-9 h-9 text-xs bg-white"
              />
            </div>
          )}
          {filterComponent}
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {enableSelection && selectedIds.size > 0 && (
            <span className="text-xs text-slate-600 bg-blue-50 px-2 py-1 rounded border border-blue-200">
              {selectedIds.size} selected
            </span>
          )}
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="text-xs h-9">
            <Download className="h-3.5 w-3.5 mr-1.5" /> Export
          </Button>
          {actions}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-md border border-slate-200 bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                {enableSelection && (
                  <th className="w-10 px-3 py-3">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      className="text-slate-500 hover:text-slate-800"
                    >
                      {selectedIds.size > 0 && selectedIds.size === paginatedData.length ? (
                        <CheckSquare className="h-4 w-4 text-blue-600" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                    </button>
                  </th>
                )}
                {columns.map((col, idx) => (
                  <th
                    key={idx}
                    className={`px-4 py-3 select-none ${col.sortable ? 'cursor-pointer hover:bg-slate-100/70' : ''} ${col.className || ''}`}
                    onClick={() => col.sortable && col.accessor && handleSort(col.accessor)}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable && (
                        <span className="text-slate-400">
                          {sortConfig.key === col.accessor ? (
                            sortConfig.direction === 'asc' ? (
                              <ChevronUp className="h-3.5 w-3.5 text-blue-600" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5 text-blue-600" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-3 w-3 opacity-60" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-normal">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (enableSelection ? 1 : 0)} className="p-8">
                    <LoadingState message="Loading data records..." />
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (enableSelection ? 1 : 0)} className="p-6">
                    <EmptyState
                      title={emptyTitle || 'No records to display'}
                      description={emptyDescription || 'Try adjusting your search criteria or filters.'}
                    />
                  </td>
                </tr>
              ) : (
                paginatedData.map((row: any, rIdx) => {
                  const rowId = row.id || rIdx
                  const isSelected = selectedIds.has(rowId)
                  return (
                    <tr
                      key={rowId}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isSelected ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      {enableSelection && (
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            onClick={() => handleToggleRow(rowId)}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            {isSelected ? (
                              <CheckSquare className="h-4 w-4 text-blue-600" />
                            ) : (
                              <Square className="h-4 w-4" />
                            )}
                          </button>
                        </td>
                      )}
                      {columns.map((col, cIdx) => (
                        <td key={cIdx} className={`px-4 py-3 text-slate-800 ${col.cellClassName || ''}`}>
                          {col.cell ? col.cell(row) : row[col.accessor] ?? '—'}
                        </td>
                      ))}
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        {!loading && sortedData.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 border-t border-slate-200 bg-slate-50/40 text-xs text-slate-500 gap-2">
            <div>
              Showing{' '}
              <span className="font-semibold text-slate-800">
                {(currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-semibold text-slate-800">
                {Math.min(currentPage * pageSize, sortedData.length)}
              </span>{' '}
              of <span className="font-semibold text-slate-800">{sortedData.length}</span> entries
            </div>

            <div className="flex items-center space-x-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </Button>
              <span className="px-2 text-slate-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
