// src/modules/institution/services/institutionService.js
import { INITIAL_INSTITUTION } from '../data/institutionMockData';

// Maintain in-memory state for mock lifecycle
let currentInstitution = { ...INITIAL_INSTITUTION };

export const institutionService = {
  /**
   * Fetch current institution profile
   * @returns {Promise<Object>}
   */
  getInstitution: async () => {
    // Simulates realistic network delay
    await new Promise((resolve) => setTimeout(resolve, 200));
    return { ...currentInstitution };
  },

  /**
   * Update institution details
   * @param {Object} updatedData
   * @returns {Promise<Object>}
   */
  updateInstitution: async (updatedData) => {
    await new Promise((resolve) => setTimeout(resolve, 350));
    currentInstitution = {
      ...currentInstitution,
      ...updatedData,
      primaryContact: {
        ...currentInstitution.primaryContact,
        ...(updatedData.primaryContact || {}),
      },
      branding: {
        ...currentInstitution.branding,
        ...(updatedData.branding || {}),
      },
    };
    return { ...currentInstitution };
  },
};
