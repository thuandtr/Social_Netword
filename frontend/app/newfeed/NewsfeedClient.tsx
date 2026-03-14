'use client'

import React, { useState, useEffect } from 'react'
import { User } from '../lib/user'
import ActivityCard from './components/ActivityCard'
import axios from '../lib/axios'

export type ActivityType = 
  | 'education_added' 
  | 'education_completed'
  | 'job_started'
  | 'job_ended'
  | 'certificate_earned'
  | 'project_created'
  | 'project_updated'
  | 'profile_updated'
  | 'article_posted'

export type Comment = {
  id: string
  author: {
    username: string
    avatar_url?: string | null
  }
  content: string
  created_at: string
}

export type ActivityData = {
  // For education
  school?: string
  degree?: string
  field_of_study?: string
  // For job
  company_name?: string
  job_title?: string
  // For certificate
  certificate_name?: string
  issuer?: string
  // For project
  project_name?: string
  project_description?: string
  source_link?: string
  demo_link?: string
  technologies?: string | string[] // Can be string (comma-separated) or array
  contributors?: string
  // For profile update
  fields_updated?: string[]
  // For article
  title?: string
  url?: string
  description?: string
  tags?: string
  image_url?: string
}

export type Activity = {
  id: string
  user_id: number
  username: string
  avatar_url?: string | null
  activity_type: ActivityType
  activity_data: ActivityData
  created_at: string
  reactions: {
    emoji: string
    count: number
    userReacted: boolean
  }
  comments: Comment[]
}

export type Props = {
  currentUser: User
}

