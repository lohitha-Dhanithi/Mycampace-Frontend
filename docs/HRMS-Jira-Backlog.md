# MyCampace HRMS — Jira Backlog (Epics, User Stories, Tasks)

**Product:** MyCampace HRMS  
**Repos:** `webapp-frontend` (UI), `backend` (NestJS + Prisma)  
**Last aligned to codebase:** Oct 2026  

---

## 1. Purpose

This document is ready to import or copy into Jira. It covers **frontend and backend** work to take HRMS from the current **UI + localStorage prototype** (`hrmsService.ts`, `hrmsMockData.ts`) to a **tenant-scoped API** consistent with other products (Auth, Organization, Admissions).

### Current baseline

| Area | Status |
|------|--------|
| Frontend routes | `/app/hrms/*` — dashboard, staff, setup, leaves, attendance, appraisals, My Portal (`/app/hrms/me/*`) |
| Frontend data | Client-side store in `localStorage` (`mycampace_hrms_v1`) |
| Backend | No `HrmsModule`; product entitlement only (`products.service.ts`) |
| Database | No HRMS models in `schema.prisma` |

### Suggested Jira configuration

| Field | Recommendation |
|-------|----------------|
| **Project key** | `HRMS` or shared `MYC` with component `HRMS` |
| **Components** | `Frontend`, `Backend`, `Database`, `DevOps` |
| **Labels** | `hrms`, `mvp`, `phase-1`, `self-service`, `api-integration` |
| **Fix versions** | `HRMS-MVP-1`, `HRMS-MVP-2` (see §8) |

**Issue type mapping**

- **Epic** → sections below (`HRMS-E1` …)
- **Story** → user-facing capability
- **Task** → implementable unit (prefix `[FE]` / `[BE]` / `[DB]`)

**Story points (optional):** 1 = few hours, 2 = half day, 3 = 1 day, 5 = 2–3 days, 8 = epic slice.

---

## 2. Cross-cutting definition of done (all stories)

- Scoped by **organization**, **campus**, and **academic year** where applicable (match platform tenant context).
- Authenticated APIs; role checks for admin vs employee self-service.
- Errors surfaced in UI (toast/inline), loading and empty states.
- API documented (Swagger on backend).
- No secrets in repo; env-based API base URL on frontend.

---

# Epic HRMS-E1 — Platform foundation & HRMS module shell

**Goal:** Register HRMS in backend, shared patterns, and wire frontend to real APIs.

| ID | User story | Acceptance criteria (summary) |
|----|------------|-------------------------------|
| **HRMS-1** | As a **platform admin**, I want HRMS registered as a product so that tenants can enable it from the hub. | Product id `hrms` matches frontend route `/app/hrms`; trial/plan visible in hub. |
| **HRMS-2** | As a **developer**, I want a dedicated HRMS API namespace so that all HR features are discoverable and versioned. | Nest `HrmsModule` mounted; health/readiness includes DB connectivity. |
| **HRMS-3** | As an **HR admin**, I want the app to use live data instead of browser storage so that records are shared across devices and users. | Frontend reads/writes via HTTP; localStorage used only for UI prefs (e.g. portal mode). |

### Tasks

| Task | Layer | Description |
|------|-------|-------------|
| HRMS-E1-T1 | [BE] | Create `backend/src/modules/hrms/` (`hrms.module.ts`, empty controllers scaffold). Register in `app.module.ts`. |
| HRMS-E1-T2 | [BE] | Add Swagger tag `@ApiTags('HRMS')`, global prefix `/hrms` (or `/api/hrms` per project convention). |
| HRMS-E1-T3 | [BE] | Implement tenant context guard: resolve `organizationId`, `campusId`, `academicYearId` from JWT/session (mirror academics/admissions pattern). |
| HRMS-E1-T4 | [FE] | Add `hrmsApiClient` (base URL from env, auth headers, error normalization). |
| HRMS-E1-T5 | [FE] | Feature flag or env `NEXT_PUBLIC_HRMS_USE_API` to switch `hrmsService` from localStorage to API adapter. |
| HRMS-E1-T6 | [FE] | Fix legacy redirect for `/hrms/*` → `/app/hrms/*` with path preservation (same pattern as admissions). |
| HRMS-E1-T7 | [DB] | Document migration strategy (Prisma migrate) and seed script for demo tenant HR data. |

