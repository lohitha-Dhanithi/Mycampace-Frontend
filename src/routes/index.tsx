// src/routes/index.jsx
import React from 'react'
import { createBrowserRouter, Navigate, useParams } from 'react-router-dom'

// Platform Shells
import { PlatformHubShell } from '@/platform/shell/PlatformHubShell'
import { ProductShell } from '@/platform/shell/ProductShell'

// Platform Auth & Onboarding
import { PlatformAuthPage } from '@/platform/auth/PlatformAuthPage'
import { ForgotPasswordPage } from '@/modules/auth/ForgotPasswordPage'
import { AuthLayout } from '@/layouts/AuthLayout'

import { OrganizationSetupPage } from '@/platform/onboarding/OrganizationSetupPage'
import { InstitutionsSetupPage } from '@/platform/onboarding/InstitutionsSetupPage'
import { ProductSelectionPage } from '@/platform/onboarding/ProductSelectionPage'
import { TeamInvitePage } from '@/platform/onboarding/TeamInvitePage'
import { WorkspaceConfirmationPage } from '@/platform/onboarding/WorkspaceConfirmationPage'
import { DocumentUploadPage } from '@/platform/onboarding/DocumentUploadPage'
import { VerificationStatusPage } from '@/platform/onboarding/VerificationStatusPage'
import { VerificationQueuePage } from '@/platform/superadmin/VerificationQueuePage'
import { VerificationDetailPage } from '@/platform/superadmin/VerificationDetailPage'
import {
  HomeRedirect,
  OnboardingResume,
  RedirectIfAuthenticated,
  RequireApplicant,
  RequireSuperadmin,
  gateRoutes,
} from '@/routes/guards'

// Platform Central Pages
import { ProductHubPage } from '@/platform/hub/ProductHubPage'
import { ProductMarketplacePage } from '@/platform/products/ProductMarketplacePage'
import { GlobalOrganizationPage } from '@/platform/organization/GlobalOrganizationPage'
import { GlobalUsersPage } from '@/platform/users/GlobalUsersPage'
import { GlobalBillingPage } from '@/platform/billing/GlobalBillingPage'
import { GlobalSettingsPage } from '@/platform/settings/GlobalSettingsPage'

// Academics Product Pages
import { AcademicConfigPage } from '@/modules/academics/AcademicConfigPage'
import { AcademicDashboardPage } from '@/modules/academics/pages/AcademicDashboardPage'
import { AcademicOverviewPage } from '@/modules/academics/pages/AcademicOverviewPage'
import { ProgramsAcademicPage } from '@/modules/academics/pages/ProgramsAcademicPage'
import { ProgramDetailPage } from '@/modules/academics/pages/ProgramDetailPage'
import { CoursesAcademicPage } from '@/modules/academics/pages/CoursesAcademicPage'
import { CourseDetailPage } from '@/modules/academics/pages/CourseDetailPage'
import { ClassesAcademicPage } from '@/modules/academics/pages/ClassesAcademicPage'
import { ClassroomsPage } from '@/modules/academics/pages/ClassroomsPage'
import { ClassDetailPage } from '@/modules/academics/pages/ClassDetailPage'
import { SectionsAcademicPage } from '@/modules/academics/pages/SectionsAcademicPage'
import { SectionDetailPage } from '@/modules/academics/pages/SectionDetailPage'
import { SubjectsAcademicPage } from '@/modules/academics/pages/SubjectsAcademicPage'
import { SubjectDetailPage } from '@/modules/academics/pages/SubjectDetailPage'
import { FacultyAssignmentsPage } from '@/modules/academics/pages/FacultyAssignmentsPage'
import { FacultyAssignmentCreatePage } from '@/modules/academics/pages/FacultyAssignmentCreatePage'
import { SubjectAssignmentsPage } from '@/modules/academics/pages/SubjectAssignmentsPage'
import { ClassTeachersPage } from '@/modules/academics/pages/ClassTeachersPage'
import { StudentEnrolmentsPage } from '@/modules/academics/pages/StudentEnrolmentsPage'
import { AcademicCalendarPage } from '@/modules/academics/pages/AcademicCalendarPage'
import { AcademicEventCreatePage } from '@/modules/academics/pages/AcademicEventCreatePage'
import { FacultyWorkloadPage } from '@/modules/academics/pages/FacultyWorkloadPage'
import { TimetablePage } from '@/modules/academics/pages/TimetablePage'

