'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import axios from '../../lib/axios'

interface ArticleFormProps {
  initialData?: {
    id?: number
    title: string
    content: string
    excerpt: string
    thumbnail_url: string
    category: string
    tags: string
    status: 'draft' | 'published'
  }
  mode: 'create' | 'edit'
}

const defaultData = {
  title: '',
  content: '',
  excerpt: '',
  thumbnail_url: '',
  category: '',
  tags: '',
  status: 'draft' as const,
}

export default function ArticleForm({ initialData, mode }: ArticleFormProps) {
  const router = useRouter()
  const [form, setForm] = useState({ ...defaultData, ...initialData })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB.')
      return
    }

    setUploading(true)
    setError(null)
    try {
      const formData = new FormData()
      formData.append('image', file)
      const res = await axios.post('/articles/admin/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      update('thumbnail_url', res.data.url)
    } catch {
      setError('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent, submitStatus?: 'draft' | 'published') => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setSaving(true)

    const payload = {
      title: form.title.trim(),
      content: form.content.trim(),
      excerpt: form.excerpt.trim() || undefined,
      thumbnail_url: form.thumbnail_url.trim() || undefined,
      category: form.category.trim() || undefined,
      tags: form.tags.trim()
        ? form.tags.split(',').map((t) => t.trim()).filter(Boolean)
        : undefined,
      status: submitStatus ?? form.status,
    }

    try {
      if (mode === 'create') {
        await axios.post('/articles/admin', payload)
        setSuccess('Article created successfully!')
        setTimeout(() => router.push('/admin/dashboard'), 1000)
      } else {
        await axios.put(`/articles/admin/${initialData!.id}`, payload)
        setSuccess('Article updated successfully!')
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to save article.')
    } finally {
      setSaving(false)
    }
  }

  const thumbnailPreview = form.thumbnail_url
    ? form.thumbnail_url.startsWith('/uploads')
      ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}${form.thumbnail_url}`
      : form.thumbnail_url
    : null

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => update('title', e.target.value)}
              placeholder="Enter article title…"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea
              value={form.excerpt}
              onChange={(e) => update('excerpt', e.target.value)}
              placeholder="Short summary shown in article cards…"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={form.content}
              onChange={(e) => update('content', e.target.value)}
              placeholder="Write your article content here…"
              rows={18}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            />
            <p className="mt-1 text-xs text-gray-400">Supports plain text. HTML tags are rendered as-is.</p>
          </div>
        </div>

        {/* Right: Meta */}
        <div className="space-y-6">
          {/* Publish actions */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Publish</h3>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => update('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSubmit(e as any, 'draft')}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={(e) => handleSubmit(e as any, 'published')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {saving ? 'Saving…' : 'Publish'}
              </button>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
            <h3 className="text-sm font-semibold text-gray-700">Thumbnail Image</h3>

            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail preview"
                className="w-full h-32 object-cover rounded-lg"
              />
            )}

            <div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full border border-dashed border-gray-300 hover:border-blue-400 text-gray-500 hover:text-blue-600 text-sm py-3 rounded-lg transition-colors disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : '+ Upload image'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Or paste image URL</label>
              <input
                type="url"
                value={form.thumbnail_url}
                onChange={(e) => update('thumbnail_url', e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Category & Tags */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h3 className="text-sm font-semibold text-gray-700">Organisation</h3>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Category</label>
              <input
                type="text"
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                placeholder="e.g. Product Update"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-500 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) => update('tags', e.target.value)}
                placeholder="e.g. news, release, team"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
