// src/components/forms/FileUpload.tsx
import React, { useRef, useState } from 'react'
import { UploadCloud, File, X } from 'lucide-react'

export interface FileUploadProps {
  label?: string;
  accept?: string;
  hint?: string;
  onFileSelected?: (file: File) => void;
  previewUrl?: string;
}

export function FileUpload({ label, accept = '.pdf,.png,.jpg,.jpeg', hint, onFileSelected, previewUrl }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      onFileSelected && onFileSelected(file)
    }
  }

  const handleClear = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-1.5">
      {label && <label className="text-xs font-medium text-slate-700">{label}</label>}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20 rounded-lg p-4 text-center cursor-pointer transition-colors"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          className="hidden"
        />

        {selectedFile ? (
          <div className="flex items-center justify-between bg-white p-2.5 rounded border border-slate-200 text-left">
            <div className="flex items-center gap-2 overflow-hidden">
              <File className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="overflow-hidden">
                <p className="text-xs font-medium text-slate-800 truncate">{selectedFile.name}</p>
                <p className="text-[11px] text-slate-400">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <UploadCloud className="h-7 w-7 text-slate-400 mb-1" />
            <p className="text-xs text-slate-700 font-medium">
              Click to upload or drag & drop
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {hint || `Accepted: ${accept} (Max 10MB)`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
