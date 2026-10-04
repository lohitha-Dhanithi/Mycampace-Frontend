// src/modules/institution/data/institutionMockData.js
// Dedicated mock data repository for Institution and Campus Management

export const INITIAL_INSTITUTION = {
  id: 'inst-1',
  name: 'ABC International School',
  code: 'ABC-INTL',
  type: 'School', // Options: School, College, University, Training Center, Other
  registrationNumber: 'REG-2018-TS-89421',
  establishedYear: 2012,
  status: 'Active',
  currentAcademicYear: '2026–27',

  // Contact Information
  email: 'admissions@abcschool.edu.in',
  phone: '+91 40 2345 6789',
  alternatePhone: '+91 40 2345 6790',
  website: 'https://abcschool.edu.in',

  // Address
  addressLine1: 'Survey No. 44/2, Financial District',
  addressLine2: 'Near Nanakramguda Circle',
  city: 'Hyderabad',
  state: 'Telangana',
  country: 'India',
  pincode: '500032',

  // Primary Contact
  primaryContact: {
    name: 'Dr. Radhakrishnan Murthy',
    designation: 'Director / Principal',
    email: 'principal@abcschool.edu.in',
    phone: '+91 98480 12345',
  },

  // Branding
  branding: {
    logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=160&auto=format&fit=crop&q=80',
    favicon: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?w=32&auto=format&fit=crop&q=80',
    primaryColor: '#2563eb',
    secondaryColor: '#0f172a',
  },
};

