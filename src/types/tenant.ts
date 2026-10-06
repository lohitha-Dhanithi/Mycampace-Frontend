// src/types/tenant.ts

export interface Organization {
  id: string;
  name: string;
  code?: string;
  logo?: string;
  domain?: string;
  status?: string;
}

export interface Institution {
  id: string;
  name: string;
  code: string;
  type?: string;
  organizationId?: string;
  address?: string;
  contactEmail?: string;
}

export interface Campus {
  id: string;
  name: string;
  code: string;
  institutionId: string;
  city?: string;
  state?: string;
  isMain?: boolean;
}

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface TenantContextType {
  organizations: Organization[];
  institutions: Institution[];
  campuses: Campus[];
  academicYears: AcademicYear[];
  selectedOrg: Organization | null;
  setSelectedOrg: (org: Organization) => void;
  selectedInstitution: Institution | null;
  setSelectedInstitution: (inst: Institution) => void;
  selectedCampus: Campus | null;
  setSelectedCampus: (campus: Campus) => void;
  selectedAcademicYear: AcademicYear | null;
  setSelectedAcademicYear: (year: AcademicYear) => void;
}
