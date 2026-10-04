// src/modules/lms/components/LessonPlayer.jsx
import React, { useState } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Video,
  File,
  Download,
  ExternalLink,
  BookOpen,
  Clock,
  Sparkles,
  Maximize2,
} from 'lucide-react'

export function LessonPlayer({
  lesson,
  isCompleted = false,
  onMarkComplete,
  onPrevious,
  onNext,
  hasPrevious = false,
  hasNext = false,
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoProgress, setVideoProgress] = useState(45)

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-96 p-8 text-center bg-white rounded-xl border border-slate-200">
        <BookOpen className="h-12 w-12 text-slate-300 mb-3" />
        <h4 className="text-base font-bold text-slate-800">Select a Lesson to Begin</h4>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Pick a lesson from the module navigation drawer on the left to start learning.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col min-h-[600px]">
      {/* Lesson Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold text-blue-700 uppercase tracking-wider bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
              {lesson.contentType || 'Article'}
            </span>
            {lesson.isMandatory && (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Required for Completion
              </span>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {lesson.duration || '30 mins'}
            </span>
          </div>
          <h2 className="text-lg md:text-xl font-extrabold text-slate-900 leading-snug">
            {lesson.title}
          </h2>
        </div>

        {/* Completion status indicator */}
        <div>
          {isCompleted ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="h-4 w-4" />
              Completed
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-500 bg-slate-100 border border-slate-200">
              In Progress
            </span>
          )}
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="p-6 md:p-8 flex-1 overflow-y-auto">
        {/* VIDEO CONTENT */}
        {lesson.contentType === 'Video' && (
          <div className="space-y-6">
            <div className="relative aspect-video rounded-xl bg-slate-950 overflow-hidden shadow-lg border border-slate-800 flex flex-col justify-between p-4 group">
              {/* Fake Video Preview Canvas */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 opacity-90 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-16 w-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl hover:scale-110 hover:bg-blue-600 transition-all cursor-pointer backdrop-blur-xs"
                >
                  {isPlaying ? (
                    <Pause className="h-8 w-8 fill-current" />
                  ) : (
                    <Play className="h-8 w-8 fill-current ml-1" />
                  )}
                </button>
              </div>

              {/* Video Title Overlay */}
              <div className="relative z-10 text-white text-xs font-semibold px-2 py-1 bg-black/40 backdrop-blur-md rounded max-w-max">
                {lesson.videoProvider || 'Video Stream'} • {lesson.title}
              </div>

              {/* Video Player Controls Bar */}
              <div className="relative z-10 bg-slate-900/90 backdrop-blur-md rounded-lg p-2.5 border border-white/10 flex items-center gap-3 text-white text-xs">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-1 hover:text-blue-400"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>

                {/* Progress bar */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect()
                    const pos = ((e.clientX - rect.left) / rect.width) * 100
                    setVideoProgress(Math.round(pos))
                  }}
                  className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden cursor-pointer relative"
                >
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                <span className="font-mono text-[11px] text-slate-300">
                  {Math.floor((videoProgress / 100) * 42)}:15 / 42:00
                </span>

                <button
                  type="button"
                  onClick={() => setVideoProgress(0)}
                  className="p-1 hover:text-blue-400"
                  title="Restart"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Video Lecture Summary & Notes */}
            {lesson.summaryNotes && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-blue-600" />
                  Lecture Summary & Study Notes
                </h4>
                <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                  {lesson.summaryNotes}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TEXT / ARTICLE CONTENT */}
        {lesson.contentType === 'Text' && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="prose prose-slate prose-sm max-w-none">
              <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-xl mb-6">
                <p className="text-xs text-blue-900 font-medium leading-relaxed">
                  <strong>Course Overview:</strong> Read the theoretical derivation and conceptual explanations below carefully. Make note of key vector identities and definitions.
                </p>
              </div>

              <div className="text-slate-800 text-sm leading-relaxed space-y-4 whitespace-pre-line font-sans">
                {lesson.contentBody || lesson.summaryNotes}
              </div>
            </div>
          </div>
        )}

        {/* PDF / DOCUMENT CONTENT */}
        {(lesson.contentType === 'PDF' || lesson.contentType === 'Document') && (
          <div className="space-y-6">
            <div className="bg-slate-900 text-white rounded-xl p-8 border border-slate-800 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-500/30">
                <File className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold mb-1">{lesson.fileName || 'Curriculum Reference Document.pdf'}</h3>
              <p className="text-xs text-slate-400 mb-6">
                Document Size: {lesson.fileSize || '3.5 MB'} • Format: {lesson.contentType}
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={lesson.fileUrl || '#'}
                  download
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors shadow-sm"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Document</span>
                </a>
              </div>
            </div>

            {/* Document Notes */}
            {lesson.summaryNotes && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Document Topics & Contents
                </h4>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">
                  {lesson.summaryNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* EXTERNAL LINK */}
        {lesson.contentType === 'External Link' && (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-slate-200">
            <ExternalLink className="h-12 w-12 text-cyan-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800 mb-1">External Interactive Resource</h4>
            <p className="text-xs text-slate-500 mb-4 max-w-md mx-auto">
              This lesson utilizes an external interactive simulation. Click the button below to open the resource in a new tab.
            </p>
            <a
              href="https://phet.colorado.edu"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2 bg-blue-600 text-white font-semibold text-xs rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
            >
              <span>Launch Simulation</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Lesson Navigation Footer Bar */}
      <div className="px-6 py-4 border-t border-slate-200 bg-white flex items-center justify-between">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
            hasPrevious
              ? 'text-slate-700 bg-white hover:bg-slate-50 border-slate-300'
              : 'text-slate-300 border-slate-100 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous Lesson</span>
        </button>

        <div>
          {!isCompleted ? (
            <button
              type="button"
              onClick={() => onMarkComplete && onMarkComplete(lesson)}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark as Complete</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span>Completed</span>
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext}
          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold border transition-all ${
            hasNext
              ? 'text-white bg-blue-600 hover:bg-blue-700 border-blue-600 shadow-xs'
              : 'text-slate-300 border-slate-100 cursor-not-allowed'
          }`}
        >
          <span>Next Lesson</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
