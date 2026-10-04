// src/modules/finance/services/feeStructureService.js
import { INITIAL_FEE_STRUCTURES } from '../data/financeMockData'

let feeStructures = [...INITIAL_FEE_STRUCTURES]

const delay = (ms = 120) => new Promise((resolve) => setTimeout(resolve, ms))

export const feeStructureService = {
  getFeeStructures: async (filters = {}) => {
    await delay(120)
    let list = [...feeStructures]

    if (filters.campusId && filters.campusId !== 'all') {
      list = list.filter(item => item.campusId === filters.campusId || item.campusId === 'all')
    }
    if (filters.academicYearId && filters.academicYearId !== 'all') {
      list = list.filter(item => item.academicYearId === filters.academicYearId)
    }
    if (filters.programId && filters.programId !== 'all') {
      list = list.filter(item => item.programId === filters.programId || item.programId === 'all')
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      list = list.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.courseName?.toLowerCase().includes(q) ||
        item.programName?.toLowerCase().includes(q)
      )
    }
    return list
  },

  getFeeStructureById: async (id) => {
    await delay(100)
    const found = feeStructures.find(fs => fs.id === id)
    if (!found) throw new Error(`Fee structure with ID ${id} not found`)
    return { ...found }
  },

  createFeeStructure: async (data) => {
    await delay(150)
    const newId = `fs-${Date.now()}`
    const components = data.components || []
    const totalAnnualAmount = components.reduce((sum, c) => sum + Number(c.amount || 0), 0)

    const newStructure = {
      id: newId,
      status: 'Active',
      currency: 'INR',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      totalAnnualAmount,
      ...data,
      components,
      installments: data.installments || [
        { id: `inst-${Date.now()}-1`, name: 'Installment 1', amount: totalAnnualAmount, dueDate: '2026-07-15', lateFeePerDay: 50, gracePeriodDays: 7, status: 'Active' },
      ],
    }

    feeStructures = [newStructure, ...feeStructures]
    return newStructure
  },

  updateFeeStructure: async (id, updates) => {
    await delay(150)
    const index = feeStructures.findIndex(fs => fs.id === id)
    if (index === -1) throw new Error(`Fee structure with ID ${id} not found`)

    let updatedComponents = updates.components || feeStructures[index].components
    const totalAnnualAmount = updatedComponents.reduce((sum, c) => sum + Number(c.amount || 0), 0)

    feeStructures[index] = {
      ...feeStructures[index],
      ...updates,
      components: updatedComponents,
      totalAnnualAmount,
      updatedAt: new Date().toISOString(),
    }
    return { ...feeStructures[index] }
  },

  deleteFeeStructure: async (id) => {
    await delay(120)
    feeStructures = feeStructures.filter(fs => fs.id !== id)
    return { success: true }
  },

  // Components sub-management
  getAllComponents: async () => {
    await delay(100)
    const all = []
    feeStructures.forEach(fs => {
      (fs.components || []).forEach(comp => {
        all.push({ ...comp, feeStructureId: fs.id, feeStructureName: fs.name, campusName: fs.campusName })
      })
    })
    return all
  },

  addComponent: async (feeStructureId, componentData) => {
    await delay(120)
    const fs = feeStructures.find(f => f.id === feeStructureId)
    if (!fs) throw new Error(`Fee structure not found`)

    const newComp = {
      id: `fc-${Date.now()}`,
      name: componentData.name,
      type: componentData.type || 'Other',
      amount: Number(componentData.amount || 0),
      frequency: componentData.frequency || 'Annual',
      mandatory: componentData.mandatory !== false,
      taxApplicable: Boolean(componentData.taxApplicable),
      dueDate: componentData.dueDate || '2026-07-15',
    }

    fs.components = [...(fs.components || []), newComp]
    fs.totalAnnualAmount = fs.components.reduce((sum, c) => sum + Number(c.amount || 0), 0)
    fs.updatedAt = new Date().toISOString()
    return newComp
  },
}
