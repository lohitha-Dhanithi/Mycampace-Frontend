// src/platform/onboarding/TeamInvitePage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users2, Mail, Shield, Check, Plus, Trash2, ArrowRight } from 'lucide-react'
import { productService } from '@/services/productService'

export function TeamInvitePage() {
  const navigate = useNavigate()
  const activeProducts = productService.getOrganizationProducts()

  const [teamMembers, setTeamMembers] = useState([
    {
      id: 1,
      email: 'priya.sundar@apexeducation.org',
      role: 'Academic Coordinator',
      products: ['academics', 'lms'],
    },
    {
      id: 2,
      email: 'kavita.finance@apexeducation.org',
      role: 'Finance Officer',
      products: ['finance'],
    },
  ])

  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState('Teacher')
  const [newSelectedProducts, setNewSelectedProducts] = useState(['academics'])

  const handleAddMember = (e) => {
    e.preventDefault()
    if (!newEmail) return
    setTeamMembers([
      ...teamMembers,
      {
        id: Date.now(),
        email: newEmail,
        role: newRole,
        products: [...newSelectedProducts],
      },
    ])
    setNewEmail('')
    setNewSelectedProducts(['academics'])
  }

  const handleRemove = (id) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id))
  }

  const toggleNewProduct = (productId) => {
    if (newSelectedProducts.includes(productId)) {
      setNewSelectedProducts(newSelectedProducts.filter((p) => p !== productId))
    } else {
      setNewSelectedProducts([...newSelectedProducts, productId])
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 py-12 px-4 sm:px-6 flex flex-col justify-center items-center">
      <div className="w-full max-w-3xl">
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-blue-400 tracking-wider uppercase">
              Step 3 of 4: Invite Team
            </span>
            <span className="text-xs text-slate-400 font-medium">Next: Workspace Confirmation</span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full w-3/4 rounded-full transition-all duration-300" />
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Invite your team & assign product access
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              In MyCampace, users receive granular access to specific products rather than a blanket ERP login.
            </p>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleAddMember} className="bg-slate-850 p-4 rounded-xl border border-slate-800 mb-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Team Member Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    placeholder="colleague@institution.edu"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full h-10 pl-9 pr-3 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Institutional Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-700 bg-slate-800 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Teacher">Teacher / Faculty</option>
                  <option value="Academic Coordinator">Academic Coordinator</option>
                  <option value="Finance Officer">Finance Officer</option>
                  <option value="Admissions Counselor">Admissions Counselor</option>
                  <option value="Campus Administrator">Campus Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                Assign Product Access:
              </label>
              <div className="flex flex-wrap gap-2">
                {activeProducts.map((p) => {
                  const isChecked = newSelectedProducts.includes(p.id)
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => toggleNewProduct(p.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-all ${
                        isChecked
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                          : 'bg-slate-800 border-slate-750 text-slate-400'
                      }`}
                    >
                      <div
                        className={`h-3.5 w-3.5 rounded flex items-center justify-center border text-[9px] ${
                          isChecked ? 'bg-blue-600 border-blue-400 text-white' : 'border-slate-600'
                        }`}
                      >
                        {isChecked && '✓'}
                      </div>
                      <span>{p.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="h-9 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center gap-1.5 transition-all"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add to Invite List</span>
              </button>
            </div>
          </form>

          {/* Pending Invites List */}
          <div className="space-y-2 mb-8">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Invites ({teamMembers.length})
            </h3>
            {teamMembers.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-800 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{member.email}</span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px]">
                      {member.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[11px] text-slate-400">
                    <span>Products:</span>
                    {member.products.map((pId) => (
                      <span
                        key={pId}
                        className="bg-blue-950 text-blue-300 border border-blue-800/60 px-1.5 py-0.2 rounded text-[10px] uppercase font-semibold"
                      >
                        {pId}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(member.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-700/60 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Bottom Actions */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <button
              type="button"
              onClick={() => navigate('/onboarding/products/confirmation')}
              className="text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Skip this step for now
            </button>

            <button
              type="button"
              onClick={() => navigate('/onboarding/products/confirmation')}
              className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              <span>Send Invites & Continue</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
