// src/modules/admissions/components/ApplicationStepper.jsx
import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function ApplicationStepper({ steps = [], currentStep = 1, onStepClick }) {
  return (
    <div className="w-full py-2">
      {/* Desktop Stepper */}
      <div className="hidden md:flex items-center justify-between relative">
        {/* Connector line */}
        <div className="absolute left-6 right-6 top-4 h-0.5 bg-slate-200 -z-0" />

        {steps.map((s, idx) => {
          const stepNum = idx + 1
          const isCompleted = stepNum < currentStep
          const isCurrent = stepNum === currentStep

          return (
            <div
              key={idx}
              className="flex flex-col items-center z-10 cursor-pointer group"
              onClick={() => onStepClick && onStepClick(stepNum)}
            >
              <div
                className={cn(
                  'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all shadow-xs',
                  isCompleted
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 border-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-white border-slate-300 text-slate-500 group-hover:border-slate-400'
                )}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
              </div>
              <span
                className={cn(
                  'text-[11px] font-medium mt-1.5 transition-colors text-center max-w-[90px] truncate',
                  isCurrent ? 'text-blue-700 font-bold' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                )}
              >
                {s.title}
              </span>
            </div>
          )
        })}
      </div>

      {/* Mobile Stepper */}
      <div className="flex md:hidden items-center justify-between bg-slate-100 p-2.5 rounded-lg border border-slate-200">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
            Step {currentStep} of {steps.length}
          </span>
          <div className="text-xs font-bold text-slate-800">{steps[currentStep - 1]?.title}</div>
        </div>
        <div className="flex gap-1">
          {steps.map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-2 w-5 rounded-full transition-all',
                i + 1 === currentStep
                  ? 'bg-blue-600 w-7'
                  : i + 1 < currentStep
                  ? 'bg-emerald-500'
                  : 'bg-slate-300'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
