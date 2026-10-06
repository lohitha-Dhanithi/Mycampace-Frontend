// src/modules/lms/pages/ContentLibraryPage.jsx
import React, { useState, useEffect } from 'react'
import {
  FolderOpen,
  Search,
  Filter,
  Upload,
  Download,
  Trash2,
  File,
  Video,
  FileText,
  FileCode,
  Image,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Plus,
} from 'lucide-react'
import { LMSNavigation } from '../components/LMSNavigation'
import { lmsContentService } from '../services/lmsContentService'

export function ContentLibraryPage() {
  const [items, setItems] = useState([])
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [newFile, setNewFile] = useState({
    fileName: '',
    type: 'PDF',
    size: '3.5 MB',
    uploadedBy: 'Pooja Iyer',
    downloadUrl: '/library/sample.pdf',
  })

  useEffect(() => {
    loadLibrary()
  }, [])

  const loadLibrary = async () => {
    setLoading(true)
    setError('')
    try {
      const data = await lmsContentService.getContentItems()
      setItems(data)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (item) => {
    if (item.usedInCourses && item.usedInCourses.length > 0) {
      alert(`Cannot delete this resource because it is actively used in: ${item.usedInCourses.join(', ')}. Please unlink it first.`)
      return
    }

    if (window.confirm(`Delete ${item.fileName} from Content Library?`)) {
      try {
        await lmsContentService.deleteContentItem(item.id)
        loadLibrary()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const handleUploadSubmit = async (e) => {
    e.preventDefault()
    if (!newFile.fileName.trim()) return
    await lmsContentService.uploadContentItem(newFile)
    setIsUploadOpen(false)
    setNewFile({
      fileName: '',
      type: 'PDF',
      size: '3.5 MB',
      uploadedBy: 'Pooja Iyer',
      downloadUrl: '/library/sample.pdf',
    })
    loadLibrary()
  }

  const filtered = items.filter((item) => {
    if (typeFilter !== 'all' && item.type.toLowerCase() !== typeFilter.toLowerCase()) return false
    if (search) {
      const q = search.toLowerCase()
      return (
        item.fileName.toLowerCase().includes(q) ||
        item.uploadedBy.toLowerCase().includes(q) ||
        item.usedInCourses?.some((c) => c.toLowerCase().includes(q))
      )
    }
    return true
  })

  const getIcon = (type) => {
    switch (type) {
      case 'Video':
        return <Video className="h-4 w-4 text-rose-500" />
      case 'Document':
        return <FileCode className="h-4 w-4 text-indigo-500" />
      case 'Image':
        return <Image className="h-4 w-4 text-emerald-500" />
      case 'PDF':
      default:
        return <File className="h-4 w-4 text-amber-500" />
    }
  }

  return (
    <div className="space-y-6">
      <LMSNavigation />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
            Institutional Repository
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Content Library & Learning Assets
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central repository of reusable lecture videos, PDF textbooks, slides, and simulation files.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors self-start md:self-auto"
        >
          <Upload className="h-3.5 w-3.5" />
          <span>Upload Learning Asset</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by filename, instructor or course..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 font-medium"
          >
            <option value="all">All File Types</option>
            <option value="pdf">PDF Documents</option>
            <option value="video">Videos</option>
            <option value="document">Office Docs</option>
            <option value="image">Images</option>
          </select>
        </div>
      </div>

      {/* Content DataTable */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Asset File Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">File Size</th>
                <th className="py-3 px-4">Uploaded By</th>
                <th className="py-3 px-4">Upload Date</th>
                <th className="py-3 px-4">Linked Courses</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                        {getIcon(item.type)}
                      </div>
                      <span className="font-bold text-slate-900 line-clamp-1">{item.fileName}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-600">{item.type}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">{item.size}</td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{item.uploadedBy}</td>
                  <td className="py-3.5 px-4 text-slate-500">{item.uploadDate}</td>
                  <td className="py-3.5 px-4">
                    {item.usedInCourses && item.usedInCourses.length > 0 ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 truncate max-w-xs">
                        {item.usedInCourses[0]}
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400">Unused in course</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <a
                        href={item.downloadUrl}
                        download
                        className="p-1.5 text-slate-400 hover:text-blue-600 rounded"
                        title="Download Asset"
                      >
                        <Download className="h-4 w-4" />
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded"
                        title="Delete Asset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Asset Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-base">Upload to Content Library</h3>
              <button type="button" onClick={() => setIsUploadOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. CBSE_Physics_Practical_Manual.pdf"
                  value={newFile.fileName}
                  onChange={(e) => setNewFile({ ...newFile, fileName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Content Type</label>
                  <select
                    value={newFile.type}
                    onChange={(e) => setNewFile({ ...newFile, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="PDF">PDF Document</option>
                    <option value="Video">Video File</option>
                    <option value="Document">Word Document</option>
                    <option value="Image">Infographic Image</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">File Size</label>
                  <input
                    type="text"
                    value={newFile.size}
                    onChange={(e) => setNewFile({ ...newFile, size: e.target.value })}
                    placeholder="e.g. 5.4 MB"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Upload File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
