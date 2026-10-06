// src/store/TenantContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_ORGANIZATIONS, MOCK_INSTITUTIONS, MOCK_CAMPUSES, MOCK_ACADEMIC_YEARS } from '../services/mockData';
import type { TenantContextType, Organization, Institution, Campus, AcademicYear } from '../types/tenant';

const TenantContext = createContext<TenantContextType | null>(null);

export const TenantProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [organizations] = useState<Organization[]>(MOCK_ORGANIZATIONS as any);
  const [institutions] = useState<Institution[]>(MOCK_INSTITUTIONS as any);
  const [campuses, setCampuses] = useState<Campus[]>(MOCK_CAMPUSES as any);
  const [academicYears] = useState<AcademicYear[]>(MOCK_ACADEMIC_YEARS as any);

  const [selectedOrg, setSelectedOrg] = useState<Organization>(MOCK_ORGANIZATIONS[0] as any);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution>(MOCK_INSTITUTIONS[0] as any);
  const [selectedCampus, setSelectedCampus] = useState<Campus>(MOCK_CAMPUSES[0] as any);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<AcademicYear>(
    (MOCK_ACADEMIC_YEARS.find((y: any) => y.isCurrent) || MOCK_ACADEMIC_YEARS[0]) as any
  );

  // When institution changes, filter campuses
  const handleSelectInstitution = (inst: Institution) => {
    setSelectedInstitution(inst);
    const relatedCampuses = campuses.filter((c) => c.institutionId === inst.id);
    if (relatedCampuses.length > 0) {
      setSelectedCampus(relatedCampuses[0]);
    }
  };

  const value: TenantContextType = {
    organizations,
    institutions,
    campuses,
    academicYears,
    selectedOrg,
    setSelectedOrg,
    selectedInstitution,
    setSelectedInstitution: handleSelectInstitution,
    selectedCampus,
    setSelectedCampus,
    selectedAcademicYear,
    setSelectedAcademicYear,
  };

  return <TenantContext.Provider value={value}>{children}</TenantContext.Provider>;
};

export const useTenantContext = (): TenantContextType => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
};
