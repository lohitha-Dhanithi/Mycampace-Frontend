// src/modules/students/services/studentImportService.js
import { studentService } from './studentService'

const delay = (ms = 150) => new Promise((resolve) => setTimeout(resolve, ms))

export const studentImportService = {
  validateStudentImport: async (parsedRows = []) => {
    await delay(300)
    const existing = await studentService.getStudents()
    const existingStudentIds = new Set(existing.map((s) => s.studentId?.toLowerCase()))
    const existingAdmissions = new Set(existing.map((s) => s.admissionNumber?.toLowerCase()))

    const validRows = []
    const invalidRows = []

    parsedRows.forEach((row, index) => {
      const rowNumber = index + 2 // considering row 1 as header
      const errors = []

      // Mandatory fields validation
      if (!row.firstName || !row.lastName) {
        errors.push('Missing Student First or Last Name')
      }

      if (!row.academicYear) {
        errors.push('Invalid or Missing Academic Year')
      }

      if (!row.program) {
        errors.push('Invalid or Missing Program / Stream')
      }

      if (!row.class) {
        errors.push('Invalid or Missing Class')
      }

      if (!row.section) {
        errors.push('Invalid Section assignment')
      }

      if (row.studentId && existingStudentIds.has(row.studentId.trim().toLowerCase())) {
        errors.push(`Duplicate Student ID '${row.studentId}' already registered`)
      }

      if (row.admissionNumber && existingAdmissions.has(row.admissionNumber.trim().toLowerCase())) {
        errors.push(`Duplicate Admission Number '${row.admissionNumber}' already exists`)
      }

      if (row.primaryMobile && !/^\+?[0-9\s-]{10,15}$/.test(row.primaryMobile.trim())) {
        errors.push('Invalid Primary Mobile contact format')
      }

      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email.trim())) {
        errors.push('Malformed Email Address')
      }

      if (errors.length > 0) {
        invalidRows.push({ rowNumber, data: row, errors })
      } else {
        validRows.push({ rowNumber, data: row })
      }
    })

    return {
      totalRows: parsedRows.length,
      validCount: validRows.length,
      invalidCount: invalidRows.length,
      validRows,
      invalidRows,
      isValid: invalidRows.length === 0,
    }
  },

  importStudents: async (validRows = []) => {
    await delay(400)
    const importedResults = []

    for (const item of validRows) {
      const r = item.data
      const studentPayload = {
        personal: {
          firstName: r.firstName,
          middleName: r.middleName || '',
          lastName: r.lastName,
          dob: r.dob || '2009-01-01',
          gender: r.gender || 'Other',
          bloodGroup: r.bloodGroup || 'O Positive',
          nationality: r.nationality || 'Indian',
        },
        contact: {
          primaryMobile: r.primaryMobile || '',
          email: r.email || '',
        },
        address: {
          addressLine1: r.addressLine1 || '',
          city: r.city || 'Hyderabad',
          state: r.state || 'Telangana',
          country: 'India',
          postalCode: r.postalCode || '500001',
        },
        academicYearName: r.academicYear || '2026-2027',
        academicYearId: 'ay-2026-27',
        campusName: r.campus || 'Hyderabad Main Campus',
        campusId: 'camp-1',
        programName: r.program || 'Senior Secondary Education',
        programId: 'prog-1',
        className: r.class || 'Class 11',
        classId: 'cls-11',
        sectionName: r.section || 'Section A',
        sectionId: 'sec-11A',
        rollNumber: r.rollNumber || '',
        admissionNumber: r.admissionNumber || '',
        studentId: r.studentId || '',
        parentGuardian: {
          name: r.guardianName || 'Guardian',
          relationship: r.guardianRelationship || 'Parent',
          mobile: r.guardianMobile || r.primaryMobile || '',
          email: r.guardianEmail || '',
        },
      }

      try {
        const created = await studentService.createStudent(studentPayload)
        importedResults.push(created)
      } catch (err) {
        console.error('Failed to import row', r, err)
      }
    }

    return {
      importedCount: importedResults.length,
      students: importedResults,
    }
  },
}
