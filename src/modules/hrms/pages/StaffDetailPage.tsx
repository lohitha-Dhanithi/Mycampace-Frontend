import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { LoadingState } from '@/components/common/LoadingState'
import { hrmsService } from '../services/hrmsService'
import { EmptyState, Field, Panel, StatusBadge } from '../components/ui'
import { DOCUMENT_TYPES, formatDisplayDate } from '../config/hrmsConfig'
import type { Certification, LeaveBalance, ServiceEvent, StaffDocument, StaffMember, AppraisalReview } from '../types'

type Profile = {
  staff: StaffMember
  documents: StaffDocument[]
  serviceEvents: ServiceEvent[]
  certifications: Certification[]
  balances: LeaveBalance[]
  appraisal: AppraisalReview | null
}

const TABS = ['Profile', 'Document Vault', 'Service History', 'Certifications'] as const

export function StaffDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [missing, setMissing] = useState(false)
  const [tab, setTab] = useState<(typeof TABS)[number]>('Profile')
  const [docName, setDocName] = useState('')
  const [docType, setDocType] = useState(DOCUMENT_TYPES[0])
  const [docExpiry, setDocExpiry] = useState('')
  const [eventTitle, setEventTitle] = useState('')
  const [eventDate, setEventDate] = useState('2026-10-09')
  const [eventDetail, setEventDetail] = useState('')
  const [notice, setNotice] = useState('')

  const load = () => {
    if (!id) return
    hrmsService.getStaffProfile(id).then((result) => {
      if (!result) setMissing(true)
      else setProfile(result)
    })
  }

  useEffect(() => {
    load()
  }, [id])

  if (missing) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-semibold text-slate-800">Staff record not found</p>
        <Button className="mt-4" onClick={() => navigate('/app/hrms/staff')}>Back to directory</Button>
      </div>
    )
  }

  if (!profile) return <LoadingState message="Loading staff profile..." />

  const { staff } = profile

  const addDocument = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!docName.trim() || !id) return
    await hrmsService.addDocument(id, { name: docName.trim(), type: docType, expiryDate: docExpiry })
    setDocName('')
    setDocExpiry('')
    setNotice('Document added to the vault and marked for review.')
    load()
  }

  const addEvent = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!eventTitle.trim() || !id) return
    await hrmsService.addServiceEvent(id, { title: eventTitle.trim(), date: eventDate, detail: eventDetail.trim() })
    setEventTitle('')
    setEventDetail('')
    setNotice('Service history updated.')
    load()
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          to="/app/hrms/staff"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          &larr; Back to Staff Directory
        </Link>
      </div>

      <PageHeader
        title={staff.fullName}
        description={`${staff.employeeCode} · ${staff.designation}`}
        badge={<StatusBadge value={staff.employmentStatus} />}
        actions={
          <div className="flex gap-2">
            <Link to={`/app/hrms/leaves/new?staffId=${staff.id}`} className="inline-flex h-8 items-center rounded-xl border border-slate-200 bg-white px-3.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors">
              Apply leave
            </Link>
            <Link to={`/app/hrms/staff/${staff.id}/edit`} className="inline-flex h-8 items-center rounded-xl bg-slate-900 px-3.5 text-xs font-semibold text-white shadow-2xs hover:bg-indigo-600 transition-colors">
              Edit profile
            </Link>
          </div>
        }
      />

      <div className="flex flex-wrap gap-2">
        <StatusBadge value={staff.category} />
        <span className="text-xs text-slate-500">{staff.department} · {staff.campus}</span>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {TABS.map((item) => {
          let count: number | null = null
          if (item === 'Document Vault') count = profile.documents.length
          if (item === 'Service History') count = profile.serviceEvents.length
          if (item === 'Certifications') count = profile.certifications.length
          return (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${
                tab === item ? 'border-b-2 border-indigo-600 text-indigo-700 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{item}</span>
              {count !== null && (
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                    tab === item ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {notice && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-700">{notice}</p>}

      {tab === 'Profile' && (
        <div className="grid gap-4 lg:grid-cols-3">
          <Panel title="Employment">
            <dl className="grid grid-cols-2 gap-3 text-xs">
              {[
                ['Email', staff.email],
                ['Phone', staff.phone],
                ['Joined', formatDisplayDate(staff.joiningDate)],
                ['Experience', `${staff.experienceYears} years`],
                ['Qualification', staff.qualification || '—'],
                ['Reports to', staff.reportingManager],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[11px] uppercase tracking-wide text-slate-400">{label}</dt>
                  <dd className="mt-0.5 font-medium text-slate-800">{value}</dd>
                </div>
              ))}
            </dl>
          </Panel>
          <Panel title="Leave balances">
            <div className="space-y-2">
              {profile.balances.map((balance) => (
                <div key={balance.type} className="flex items-center justify-between text-xs">
                  <span className="text-slate-600">{balance.type}</span>
                  <span className="font-semibold text-slate-900">{balance.entitled - balance.used} left <span className="font-normal text-slate-400">/ {balance.entitled}</span></span>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Current appraisal">
            {profile.appraisal ? (
              <div className="space-y-3">
                <StatusBadge value={profile.appraisal.stage} />
                <p className="text-xs text-slate-500">{profile.appraisal.cycle}</p>
                {profile.appraisal.finalRating && <StatusBadge value={profile.appraisal.finalRating} />}
                <Link to={`/app/hrms/appraisals/${profile.appraisal.id}`} className="block text-xs font-semibold text-blue-600 hover:underline">
                  Open performance review
                </Link>
              </div>
            ) : (
              <EmptyState message="No appraisal is open for this staff member." />
            )}
          </Panel>
        </div>
      )}

      {tab === 'Document Vault' && (
        <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            {profile.documents.length === 0 ? (
              <EmptyState message="The vault is empty." />
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Document</th>
                    <th className="px-4 py-3 font-semibold">Uploaded</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profile.documents.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-slate-800">{doc.name}</p>
                        <p className="text-[11px] text-slate-500">{doc.type}{doc.expiryDate ? ` · expires ${formatDisplayDate(doc.expiryDate)}` : ''}</p>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{formatDisplayDate(doc.uploadedOn)}</td>
                      <td className="px-4 py-3"><StatusBadge value={doc.status} /></td>
                      <td className="px-4 py-3 text-right">
                        {doc.status !== 'Verified' && (
                          <button
                            type="button"
                            className="text-[11px] font-semibold text-indigo-700"
                            onClick={async () => {
                              await hrmsService.updateDocumentStatus(doc.id, 'Verified')
                              setNotice(`${doc.name} verified.`)
                              load()
                            }}
                          >
                            Verify
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <form onSubmit={addDocument} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-slate-900">Add to vault</h2>
            <Field label="Document name"><Input value={docName} onChange={(event) => setDocName(event.target.value)} /></Field>
            <Field label="Type">
              <Select value={docType} onChange={(event) => setDocType(event.target.value)}>
                {DOCUMENT_TYPES.map((item) => <option key={item}>{item}</option>)}
              </Select>
            </Field>
            <Field label="Expiry date">
              <Input type="date" value={docExpiry} onChange={(event) => setDocExpiry(event.target.value)} />
            </Field>
            <Button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600">Store document</Button>
          </form>
        </div>
      )}

      {tab === 'Service History' && (
        <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            {profile.serviceEvents.length === 0 ? (
              <EmptyState message="No service events yet." />
            ) : (
              profile.serviceEvents.map((item) => (
                <div key={item.id} className="border-l-2 border-indigo-200 pl-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-600">{formatDisplayDate(item.date)}</p>
                  <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                  <p className="text-xs text-slate-500">{item.detail}</p>
                </div>
              ))
            )}
          </div>
          <form onSubmit={addEvent} className="space-y-3 rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-slate-900">Add service note</h2>
            <Field label="Title"><Input value={eventTitle} onChange={(event) => setEventTitle(event.target.value)} /></Field>
            <Field label="Date"><Input type="date" value={eventDate} onChange={(event) => setEventDate(event.target.value)} /></Field>
            <Field label="Detail"><Input value={eventDetail} onChange={(event) => setEventDetail(event.target.value)} /></Field>
            <Button type="submit" className="w-full bg-slate-900 hover:bg-indigo-600">Add to history</Button>
          </form>
        </div>
      )}

      {tab === 'Certifications' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {profile.certifications.length === 0 ? (
            <EmptyState message="No certifications are on file." />
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Certification</th>
                  <th className="px-4 py-3 font-semibold">Issuer</th>
                  <th className="px-4 py-3 font-semibold">Validity</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {profile.certifications.map((cert) => (
                  <tr key={cert.id}>
                    <td className="px-4 py-3 font-semibold text-slate-800">{cert.name}</td>
                    <td className="px-4 py-3 text-slate-600">{cert.issuer}</td>
                    <td className="px-4 py-3 text-slate-600">{cert.validUntil ? formatDisplayDate(cert.validUntil) : 'No expiry'}</td>
                    <td className="px-4 py-3"><StatusBadge value={cert.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
