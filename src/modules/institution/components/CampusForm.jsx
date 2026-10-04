// src/modules/institution/components/CampusForm.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Building, MapPin, Phone, User, Clock, Save, ArrowLeft } from 'lucide-react'

export function CampusForm({ initialData = null, onSubmit, isEditing = false, isSubmitting = false }) {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    code: '',
    type: 'Main Campus',
    status: 'Active',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
    email: '',
    phone: '',
    alternatePhone: '',
    website: '',
    head: {
      name: '',
      email: '',
      phone: '',
    },
    operatingInfo: {
      openingTime: '08:00 AM',
      closingTime: '04:30 PM',
      workingDays: 'Monday to Friday',
    },
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        head: {
          name: initialData.head?.name || '',
          email: initialData.head?.email || '',
          phone: initialData.head?.phone || '',
        },
        operatingInfo: {
          openingTime: initialData.operatingInfo?.openingTime || '08:00 AM',
          closingTime: initialData.operatingInfo?.closingTime || '04:30 PM',
          workingDays: initialData.operatingInfo?.workingDays || 'Monday to Friday',
        },
      })
    }
  }, [initialData])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Campus Name is required'
    if (!form.code.trim()) errs.code = 'Campus Code is required'
    if (!form.addressLine1.trim()) errs.addressLine1 = 'Address Line 1 is required'
    if (!form.city.trim()) errs.city = 'City is required'
    if (!form.state.trim()) errs.state = 'State is required'
    if (!form.pincode.trim()) errs.pincode = 'Pincode is required'
    if (!form.email.trim()) errs.email = 'Campus Email is required'
    if (!form.phone.trim()) errs.phone = 'Phone number is required'
    if (!form.head?.name?.trim()) errs.headName = 'Campus Head Name is required'
    if (!form.head?.email?.trim()) errs.headEmail = 'Campus Head Email is required'
    if (!form.head?.phone?.trim()) errs.headPhone = 'Campus Head Phone is required'

    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmit && onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Campus Details */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-semibold text-slate-900">Campus Details</CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Designate the campus identity, official branch code, and operational status
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">
                Campus Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Hyderabad Main Campus"
                className={`h-9 text-xs ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Campus Code <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="e.g. HYD-MAIN"
                className={`h-9 text-xs font-mono uppercase ${errors.code ? 'border-red-500' : ''}`}
              />
              {errors.code && <p className="text-[11px] text-red-600 mt-1">{errors.code}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Campus Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="h-9 text-xs"
              >
                <option value="Main Campus">Main Campus</option>
                <option value="Branch Campus">Branch Campus</option>
                <option value="School">School</option>
                <option value="College">College</option>
                <option value="University">University</option>
                <option value="Training Center">Training Center</option>
                <option value="Other">Other</option>
              </Select>
            </div>
          </div>

          <div className="w-48 text-xs">
            <label className="font-semibold text-slate-700 block mb-1">Operational Status</label>
            <Select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="h-9 text-xs"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 2. Address */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-semibold text-slate-900">Physical Address</CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Physical street address, geographical municipal jurisdiction and pin code
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.addressLine1}
                onChange={(e) => setForm({ ...form, addressLine1: e.target.value })}
                placeholder="Plot / Survey number, Street name"
                className={`h-9 text-xs ${errors.addressLine1 ? 'border-red-500' : ''}`}
              />
              {errors.addressLine1 && <p className="text-[11px] text-red-600 mt-1">{errors.addressLine1}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Address Line 2</label>
              <Input
                value={form.addressLine2}
                onChange={(e) => setForm({ ...form, addressLine2: e.target.value })}
                placeholder="Landmark, Area, Sector"
                className="h-9 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="e.g. Hyderabad"
                className={`h-9 text-xs ${errors.city ? 'border-red-500' : ''}`}
              />
              {errors.city && <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                State / Province <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="e.g. Telangana"
                className={`h-9 text-xs ${errors.state ? 'border-red-500' : ''}`}
              />
              {errors.state && <p className="text-[11px] text-red-600 mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                placeholder="e.g. India"
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Postal / Pincode <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.pincode}
                onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                placeholder="e.g. 500032"
                className={`h-9 text-xs font-mono ${errors.pincode ? 'border-red-500' : ''}`}
              />
              {errors.pincode && <p className="text-[11px] text-red-600 mt-1">{errors.pincode}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 3. Contact Details */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-semibold text-slate-900">Campus Contact Details</CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Direct telephone endpoints, electronic mail and campus web domain
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Official Campus Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="campus@abcschool.edu.in"
                className={`h-9 text-xs ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+91 40 2345 6789"
                className={`h-9 text-xs font-mono ${errors.phone ? 'border-red-500' : ''}`}
              />
              {errors.phone && <p className="text-[11px] text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Alternate Phone</label>
              <Input
                type="tel"
                value={form.alternatePhone}
                onChange={(e) => setForm({ ...form, alternatePhone: e.target.value })}
                placeholder="+91 40 2345 6780"
                className="h-9 text-xs font-mono"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Website URL</label>
              <Input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://hyd.abcschool.edu.in"
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Campus Head */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-semibold text-slate-900">Campus Head / Principal</CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Administrative and academic leader presiding over this campus
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Head / Principal Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={form.head?.name}
                onChange={(e) =>
                  setForm({ ...form, head: { ...form.head, name: e.target.value } })
                }
                placeholder="Dr. / Col. Name"
                className={`h-9 text-xs ${errors.headName ? 'border-red-500' : ''}`}
              />
              {errors.headName && <p className="text-[11px] text-red-600 mt-1">{errors.headName}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Official Email <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={form.head?.email}
                onChange={(e) =>
                  setForm({ ...form, head: { ...form.head, email: e.target.value } })
                }
                placeholder="head@abcschool.edu.in"
                className={`h-9 text-xs ${errors.headEmail ? 'border-red-500' : ''}`}
              />
              {errors.headEmail && <p className="text-[11px] text-red-600 mt-1">{errors.headEmail}</p>}
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Direct Contact Phone <span className="text-red-500">*</span>
              </label>
              <Input
                type="tel"
                value={form.head?.phone}
                onChange={(e) =>
                  setForm({ ...form, head: { ...form.head, phone: e.target.value } })
                }
                placeholder="+91 98000 00000"
                className={`h-9 text-xs font-mono ${errors.headPhone ? 'border-red-500' : ''}`}
              />
              {errors.headPhone && <p className="text-[11px] text-red-600 mt-1">{errors.headPhone}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 5. Operating Information */}
      <Card className="border-slate-200">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-600" />
            <CardTitle className="text-sm font-semibold text-slate-900">Operating Schedule & Hours</CardTitle>
          </div>
          <CardDescription className="text-xs text-slate-500">
            Bell timings, administrative hours and institutional working days
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Opening Time</label>
              <Input
                value={form.operatingInfo?.openingTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    operatingInfo: { ...form.operatingInfo, openingTime: e.target.value },
                  })
                }
                placeholder="e.g. 08:00 AM"
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Closing Time</label>
              <Input
                value={form.operatingInfo?.closingTime}
                onChange={(e) =>
                  setForm({
                    ...form,
                    operatingInfo: { ...form.operatingInfo, closingTime: e.target.value },
                  })
                }
                placeholder="e.g. 04:30 PM"
                className="h-9 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Working Days</label>
              <Input
                value={form.operatingInfo?.workingDays}
                onChange={(e) =>
                  setForm({
                    ...form,
                    operatingInfo: { ...form.operatingInfo, workingDays: e.target.value },
                  })
                }
                placeholder="e.g. Monday to Friday"
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="text-xs h-9 px-4"
          onClick={() => navigate('/institution/campuses')}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="text-xs h-9 px-5 bg-blue-600 hover:bg-blue-700 text-white font-semibold"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Campus'}
          <Save className="h-3.5 w-3.5 ml-1.5" />
        </Button>
      </div>
    </form>
  )
}
