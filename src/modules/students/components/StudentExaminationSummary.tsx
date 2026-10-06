// src/modules/students/components/StudentExaminationSummary.jsx
import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Award, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function StudentExaminationSummary({ examSummary, examResults = [] }) {
  const navigate = useNavigate()

  const summary = examSummary || {
    latestExam: 'Mid-Term Summative Assessment 2026',
    overallPercentage: '92.8%',
    overallGrade: 'A1',
    gradePoint: '9.4',
    result: 'Passed with Distinction',
  }

  const sampleSubjects = examResults.length > 0 ? examResults : [
    { subject: 'Physics', maxMarks: 100, marksObtained: 94, grade: 'A1', remarks: 'Outstanding analytical skills' },
    { subject: 'Chemistry', maxMarks: 100, marksObtained: 89, grade: 'A2', remarks: 'Very thorough in lab practicals' },
    { subject: 'Mathematics', maxMarks: 100, marksObtained: 98, grade: 'A1', remarks: 'Exceptional problem solver' },
    { subject: 'Computer Science', maxMarks: 100, marksObtained: 96, grade: 'A1', remarks: 'Excellent project work in Python' },
    { subject: 'English Core', maxMarks: 100, marksObtained: 88, grade: 'A2', remarks: 'Good creative writing proficiency' },
  ]

  return (
    <div className="space-y-6">
      {/* Top Exam Header Banner */}
      <Card className="border-slate-200 shadow-xs bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white">
        <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] text-blue-300 uppercase tracking-wider font-semibold">
              Official Assessment Record
            </span>
            <h3 className="text-base font-bold">{summary.latestExam}</h3>
            <p className="text-xs text-slate-300">Class Performance Dossier</p>
          </div>

          <div className="flex items-center gap-4 border-t sm:border-t-0 sm:border-l border-white/20 pt-3 sm:pt-0 sm:pl-6">
            <div>
              <div className="text-[10px] text-slate-300 uppercase">Aggregated %</div>
              <div className="text-xl font-black text-emerald-400">{summary.overallPercentage}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-300 uppercase">Grade</div>
              <div className="text-xl font-black text-white">{summary.overallGrade}</div>
            </div>
            <div>
              <div className="text-[10px] text-slate-300 uppercase">Result</div>
              <div className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {summary.result}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subject-wise Marks Table */}
      <Card className="border-slate-200 shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xs font-bold uppercase text-slate-700">Subject-wise Evaluation Scores</CardTitle>
            <p className="text-[11px] text-slate-500">Continuous internal assessment and term exam marks</p>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate('/academics/examinations')}
            className="text-xs h-7 gap-1 text-blue-600 border-blue-200 hover:bg-blue-50"
          >
            Full Grade Sheet <ArrowRight className="h-3 w-3" />
          </Button>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="px-3 py-2.5">Subject</th>
                  <th className="px-3 py-2.5 text-center">Max Marks</th>
                  <th className="px-3 py-2.5 text-center">Marks Obtained</th>
                  <th className="px-3 py-2.5 text-center">Grade</th>
                  <th className="px-3 py-2.5">Academic Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sampleSubjects.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50/60">
                    <td className="px-3 py-2.5 font-bold text-slate-900">{s.subject}</td>
                    <td className="px-3 py-2.5 text-center font-mono text-slate-500">{s.maxMarks}</td>
                    <td className="px-3 py-2.5 text-center font-mono font-bold text-slate-900">{s.marksObtained}</td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="font-bold px-2 py-0.5 rounded text-[11px] bg-blue-50 text-blue-700 border border-blue-200">
                        {s.grade}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-slate-600 italic text-[11px]">{s.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
