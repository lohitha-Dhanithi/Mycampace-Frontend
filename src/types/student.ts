// src/types/student.ts

export type StudentStatus = 'Active' | 'Inactive' | 'Suspended' | 'Alumni' | 'Transferred' | 'Withdrawn';

export interface Guardian {
  id?: string;
  name: string;
  relation: string;
  phone: string;
  email?: string;
  occupation?: string;
  isPrimary?: boolean;
}

export interface StudentDocument {
  id: string;
  studentId: string;
  title: string;
  documentType: string;
  fileUrl?: string;
  uploadDate: string;
  status: 'Verified' | 'Pending' | 'Rejected';
}

export interface Student {
  id: string;
  admissionNo: string;
  rollNo?: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: string;
  status: StudentStatus;
  academicYearId?: string;
  institutionId?: string;
  campusId?: string;
  programId?: string;
  departmentId?: string;
  sectionId?: string;
  batch?: string;
  guardians?: Guardian[];
  avatar?: string;
  address?: {
    line1?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
}

export interface StudentFilters {
  search?: string;
  status?: string;
  campusId?: string;
  departmentId?: string;
  programId?: string;
  academicYearId?: string;
}
