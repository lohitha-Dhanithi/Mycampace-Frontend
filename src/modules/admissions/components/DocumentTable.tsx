// src/modules/admissions/components/DocumentTable.jsx
import React, { useState } from 'react'
import {
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Download,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export interface DocumentTableProps {
  documents?: any[]
  onUpload?: (docId: any, fileData: any) => Promise<void> | void
  onVerify?: (docId: any) => Promise<void> | void
  onReject?: (docId: any, reason: any) => Promise<void> | void
  allowActions?: boolean
}

export function DocumentTable({
  documents = [],
  onUpload,
  onVerify,
  onReject,
  allowActions = true,
}: DocumentTableProps) {
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadTarget, setUploadTarget] = useState(null)
  const [fileNameInput, setFileNameInput] = useState('')

  const handleVerify = (doc) => {
    if (onVerify) {
      onVerify(doc.id)
    }
  }

  const handleOpenReject = (doc) => {
    setSelectedDoc(doc)
    setRejectReason('')
    setRejectDialogOpen(true)
  }

  const handleConfirmReject = () => {
    if (onReject && selectedDoc) {
      onReject(selectedDoc.id, rejectReason)
    }
    setRejectDialogOpen(false)
  }

  const handleOpenUpload = (doc) => {
    setUploadTarget(doc)
    setFileNameInput(`${doc.type.replace(/\s+/g, '_')}_Document.pdf`)
    setUploadDialogOpen(true)
  }

  const handleConfirmUpload = () => {
    if (onUpload && uploadTarget) {
      onUpload(uploadTarget.applicationId, {
        id: uploadTarget.id,
        type: uploadTarget.type,
        code: uploadTarget.code,
        fileName: fileNameInput || 'uploaded_document.pdf',
        fileSize: '1.2 MB',
      })
    }
    setUploadDialogOpen(false)
  }

  const getVerificationBadge = (doc) => {
    if (!doc.uploaded) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          <Clock className="h-3 w-3" /> Upload Pending
        </span>
      )
    }
    if (doc.verificationStatus === 'Verified') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
          <CheckCircle className="h-3 w-3" /> Verified
        </span>
      )
    }
    if (doc.verificationStatus === 'Rejected') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-red-700 bg-red-50 px-2 py-0.5 rounded border border-red-200">
          <XCircle className="h-3 w-3" /> Rejected
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
        <Clock className="h-3 w-3" /> Pending Review
      </span>
    )
  }

  return (
    <div className="space-y-3">
      <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="px-4 py-3">Document</th>
                <th className="px-4 py-3">Requirement</th>
                <th className="px-4 py-3">Uploaded File</th>
                <th className="px-4 py-3">Verification Status</th>
                <th className="px-4 py-3">Verified By</th>
                {allowActions && <th className="px-4 py-3 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={allowActions ? 6 : 5} className="p-6 text-center text-slate-400">
                    No documents listed for this applicant.
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                      <div>
                        <div>{doc.type}</div>
                        <span className="text-[10px] text-slate-400 font-normal">Code: {doc.code || 'DOC'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {doc.required ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-700 border border-red-200 font-medium">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          Optional
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {doc.uploaded ? (
                        <div>
                          <div className="font-medium text-slate-800">{doc.fileName}</div>
                          <span className="text-[10px] text-slate-400">
                            {doc.fileSize} • Uploaded {doc.uploadedDate}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Not yet uploaded</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        {getVerificationBadge(doc)}
                        {doc.rejectionReason && (
                          <div className="text-[10px] text-red-600 mt-1 max-w-xs leading-tight">
                            Note: {doc.rejectionReason}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {doc.verifiedBy ? (
                        <div>
                          <div className="font-medium text-slate-800">{doc.verifiedBy}</div>
                          <div className="text-[10px] text-slate-400">{doc.verifiedDate}</div>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    {allowActions && (
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {!doc.uploaded ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenUpload(doc)}
                              className="h-7 text-[11px] gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Upload className="h-3 w-3" /> Upload
                            </Button>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[11px]"
                                title="View Mock File"
                                onClick={() => alert(`Previewing ${doc.fileName} (Mock Viewer)`)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              {doc.verificationStatus !== 'Verified' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleVerify(doc)}
                                  className="h-7 text-[11px] text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                                >
                                  Verify
                                </Button>
                              )}
                              {doc.verificationStatus !== 'Rejected' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleOpenReject(doc)}
                                  className="h-7 text-[11px] text-red-700 border-red-200 hover:bg-red-50"
                                >
                                  Reject
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-700 flex items-center gap-1.5">
              <AlertCircle className="h-4 w-4" /> Reject Document
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Provide feedback for rejecting <strong>{selectedDoc?.type}</strong>. The applicant will be notified to re-upload.
            </p>
            <Textarea
              placeholder="e.g. Document image is blurry or missing seal from previous school..."
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmReject}
              disabled={!rejectReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document (Mock)</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-xs text-slate-600">
              Select or confirm document filename for <strong>{uploadTarget?.type}</strong>.
            </p>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700">File Name</label>
              <Input
                value={fileNameInput}
                onChange={(e) => setFileNameInput(e.target.value)}
                placeholder="document_name.pdf"
              />
            </div>
            <div className="border border-dashed border-slate-300 rounded p-4 text-center bg-slate-50 text-xs text-slate-500">
              Drag and drop local document here, or keep mock file name.
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setUploadDialogOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmUpload} className="bg-blue-600 hover:bg-blue-700 text-white">
              Confirm Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
