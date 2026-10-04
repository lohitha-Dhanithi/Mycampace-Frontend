// src/store/TenantContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { MOCK_ORGANIZATIONS, MOCK_INSTITUTIONS, MOCK_CAMPUSES, MOCK_ACADEMIC_YEARS } from '../services/mockData';

const TenantContext = createContext(null);

export const TenantProvider = ({ children }) => {
  const [organizations] = useState(MOCK_ORGANIZATIONS);
  const [institutions] = useState(MOCK_INSTITUTIONS);
  const [campuses, setCampuses] = useState(MOCK_CAMPUSES);
  const [academicYears] = useState(MOCK_ACADEMIC_YEARS);

  const [selectedOrg, setSelectedOrg] = useState(MOCK_ORGANIZATIONS[0]);
  const [selectedInstitution, setSelectedInstitution] = useState(MOCK_INSTITUTIONS[0]);
  const [selectedCampus, setSelectedCampus] = useState(MOCK_CAMPUSES[0]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(
    MOCK_ACADEMIC_YEARS.find((y) => y.isCurrent) || MOCK_ACADEMIC_YEARS[0]
  );

  // When institution changes, filter campuses
  const handleSelectInstitution = (inst) => {
    setSelectedInstitution(inst);
    const relatedCampuses = campuses.filter((c) => c.institutionId === inst.id);
    if (relatedCampuses.length > 0) {
      setSelectedCampus(relatedCampuses[0]);
    }
  };

  const value = {
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

export const useTenantContext = () => {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenantContext must be used within a TenantProvider');
  }
  return context;
};
