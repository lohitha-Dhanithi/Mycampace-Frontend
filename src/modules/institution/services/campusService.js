// src/modules/institution/services/campusService.js
import { INITIAL_CAMPUSES } from '../data/institutionMockData';

// Maintain in-memory state for mock lifecycle
let campusesList = [...INITIAL_CAMPUSES];

export const campusService = {
  /**
   * Get list of campuses with optional filters
   * @param {Object} filters
   * @returns {Promise<Array>}
   */
  getCampuses: async (filters = {}) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let result = [...campusesList];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.code.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.head?.name?.toLowerCase().includes(q)
      );
    }

    if (filters.status && filters.status !== 'all') {
      result = result.filter((c) => c.status === filters.status);
    }

    if (filters.type && filters.type !== 'all') {
      result = result.filter((c) => c.type === filters.type);
    }

    return result;
  },

  /**
   * Get single campus by ID
   * @param {string} id
   * @returns {Promise<Object|null>}
   */
  getCampusById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 150));
    const found = campusesList.find((c) => c.id === id);
    return found ? { ...found } : null;
  },

  /**
   * Create a new campus
   * @param {Object} campusData
   * @returns {Promise<Object>}
   */
  createCampus: async (campusData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newCampus = {
      id: `camp-${Date.now()}`,
      createdDate: new Date().toISOString().split('T')[0],
      academicStats: {
        currentAcademicYear: '2026–27',
        programsCount: 1,
        programsList: ['General Academic Curriculum'],
        classesCount: 1,
        sectionsCount: 1,
        departmentsCount: 1,
        departmentsList: ['General Academics'],
      },
      userStats: {
        totalUsers: 1,
        administrators: 1,
        teachers: 0,
        staff: 0,
        students: 0,
      },
      recentActivity: [
        {
          id: `act-new-${Date.now()}`,
          title: 'Campus Created',
          description: `Campus registered in system.`,
          timestamp: 'Just now',
          user: 'Admin',
          type: 'campus',
        },
      ],
      ...campusData,
      status: campusData.status || 'Active',
    };

    campusesList = [newCampus, ...campusesList];
    return { ...newCampus };
  },

  /**
   * Update an existing campus
   * @param {string} id
   * @param {Object} campusData
   * @returns {Promise<Object>}
   */
  updateCampus: async (id, campusData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    campusesList = campusesList.map((c) => {
      if (c.id === id) {
        return {
          ...c,
          ...campusData,
          head: {
            ...c.head,
            ...(campusData.head || {}),
          },
          operatingInfo: {
            ...c.operatingInfo,
            ...(campusData.operatingInfo || {}),
          },
        };
      }
      return c;
    });

    const updated = campusesList.find((c) => c.id === id);
    return updated ? { ...updated } : null;
  },

  /**
   * Update status (Active / Inactive)
   * @param {string} id
   * @param {string} newStatus - 'Active' | 'Inactive'
   * @returns {Promise<Object>}
   */
  updateCampusStatus: async (id, newStatus) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    campusesList = campusesList.map((c) => (c.id === id ? { ...c, status: newStatus } : c));
    const updated = campusesList.find((c) => c.id === id);
    return updated ? { ...updated } : null;
  },
};
