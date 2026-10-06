// src/services/admissionService.js
import { MOCK_ADMISSIONS_PIPELINE, MOCK_LEADS, MOCK_APPLICATIONS } from './mockData';

let pipeline = [...MOCK_ADMISSIONS_PIPELINE];
let leads = [...MOCK_LEADS];
let applications = [...MOCK_APPLICATIONS];

export const admissionService = {
  getPipeline: async () => {
    await new Promise((r) => setTimeout(r, 100));
    return [...pipeline];
  },

  getLeads: async (filters: any = {}) => {
    await new Promise((r) => setTimeout(r, 150));
    let result = [...leads];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (l) =>
          l.studentName.toLowerCase().includes(q) ||
          l.parentName.toLowerCase().includes(q) ||
          l.leadNumber.toLowerCase().includes(q) ||
          l.phone.includes(q)
      );
    }
    if (filters.stage && filters.stage !== 'all') {
      result = result.filter((l) => l.stage.toUpperCase() === filters.stage.toUpperCase());
    }
    return result;
  },

  createLead: async (leadData) => {
    await new Promise((r) => setTimeout(r, 200));
    const newLead = {
      id: `lead-${Date.now()}`,
      leadNumber: `ENQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      createdDate: new Date().toISOString().split('T')[0],
      stage: 'Enquiry',
      status: 'New',
      priority: 'Medium',
      ...leadData,
    };
    leads = [newLead, ...leads];
    return newLead;
  },

  getApplications: async (filters: any = {}) => {
    await new Promise((r) => setTimeout(r, 150));
    let result = [...applications];
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (a) =>
          a.studentName.toLowerCase().includes(q) ||
          a.parentName.toLowerCase().includes(q) ||
          a.applicationNumber.toLowerCase().includes(q)
      );
    }
    if (filters.stage && filters.stage !== 'all') {
      result = result.filter((a) => a.stage.toLowerCase() === filters.stage.toLowerCase());
    }
    return result;
  },

  updateApplicationStage: async (id, newStage) => {
    await new Promise((r) => setTimeout(r, 200));
    applications = applications.map((a) => (a.id === id ? { ...a, stage: newStage } : a));
    return applications.find((a) => a.id === id);
  },

  enrollStudentFromApplication: async (id, section) => {
    await new Promise((r) => setTimeout(r, 250));
    applications = applications.map((a) =>
      a.id === id
        ? {
            ...a,
            stage: 'Enrolled',
            status: 'Enrolled',
            allocatedSection: section || a.allocatedSection,
          }
        : a
    );
    return applications.find((a) => a.id === id);
  },
};
