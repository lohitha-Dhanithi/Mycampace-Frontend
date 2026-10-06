// src/modules/students/components/StudentImport.jsx
import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import {
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Download,
  Check,
  X,
  FileText,
  Sparkles,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { studentImportService } from '../services/studentImportService'

export function StudentImport({ onImportComplete }: { onImportComplete?: () => void } = {}) {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1) // 1: Upload, 2: Map, 3: Validate, 4: Complete
  const [file, setFile] = useState(null)
  const [validating, setValidating] = useState(false)
  const [importing, setImporting] = useState(false)
  const [validationResult, setValidationResult] = useState(null)
  const [importedSummary, setImportedSummary] = useState(null)

  // Mock parsed sample data from a template
  const SAMPLE_ROWS = [
    {
      firstName: 'Kabir',
      middleName: 'Singh',
      lastName: 'Gill',
      dob: '2009-08-14',
      gender: 'Male',
      bloodGroup: 'O Positive',
      nationality: 'Indian',
      academicYear: '2026-2027',
      campus: 'Hyderabad Main Campus',
      program: 'Senior Secondary Education',
      class: 'Class 11',
      section: 'Section A (PCM)',
      rollNumber: '11-PCM-032',
      primaryMobile: '+91 98111 22334',
      email: 'kabir.gill@student.mycampace.edu.in',
      guardianName: 'Harpreet Gill',
      guardianRelationship: 'Father',
      guardianMobile: '+91 98111 22330',
      studentId: '', // deterministic will be assigned
      admissionNumber: 'ADM-2026-950',
    },
    {
      firstName: 'Ananya',
      middleName: '',
      lastName: 'Iyer',
      dob: '2009-02-19',
      gender: 'Female',
      bloodGroup: 'A Positive',
      nationality: 'Indian',
      academicYear: '2026-2027',
      campus: 'Hyderabad Main Campus',
      program: 'Senior Secondary Education',
      class: 'Class 11',
      section: 'Section B (PCB)',
      rollNumber: '11-PCB-018',
      primaryMobile: '+91 99222 33445',
      email: 'ananya.iyer@gmail.com',
      guardianName: 'Venkatesh Iyer',
      guardianRelationship: 'Father',
      guardianMobile: '+91 99222 33440',
      studentId: '',
      admissionNumber: 'ADM-2026-951',
    },
    {
      // Row with validation issues to demonstrate error handling
      firstName: '',
      middleName: '',
      lastName: 'Sharma',
      dob: '2009-11-05',
      gender: 'Male',
      academicYear: '', // missing
      campus: 'Hyderabad Main Campus',
      program: '', // missing
      class: 'Class 11',
      section: 'Section C',
      rollNumber: '11-PCM-014',
      primaryMobile: 'invalid-number',
      email: 'not-an-email',
      studentId: 'STU-001', // duplicate ID
      admissionNumber: 'ADM-2026-089', // duplicate admission
    },
  ]

  const handleFileUpload = (e) => {
    const selected = e.target.files?.[0]
    if (selected) {
      setFile(selected)
    }
  }

  const handleSimulateDefaultFile = () => {
    setFile({
      name: 'Batch_Student_Enrolment_2026_CBSE.xlsx',
      size: 48200,
    })
  }

  const handleRunValidation = async () => {
    setValidating(true)
    const result = await studentImportService.validateStudentImport(SAMPLE_ROWS)
    setValidationResult(result)
    setValidating(false)
    setCurrentStep(3)
  }

  const handleExecuteImport = async () => {
    if (!validationResult?.validRows) return
    setImporting(true)
    const result = await studentImportService.importStudents(validationResult.validRows)
    setImportedSummary(result)
    setImporting(false)
    setCurrentStep(4)
    if (onImportComplete) onImportComplete()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">
              <FileSpreadsheet className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-slate-900">Bulk Student Onboarding & Data Import</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Import hundreds of student records simultaneously via CSV or Excel sheets with automatic column mapping and validation.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/students')}>
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Students
          </Button>
        </div>
      </div>

      {/* Wizard Steps Indicator */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { step: 1, title: 'Upload File', desc: 'CSV or Excel' },
          { step: 2, title: 'Map Columns', desc: 'Field matching' },
          { step: 3, title: 'Validate Data', desc: 'Pre-flight check' },
          { step: 4, title: 'Import & Enroll', desc: 'Directory creation' },
        ].map((s) => {
          const isActive = currentStep === s.step
          const isDone = currentStep > s.step
          return (
            <div
              key={s.step}
              className={`p-3 rounded-lg border text-center transition-all ${
                isActive
                  ? 'bg-blue-50/50 border-blue-500 text-blue-900 shadow-xs'
                  : isDone
                  ? 'bg-emerald-50/40 border-emerald-300 text-emerald-900'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : isDone
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  {isDone ? <Check className="w-3 h-3" /> : s.step}
                </span>
                <span className="text-xs font-bold">{s.title}</span>
              </div>
              <p className="text-[10px] hidden sm:block opacity-75">{s.desc}</p>
            </div>
          )
        })}
      </div>

      {/* Step 1: Upload File */}
      {currentStep === 1 && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-blue-600" /> Step 1: Select Student Data Sheet
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors bg-slate-50/50">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Drag and drop your spreadsheet here</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Supports .xlsx, .xls and .csv formats containing personal, academic and contact columns.
              </p>

              <div className="mt-4 flex items-center justify-center gap-3">
                <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-slate-300 shadow-xs text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50">
                  <Upload className="w-4 h-4 mr-2 text-slate-500" />
                  Browse Local Files
                  <input
                    type="file"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </label>

                <Button variant="ghost" size="sm" onClick={handleSimulateDefaultFile} className="text-xs text-blue-600">
                  Use Standard Sample Template
                </Button>
              </div>

              {file && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-xs font-medium">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  <span>{file.name}</span>
                  <span className="text-[10px] text-blue-500">
                    ({Math.round((file.size || 35000) / 1024)} KB)
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Download className="w-4 h-4 text-slate-400" />
                <a href="#template" onClick={(e) => { e.preventDefault(); handleSimulateDefaultFile(); }} className="text-blue-600 hover:underline">
                  Download Standard CSV Header Template
                </a>
              </div>

              <Button
                disabled={!file}
                onClick={() => setCurrentStep(2)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                Proceed to Column Mapping <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Column Mapping */}
      {currentStep === 2 && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" /> Step 2: Verify & Map Data Fields
            </CardTitle>
            <span className="text-xs text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              14 / 14 Fields Automatically Mapped
            </span>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            <p className="text-xs text-slate-500">
              Review how column headers in your file map into MyCampace SIS student attributes:
            </p>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
              {[
                { field: 'First Name', fileCol: 'first_name', required: true },
                { field: 'Last Name', fileCol: 'last_name', required: true },
                { field: 'Date of Birth', fileCol: 'dob', required: true },
                { field: 'Academic Year', fileCol: 'academic_year', required: true },
                { field: 'Program / Stream', fileCol: 'program_name', required: true },
                { field: 'Class Allocation', fileCol: 'class_name', required: true },
                { field: 'Section Allocation', fileCol: 'section_name', required: true },
                { field: 'Primary Mobile', fileCol: 'primary_mobile', required: true },
                { field: 'Student Email', fileCol: 'email', required: false },
                { field: 'Guardian Name', fileCol: 'guardian_name', required: true },
                { field: 'Guardian Mobile', fileCol: 'guardian_mobile', required: true },
              ].map((map, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between bg-white hover:bg-slate-50/50">
                  <div className="w-1/3">
                    <span className="font-semibold text-slate-800">{map.field}</span>
                    {map.required && <span className="text-red-500 ml-1">*</span>}
                  </div>
                  <div className="w-1/3 text-center text-slate-400">
                    <ArrowRight className="w-4 h-4 inline" />
                  </div>
                  <div className="w-1/3">
                    <span className="font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-700 text-[11px] border border-slate-200">
                      {map.fileCol}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(1)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back
              </Button>
              <Button
                onClick={handleRunValidation}
                disabled={validating}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
              >
                {validating ? 'Running Pre-flight...' : 'Validate File Data'} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Validate Data & Review Errors */}
      {currentStep === 3 && validationResult && (
        <Card className="border-slate-200 shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> Step 3: Data Integrity Audit Results
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
                {validationResult.validCount} Valid Records
              </span>
              {validationResult.invalidCount > 0 && (
                <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2 py-0.5 rounded font-semibold">
                  {validationResult.invalidCount} Error Rows Flagged
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-5 space-y-5">
            {/* Summary Banner */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
              <div>
                <p className="font-semibold text-slate-900">
                  Ready to enroll {validationResult.validCount} verified student records.
                </p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Valid records will be imported into SIS. Flagged error rows can be corrected and re-submitted separately.
                </p>
              </div>
            </div>

            {/* Error Rows Table if any */}
            {validationResult.invalidCount > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-red-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" /> Validation Exceptions Found (Will Be Skipped)
                </span>
                <div className="border border-red-200 bg-red-50/20 rounded-xl overflow-hidden divide-y divide-red-100 text-xs">
                  {validationResult.invalidRows.map((inv, idx) => (
                    <div key={idx} className="p-3 space-y-1">
                      <div className="flex items-center justify-between font-semibold text-red-800">
                        <span>Row #{inv.rowNumber}: {inv.data.lastName || 'Student Record'}</span>
                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded">
                          {inv.errors.length} Exception{inv.errors.length === 1 ? '' : 's'}
                        </span>
                      </div>
                      <ul className="list-disc list-inside text-[11px] text-red-700 space-y-0.5">
                        {inv.errors.map((err, eIdx) => (
                          <li key={eIdx}>{err}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Valid Rows Preview */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Preview Clean Import Rows
              </span>
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                {validationResult.validRows.map((v, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between bg-white">
                    <div>
                      <div className="font-bold text-slate-900">
                        {v.data.firstName} {v.data.lastName}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {v.data.class} • {v.data.section} • {v.data.primaryMobile}
                      </div>
                    </div>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-semibold border border-emerald-200">
                      Ready to Ingest
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button variant="outline" size="sm" onClick={() => setCurrentStep(2)}>
                <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Mapping
              </Button>
              <Button
                disabled={validationResult.validCount === 0 || importing}
                onClick={handleExecuteImport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                {importing ? 'Processing Ingestion...' : `Import ${validationResult.validCount} Valid Students`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Complete */}
      {currentStep === 4 && importedSummary && (
        <Card className="border-slate-200 shadow-xs">
          <CardContent className="py-12 text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Bulk Ingestion Successfully Executed!</h2>
              <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                Created <strong>{importedSummary.importedCount} student records</strong> with unique Student IDs, active enrollment profiles, and parent contact links.
              </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-3">
              <Button onClick={() => navigate('/students')} className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
                View Central Student Directory
              </Button>
              <Button variant="outline" size="sm" onClick={() => { setCurrentStep(1); setFile(null); }}>
                Import Another Batch
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
