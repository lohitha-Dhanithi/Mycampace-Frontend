// src/services/notificationService.js

export const MOCK_NOTIFICATIONS = [
  {
    id: 'notif-1',
    productId: 'finance',
    productName: 'Finance',
    productBadge: 'Finance',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    title: 'Fee Payment Received',
    message: '₹45,000 received for Tanya Patel (ID: STU-8921) via Razorpay.',
    time: '12m ago',
    unread: true,
    link: '/app/finance/payments',
  },
  {
    id: 'notif-2',
    productId: 'lms',
    productName: 'LMS',
    productBadge: 'LMS',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    title: 'Assignment Submitted',
    message: '28 submissions received for "Differential Calculus Problem Set 3".',
    time: '45m ago',
    unread: true,
    link: '/app/lms/assignments',
  },
  {
    id: 'notif-3',
    productId: 'admissions',
    productName: 'Admissions',
    productBadge: 'Admissions',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    title: 'New Application Received',
    message: 'Aditya Swaminathan completed Class 11 PCM application with documents.',
    time: '2h ago',
    unread: true,
    link: '/app/admissions/applications',
  },
  {
    id: 'notif-4',
    productId: 'academics',
    productName: 'Academics',
    productBadge: 'Academics',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    title: 'Curriculum Revision Approved',
    message: 'Grade 10 Physics Syllabus 2026-27 finalized by Department Head.',
    time: '5h ago',
    unread: false,
    link: '/app/academics/subjects',
  },
  {
    id: 'notif-5',
    productId: 'platform',
    productName: 'Platform',
    productBadge: 'Platform',
    badgeColor: 'bg-slate-100 text-slate-800 border-slate-200',
    title: 'New Product Entitlement Activated',
    message: 'HRMS trial workspace provisioned successfully for Hyderabad Main Campus.',
    time: '1d ago',
    unread: false,
    link: '/app/products',
  },
]

class NotificationService {
  constructor() {
    this.storageKey = 'mycampace_notifications'
    this.init()
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify(MOCK_NOTIFICATIONS))
    }
  }

  getNotifications() {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : MOCK_NOTIFICATIONS
    } catch (e) {
      return MOCK_NOTIFICATIONS
    }
  }

  getUnreadCount() {
    return this.getNotifications().filter((n) => n.unread).length
  }

  markAllAsRead() {
    const list = this.getNotifications().map((n) => ({ ...n, unread: false }))
    localStorage.setItem(this.storageKey, JSON.stringify(list))
    return list
  }

  markAsRead(id) {
    const list = this.getNotifications().map((n) => (n.id === id ? { ...n, unread: false } : n))
    localStorage.setItem(this.storageKey, JSON.stringify(list))
    return list
  }
}

export const notificationService = new NotificationService()