const NewsfeedClient: React.FC<Props> = ({ currentUser }) => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadActivities = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const response = await axios.get('/activities')
        setActivities(response.data.activities || [])
      } catch (err: any) {
        console.error('Error fetching activities:', err)
        setError('Failed to load activities. Please try again later.')
        // Fallback to empty array on error
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    loadActivities()
  }, [currentUser])

  const handleReaction = async (activityId: string) => {
    try {
      // Optimistically update UI
      setActivities(
        activities.map((activity) => {
          if (activity.id === activityId) {
            return {
              ...activity,
              reactions: {
                ...activity.reactions,
                count: activity.reactions.userReacted
                  ? activity.reactions.count - 1
                  : activity.reactions.count + 1,
                userReacted: !activity.reactions.userReacted,
              },
            }
          }
          return activity
        })
      )

      // Send request to backend
      await axios.post(`/activities/${activityId}/reaction`, {
        emoji: '🎉'
      })
    } catch (err) {
      console.error('Error toggling reaction:', err)
      // Revert optimistic update on error
      setActivities(
        activities.map((activity) => {
          if (activity.id === activityId) {
            return {
              ...activity,
              reactions: {
                ...activity.reactions,
                count: activity.reactions.userReacted
                  ? activity.reactions.count + 1
                  : activity.reactions.count - 1,
                userReacted: !activity.reactions.userReacted,
              },
            }
          }
          return activity
        })
      )
    }
  }

  const handleComment = async (activityId: string, content: string) => {
    try {
      // Send request to backend
      const response = await axios.post(`/activities/${activityId}/comment`, {
        content
      })

      // Update activities with new comment from response
      setActivities(
        activities.map((activity) => {
          if (activity.id === activityId) {
            return {
              ...activity,
              comments: [...activity.comments, response.data.comment],
            }
          }
          return activity
        })
      )
    } catch (err) {
      console.error('Error adding comment:', err)
      alert('Failed to add comment. Please try again.')
    }
  }

  const handleCollaborationRequest = async (activityId: string) => {
    try {
      await axios.post(`/activities/${activityId}/collaborate`, {
        message: 'I would like to collaborate on this project!'
      })
      alert('Collaboration request sent! The project owner will be notified.')
    } catch (err: any) {
      console.error('Error requesting collaboration:', err)
      const errorMessage = err.response?.data?.error || 'Failed to send collaboration request.'
      alert(errorMessage)
    }
  }

  const handleCreateArticle = async (data: {
    title: string
    url: string
    description: string
    company_name: string
    tags: string
    image_url: string
  }) => {
    try {
      const response = await axios.post('/activities', {
        activity_type: 'article_posted',
        activity_data: data,
      })
      const newActivity: Activity = {
        id: response.data.activityId.toString(),
        user_id: currentUser.id,
        username: currentUser.username,
        avatar_url: null,
        activity_type: 'article_posted',
        activity_data: data,
        created_at: new Date().toISOString(),
        reactions: { emoji: '🎉', count: 0, userReacted: false },
        comments: [],
      }
      setActivities([newActivity, ...activities])
    } catch (err) {
      console.error('Error creating article:', err)
      alert('Failed to post article. Please try again.')
    }
  }

  const handleEditActivity = async (activityId: string, activity_data: ActivityData) => {
    try {
      await axios.put(`/activities/${activityId}`, { activity_data })
      setActivities(
        activities.map((a) =>
          a.id === activityId ? { ...a, activity_data } : a
        )
      )
    } catch (err: any) {
      console.error('Error editing activity:', err)
      alert(err.response?.data?.error || 'Failed to update article.')
    }
  }

  const handleDeleteActivity = async (activityId: string) => {
    try {
      await axios.delete(`/activities/${activityId}`)
      setActivities(activities.filter((a) => a.id !== activityId))
    } catch (err: any) {
      console.error('Error deleting activity:', err)
      alert(err.response?.data?.error || 'Failed to delete activity.')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-red-900 dark:text-red-300">
              Error Loading Activities
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-400">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Post Article Form */}
      <PostArticleForm onSubmit={handleCreateArticle} />

      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <h3 className="text-sm font-medium text-blue-900 dark:text-blue-300">
              Automatic Activity Feed
            </h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              This feed automatically shows updates when you or others complete education, start new jobs, 
              earn certificates, or create projects. Update your profile to see your activities here!
            </p>
          </div>
        </div>
      </div>

      {/* Activities Feed */}
      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="mt-4 text-gray-500 dark:text-gray-400">
              No activities yet. Update your profile to generate activities!
            </p>
          </div>
        ) : (
          activities.map((activity) => (
            <ActivityCard
              key={activity.id}
              activity={activity}
              currentUserId={currentUser.id}
              currentUsername={currentUser.username}
              onReaction={handleReaction}
              onComment={handleComment}
              onCollaborationRequest={handleCollaborationRequest}
              onEdit={handleEditActivity}
              onDelete={handleDeleteActivity}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ── Post Article Form ──────────────────────────────────────────────────────────

type PostArticleFormProps = {
  onSubmit: (data: {
    title: string
    url: string
    description: string
    company_name: string
    tags: string
    image_url: string
  }) => Promise<void>
}

const PostArticleForm: React.FC<PostArticleFormProps> = ({ onSubmit }) => {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    url: '',
    description: '',
    company_name: '',
    tags: '',
    image_url: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.url.trim()) return
    setSubmitting(true)
    try {
      await onSubmit(form)
      setForm({ title: '', url: '', description: '', company_name: '', tags: '', image_url: '' })
      setOpen(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 dark:hover:border-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="text-sm font-medium">Share a company article...</span>
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <span>📰</span> Share a Company Article
          </h3>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Article Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. How We Scaled to 1M Users"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Article URL <span className="text-red-500">*</span>
              </label>
              <input
                name="url"
                value={form.url}
                onChange={handleChange}
                required
                type="url"
                placeholder="https://company.com/blog/article"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
              <input
                name="company_name"
                value={form.company_name}
                onChange={handleChange}
                placeholder="e.g. Google"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Tags (comma-separated)</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. engineering, backend, cloud"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                placeholder="What is this article about?"
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image URL (optional)</label>
              <input
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                type="url"
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Posting…' : 'Post Article'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default NewsfeedClient