---

# Epic HRMS-E2 — Data model & staff directory (employee records)

**Goal:** Persist staff master data and profiles (directory, detail, create/edit).

| ID | User story | Acceptance criteria (summary) |
|----|------------|-------------------------------|
| **HRMS-4** | As an **HR admin**, I want to view and search the staff directory so that I can find employees by name, code, department, or campus. | Filters: search, category, status, campus; list matches `StaffListPage`. |
| **HRMS-5** | As an **HR admin**, I want to create and edit staff profiles so that employee master data stays accurate. | Fields align with `StaffMember` / `StaffDraft` in `types.ts`; unique employee code per org. |
| **HRMS-6** | As an **HR admin**, I want a staff detail view with documents, service history, certifications, leave balances, and appraisal summary so that I have a single employee record. | Matches `getStaffProfile` behavior in `hrmsService.ts`. |
| **HRMS-7** | As **HR**, I want to add documents and service events on a profile so that compliance and tenure history are tracked. | Document status workflow: Pending Review → Verified / Expired. |

### Tasks

| Task | Layer | Description |
|------|-------|-------------|
| HRMS-E2-T1 | [DB] | Prisma models: `Staff`, `StaffDocument`, `ServiceEvent`, `Certification` (+ enums for employment/document/cert status). Relations to `Organization`, `Campus`, optional link to `User`. |
| HRMS-E2-T2 | [BE] | `GET/POST /hrms/staff`, `GET/PATCH /hrms/staff/:id`, query filters for list endpoint. |
| HRMS-E2-T3 | [BE] | `GET /hrms/staff/:id/profile` aggregating documents, events, certifications, balances, appraisal stub. |
| HRMS-E2-T4 | [BE] | `POST /hrms/staff/:id/documents`, `PATCH /hrms/staff/documents/:id/status`. |
| HRMS-E2-T5 | [BE] | `POST /hrms/staff/:id/service-events`; auto-create “Joined” event on staff create. |
| HRMS-E2-T6 | [BE] | Employee code generator (`EMP-####`) per organization; validation on email uniqueness. |
| HRMS-E2-T7 | [FE] | Replace `getStaff`, `getStaffById`, `createStaff`, `updateStaff`, `getStaffProfile`, document/event actions in `hrmsService.ts` with API calls. |
| HRMS-E2-T8 | [FE] | Loading/error states on `StaffListPage`, `StaffFormPage`, `StaffDetailPage`. |
| HRMS-E2-T9 | [FE] | Pagination or virtual scroll if staff count > 100 (MVP: server-side page + size). |

---

# Epic HRMS-E3 — HR setup (categories, departments, lookups)

**Goal:** Configurable lookups currently stored in `mycampace_hrms_lookups`.

| ID | User story | Acceptance criteria (summary) |
|----|------------|-------------------------------|
| **HRMS-8** | As an **HR admin**, I want to manage staff categories and departments so that forms and reports use consistent values. | UI: `HrmsSetupPage`; prevent duplicate names (case-insensitive). |
| **HRMS-9** | As an **HR admin**, I want default categories (Teaching / Non-Teaching) seeded for new tenants so that setup is fast. | Seed on org onboarding or first HRMS access. |

### Tasks

| Task | Layer | Description |
|------|-------|-------------|
| HRMS-E3-T1 | [DB] | Models `HrmsCategory`, `HrmsDepartment` (org-scoped, unique name). |
| HRMS-E3-T2 | [BE] | `GET/POST /hrms/lookups/categories`, `GET/POST /hrms/lookups/departments`. |
| HRMS-E3-T3 | [FE] | Wire `HrmsSetupPage` + staff forms to lookup APIs; remove `LOOKUP_KEY` localStorage. |

