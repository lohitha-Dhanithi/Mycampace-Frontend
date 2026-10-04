// src/modules/finance/services/financialProductService.js
import { dhanitiPayService } from './dhanitiPayService'

export const financialProductService = {
  getProducts: (filters) => dhanitiPayService.getFinancialProducts(filters),
  getProductById: (id) => dhanitiPayService.getFinancialProductById(id),
  checkEligibility: (data) => dhanitiPayService.checkEligibility(data),
}
