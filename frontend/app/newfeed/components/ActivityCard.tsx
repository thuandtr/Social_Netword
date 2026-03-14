'use client'

import React, { useState } from 'react'
import { Activity, ActivityType } from '../NewsfeedClient'
import CommentSection from './CommentSection'
import Link from 'next/link'

type Props = {
  activity: Activity
  currentUserId: number
  currentUsername: string
  onReaction: (activityId: string) => void
  onComment: (activityId: string, content: string) => void
  onCollaborationRequest: (activityId: string) => void
  onEdit: (activityId: string, activity_data: Activity['activity_data']) => Promise<void>
  onDelete: (activityId: string) => Promise<void>
}

const ACTIVITY_CONFIG: Record<ActivityType, { icon: string; color: string; bgColor: string; label: string }> = {
  education_added: { icon: '🎓', color: 'text-purple-700 dark:text-purple-300', bgColor: 'bg-purple-100 dark:bg-purple-900/30', label: 'Started Education' },
  education_completed: { icon: '🎓', color: 'text-purple-700 dark:text-purple-300', bgColor: 'bg-purple-100 dark:bg-purple-900/30', label: 'Completed Education' },
  job_started: { icon: '💼', color: 'text-blue-700 dark:text-blue-300', bgColor: 'bg-blue-100 dark:bg-blue-900/30', label: 'Started New Position' },
  job_ended: { icon: '💼', color: 'text-gray-700 dark:text-gray-300', bgColor: 'bg-gray-100 dark:bg-gray-700', label: 'Position Ended' },
  certificate_earned: { icon: '🏆', color: 'text-yellow-700 dark:text-yellow-300', bgColor: 'bg-yellow-100 dark:bg-yellow-900/30', label: 'Earned Certificate' },
  project_created: { icon: '🚀', color: 'text-green-700 dark:text-green-300', bgColor: 'bg-green-100 dark:bg-green-900/30', label: 'Created Project' },
  project_updated: { icon: '🔄', color: 'text-teal-700 dark:text-teal-300', bgColor: 'bg-teal-100 dark:bg-teal-900/30', label: 'Updated Project' },
  profile_updated: { icon: '✏️', color: 'text-gray-700 dark:text-gray-300', bgColor: 'bg-gray-100 dark:bg-gray-700', label: 'Updated Profile' },
  article_posted: { icon: '📰', color: 'text-indigo-700 dark:text-indigo-300', bgColor: 'bg-indigo-100 dark:bg-indigo-900/30', label: 'Shared Article' },
}

