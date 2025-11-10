'use client'

import React, { useState } from 'react'
import { Activity, ActivityType } from '../NewsfeedClient'
import CommentSection from './CommentSection'
import Link from 'next/link'

type Props = {
  activity: Activity
  currentUsername: string
  onReaction: (activityId: string) => void
  onComment: (activityId: string, content: string) => void
  onCollaborationRequest: (activityId: string) => void
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

const ActivityCard: React.FC<Props> = ({ activity, currentUsername, onReaction, onComment, onCollaborationRequest }) => {
  const [showComments, setShowComments] = useState(false)
  const config = ACTIVITY_CONFIG[activity.activity_type]
  const isProjectActivity = activity.activity_type === 'project_created' || activity.activity_type === 'project_updated'
  const canRequestCollaboration = isProjectActivity && activity.username !== currentUsername

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
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.bgColor} ${config.color}`}>
            <span>{config.icon}</span>
            <span>{config.label}</span>
          </span>
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
    </article>
  )
}

export default ActivityCard
