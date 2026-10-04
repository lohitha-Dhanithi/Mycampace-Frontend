// src/services/institutionService.js
import { MOCK_INSTITUTIONS, MOCK_CAMPUSES, MOCK_ACADEMIC_YEARS, MOCK_ORGANIZATIONS } from './mockData';

let institutions = [...MOCK_INSTITUTIONS];
let campuses = [...MOCK_CAMPUSES];
let academicYears = [...MOCK_ACADEMIC_YEARS];

export const institutionService = {
  getOrganizations: async () => {
    return MOCK_ORGANIZATIONS;
  },

  getInstitutions: async () => {
    await new Promise((r) => setTimeout(r, 150));
    return [...institutions];
  },

  getInstitutionById: async (id) => {
    await new Promise((r) => setTimeout(r, 150));
    return institutions.find((i) => i.id === id) || institutions[0];
  },

  updateInstitution: async (id, updatedData) => {
    await new Promise((r) => setTimeout(r, 250));
    institutions = institutions.map((i) => (i.id === id ? { ...i, ...updatedData } : i));
    return institutions.find((i) => i.id === id);
  },

  getCampuses: async (institutionId) => {
    await new Promise((r) => setTimeout(r, 150));
    if (!institutionId || institutionId === 'all') return campuses;
    return campuses.filter((c) => c.institutionId === institutionId);
  },

  addCampus: async (campusData) => {
    await new Promise((r) => setTimeout(r, 200));
    const newCampus = {
      id: `camp-${Date.now()}`,
      institutionId: campusData.institutionId || 'inst-1',
      status: 'Active',
      currentStudents: 0,
      ...campusData,
    };
    campuses = [newCampus, ...campuses];
    return newCampus;
  },

  updateCampus: async (id, updatedData) => {
    await new Promise((r) => setTimeout(r, 200));
    campuses = campuses.map((c) => (c.id === id ? { ...c, ...updatedData } : c));
    return campuses.find((c) => c.id === id);
  },

  deleteCampus: async (id) => {
    await new Promise((r) => setTimeout(r, 200));
    campuses = campuses.filter((c) => c.id !== id);
    return true;
  },

  getAcademicYears: async () => {
    return academicYears;
  },
};