---

# Epic HRMS-E4 — Leave management & approval workflow

**Goal:** Leave apply, multi-level approval (manager chain → HR), balances, admin desk.

| ID | User story | Acceptance criteria (summary) |
|----|------------|-------------------------------|
| **HRMS-10** | As a **staff member**, I want to apply for leave with type, dates, and reason so that my manager can approve it. | Day count inclusive; validation for past dates per policy (configurable MVP: block invalid range). |
| **HRMS-11** | As a **reporting manager**, I want an approval inbox so that I only see requests assigned to me. | Matches `getApprovalInbox` + `currentApproverId` logic. |
| **HRMS-12** | As **HR**, I want to final-approve or reject after the manager chain so that balances update and status is final. | HR step only when status `Pending HR`; balance check on approve. |
| **HRMS-13** | As an **HR admin**, I want a leave desk listing all requests with filters so that I can monitor SLA and queues. | `LeaveListPage`, `LeaveDetailPage`, `LeaveFormPage` (admin create on behalf). |
| **HRMS-14** | As a **staff member**, I want to see leave balance by type so that I know remaining entitlement. | Casual / Sick / Earned (+ optional types from config). |

### Tasks

| Task | Layer | Description |
|------|-------|-------------|
| HRMS-E4-T1 | [DB] | Models `LeaveRequest`, `LeaveTimelineEntry`, `LeaveBalance`; enums for type/status. |
| HRMS-E4-T2 | [BE] | Port approval graph logic from `assignApprover`, `nextManager`, `decideLeave` in `hrmsService.ts` to service layer. |
| HRMS-E4-T3 | [BE] | `GET/POST /hrms/leaves`, `GET /hrms/leaves/:id`, `POST /hrms/leaves/:id/decide` (body: approve/reject, comment, actor context). |
| HRMS-E4-T4 | [BE] | `GET /hrms/leaves/inbox` for current user’s staff record; map platform user → staff via email. |
| HRMS-E4-T5 | [BE] | `GET /hrms/staff/:id/leave-balances`; initialize balances on staff create. |
| HRMS-E4-T6 | [BE] | On HR approve, update balance and optionally set staff `employmentStatus` to `On Leave` when dates include today. |
| HRMS-E4-T7 | [FE] | API integration for `LeaveListPage`, `LeaveFormPage`, `LeaveDetailPage`, `leaveAwaitingLabel`. |
| HRMS-E4-T8 | [FE] | Manager approve/reject actions on detail view with permission checks. |
| HRMS-E4-T9 | [FE] | `previewFirstApprover` via API for leave apply form. |

---

# Epic HRMS-E5 — Employee self-service (My Portal)

**Goal:** Staff-only UX at `/app/hrms/me/*` with portal mode rules in `portalMode.ts`.

| ID | User story | Acceptance criteria (summary) |
|----|------------|-------------------------------|
| **HRMS-15** | As a **staff user**, I want My Portal home with my pending items so that I see leave and tasks without admin menus. | Non-admin users default to `self` mode; admin can toggle admin/self. |
| **HRMS-16** | As a **staff user**, I want to view and edit my profile basics so that contact info stays current. | `MyProfilePage`; limited fields vs HR full edit. |
| **HRMS-17** | As a **staff user**, I want to apply and track my leave from My Leave so that I don’t need HR to submit for me. | Routes: `/app/hrms/me/leave`, `/new`, `/:id`. |
| **HRMS-18** | As a **staff user**, I want to see my attendance history so that I can verify records. | `MyAttendancePage` read-only subset. |

### Tasks