const formatTimeAgo = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  if (weeks < 4) return `${weeks}w ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

const generateActivityMessage = (activity: Activity): React.ReactNode => {
  const data = activity.activity_data
  const type = activity.activity_type

  switch (type) {
    case 'education_completed':
      return (
        <div className="space-y-2">
          <p className="text-gray-800 dark:text-gray-200">
            Completed <strong>{data.degree || 'degree'}</strong> in <strong>{data.field_of_study || 'their field'}</strong> at
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.school}</p>
        </div>
      )
    
    case 'education_added':
      return (
        <div className="space-y-2">
          <p className="text-gray-800 dark:text-gray-200">
            Started studying <strong>{data.field_of_study || 'a new field'}</strong> at
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.school}</p>
        </div>
      )

    case 'job_started':
      return (
        <div className="space-y-2">
          <p className="text-gray-800 dark:text-gray-200">
            Started new position as
          </p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.job_title}</p>
          <p className="text-gray-800 dark:text-gray-200">
            at <strong>{data.company_name}</strong>
          </p>
        </div>
      )

    case 'job_ended':
      return (
        <div className="space-y-2">
          <p className="text-gray-800 dark:text-gray-200">
            Completed their role as <strong>{data.job_title}</strong> at <strong>{data.company_name}</strong>
          </p>
        </div>
      )

    case 'certificate_earned':
      return (
        <div className="space-y-2">
          <p className="text-gray-800 dark:text-gray-200">Earned a new certificate</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.certificate_name}</p>
          {data.issuer && (
            <p className="text-sm text-gray-600 dark:text-gray-400">Issued by {data.issuer}</p>
          )}
        </div>
      )

    case 'project_created':
    case 'project_updated':
      return (
        <div className="space-y-3">
          <div>
            <p className="text-gray-800 dark:text-gray-200 mb-2">
              {type === 'project_created' ? 'Created a new project' : 'Updated project'}
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{data.project_name}</p>
          </div>
          
          {data.project_description && (
            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
              {data.project_description}
            </p>
          )}
          
          {data.technologies && (
            <div className="flex flex-wrap gap-2">
              {(typeof data.technologies === 'string' 
                ? data.technologies.split(',') 
                : Array.isArray(data.technologies) 
                  ? data.technologies 
                  : []
              ).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 text-xs font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
                >
                  {typeof tech === 'string' ? tech.trim() : String(tech).trim()}
                </span>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-3 pt-2">
            {data.source_link && (
              <a
                href={data.source_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                View Source
              </a>
            )}
            {data.demo_link && (
              <a
                href={data.demo_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400 hover:underline"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                Live Demo
              </a>
            )}
          </div>
          
          {data.contributors && data.contributors.trim() !== '' && (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>Contributors:</strong> {data.contributors}
              </p>
            </div>
          )}
        </div>
      )

    case 'article_posted':
      return (
        <div className="space-y-3">
          {data.image_url && (
            <img
              src={data.image_url}
              alt={data.title}
              className="w-full h-40 object-cover rounded-lg"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
            />
          )}
          <div>
            {data.company_name && (
              <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400 mb-1">
                {data.company_name}
              </p>
            )}
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline"
            >
              {data.title}
            </a>
          </div>
          {data.description && (
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{data.description}</p>
          )}
          {data.tags && (
            <div className="flex flex-wrap gap-2">
              {data.tags.split(',').map((tag, idx) => (
                <span key={idx} className="px-2 py-0.5 text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
          <a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Read article
          </a>
        </div>
      )

    case 'profile_updated':
      return (
        <p className="text-gray-800 dark:text-gray-200">
          Updated their profile
          {data.fields_updated && data.fields_updated.length > 0 && (
            <span className="text-gray-600 dark:text-gray-400">
              {' '}({data.fields_updated.join(', ')})
            </span>
          )}
        </p>
      )

    default:
      return <p className="text-gray-800 dark:text-gray-200">Made an update</p>
  }
}

const ActivityCard: React.FC<Props> = ({ activity, currentUserId, currentUsername, onReaction, onComment, onCollaborationRequest, onEdit, onDelete }) => {
  const [showComments, setShowComments] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const config = ACTIVITY_CONFIG[activity.activity_type]
  const isProjectActivity = activity.activity_type === 'project_created' || activity.activity_type === 'project_updated'
  const canRequestCollaboration = isProjectActivity && activity.username !== currentUsername
  const isOwner = activity.user_id === currentUserId
  const isArticle = activity.activity_type === 'article_posted'

  return (
    <article className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* Activity Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <Link href={`/profile/${activity.username}`}>
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:opacity-80 transition-opacity">
                {activity.username[0].toUpperCase()}
              </div>
            </Link>

            {/* User Info */}
            <div>
              <Link href={`/profile/${activity.username}`}>
                <h3 className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">
                  {activity.username}
                </h3>
              </Link>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatTimeAgo(activity.created_at)}
              </p>
            </div>
          </div>

          {/* Activity Type Badge */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.bgColor} ${config.color}`}>
              <span>{config.icon}</span>
              <span>{config.label}</span>
            </span>

            {/* Owner actions (article only) */}
            {isOwner && isArticle && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowEditModal(true)}
                  title="Edit article"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this article?')) onDelete(activity.id)
                  }}
                  title="Delete article"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Activity Content */}
        <div className="ml-15">
          {generateActivityMessage(activity)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center gap-6">
          {/* Reaction Button */}
          <button
            onClick={() => onReaction(activity.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
              activity.reactions.userReacted
                ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <span className="text-xl">{activity.reactions.emoji}</span>
            <span className="text-sm font-medium">
              {activity.reactions.count > 0 && activity.reactions.count}
            </span>
          </button>

          {/* Comment Button */}
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span className="text-sm font-medium">
              {activity.comments.length > 0 && `${activity.comments.length} `}
              Comment{activity.comments.length !== 1 ? 's' : ''}
            </span>
          </button>

          {/* Collaboration Request Button (only for projects) */}
          {canRequestCollaboration && (
            <button
              onClick={() => onCollaborationRequest(activity.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors ml-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-sm font-medium">Request to Collaborate</span>
            </button>
          )}
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <CommentSection
          comments={activity.comments}
          currentUsername={currentUsername}
          onSubmit={(content: string) => onComment(activity.id, content)}
        />
      )}

      {/* Edit Article Modal */}
      {showEditModal && isArticle && (
        <EditArticleModal
          activity={activity}
          onClose={() => setShowEditModal(false)}
          onSave={async (data) => {
            await onEdit(activity.id, data)
            setShowEditModal(false)
          }}
        />
      )}
    </article>
  )
}

// ── Edit Article Modal ─────────────────────────────────────────────────────────

type EditModalProps = {
  activity: Activity
  onClose: () => void
  onSave: (data: Activity['activity_data']) => Promise<void>
}

const EditArticleModal: React.FC<EditModalProps> = ({ activity, onClose, onSave }) => {
  const d = activity.activity_data
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: d.title || '',
    url: d.url || '',
    description: d.description || '',
    company_name: d.company_name || '',
    tags: d.tags || '',
    image_url: d.image_url || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.url.trim()) return
    setSaving(true)
    try {
      await onSave(form)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Article</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Article Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Article URL <span className="text-red-500">*</span>
            </label>
            <input
              name="url"
              value={form.url}
              onChange={handleChange}
              required
              type="url"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
            <input
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image URL</label>
            <input
              name="image_url"
              value={form.image_url}
              onChange={handleChange}
              type="url"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ActivityCard