// LMS Product Pages
import {
  LMSDashboardPage,
  CoursesListPage,
  CourseCreatePage,
  CourseEditPage,
  CourseDetailPage as LMSCourseDetailPage,
  CourseLessonDetailPage,
  CourseSubRoutePage,
  StudentMyLearningPage,
  StudentCoursePlayerPage,
  GlobalAssignmentsPage,
  AssignmentSubmissionsPage,
  GlobalQuizzesPage,
  QuizAttemptsPage,
  ContentLibraryPage,
  LMSReportsPage,
} from '@/modules/lms/pages'

// Finance Product Pages
import {
  FinanceDashboardPage,
  FeeStructuresListPage,
  FeeStructureCreatePage,
  FeeStructureDetailPage,
  FeeComponentsPage,
  StudentFeesListPage,
  StudentFeeDetailPage,
  InvoicesListPage,
  InvoiceDetailPage,
  PaymentsListPage,
  PaymentDetailPage,
  ReceiptsListPage,
  DiscountsListPage,
  ScholarshipsListPage,
  RefundsListPage,
  OutstandingDuesPage,
  FeeRemindersPage,
  ReconciliationPage,
  AdvertisingDashboardPage,
  AdCampaignsListPage,
  AdCampaignCreatePage,
  AdInventoryPage,
  FinancialServicesDashboardPage,
  LoanProductsListPage,
  LoanProductDetailPage,
  LoanApplicationsListPage,
  LoanApplicationDetailPage,
  FinanceReportsPage,
} from '@/modules/finance/pages'

// Admissions Product Pages
import { AdmissionsPage } from '@/modules/admissions/AdmissionsPage'
import { LeadCreatePage } from '@/modules/admissions/pages/LeadCreatePage'
import { LeadDetailPage } from '@/modules/admissions/pages/LeadDetailPage'
import { LeadEditPage } from '@/modules/admissions/pages/LeadEditPage'
import { CounsellingCreatePage } from '@/modules/admissions/pages/CounsellingCreatePage'
import { ApplicationCreatePage } from '@/modules/admissions/pages/ApplicationCreatePage'
import { ApplicationDetailPage } from '@/modules/admissions/pages/ApplicationDetailPage'
import { ApplicationReviewPage } from '@/modules/admissions/pages/ApplicationReviewPage'

// HRMS Product Pages
import {
  HrmsDashboardPage,
  StaffListPage,
  StaffFormPage,
  StaffDetailPage,
  LeaveListPage,
  LeaveFormPage,
  LeaveDetailPage,
  AttendancePage,
  HrmsSetupPage,
  MyPortalHome,
  MyProfilePage,
  MyLeavePage,
  MyLeaveApplyPage,
  MyLeaveDetailPage,
  MyAttendancePage,
} from '@/modules/hrms/pages'

// Students SIS Pages
import { StudentsListPage } from '@/modules/students/StudentsListPage'
import { StudentCreatePage } from '@/modules/students/pages/StudentCreatePage'
import { StudentEditPage } from '@/modules/students/pages/StudentEditPage'
import { StudentDetailPage } from '@/modules/students/pages/StudentDetailPage'
import { StudentTransfersPage } from '@/modules/students/pages/StudentTransfersPage'
import { StudentPromotionsPage } from '@/modules/students/pages/StudentPromotionsPage'
import { StudentExitsPage } from '@/modules/students/pages/StudentExitsPage'
import { StudentImportPage } from '@/modules/students/pages/StudentImportPage'

function AcademicsLegacyRedirect() {
  const rest = useParams()['*']
  return <Navigate to={rest ? `/app/academics/${rest}` : '/app/academics'} replace />
}

function AdmissionsLegacyRedirect() {
  const rest = useParams()['*']
  return <Navigate to={rest ? `/app/admissions/${rest}` : '/app/admissions'} replace />
}

