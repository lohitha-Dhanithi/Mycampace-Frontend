// src/platform/shell/PlatformHubShell.jsx
import React, { useState, useRef, useEffect } from 'react'
import { Outlet, NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import {
  Search,
  Bell,
  ChevronDown,
  Building2,
  Users2,
  CreditCard,
  Settings,
  LogOut,
  Layers,
} from 'lucide-react'
import { ProductLauncherMenu } from '@/components/layout/ProductLauncherMenu'
import { GlobalSearchModal } from '@/components/layout/GlobalSearchModal'
import { notificationService } from '@/services/notificationService'
import { useAuth } from '@/store/AuthContext'

export function PlatformHubShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [headerSearch, setHeaderSearch] = useState('')
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState(notificationService.getNotifications())

  const notifRef = useRef(null)
  const userMenuRef = useRef(null)

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

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && headerSearch.trim()) {
      setShowSearchModal(true)
    }
  }

  const navLinks = [
    { label: 'Products', path: '/app', isExact: true },
    { label: 'Organization', path: '/app/organization' },
    { label: 'Users', path: '/app/users' },
    { label: 'Billing', path: '/app/billing' },
  ]

  const isCurrentActive = (link) => {
    if (link.isExact) {
      return location.pathname === '/app' || location.pathname === '/app/products'
    }
    return location.pathname.startsWith(link.path)
  }

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans text-slate-800">
      {/* Top Header matching exact screenshot */}
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-8">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <Link to="/app" className="flex items-center gap-2.5 group">
            <img
              src="/mycampace-logo.png"
              alt="MyCampace"
              className="h-9 w-9 object-contain drop-shadow-2xs group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-slate-900 uppercase leading-tight">
                MYCAMPACE
              </span>
              <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">
                PLATFORM HUB
              </span>
            </div>
          </Link>
          <div className="hidden sm:block">
            <ProductLauncherMenu />
          </div>
        </div>

        {/* Center: Navigation Tabs with active blue underline */}
        <nav className="hidden md:flex items-center gap-8 h-full">
          {navLinks.map((item) => {
            const active = isCurrentActive(item)
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`h-full flex items-center text-xs font-semibold tracking-wide transition-all relative px-1 ${
                  active
                    ? 'text-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {active && (
                  <span className="absolute bottom-0 inset-x-0 h-0.5 bg-blue-600 rounded-t-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Right: Search, Notification Bell, User Avatar & Menu */}
        <div className="flex items-center gap-3">
          {/* Header Search Input */}
          <div className="relative hidden sm:block w-48 lg:w-60">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              onKeyDown={handleSearchSubmit}
              onClick={() => setShowSearchModal(true)}
              placeholder="Search products..."
              className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-500 transition-all"
            />
          </div>

          {/* Notification Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            >
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-1">
                  <span className="font-bold text-slate-900">Notifications</span>
                  <span
                    onClick={() => {
                      notificationService.markAllAsRead()
                      setNotifications(notificationService.getNotifications())
                    }}
                    className="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline"
                  >
                    Mark all read
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {notifications.slice(0, 4).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setShowNotifications(false)
                        if (n.link) navigate(n.link)
                      }}
                      className="py-2 px-1 hover:bg-slate-50 rounded-lg cursor-pointer"
                    >
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${n.badgeColor}`}>
                        {n.productName}
                      </span>
                      <p className="font-semibold text-slate-800 mt-1">{n.title}</p>
                      <p className="text-[11px] text-slate-500">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar with dropdown */}
          <div className="relative" ref={userMenuRef}>
            <button
              type="button"
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-50 transition-colors"
            >
              <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name.charAt(0) : 'V'}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-tight">
                <span className="text-xs font-bold text-slate-800">
                  {user?.name || 'Vikram Aditya'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {user?.role || 'Admin'}
                </span>
              </div>
              <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:block" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50 animate-in fade-in-0 zoom-in-95 text-xs">
                <Link
                  to="/app/organization"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span>Organization</span>
                </Link>
                <Link
                  to="/app/settings"
                  onClick={() => setShowUserMenu(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  <Settings className="h-4 w-4 text-slate-400" />
                  <span>Platform Settings</span>
                </Link>
                <div className="my-1 border-t border-slate-100" />
                <button
                  type="button"
                  onClick={() => {
                    setShowUserMenu(false)
                    logout()
                    navigate('/auth')
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-left font-medium"
                >
                  <LogOut className="h-4 w-4 text-red-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content View */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Search Modal */}
      <GlobalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
      />
    </div>
  )
}
