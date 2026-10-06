// src/modules/lms/components/DiscussionThread.jsx
import React, { useState } from 'react'
import {
  MessageSquare,
  Pin,
  Send,
  User,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

export interface DiscussionThreadProps {
  discussion: any
  onReply?: (discId: any, replyData: any) => Promise<void> | void
  onTogglePin?: (discId: any) => Promise<void> | void
  onCloseThread?: (discId: any) => Promise<void> | void
  readOnly?: boolean
}

export function DiscussionThread({
  discussion,
  onReply,
  onTogglePin,
  onCloseThread,
  readOnly = false,
}: DiscussionThreadProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSendReply = async (e) => {
    e.preventDefault()
    if (!replyText.trim()) return

    setIsSubmitting(true)
    try {
      await onReply(discussion.id, {
        authorId: 'usr-5',
        authorName: 'Pooja Iyer',
        authorRole: 'Instructor',
        isInstructorResponse: true,
        content: replyText,
      })
      setReplyText('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formattedDate = discussion.createdAt
    ? new Date(discussion.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : ''

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden transition-all">
      {/* Thread Header */}
      <div className="p-5 border-b border-slate-100">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            {discussion.isPinned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                <Pin className="h-3 w-3" />
                Pinned
              </span>
            )}
            {discussion.isClosed && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                <Lock className="h-3 w-3" />
                Closed
              </span>
            )}
            <span className="text-xs text-slate-400">{formattedDate}</span>
          </div>

          <div className="flex items-center gap-1">
            {!readOnly && onTogglePin && (
              <button
                type="button"
                onClick={() => onTogglePin(discussion.id)}
                className={`p-1.5 rounded transition-colors ${
                  discussion.isPinned
                    ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                }`}
                title="Toggle Pin"
              >
                <Pin className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        <h4 className="font-bold text-base text-slate-900 leading-snug mb-2">
          {discussion.title}
        </h4>

        <p className="text-xs text-slate-700 leading-relaxed font-sans mb-3">
          {discussion.content}
        </p>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
              {discussion.authorName?.charAt(0)}
            </div>
            <span className="font-semibold text-slate-800">{discussion.authorName}</span>
            <span className="text-[11px] text-slate-400">• {discussion.authorRole}</span>
          </div>

          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold"
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{discussion.replies?.length || 0} Replies</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Replies List */}
      {isExpanded && (
        <div className="bg-slate-50/60 p-5 space-y-3">
          {discussion.replies && discussion.replies.length > 0 ? (
            discussion.replies.map((reply) => (
              <div
                key={reply.id}
                className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                  reply.isInstructorResponse
                    ? 'bg-blue-50/60 border-blue-200 text-slate-800'
                    : 'bg-white border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{reply.authorName}</span>
                    {reply.isInstructorResponse && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-100/80 px-1.5 py-0.2 rounded border border-blue-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Instructor Verified
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {new Date(reply.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="font-sans text-slate-700">{reply.content}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-slate-400 py-3">No replies yet. Be the first to respond!</p>
          )}

          {/* Quick Reply Form */}
          {!discussion.isClosed && (
            <form onSubmit={handleSendReply} className="pt-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a response or answer this query..."
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !replyText.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold shadow-xs transition-colors shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  )
}