export const INITIAL_CAMPUSES = [
  {
    id: 'camp-1',
    institutionId: 'inst-1',
    name: 'Hyderabad Main Campus',
    code: 'HYD-MAIN',
    type: 'Main Campus',
    status: 'Active',
    createdDate: '2012-06-15',

    // Address
    addressLine1: 'Survey No. 44/2, Financial District',
    addressLine2: 'Gachibowli Outer Ring Road',
    city: 'Hyderabad',
    state: 'Telangana',
    country: 'India',
    pincode: '500032',

    // Contact
    email: 'hyd.campus@abcschool.edu.in',
    phone: '+91 40 2345 6789',
    alternatePhone: '+91 40 2345 6780',
    website: 'https://hyd.abcschool.edu.in',

    // Campus Head
    head: {
      name: 'Dr. Meenakshi Sundaram',
      email: 'meenakshi.s@abcschool.edu.in',
      phone: '+91 98480 33445',
    },

    // Operating Info
    operatingInfo: {
      openingTime: '08:00 AM',
      closingTime: '04:30 PM',
      workingDays: 'Monday to Friday',
    },

    // Metrics for Campus Details
    academicStats: {
      currentAcademicYear: '2026–27',
      programsCount: 4,
      programsList: [
        'Senior Secondary (Grades 11-12)',
        'Secondary (Grades 6-10)',
        'Primary Foundation (Grades 1-5)',
        'Early Childhood Education',
      ],
      classesCount: 12,
      sectionsCount: 28,
      departmentsCount: 6,
      departmentsList: [
        'Science & Research',
        'Mathematics',
        'Humanities & Social Sciences',
        'Languages',
        'Physical Education & Sports',
        'Computer Science & AI',
      ],
    },

    userStats: {
      totalUsers: 2490,
      administrators: 14,
      teachers: 142,
      staff: 64,
      students: 2270,
    },

    recentActivity: [
      {
        id: 'act-c1-1',
        title: 'New Class Section Created',
        description: 'Class 11 Section A (PCM Advanced) allocated to Block C, Room 201.',
        timestamp: '1 hour ago',
        user: 'Dr. Meenakshi Sundaram',
        type: 'campus',
      },
      {
        id: 'act-c1-2',
        title: 'Biometric Attendance Synchronized',
        description: 'Biometric turnstile readers verified 2,210 morning check-ins.',
        timestamp: '4 hours ago',
        user: 'System Automated Daemon',
        type: 'success',
      },
      {
        id: 'act-c1-3',
        title: 'Campus Facility Maintenance Scheduled',
        description: 'Annual HVAC servicing for the STEM laboratory wing scheduled for Saturday.',
        timestamp: '1 day ago',
        user: 'Vikram Aditya (Admin)',
        type: 'warning',
      },
      {
        id: 'act-c1-4',
        title: 'Affiliation Compliance Audit Logged',
        description: 'CBSE safety compliance certificate renewed for 2026–2027.',
        timestamp: '3 days ago',
        user: 'Dr. Radhakrishnan Murthy',
        type: 'success',
      },
    ],
  },
  {
    id: 'camp-2',
    institutionId: 'inst-1',
    name: 'Bangalore Whitefield Campus',
    code: 'BLR-WF',
    type: 'Branch Campus',
    status: 'Active',
    createdDate: '2018-04-10',

    // Address
    addressLine1: 'Plot 12B, EPIP Zone, Whitefield',
    addressLine2: 'Near International Tech Park (ITPL)',
    city: 'Bangalore',
    state: 'Karnataka',
    country: 'India',
    pincode: '560066',

    // Contact
    email: 'blr.campus@abcschool.edu.in',
    phone: '+91 80 4123 5566',
    alternatePhone: '+91 80 4123 5570',
    website: 'https://blr.abcschool.edu.in',

    // Campus Head
    head: {
      name: 'Col. Rajeshwar Rao',
      email: 'rajeshwar.rao@abcschool.edu.in',
      phone: '+91 80 4123 5566',
    },

    // Operating Info
    operatingInfo: {
      openingTime: '08:30 AM',
      closingTime: '04:00 PM',
      workingDays: 'Monday to Friday',
    },

    academicStats: {
      currentAcademicYear: '2026–27',
      programsCount: 3,
      programsList: [
        'Senior Secondary (Grades 11-12)',
        'Secondary (Grades 6-10)',
        'Primary Foundation (Grades 1-5)',
      ],
      classesCount: 10,
      sectionsCount: 20,
      departmentsCount: 5,
      departmentsList: [
        'Science & STEM',
        'Mathematics',
        'Commerce & Humanities',
        'Languages',
        'Performing Arts',
      ],
    },

    userStats: {
      totalUsers: 1510,
      administrators: 8,
      teachers: 86,
      staff: 38,
      students: 1378,
    },

    recentActivity: [
      {
        id: 'act-c2-1',
        title: 'Science & Robotics Lab Upgraded',
        description: 'Installed 30 high-spec workstations for Python robotics simulation.',
        timestamp: '2 hours ago',
        user: 'Col. Rajeshwar Rao',
        type: 'campus',
      },
      {
        id: 'act-c2-2',
        title: 'Inter-School Athletics Tryouts',
        description: 'Track and field qualifications conducted at Whitefield synthetic grounds.',
        timestamp: '2 days ago',
        user: 'Sports Faculty',
        type: 'success',
      },
    ],
  },
  {
    id: 'camp-3',
    institutionId: 'inst-1',
    name: 'Pune Hinjawadi Campus',
    code: 'PUN-HINJ',
    type: 'Branch Campus',
    status: 'Active',
    createdDate: '2022-01-20',

    // Address
    addressLine1: 'Phase 1, Hinjawadi Rajiv Gandhi Infotech Park',
    addressLine2: 'Maan Road, Near Wipro Circle',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    pincode: '411057',

    // Contact
    email: 'pune.campus@abcschool.edu.in',
    phone: '+91 20 6789 1234',
    alternatePhone: '+91 20 6789 1235',
    website: 'https://pune.abcschool.edu.in',

    // Campus Head
    head: {
      name: 'Mrs. Sunita Deshmukh',
      email: 'sunita.d@abcschool.edu.in',
      phone: '+91 20 6789 1234',
    },

    // Operating Info
    operatingInfo: {
      openingTime: '08:00 AM',
      closingTime: '03:30 PM',
      workingDays: 'Monday to Friday',
    },

    academicStats: {
      currentAcademicYear: '2026–27',
      programsCount: 2,
      programsList: [
        'Secondary (Grades 6-10)',
        'Primary Foundation (Grades 1-5)',
      ],
      classesCount: 8,
      sectionsCount: 14,
      departmentsCount: 4,
      departmentsList: [
        'General Science',
        'Mathematics',
        'Social Studies',
        'Languages',
      ],
    },

    userStats: {
      totalUsers: 840,
      administrators: 5,
      teachers: 48,
      staff: 22,
      students: 765,
    },

    recentActivity: [
      {
        id: 'act-c3-1',
        title: 'New Campus Bus Route Commissioned',
        description: 'Added Route 7 covering Wakad and Pimple Saudagar corridors.',
        timestamp: '1 day ago',
        user: 'Transport Officer',
        type: 'campus',
      },
    ],
  },
];
