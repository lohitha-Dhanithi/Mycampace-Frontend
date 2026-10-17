// Patches the checklist after upload/remove using the upload API response.
// GET /verification/requirements stays the source of truth on page load; we avoid refetching after every file.
import type { DocumentMeta, RequirementItem, RequirementsResponse, RequirementsSummary, VerificationStatusView } from '../types/verification'

function recomputeSummary(items: RequirementItem[], status: VerificationStatusView): RequirementsSummary {
  const required = items.filter((i) => i.required)
  const missing = required.filter((i) => !i.done)
  const rejected = items.filter((i) => i.document?.reviewStatus === 'Rejected')
  return {
    requiredTotal: required.length,
    requiredDone: required.length - missing.length,
    optionalTotal: items.length - required.length,
    optionalDone: items.filter((i) => !i.required && i.done).length,
    missing: missing.map((m) => ({ key: m.key, campusId: m.campusId, label: m.label })),
    rejected: rejected.map((r) => ({
      key: r.key,
      campusId: r.campusId,
      label: r.label,
      note: r.document?.reviewNote ?? null,
    })),
    canSubmit:
      status.editable && status.onboardingStep >= 4 && missing.length === 0 && rejected.length === 0,
  }
}

function slotMatches(item: RequirementItem, key: string, campusId: string | null) {
  return item.key === key && (item.campusId ?? null) === (campusId ?? null)
}

/** Apply POST /verification/documents response to the cached checklist. */
export function patchRequirementsAfterUpload(
  req: RequirementsResponse,
  key: string,
  campusId: string | null,
  document: DocumentMeta,
): RequirementsResponse {
  const items = req.items.map((item) => {
    if (!slotMatches(item, key, campusId) || item.kind === 'data') return item
    return { ...item, document, done: true }
  })
  return { ...req, items, summary: recomputeSummary(items, req.status) }
}

/** Apply DELETE /verification/documents/:id to the cached checklist. */
export function patchRequirementsAfterRemove(req: RequirementsResponse, documentId: string): RequirementsResponse {
  const items = req.items.map((item) => {
    if (item.document?.id !== documentId || item.kind === 'data') return item
    return { ...item, document: null, done: false }
  })
  return { ...req, items, summary: recomputeSummary(items, req.status) }
}
