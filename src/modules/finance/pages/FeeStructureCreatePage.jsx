// src/modules/finance/pages/FeeStructureCreatePage.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { PageHeader } from '@/components/common/PageHeader'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { FinanceNavigation } from '../components/FinanceNavigation'
import { feeStructureService } from '../services/feeStructureService'
import {
  FEE_COMPONENT_TYPES,
  FEE_FREQUENCIES,
  STUDENT_CATEGORIES,
  formatCurrency,
} from '../config/financeConfig'
import { Plus, Trash2, ArrowLeft, Save, Layers, Calendar, Building } from 'lucide-react'

export function FeeStructureCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // Academic Context
  const [name, setName] = useState('')
  const [academicYearName, setAcademicYearName] = useState('2026–27')
  const [academicYearId, setAcademicYearId] = useState('ay-2026-2027')
  const [campusName, setCampusName] = useState('Main Campus')
  const [campusId, setCampusId] = useState('campus-main')
  const [programName, setProgramName] = useState('Bachelor of Technology')
  const [courseName, setCourseName] = useState('Computer Science & Engineering')
  const [className, setClassName] = useState('Year 1')
  const [studentCategory, setStudentCategory] = useState('General')
  const [description, setDescription] = useState('')

  // Components state
  const [components, setComponents] = useState([
    { id: 'fc-new-1', name: 'Tuition Fee', type: 'Tuition Fee', amount: 80000, frequency: 'Annual', mandatory: true, taxApplicable: false, dueDate: '2026-07-15' },
    { id: 'fc-new-2', name: 'Admission & Registration Fee', type: 'Admission Fee', amount: 15000, frequency: 'One Time', mandatory: true, taxApplicable: false, dueDate: '2026-06-30' },
    { id: 'fc-new-3', name: 'Lab & Computer Facility', type: 'Laboratory Fee', amount: 10000, frequency: 'Annual', mandatory: true, taxApplicable: false, dueDate: '2026-07-15' },
  ])

  // Installments state
  const [installments, setInstallments] = useState([
    { id: 'inst-new-1', name: 'Installment 1 (Term 1 & Admission)', amount: 55000, dueDate: '2026-06-30', lateFeePerDay: 50, gracePeriodDays: 7 },
    { id: 'inst-new-2', name: 'Installment 2 (Term 2)', amount: 50000, dueDate: '2026-11-15', lateFeePerDay: 50, gracePeriodDays: 7 },
  ])

  // Calculated totals
  const totalComponentsAmount = components.reduce((sum, c) => sum + Number(c.amount || 0), 0)
  const totalInstallmentsAmount = installments.reduce((sum, i) => sum + Number(i.amount || 0), 0)
  const isBalanced = totalComponentsAmount === totalInstallmentsAmount

  const handleAddComponent = () => {
    setComponents([
      ...components,
      {
        id: `fc-new-${Date.now()}`,
        name: 'Library & Technology Fee',
        type: 'Library Fee',
        amount: 5000,
        frequency: 'Annual',
        mandatory: true,
        taxApplicable: false,
        dueDate: '2026-07-15',
      },
    ])
  }

  const handleRemoveComponent = (id) => {
    if (components.length <= 1) return
    setComponents(components.filter(c => c.id !== id))
  }

  const handleUpdateComponent = (id, field, value) => {
    setComponents(components.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const handleAddInstallment = () => {
    setInstallments([
      ...installments,
      {
        id: `inst-new-${Date.now()}`,
        name: `Installment ${installments.length + 1}`,
        amount: 25000,
        dueDate: '2027-01-15',
        lateFeePerDay: 50,
        gracePeriodDays: 7,
      },
    ])
  }

  const handleRemoveInstallment = (id) => {
    if (installments.length <= 1) return
    setInstallments(installments.filter(i => i.id !== id))
  }

  const handleUpdateInstallment = (id, field, value) => {
    setInstallments(installments.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim()) {
      alert('Please enter a structure name')
      return
    }
    setLoading(true)
    try {
      await feeStructureService.createFeeStructure({
        name,
        academicYearName,
        academicYearId,
        campusName,
        campusId,
        programName,
        courseName,
        className,
        studentCategory,
        description,
        components,
        installments,
      })
      navigate('/finance/fee-structures')
    } catch (err) {
      alert(err.message || 'Failed to save fee structure')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-12">
      <FinanceNavigation />

      <PageHeader
        title="Create Academic Fee Structure"
        description="Configure structured tuition, lab, transport, and term installment schedules for your cohort."
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild className="text-xs">
              <Link to="/finance/fee-structures">
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Cancel
              </Link>
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 shadow-xs text-xs"
            >
              <Save className="h-3.5 w-3.5 mr-1.5" />
              {loading ? 'Saving Structure...' : 'Publish Fee Structure'}
            </Button>
          </div>
        }
      />

      {/* SECTION 1: ACADEMIC CONTEXT */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100">
          <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-600" />
            1. Institutional & Academic Context
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Fee Structure Title *</label>
              <Input
                placeholder="e.g. B.Tech Computer Science Year 1 (2026-27)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="text-xs font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Academic Year *</label>
              <Select value={academicYearName} onValueChange={setAcademicYearName}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2026–27" className="text-xs">Academic Year 2026–27</SelectItem>
                  <SelectItem value="2025–26" className="text-xs">Academic Year 2025–26</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Campus *</label>
              <Select value={campusName} onValueChange={setCampusName}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Main Campus" className="text-xs">Main Campus</SelectItem>
                  <SelectItem value="South City Campus" className="text-xs">South City Campus</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Program *</label>
              <Select value={programName} onValueChange={setProgramName}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Bachelor of Technology" className="text-xs">Bachelor of Technology (B.Tech)</SelectItem>
                  <SelectItem value="Master of Business Administration" className="text-xs">MBA (Postgraduate)</SelectItem>
                  <SelectItem value="Bachelor of Computer Applications" className="text-xs">BCA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Class / Semester *</label>
              <Select value={className} onValueChange={setClassName}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Year 1" className="text-xs">Year 1 (Semesters 1 & 2)</SelectItem>
                  <SelectItem value="Year 2" className="text-xs">Year 2 (Semesters 3 & 4)</SelectItem>
                  <SelectItem value="Year 3" className="text-xs">Year 3 (Semesters 5 & 6)</SelectItem>
                  <SelectItem value="Year 4" className="text-xs">Year 4 (Semesters 7 & 8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Target Student Category</label>
              <Select value={studentCategory} onValueChange={setStudentCategory}>
                <SelectTrigger className="text-xs h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STUDENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Description / Billing Notes</label>
              <Input
                placeholder="Institutional notes or admission criteria..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 2: FEE COMPONENTS */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-600" />
            2. Fee Components ({formatCurrency(totalComponentsAmount)})
          </CardTitle>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddComponent}
            className="text-xs h-7"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Component
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Component Name</th>
                  <th className="py-2 px-3">Type</th>
                  <th className="py-2 px-3">Frequency</th>
                  <th className="py-2 px-3">Amount (₹)</th>
                  <th className="py-2 px-3">Due Date</th>
                  <th className="py-2 px-3 text-center">Mandatory</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {components.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2 px-3">
                      <Input
                        value={c.name}
                        onChange={(e) => handleUpdateComponent(c.id, 'name', e.target.value)}
                        className="text-xs h-8 font-medium"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <Select value={c.type} onValueChange={(v) => handleUpdateComponent(c.id, 'type', v)}>
                        <SelectTrigger className="text-xs h-8 w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FEE_COMPONENT_TYPES.map((t) => (
                            <SelectItem key={t} value={t} className="text-xs">{t}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 px-3">
                      <Select value={c.frequency} onValueChange={(v) => handleUpdateComponent(c.id, 'frequency', v)}>
                        <SelectTrigger className="text-xs h-8 w-28">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FEE_FREQUENCIES.map((f) => (
                            <SelectItem key={f} value={f} className="text-xs">{f}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-2 px-3">
                      <Input
                        type="number"
                        min="0"
                        value={c.amount}
                        onChange={(e) => handleUpdateComponent(c.id, 'amount', e.target.value)}
                        className="text-xs h-8 w-28 font-bold text-slate-800"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <Input
                        type="date"
                        value={c.dueDate}
                        onChange={(e) => handleUpdateComponent(c.id, 'dueDate', e.target.value)}
                        className="text-xs h-8 w-32"
                      />
                    </td>
                    <td className="py-2 px-3 text-center">
                      <Switch
                        checked={c.mandatory}
                        onCheckedChange={(checked) => handleUpdateComponent(c.id, 'mandatory', checked)}
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveComponent(c.id)}
                        disabled={components.length <= 1}
                        className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* SECTION 3: INSTALLMENT SCHEDULE */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="py-3 px-4 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              3. Installment Schedules ({formatCurrency(totalInstallmentsAmount)})
            </CardTitle>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Split the annual fees into manageable student payment tranches
            </p>
          </div>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={handleAddInstallment}
            className="text-xs h-7"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Installment
          </Button>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2 px-3">Installment Name</th>
                  <th className="py-2 px-3">Tranche Amount (₹)</th>
                  <th className="py-2 px-3">Due Date</th>
                  <th className="py-2 px-3">Late Fine / Day (₹)</th>
                  <th className="py-2 px-3">Grace Period (Days)</th>
                  <th className="py-2 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {installments.map((inst) => (
                  <tr key={inst.id}>
                    <td className="py-2 px-3">
                      <Input
                        value={inst.name}
                        onChange={(e) => handleUpdateInstallment(inst.id, 'name', e.target.value)}
                        className="text-xs h-8 font-medium"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <Input
                        type="number"
                        min="0"
                        value={inst.amount}
                        onChange={(e) => handleUpdateInstallment(inst.id, 'amount', e.target.value)}
                        className="text-xs h-8 w-32 font-bold text-blue-800"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <Input
                        type="date"
                        value={inst.dueDate}
                        onChange={(e) => handleUpdateInstallment(inst.id, 'dueDate', e.target.value)}
                        className="text-xs h-8 w-32"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <Input
                        type="number"
                        value={inst.lateFeePerDay}
                        onChange={(e) => handleUpdateInstallment(inst.id, 'lateFeePerDay', e.target.value)}
                        className="text-xs h-8 w-20 text-rose-700 font-medium"
                      />
                    </td>
                    <td className="py-2 px-3">
                      <Input
                        type="number"
                        value={inst.gracePeriodDays}
                        onChange={(e) => handleUpdateInstallment(inst.id, 'gracePeriodDays', e.target.value)}
                        className="text-xs h-8 w-20"
                      />
                    </td>
                    <td className="py-2 px-3 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveInstallment(inst.id)}
                        disabled={installments.length <= 1}
                        className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Validation Notice */}
          <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
            isBalanced ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}>
            <span>
              {isBalanced
                ? `Total components (${formatCurrency(totalComponentsAmount)}) perfectly matches scheduled installments.`
                : `Balance Alert: Components sum to ${formatCurrency(totalComponentsAmount)}, while installments sum to ${formatCurrency(totalInstallmentsAmount)} (Difference: ${formatCurrency(Math.abs(totalComponentsAmount - totalInstallmentsAmount))}).`}
            </span>
            <span className="font-bold text-xs">
              Net Annual: {formatCurrency(totalComponentsAmount)}
            </span>
          </div>
        </CardContent>

        <CardFooter className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
          <Button variant="outline" size="sm" asChild className="text-xs">
            <Link to="/finance/fee-structures">Cancel</Link>
          </Button>
          <Button type="submit" size="sm" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-xs">
            Save Fee Structure
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