export const router = createBrowserRouter(gateRoutes([
  // 1. Authentication Experience (signed-in users are sent on to their area)
  {
    path: '/auth',
    element: <RedirectIfAuthenticated><PlatformAuthPage mode="signin" /></RedirectIfAuthenticated>,
  },
  {
    path: '/auth/signup',
    element: <RedirectIfAuthenticated><PlatformAuthPage mode="signup" /></RedirectIfAuthenticated>,
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/auth/forgot-password',
        element: <RedirectIfAuthenticated><ForgotPasswordPage /></RedirectIfAuthenticated>,
      },
    ],
  },
  // The backend has no password-reset endpoint yet, so reset links go to the recovery help page.
  { path: '/auth/reset-password', element: <Navigate to="/auth/forgot-password" replace /> },
  { path: '/auth/signin', element: <Navigate to="/auth" replace /> },
  { path: '/login', element: <Navigate to="/auth" replace /> },
  { path: '/signup', element: <Navigate to="/auth/signup" replace /> },

  // 2. Organization Onboarding Experience (signed-in applicants only; later steps need earlier ones saved)
  {
    path: '/onboarding',
    element: <RequireApplicant><OnboardingResume /></RequireApplicant>,
  },
  {
    path: '/onboarding/organization',
    element: <RequireApplicant step={1}><OrganizationSetupPage /></RequireApplicant>,
  },
  {
    path: '/onboarding/institutions',
    element: <RequireApplicant step={2}><InstitutionsSetupPage /></RequireApplicant>,
  },
  {
    path: '/onboarding/products',
    element: <RequireApplicant step={3}><ProductSelectionPage /></RequireApplicant>,
  },
  {
    path: '/onboarding/team',
    element: <RequireApplicant step={4}><TeamInvitePage /></RequireApplicant>,
  },
  {
    // Review is reachable once documents are open (the server only records step 4 at that point).
    path: '/onboarding/products/confirmation',
    element: <RequireApplicant step={4}><WorkspaceConfirmationPage /></RequireApplicant>,
  },
  {
    path: '/onboarding/documents',
    element: <RequireApplicant step={4}><DocumentUploadPage /></RequireApplicant>,
  },
  {
    path: '/onboarding/verification-status',
    element: <RequireApplicant><VerificationStatusPage /></RequireApplicant>,
  },

  // 2b. Superadmin verification console (SuperAdmin role only; enforced by the backend)
  {
    path: '/admin/superadmin',
    element: <RequireSuperadmin><VerificationQueuePage /></RequireSuperadmin>,
  },
  {
    path: '/superadmin/verifications',
    element: <RequireSuperadmin><VerificationQueuePage /></RequireSuperadmin>,
  },
  {
    path: '/superadmin/verifications/:organizationId',
    element: <RequireSuperadmin><VerificationDetailPage /></RequireSuperadmin>,
  },

  // 3. Central MyCampace Product Hub & Platform Governance
  {
    path: '/app',
    element: <PlatformHubShell />,
    children: [
      { index: true, element: <ProductHubPage /> },
      { path: 'products', element: <ProductMarketplacePage /> },
      { path: 'organization', element: <GlobalOrganizationPage /> },
      { path: 'users', element: <GlobalUsersPage /> },
      { path: 'billing', element: <GlobalBillingPage /> },
      { path: 'settings', element: <GlobalSettingsPage /> },
    ],
  },

  // 4. Product Applications (Isolated Shell & Dedicated Product Sidebars)
  // 4A. MyCampace Academics
  {
    path: '/app/academics',
    element: <ProductShell productId="academics" />,
    children: [
      { index: true, element: <AcademicDashboardPage /> },
      { path: 'overview', element: <AcademicOverviewPage /> },
      { path: 'programs', element: <ProgramsAcademicPage /> },
      { path: 'programs/:id', element: <ProgramDetailPage /> },
      { path: 'courses', element: <CoursesAcademicPage /> },
      { path: 'courses/:id', element: <CourseDetailPage /> },
      { path: 'classes', element: <ClassesAcademicPage /> },
      { path: 'classrooms', element: <ClassroomsPage /> },
      { path: 'classes/:id', element: <ClassDetailPage /> },
      { path: 'sections', element: <SectionsAcademicPage /> },
      { path: 'sections/:id', element: <SectionDetailPage /> },
      { path: 'subjects', element: <SubjectsAcademicPage /> },
      { path: 'subjects/:id', element: <SubjectDetailPage /> },
      { path: 'faculty-assignments', element: <FacultyAssignmentsPage /> },
      { path: 'faculty-assignments/new', element: <FacultyAssignmentCreatePage /> },
      { path: 'subject-assignments', element: <SubjectAssignmentsPage /> },
      { path: 'class-teachers', element: <ClassTeachersPage /> },
      { path: 'enrolments', element: <StudentEnrolmentsPage /> },
      { path: 'academic-calendar', element: <AcademicCalendarPage /> },
      { path: 'timetable', element: <TimetablePage /> },
      { path: 'academic-calendar/new', element: <AcademicEventCreatePage /> },
      { path: 'workload', element: <FacultyWorkloadPage /> },
      { path: 'academic-years', element: <AcademicConfigPage defaultTab="years" /> },
      { path: 'configuration', element: <AcademicConfigPage defaultTab="years" /> },
    ],
  },

  // 4B. MyCampace LMS
  {
    path: '/app/lms',
    element: <ProductShell productId="lms" />,
    children: [
      { index: true, element: <LMSDashboardPage /> },
      { path: 'courses', element: <CoursesListPage /> },
      { path: 'courses/new', element: <CourseCreatePage /> },
      { path: 'courses/:id', element: <LMSCourseDetailPage /> },
      { path: 'courses/:id/edit', element: <CourseEditPage /> },
      { path: 'courses/:id/modules', element: <CourseSubRoutePage tab="content" /> },
      { path: 'courses/:id/modules/new', element: <CourseSubRoutePage tab="content" /> },
      { path: 'courses/:id/modules/:moduleId', element: <CourseSubRoutePage tab="content" /> },
      { path: 'courses/:id/lessons/new', element: <CourseSubRoutePage tab="content" /> },
      { path: 'courses/:id/lessons/:lessonId', element: <CourseLessonDetailPage /> },
      { path: 'courses/:id/content', element: <CourseSubRoutePage tab="content" /> },
      { path: 'courses/:id/assignments', element: <CourseSubRoutePage tab="assignments" /> },
      { path: 'courses/:id/assignments/new', element: <CourseSubRoutePage tab="assignments" /> },
      { path: 'courses/:id/assignments/:assignmentId', element: <CourseSubRoutePage tab="assignments" /> },
      { path: 'courses/:id/quizzes', element: <CourseSubRoutePage tab="quizzes" /> },
      { path: 'courses/:id/quizzes/new', element: <CourseSubRoutePage tab="quizzes" /> },
      { path: 'courses/:id/quizzes/:quizId', element: <CourseSubRoutePage tab="quizzes" /> },
      { path: 'courses/:id/students', element: <CourseSubRoutePage tab="students" /> },
      { path: 'courses/:id/progress', element: <CourseSubRoutePage tab="progress" /> },
      { path: 'my-learning', element: <StudentMyLearningPage /> },
      { path: 'my-learning/:courseId', element: <StudentCoursePlayerPage /> },
      { path: 'assignments', element: <GlobalAssignmentsPage /> },
      { path: 'assignments/:id/submissions', element: <AssignmentSubmissionsPage /> },
      { path: 'quizzes', element: <GlobalQuizzesPage /> },
      { path: 'quizzes/:id/attempts', element: <QuizAttemptsPage /> },
      { path: 'content-library', element: <ContentLibraryPage /> },
      { path: 'reports', element: <LMSReportsPage /> },
    ],
  },

  // 4C. MyCampace Finance
  {
    path: '/app/finance',
    element: <ProductShell productId="finance" />,
    children: [
      { index: true, element: <FinanceDashboardPage /> },
      { path: 'dashboard', element: <FinanceDashboardPage /> },
      { path: 'fee-structures', element: <FeeStructuresListPage /> },
      { path: 'fee-structures/new', element: <FeeStructureCreatePage /> },
      { path: 'fee-structures/:id', element: <FeeStructureDetailPage /> },
      { path: 'fee-structures/:id/edit', element: <FeeStructureDetailPage /> },
      { path: 'fee-components', element: <FeeComponentsPage /> },
      { path: 'fee-components/new', element: <FeeComponentsPage /> },
      { path: 'student-fees', element: <StudentFeesListPage /> },
      { path: 'student-fees/:studentId', element: <StudentFeeDetailPage /> },
      { path: 'invoices', element: <InvoicesListPage /> },
      { path: 'invoices/:id', element: <InvoiceDetailPage /> },
      { path: 'payments', element: <PaymentsListPage /> },
      { path: 'payments/:id', element: <PaymentDetailPage /> },
      { path: 'receipts', element: <ReceiptsListPage /> },
      { path: 'receipts/:id', element: <ReceiptsListPage /> },
      { path: 'discounts', element: <DiscountsListPage /> },
      { path: 'scholarships', element: <ScholarshipsListPage /> },
      { path: 'refunds', element: <RefundsListPage /> },
      { path: 'dues', element: <OutstandingDuesPage /> },
      { path: 'reminders', element: <FeeRemindersPage /> },
      { path: 'reconciliation', element: <ReconciliationPage /> },
      { path: 'advertising', element: <AdvertisingDashboardPage /> },
      { path: 'advertising/campaigns', element: <AdCampaignsListPage /> },
      { path: 'advertising/campaigns/new', element: <AdCampaignCreatePage /> },
      { path: 'advertising/inventory', element: <AdInventoryPage /> },
      { path: 'financial-services', element: <FinancialServicesDashboardPage /> },
      { path: 'financial-services/loans', element: <LoanProductsListPage /> },
      { path: 'financial-services/loans/:id', element: <LoanProductDetailPage /> },
      { path: 'financial-services/applications', element: <LoanApplicationsListPage /> },
      { path: 'financial-services/applications/:id', element: <LoanApplicationDetailPage /> },
      { path: 'reports', element: <FinanceReportsPage /> },
    ],
  },

  // 4D. MyCampace Admissions
  {
    path: '/app/admissions',
    element: <ProductShell productId="admissions" />,
    children: [
      { index: true, element: <AdmissionsPage defaultTab="dashboard" /> },
      { path: 'leads', element: <AdmissionsPage defaultTab="leads" /> },
      { path: 'leads/new', element: <LeadCreatePage /> },
      { path: 'leads/:id', element: <LeadDetailPage /> },
      { path: 'leads/:id/edit', element: <LeadEditPage /> },
      { path: 'enquiries', element: <Navigate to="/app/admissions/leads" replace /> },
      { path: 'counselling', element: <AdmissionsPage defaultTab="counselling" /> },
      { path: 'counselling/new', element: <CounsellingCreatePage /> },
      { path: 'applications', element: <AdmissionsPage defaultTab="applications" /> },
      { path: 'applications/new', element: <ApplicationCreatePage /> },
      { path: 'applications/:id', element: <ApplicationDetailPage /> },
      { path: 'applications/:id/review', element: <ApplicationReviewPage /> },
      { path: 'fees', element: <AdmissionsPage defaultTab="fees" /> },
      { path: 'documents', element: <AdmissionsPage defaultTab="documents" /> },
      { path: 'follow-ups', element: <AdmissionsPage defaultTab="followups" /> },
      { path: 'reports', element: <AdmissionsPage defaultTab="reports" /> },
    ],
  },

  // 4E. MyCampace Students (SIS)
  {
    path: '/app/students',
    element: <ProductShell productId="students" />,
    children: [
      { index: true, element: <StudentsListPage /> },
      { path: 'new', element: <StudentCreatePage /> },
      { path: 'import', element: <StudentImportPage /> },
      { path: 'transfers', element: <StudentTransfersPage /> },
      { path: 'promotions', element: <StudentPromotionsPage /> },
      { path: 'exits', element: <StudentExitsPage /> },
      { path: ':id', element: <StudentDetailPage /> },
      { path: ':id/edit', element: <StudentEditPage /> },
      { path: ':id/:tab', element: <StudentDetailPage /> },
    ],
  },

  // 4F. MyCampace HRMS
  {
    path: '/app/hrms',
    element: <ProductShell productId="hrms" />,
    children: [
      { index: true, element: <HrmsDashboardPage /> },
      { path: 'me', element: <MyPortalHome /> },
      { path: 'me/profile', element: <MyProfilePage /> },
      { path: 'me/leave', element: <MyLeavePage /> },
      { path: 'me/leave/new', element: <MyLeaveApplyPage /> },
      { path: 'me/leave/:id', element: <MyLeaveDetailPage /> },
      { path: 'me/attendance', element: <MyAttendancePage /> },
      { path: 'staff', element: <StaffListPage /> },
      { path: 'setup', element: <HrmsSetupPage /> },
      { path: 'staff/new', element: <StaffFormPage /> },
      { path: 'staff/:id', element: <StaffDetailPage /> },
      { path: 'staff/:id/edit', element: <StaffFormPage /> },
      { path: 'leaves', element: <LeaveListPage /> },
      { path: 'leaves/new', element: <LeaveFormPage /> },
      { path: 'leaves/:id', element: <LeaveDetailPage /> },
      { path: 'attendance', element: <AttendancePage /> },
    ],
  },

  // 4G. Other Products (Dynamic Entitlement / Unlock Screen)
  {
    path: '/app/:productId/*',
    element: <ProductShell productId="hrms" />,
  },

  // 5. Backwards Compatibility & Permalinks
  { path: '/', element: <HomeRedirect /> },
  { path: '/dashboard', element: <HomeRedirect /> },
  { path: '/academics/*', element: <AcademicsLegacyRedirect /> },
  { path: '/lms/*', element: <Navigate to="/app/lms" replace /> },
  { path: '/finance/*', element: <Navigate to="/app/finance" replace /> },
  { path: '/admissions/*', element: <AdmissionsLegacyRedirect /> },
  { path: '/students/*', element: <Navigate to="/app/students" replace /> },
  { path: '/hrms/*', element: <Navigate to="/app/hrms" replace /> },
  { path: '/institution/*', element: <Navigate to="/app/organization" replace /> },
  { path: '/users/*', element: <Navigate to="/app/users" replace /> },
  { path: '/roles/*', element: <Navigate to="/app/users" replace /> },
  { path: '/settings', element: <Navigate to="/app/settings" replace /> },

  // Catch-all
  { path: '*', element: <HomeRedirect /> },
]))
