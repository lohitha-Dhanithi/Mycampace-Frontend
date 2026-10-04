// src/modules/masterData/services/masterDataService.js
import { INITIAL_MASTER_DATA } from '../data/masterDataMockData'
import { MASTER_DATA_GROUPS, getCategoryConfig } from '../data/masterDataConfig'

let store = JSON.parse(JSON.stringify(INITIAL_MASTER_DATA))
const delay = (ms = 180) => new Promise((resolve) => setTimeout(resolve, ms))

export const masterDataService = {
  getGroups: async () => {
    await delay(50)
    return MASTER_DATA_GROUPS
  },

  getCategoriesWithStats: async () => {
    await delay(100)
    return MASTER_DATA_GROUPS.map((group) => ({
      ...group,
      categories: group.categories.map((cat) => ({
        ...cat,
        count: store[cat.key]?.length || 0,
        activeCount: store[cat.key]?.filter((item) => item.status === 'Active').length || 0,
      })),
    }))
  },

  getCategoryData: async (categoryKey) => {
    await delay()
    return store[categoryKey] ? [...store[categoryKey]] : []
  },

  createRecord: async (categoryKey, data) => {
    await delay(250)
    if (!store[categoryKey]) {
      store[categoryKey] = []
    }

    const newRecord = {
      id: `${categoryKey.slice(0, 3)}-${Date.now()}`,
      status: 'Active',
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      ...data,
    }

    store[categoryKey] = [newRecord, ...store[categoryKey]]
    return newRecord
  },

  updateRecord: async (categoryKey, id, data) => {
    await delay(250)
    if (!store[categoryKey]) throw new Error('Category not found')

    store[categoryKey] = store[categoryKey].map((item) =>
      item.id === id
        ? { ...item, ...data, updatedAt: new Date().toISOString().split('T')[0] }
        : item
    )
    return store[categoryKey].find((item) => item.id === id)
  },

  deleteRecord: async (categoryKey, id) => {
    await delay(250)
    if (!store[categoryKey]) throw new Error('Category not found')

    const item = store[categoryKey].find((i) => i.id === id)
    if (!item) throw new Error('Record not found')

    if (item.usageCount > 0) {
      throw new Error('This value is currently in use and cannot be deleted.')
    }

    store[categoryKey] = store[categoryKey].filter((i) => i.id !== id)
    return { success: true, id }
  },

  toggleRecordStatus: async (categoryKey, id) => {
    await delay(200)
    if (!store[categoryKey]) throw new Error('Category not found')

    store[categoryKey] = store[categoryKey].map((item) =>
      item.id === id
        ? {
            ...item,
            status: item.status === 'Active' ? 'Inactive' : 'Active',
            updatedAt: new Date().toISOString().split('T')[0],
          }
        : item
    )
    return store[categoryKey].find((item) => item.id === id)
  },
}
