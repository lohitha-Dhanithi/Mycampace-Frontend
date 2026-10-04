// src/modules/admissions/data/applicationMockData.js

export const INITIAL_APPLICATIONS = [
  {
    id: 'app-1',
    applicationNumber: 'APP-2026-001',
    leadId: 'lead-1',
    enquiryId: 'enq-1',
    counsellingId: null,
    studentId: 'stu-101',
    applicantName: 'Aarav Patel',
    status: 'Admitted',
    applicationDate: '2026-09-24',
    assignedReviewerId: 'usr-2',
    assignedReviewerName: 'Dr. Radhakrishnan Murthy',

    // Personal info
    personal: {
      firstName: 'Aarav',
      lastName: 'Patel',
      dob: '2009-04-12',
      gender: 'Male',
      nationality: 'Indian',
      bloodGroup: 'B Positive',
      category: 'General',
    },

    // Contact info
    contact: {
      email: 'aarav.patel@gmail.com',
      mobile: '+91 98765 43210',
      alternatePhone: '+91 98765 43211',
      address: 'Plot 104, Jubilee Hills Road No. 36',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500033',
    },

    // Academic interest
    academicInterest: {
      academicYearId: 'ay-2026-27',
      academicYearName: '2026-2027',
      campusId: 'camp-1',
      campusName: 'Hyderabad Main Campus',
      programId: 'prog-1',
      programName: 'Senior Secondary Education',
      courseId: 'crs-1',
      courseName: 'Science Stream (PCM / PCB)',
      classId: 'cls-11',
      className: 'Class 11',
      sectionId: 'sec-11A',
      sectionName: 'Section A (PCM)',
    },

    // Previous Academic
    previousAcademic: {
      previousInstitution: 'Delhi Public School, Hyderabad',
      qualification: 'Class 10 CBSE Board',
      passingYear: '2026',
      percentage: '94.6%',
      relevantSubjects: 'Mathematics, Science, English, Social Science, Hindi',
    },

    // Guardian
    guardian: {
      name: 'Rajesh Patel',
      relationship: 'Father',
      mobile: '+91 98765 11111',
      email: 'rajesh.patel@patelindustries.com',
      occupation: 'Managing Director, Patel Agro Tech',
    },

    // Declaration
    declaration: {
      confirmed: true,
      confirmedDate: '2026-09-24',
      applicantSignature: 'Aarav Patel',
    },

    // Reviewer feedback
    reviewData: {
      reviewerComments: 'Exceptional academic track record with 94.6% in 10th boards. Cleared entrance evaluation with 88%. Strongly recommended.',
      conditionalTerms: '',
      decisionDate: '2026-09-27',
      decisionBy: 'Dr. Radhakrishnan Murthy',
    },

    // Admission Details
    admissionDetails: {
      admissionNumber: 'ADM-2026-089',
      rollNumber: '11-PCM-014',
      allocatedSection: 'Section A (PCM)',
      admissionDate: '2026-09-29',
      admissionNotes: 'Direct admission under academic merit quota with 20% tuition scholarship.',
    },

    communications: [
      {
        id: 'comm-1',
        type: 'Email',
        recipient: 'aarav.patel@gmail.com',
        sentBy: 'Admissions Office',
        date: '2026-09-24 10:30 AM',
        status: 'Delivered',
        subject: 'Application APP-2026-001 Received Successfully',
      },
      {
        id: 'comm-2',
        type: 'SMS',
        recipient: '+91 98765 43210',
        sentBy: 'System Gateway',
        date: '2026-09-27 04:15 PM',
        status: 'Delivered',
        subject: 'Congratulations! Your application to MyCampace has been Approved.',
      },
      {
        id: 'comm-3',
        type: 'Email',
        recipient: 'aarav.patel@gmail.com',
        sentBy: 'Dr. Radhakrishnan Murthy',
        date: '2026-09-29 02:00 PM',
        status: 'Delivered',
        subject: 'Official Admission Letter & Enrolment Instructions - ADM-2026-089',
      },
    ],
  },
  {
    id: 'app-2',
    applicationNumber: 'APP-2026-002',
    leadId: null,
    enquiryId: null,
    counsellingId: null,
    studentId: null,
    applicantName: 'Ananya Deshmukh',
    status: 'Approved',
    applicationDate: '2026-09-28',
    assignedReviewerId: 'usr-2',
    assignedReviewerName: 'Dr. Radhakrishnan Murthy',

    personal: {
      firstName: 'Ananya',
      lastName: 'Deshmukh',
      dob: '2009-02-18',
      gender: 'Female',
      nationality: 'Indian',
      bloodGroup: 'O Positive',
      category: 'General',
    },

    contact: {
      email: 'ananya.deshmukh@gmail.com',
      mobile: '+91 97123 45678',
      alternatePhone: '+91 97123 45679',
      address: 'Flat 402, Green Meadows, Gachibowli',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500032',
    },

    academicInterest: {
      academicYearId: 'ay-2026-27',
      academicYearName: '2026-2027',
      campusId: 'camp-1',
      campusName: 'Hyderabad Main Campus',
      programId: 'prog-1',
      programName: 'Senior Secondary Education',
      courseId: 'crs-2',
      courseName: 'Commerce with Applied Mathematics',
      classId: 'cls-11',
      className: 'Class 11',
      sectionId: 'sec-11A',
      sectionName: 'Section A',
    },

    previousAcademic: {
      previousInstitution: 'Chirec International School',
      qualification: 'ICSE Board',
      passingYear: '2026',
      percentage: '91.2%',
      relevantSubjects: 'English, Economics, Commercial Studies, Mathematics',
    },

    guardian: {
      name: 'Sunil Deshmukh',
      relationship: 'Father',
      mobile: '+91 97123 00000',
      email: 'sunil.d@deshmukhpartners.in',
      occupation: 'Senior Corporate Lawyer',
    },

    declaration: {
      confirmed: true,
      confirmedDate: '2026-09-28',
      applicantSignature: 'Ananya Deshmukh',
    },

    reviewData: {
      reviewerComments: 'Verified ICSE transcripts. Strong analytical orientation. Approved for admission confirmation upon Transfer Certificate receipt.',
      conditionalTerms: 'Pending submission of hard-copy original Transfer Certificate.',
      decisionDate: '2026-10-02',
      decisionBy: 'Dr. Radhakrishnan Murthy',
    },

    admissionDetails: null,

    communications: [
      {
        id: 'comm-201',
        type: 'Email',
        recipient: 'ananya.deshmukh@gmail.com',
        sentBy: 'Admissions Office',
        date: '2026-09-28 09:30 AM',
        status: 'Delivered',
        subject: 'Application APP-2026-002 Acknowledged',
      },
      {
        id: 'comm-202',
        type: 'WhatsApp',
        recipient: '+91 97123 45678',
        sentBy: 'Admissions Helpdesk',
        date: '2026-10-02 10:20 AM',
        status: 'Read',
        subject: 'Your application has been Approved! Complete your admission confirmation.',
      },
    ],
  },
  {
    id: 'app-3',
    applicationNumber: 'APP-2026-003',
    leadId: 'lead-5',
    enquiryId: 'enq-3',
    counsellingId: 'coun-3',
    studentId: null,
    applicantName: 'Dev Choudhury',
    status: 'Documents Required',
    applicationDate: '2026-10-01',
    assignedReviewerId: 'usr-3',
    assignedReviewerName: 'Ananya Sharma',

    personal: {
      firstName: 'Dev',
      lastName: 'Choudhury',
      dob: '2009-07-19',
      gender: 'Male',
      nationality: 'Indian',
      bloodGroup: 'A Positive',
      category: 'General',
    },

    contact: {
      email: 'dev.c@gmail.com',
      mobile: '+91 94567 81234',
      alternatePhone: '+91 94567 81235',
      address: '22 Tanjong Pagar Road, #12-04 (Relocating to Madhapur)',
      city: 'Hyderabad',
      state: 'Telangana',
      country: 'India',
      postalCode: '500081',
    },

    academicInterest: {
      academicYearId: 'ay-2026-27',
      academicYearName: '2026-2027',
      campusId: 'camp-1',
      campusName: 'Hyderabad Main Campus',
      programId: 'prog-1',
      programName: 'Senior Secondary Education',
      courseId: 'crs-1',
      courseName: 'Science Stream (PCM / PCB)',
      classId: 'cls-11',
      className: 'Class 11',
      sectionId: 'sec-11A',
      sectionName: 'Section A',
    },

    previousAcademic: {
      previousInstitution: 'Global Indian International School, Singapore',
      qualification: 'IGCSE Grade 10',
      passingYear: '2026',
      percentage: '88.0%',
      relevantSubjects: 'Physics, Chemistry, Additional Mathematics, Computer Science',
    },

    guardian: {
      name: 'Anirban Choudhury',
      relationship: 'Father',
      mobile: '+65 9123 4567',
      email: 'anirban.choudhury@techcorp.com',
      occupation: 'VP Engineering',
    },

    declaration: {
      confirmed: true,
      confirmedDate: '2026-10-01',
      applicantSignature: 'Dev Choudhury',
    },

    reviewData: {
      reviewerComments: 'IGCSE transcripts require school seal attestation or digital verification key. Requested re-upload of attested documents.',
      conditionalTerms: '',
      decisionDate: null,
      decisionBy: null,
    },

    admissionDetails: null,

    communications: [
      {
        id: 'comm-301',
        type: 'Email',
        recipient: 'dev.c@gmail.com',
        sentBy: 'Ananya Sharma',
        date: '2026-10-02 11:45 AM',
        status: 'Delivered',
        subject: 'Action Required: Attested Marksheet requested for APP-2026-003',
      },
    ],
  },
  {
    id: 'app-4',
    applicationNumber: 'APP-2026-004',
    leadId: null,
    enquiryId: null,
    counsellingId: null,
    studentId: null,
    applicantName: 'Kavya Reddy',
    status: 'Submitted',
    applicationDate: '2026-10-01',
    assignedReviewerId: 'usr-3',
    assignedReviewerName: 'Ananya Sharma',

    personal: {
      firstName: 'Kavya',
      lastName: 'Reddy',
      dob: '2010-01-25',
      gender: 'Female',
      nationality: 'Indian',
      bloodGroup: 'AB Positive',
      category: 'General',
    },

    contact: {
      email: 'kavya.reddy@gmail.com',
      mobile: '+91 99112 23344',
      alternatePhone: null,
      address: 'Villa 18, Palm Meadows, Whitefield',
      city: 'Bangalore',
      state: 'Karnataka',
      country: 'India',
      postalCode: '560066',
    },

    academicInterest: {
      academicYearId: 'ay-2026-27',
      academicYearName: '2026-2027',
      campusId: 'camp-2',
      campusName: 'Bangalore Campus',
      programId: 'prog-1',
      programName: 'Senior Secondary Education',
      courseId: 'crs-1',
      courseName: 'Science Stream (PCM / PCB)',
      classId: 'cls-11',
      className: 'Class 11',
      sectionId: null,
      sectionName: null,
    },

    previousAcademic: {
      previousInstitution: 'National Public School, Indiranagar',
      qualification: 'Class 10 CBSE',
      passingYear: '2026',
      percentage: '93.4%',
      relevantSubjects: 'Maths, Science, Social, English',
    },

    guardian: {
      name: 'Venkatesh Reddy',
      relationship: 'Father',
      mobile: '+91 99112 99999',
      email: 'v.reddy@biocon.com',
      occupation: 'Director, Clinical Research',
    },

    declaration: {
      confirmed: true,
      confirmedDate: '2026-10-01',
      applicantSignature: 'Kavya Reddy',
    },

    reviewData: null,
    admissionDetails: null,
    communications: [
      {
        id: 'comm-401',
        type: 'Email',
        recipient: 'kavya.reddy@gmail.com',
        sentBy: 'System Auto-Mailer',
        date: '2026-10-01 06:12 PM',
        status: 'Delivered',
        subject: 'Application APP-2026-004 Submitted',
      },
    ],
  },
]
