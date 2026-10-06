// src/components/layout/AppHeader.jsx
import React, { useState, useRef, useEffect } from 'react'
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  LogOut,
  User,
  Shield,
  Settings,
  ChevronDown,
  ExternalLink,
  BookOpen,
} from 'lucide-react'
import { Breadcrumb } from './Breadcrumb'
import { ContextSelector } from './ContextSelector'
import { Avatar } from '@/components/ui/avatar'
import { useAuth } from '@/store/AuthContext'
import { useNavigate } from 'react-router-dom'

export function AppHeader({ onToggleSidebar, isSidebarCollapsed }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showHelpModal, setShowHelpModal] = useState(false)

  const notifRef = useRef(null)
  const userMenuRef = useRef(null)

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleGlobalSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Redirect or filter based on query
      navigate(`/students?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-xs px-4 sm:px-6 shadow-2xs">
      {/* Left: Mobile hamburger & Context Selector & Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-none"
          title="Toggle Navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Tenant context selector */}
        <ContextSelector />

        {/* Breadcrumb (desktop) */}
        <div className="hidden lg:block border-l border-slate-200 pl-4 ml-1">
          <Breadcrumb />
        </div>
      </div>

      {/* Right: Search, Notifications, Help, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search students, staff, IDs... (Press ↵)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleGlobalSearch}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-slate-50 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Help icon */}
        <button
          type="button"
          onClick={() => setShowHelpModal(!showHelpModal)}
          className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
          title="Documentation & Help"
        >
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in-0 zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] text-blue-600 font-medium cursor-pointer hover:underline">
                  Mark all as read
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto py-1">
                <div className="py-2.5 px-1 hover:bg-slate-50 rounded transition-colors text-xs">
                  <p className="font-semibold text-slate-800">New Application Submitted</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Aditya Swaminathan submitted Class 11 PCM application.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">15m ago</span>
                </div>
                <div className="py-2.5 px-1 hover:bg-slate-50 rounded transition-colors text-xs">
                  <p className="font-semibold text-slate-800">Fee Payment Completed</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ₹45,000 received for Tanya Patel (ID: STU-8921).
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">1h ago</span>
                </div>
                <div className="py-2.5 px-1 hover:bg-slate-50 rounded transition-colors text-xs">
                  <p className="font-semibold text-slate-800">CBSE Inspection Compliance</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Annual institutional audit records updated for 2026.
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">3h ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Menu */}
        <div className="relative border-l border-slate-200 pl-3 ml-1" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 transition-colors"
          >
            <Avatar
              src={user?.avatar}
              alt={user?.name || 'Administrator'}
              fallback="VA"
              size="sm"
            />
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-xs font-semibold text-slate-900">{user?.name || 'Administrator'}</span>
              <span className="text-[10px] text-slate-500 mt-0.5">{user?.role || 'Super Admin'}</span>
            </div>
            <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 text-xs">
              <div className="p-2 border-b border-slate-100 mb-1">
                <p className="font-semibold text-slate-900 truncate">{user?.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium w-fit">
                  <Shield className="h-3 w-3" /> {user?.role}
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false)
                  navigate('/settings')
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <Settings className="h-4 w-4 text-slate-400" />
                <span>Account Settings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false)
                  navigate('/audit-logs')
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-slate-700 hover:bg-slate-100 transition-colors text-left"
              >
                <Shield className="h-4 w-4 text-slate-400" />
                <span>Security & Audit Logs</span>
              </button>

              <div className="my-1 border-t border-slate-100" />

              <button
                type="button"
                onClick={() => {
                  setShowUserMenu(false)
                  logout()
                  navigate('/login')
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded text-red-600 hover:bg-red-50 transition-colors text-left"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
