// src/services/organizationService.js
import { MOCK_ORGANIZATIONS, MOCK_INSTITUTIONS, MOCK_CAMPUSES } from './mockData'

const DEFAULT_ORG_PROFILE = {
  id: 'org-1',
  name: 'Apex Global Education Foundation',
  legalName: 'Apex Global Education Foundation Trust',
  code: 'AGEF',
  logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=120&auto=format&fit=crop&q=80',
  type: 'Higher Education & K-12 Group',
  country: 'India',
  state: 'Telangana',
  city: 'Hyderabad',
  address: 'Level 14, Apex Towers, Financial District, Nanakramguda',
  postalCode: '500032',
  taxId: 'GSTIN36AAATA1234F1Z8',
  primaryContact: {
    name: 'Dr. Radhakrishnan Murthy',
    email: 'chancellor@apexeducation.org',
    phone: '+91 98480 12345',
    designation: 'Director General',
  },
  domains: ['apexeducation.org', 'abcschool.edu.in', 'aitm.edu.in'],
  branding: {
    primaryColor: '#2563eb',
    accentColor: '#4f46e5',
    themeMode: 'light',
    customSubdomain: 'apex.mycampace.com',
  },
  academicContext: {
    activeYear: '2026-27',
    term: 'Fall Term / Term 1',
    boardAffiliations: ['CBSE', 'JNTU / AICTE', 'Cambridge International'],
  },
}

class OrganizationService {
  storageKey: string

  constructor() {
    this.storageKey = 'mycampace_organization'
    this.init()
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(DEFAULT_ORG_PROFILE))
    }
  }

  getOrganization() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : DEFAULT_ORG_PROFILE
    } catch (e) {
      return DEFAULT_ORG_PROFILE
    }
  }

  updateOrganization(updated) {
    const current = this.getOrganization()
    const merged = { ...current, ...updated }
    localStorage.setItem(this.storageKey, JSON.stringify(merged))
    return merged
  }

  getInstitutions() {
    return MOCK_INSTITUTIONS
  }

  getCampuses() {
    return MOCK_CAMPUSES
  }
}

export const organizationService = new OrganizationService()