| Task | Layer | Description |
|------|-------|-------------|
| HRMS-E5-T1 | [BE] | `GET /hrms/me` — resolve staff by authenticated user email; `ensureSelfStaff` equivalent server-side. |
| HRMS-E5-T2 | [BE] | `PATCH /hrms/me/profile` with field allowlist. |
| HRMS-E5-T3 | [BE] | `GET /hrms/me/leaves`, `POST /hrms/me/leaves` (same validation as admin create but staffId fixed). |
| HRMS-E5-T4 | [BE] | `GET /hrms/me/attendance` filtered by staffId + date range. |
| HRMS-E5-T5 | [FE] | Wire `MyPortalPages.tsx` flows to API; keep portal mode in localStorage only. |
| HRMS-E5-T6 | [FE] | Enforce navigation guards in `ProductShell` using server role + `hasHrmsAdminAccess` (avoid client-only trust). |

---

# Epic HRMS-E6 — Attendance & shifts

**Goal:** Daily attendance register and shift definitions (`AttendancePage`).

| ID | User story | Acceptance criteria (summary) |
|----|------------|-------------------------------|
| **HRMS-19** | As an **HR admin**, I want to define shifts per campus so that attendance aligns with schedules. | CRUD shifts: name, start, end, campus, assigned count (optional). |
| **HRMS-20** | As an **HR admin**, I want to mark or update attendance (Present, Absent, Late, On Leave) so that daily reports are accurate. | Bulk mark for date + department (MVP: single-day grid). |
| **HRMS-21** | As an **HR admin**, I want dashboard metrics for present today so that leadership sees snapshot counts. | Feeds `HrmsDashboardPage` KPIs. |

### Tasks

| Task | Layer | Description |
|------|-------|-------------|
| HRMS-E6-T1 | [DB] | Models `Shift`, `AttendanceRecord` (unique staffId + date). |
| HRMS-E6-T2 | [BE] | `GET/POST/PATCH /hrms/shifts`, `GET /hrms/attendance?date=`, `PATCH /hrms/attendance/:id`. |
| HRMS-E6-T3 | [BE] | Optional: generate attendance rows for active staff for a given date (job or on-demand). |
| HRMS-E6-T4 | [FE] | Wire `AttendancePage` to API; status updates with optimistic UI optional. |
| HRMS-E6-T5 | [FE] | Dashboard widget: present today / total from API. |

---

# Epic HRMS-E7 — Performance appraisal cycle

**Goal:** Weighted metrics, stages Self → HOD → Principal → HR Closed (`AppraisalListPage`, `AppraisalDetailPage`).

| ID | User story | Acceptance criteria (summary) |
|----|------------|-------------------------------|
| **HRMS-22** | As **HR**, I want an appraisal cycle list by stage so that I can track completion. | Filter by stage; cycle name from config (`APPRAISAL_CYCLE`). |
| **HRMS-23** | As an **employee**, I want to complete self-review scores (1–5) so that my HOD can review next. | Cannot advance until all metrics scored. |
| **HRMS-24** | As **HOD / Principal**, I want to score and advance reviews so that final rating is computed. | Weighted scores; final rating band from `ratingFor` logic. |
| **HRMS-25** | As **HR**, I want closed appraisals locked from edit so that records are audit-safe. | Stage `HR Closed` read-only. |

### Tasks

| Task | Layer | Description |
|------|-------|-------------|
| HRMS-E7-T1 | [DB] | Models `AppraisalReview`, `AppraisalMetric`, `AppraisalComment`; link to staff + cycle. |
| HRMS-E7-T2 | [BE] | Auto-create appraisal row on staff hire (mirror frontend `createStaff`). |
| HRMS-E7-T3 | [BE] | `GET /hrms/appraisals`, `GET /hrms/appraisals/:id`, `PATCH metrics`, `POST advance` with stage enforcement. |
| HRMS-E7-T4 | [BE] | Role rules: self vs HOD vs Principal (map by department/manager or product role). |
| HRMS-E7-T5 | [FE] | Wire appraisal pages to API; add sidebar nav item under HRMS (routes exist but not in `ProductShell` today). |
| HRMS-E7-T6 | [FE] | Staff detail tab: show linked appraisal summary from API. |

---

# Epic HRMS-E8 — HR dashboard & reporting

**Goal:** Replace computed mock dashboard with API aggregates.

