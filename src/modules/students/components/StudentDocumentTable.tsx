// src/modules/students/components/StudentDocumentTable.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { StatusBadge } from '@/components/common/StatusBadge'
import {
  FileText,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Plus,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export function StudentDocumentTable({
  documents = [],
  studentId,
  onUploadDocument,
  onVerifyDocument,
  onRejectDocument,
}) {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [docName, setDocName] = useState('')
  const [docType, setDocType] = useState('Identity Proof')

  const [rejectOpen, setRejectOpen] = useState(false)
  const [targetDoc, setTargetDoc] = useState(null)
  const [rejectReason, setRejectReason] = useState('')

  const handleUploadSubmit = (e) => {
    e.preventDefault()
    if (onUploadDocument) {
      onUploadDocument({
        documentName: docName || `${docType.replace(/\s+/g, '_')}.pdf`,
        documentType: docType,
        required: true,
      })
    }
    setUploadOpen(false)
    setDocName('')
  }

  const handleConfirmReject = () => {
    if (onRejectDocument && targetDoc) {
      onRejectDocument(targetDoc.id, rejectReason)
    }
    setRejectOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Official Student Records</h4>
          <p className="text-[11px] text-slate-500">Certificates, identity proofs and statutory compliance documents</p>
        </div>
        <Button size="sm" onClick={() => setUploadOpen(true)} className="h-8 text-xs gap-1.5 bg-blue-600 hover:bg-blue-700 text-white">
          <Upload className="h-3.5 w-3.5" /> Upload Document
        </Button>
      </div>

      <div className="rounded-md border border-slate-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
              <tr>
                <th className="px-4 py-3">Document Name</th>
                <th className="px-4 py-3">Classification</th>
                <th className="px-4 py-3">Uploaded Date</th>
                <th className="px-4 py-3">Verification Status</th>
                <th className="px-4 py-3">Verified By</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-slate-400">
                    No documents uploaded for this student yet.
                  </td>
                </tr>
              ) : (
                documents.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-slate-900 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                      <div>
                        <div>{d.documentName}</div>
                        <span className="text-[10px] text-slate-400 font-normal">{d.fileSize || '1.2 MB'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-700">{d.documentType}</td>
                    <td className="px-4 py-3 text-slate-600">{d.uploadedDate || '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={d.status} />
                      {d.remarks && (
                        <div className="text-[10px] text-slate-500 mt-0.5 truncate max-w-xs">{d.remarks}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {d.verifiedBy ? (
                        <div>
                          <div className="font-medium text-slate-800">{d.verifiedBy}</div>
                          <span className="text-[10px] text-slate-400">{d.verifiedDate}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => alert(`Opening ${d.documentName} in secure document viewer`)}
                          className="h-7 px-2 text-xs"
                          title="Preview File"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        {d.status !== 'Verified' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onVerifyDocument && onVerifyDocument(d.id)}
                            className="h-7 text-[11px] text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                          >
                            Verify
                          </Button>
                        )}
                        {d.status !== 'Rejected' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setTargetDoc(d)
                              setRejectReason('')
                              setRejectOpen(true)
                            }}
                            className="h-7 text-[11px] text-red-600 border-red-200 hover:bg-red-50"
                          >
                            Reject
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Student Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUploadSubmit} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Document Type *</label>
              <Select value={docType} onChange={(e) => setDocType(e.target.value)}>
                <option value="Identity Proof">Identity Proof (Aadhaar / Passport)</option>
                <option value="Address Proof">Address Proof</option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Previous Qualification">Previous Qualification Mark Sheet</option>
                <option value="Transfer Certificate">Transfer Certificate (TC)</option>
                <option value="Photograph">Student Photograph</option>
                <option value="Medical Certificate">Medical & Health Fitness</option>
                <option value="Other">Other Certificate</option>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-700">Document Title / File Name *</label>
              <Input
                required
                placeholder="e.g. TC_Original_Scan.pdf"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
            </div>

            <div className="p-4 border border-dashed border-slate-300 rounded text-center text-slate-500 bg-slate-50">
              Drag and drop local file here or confirm simulated document upload.
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" size="sm" onClick={() => setUploadOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Upload & Register Document
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-700">Reject Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <p className="text-slate-600">
              Provide reason for rejecting <strong>{targetDoc?.documentName}</strong>:
            </p>
            <Textarea
              rows={3}
              placeholder="e.g. Attestation stamp missing from previous school..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setRejectOpen(false)}>
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
    </div>
  )
}
