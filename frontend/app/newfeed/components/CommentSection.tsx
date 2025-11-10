'use client'

import React, { useState } from 'react'
import { Comment } from '../NewsfeedClient'

type Props = {
  comments: Comment[]
  currentUsername: string
  onSubmit: (content: string) => void
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
  return `${days}d ago`
}

const CommentSection: React.FC<Props> = ({ comments, currentUsername, onSubmit }) => {
  const [newComment, setNewComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      onSubmit(newComment)
      setNewComment('')
    }
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 px-6 py-4">
      {/* Existing Comments */}
      {comments.length > 0 && (
        <div className="space-y-4 mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {/* Commenter Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                {comment.author.username[0].toUpperCase()}
              </div>

              {/* Comment Content */}
              <div className="flex-1">
                <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-semibold text-sm text-gray-900 dark:text-white">
                      {comment.author.username}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {formatTimeAgo(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-800 dark:text-gray-200">
                    {comment.content}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-3">
        {/* Current User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {currentUsername[0].toUpperCase()}
        </div>

        {/* Comment Input */}
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
          />
          <button
            type="submit"
            disabled={!newComment.trim()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-full transition-colors"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  )
}

export default CommentSection