| ID | User story | Acceptance criteria (summary) |
|----|------------|-------------------------------|
| **HRMS-26** | As an **HR admin**, I want a dashboard with headcount, leave queue, appraisal progress, and compliance alerts so that I can prioritize work. | Matches `HrmsDashboard` interface. |
| **HRMS-27** | As an **HR admin**, I want expiring documents and certifications highlighted so that I can renew before lapse. | Top N expiring items with owner name. |

### Tasks

| Task | Layer | Description |
|------|-------|-------------|
| HRMS-E8-T1 | [BE] | `GET /hrms/dashboard` — aggregate queries (counts by department, rating distribution, leave queue). |
| HRMS-E8-T2 | [BE] | Index/optimize queries for dashboard (campus + status filters). |
| HRMS-E8-T3 | [FE] | Wire `HrmsDashboardPage` to dashboard API; skeleton loaders. |
| HRMS-E8-T4 | [FE] | Deep links from dashboard cards to leaves/staff/appraisals routes. |

---

# Epic HRMS-E9 — Quality, security, observability & release

**Goal:** Production readiness for HRMS MVP.

| ID | User story | Acceptance criteria (summary) |
|----|------------|-------------------------------|
| **HRMS-28** | As a **security owner**, I want HRMS APIs authorized by role so that staff cannot access other tenants’ or unauthorized records. | Integration tests for cross-tenant denial. |
| **HRMS-29** | As a **QA engineer**, I want automated tests for leave approval and appraisal transitions so that regressions are caught. | BE e2e + FE smoke on critical paths. |

### Tasks

| Task | Layer | Description |
|------|-------|-------------|
| HRMS-E9-T1 | [BE] | Unit tests: leave approval chain, balance deduction, self-approval blocked. |
| HRMS-E9-T2 | [BE] | E2e tests: staff CRUD, leave lifecycle, auth guards. |
| HRMS-E9-T3 | [FE] | Component/integration tests for leave apply and portal mode routing. |
| HRMS-E9-T4 | [BE] | Audit log hooks for leave decisions and appraisal stage changes (if platform audit exists, integrate). |
| HRMS-E9-T5 | [DevOps] | CI job: migrate + test; staging env vars documented in `.env.example`. |
| HRMS-E9-T6 | [FE] | Remove or gate `hrmsMockData` seed when API flag on; migration guide for existing localStorage users (one-time discard OK for MVP). |

---

## 8. Suggested delivery phases

### HRMS-MVP-1 (Foundation + Staff + Leave + Portal)

Epics: **E1, E2, E3, E4, E5** (partial E8 dashboard counts only).

**Outcome:** Real staff records, leave workflow end-to-end, My Portal live, no localStorage business data.

### HRMS-MVP-2 (Attendance + Appraisals + Dashboard polish)

Epics: **E6, E7, E8, E9**.

**Outcome:** Full parity with current frontend feature set backed by API.

---

## 9. Jira import checklist

1. Create epics **HRMS-E1 … HRMS-E9** with descriptions from this doc.  
2. Create stories under each epic; link FE/BE tasks as sub-tasks or linked tasks.  
3. Set **Component** on every task (`Frontend` / `Backend`).  
4. Add dependency: **E1** blocks all others; **E2** blocks E4, E5, E6, E7.  
5. Assign **MVP-1** fix version to E1–E5 stories; **MVP-2** to E6–E9.  

---

## 10. Quick reference — frontend routes (for QA / story descriptions)

| Route | Page |
|-------|------|
| `/app/hrms` | HR dashboard |
| `/app/hrms/staff` | Staff directory |
| `/app/hrms/staff/new`, `/staff/:id`, `/staff/:id/edit` | Staff CRUD |
| `/app/hrms/setup` | Categories & departments |
| `/app/hrms/leaves`, `/leaves/new`, `/leaves/:id` | Leave desk |
| `/app/hrms/attendance` | Shifts & attendance |
| `/app/hrms/appraisals`, `/appraisals/:id` | Appraisals |
| `/app/hrms/me/*` | Employee self-service |

---

*Document owner: Product / Engineering. Update when API paths or routes change.*
