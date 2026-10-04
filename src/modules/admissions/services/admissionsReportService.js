// src/modules/admissions/services/admissionsReportService.js

export const admissionsReportService = {
  getReportData: async () => {
    return {
      leadSources: [
        { name: 'Website Portal', count: 42, percentage: '35%' },
        { name: 'Walk-in Visits', count: 28, percentage: '23%' },
        { name: 'Parent/Alumni Referral', count: 20, percentage: '17%' },
        { name: 'Education Fair', count: 16, percentage: '13%' },
        { name: 'Social Media', count: 14, percentage: '12%' },
      ],
      applicationStatusBreakdown: [
        { status: 'Submitted', count: 18, color: '#3b82f6' },
        { status: 'Under Review', count: 14, color: '#f59e0b' },
        { status: 'Documents Required', count: 6, color: '#ec4899' },
        { status: 'Approved', count: 22, color: '#10b981' },
        { status: 'Admitted', count: 15, color: '#059669' },
        { status: 'Enrolled', count: 12, color: '#047857' },
        { status: 'Rejected', count: 4, color: '#ef4444' },
      ],
      programDemand: [
        { program: 'Senior Secondary - Science (PCM)', applications: 38, capacity: 40, fillRatio: '95%' },
        { program: 'Senior Secondary - Commerce', applications: 29, capacity: 40, fillRatio: '72%' },
        { program: 'Senior Secondary - Humanities', applications: 18, capacity: 30, fillRatio: '60%' },
        { program: 'Secondary - Class 10 CBSE', applications: 34, capacity: 45, fillRatio: '75%' },
        { program: 'Secondary - Class 9 CBSE', applications: 26, capacity: 45, fillRatio: '58%' },
      ],
      counsellorActivity: [
        {
          counsellor: 'Ananya Sharma',
          leadsAssigned: 28,
          followupsCompleted: 44,
          applicationsGenerated: 21,
          admissionsConverted: 14,
          conversionRate: '50.0%',
        },
        {
          counsellor: 'Rohan Mehra',
          leadsAssigned: 20,
          followupsCompleted: 36,
          applicationsGenerated: 17,
          admissionsConverted: 10,
          conversionRate: '50.0%',
        },
      ],
    }
  },
}
