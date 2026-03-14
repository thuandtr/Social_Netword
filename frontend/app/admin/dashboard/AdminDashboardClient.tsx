'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import axios from '../../lib/axios'

interface Article {
  id: number
  title: string
  excerpt: string | null
  thumbnail_url: string | null
  category: string | null
  status: 'draft' | 'published'
  created_at: string
  author_username: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

export default function AdminDashboardClient() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)

  const fetchArticles = async () => {
    try {
      setLoading(true)
      const res = await axios.get('/articles/admin')
      setArticles(res.data.articles ?? [])
    } catch (err: any) {
      setError('Failed to load articles.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchArticles() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this article? This cannot be undone.')) return
    setDeleting(id)
    try {
      await axios.delete(`/articles/admin/${id}`)
      setArticles((prev) => prev.filter((a) => a.id !== id))
    } catch {
      alert('Failed to delete article.')
    } finally {
      setDeleting(null)
    }
  }

  const published = articles.filter((a) => a.status === 'published').length
  const drafts = articles.filter((a) => a.status === 'draft').length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-sm text-gray-500 mt-1">
            {published} published · {drafts} draft{drafts !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          + New Article
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
          Loading articles…
        </div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No articles yet.</p>
          <Link href="/admin/articles/new" className="mt-4 inline-block text-blue-600 text-sm font-medium hover:underline">
            Create your first article →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 font-semibold text-gray-600">Title</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Date</th>
                <th className="text-right px-6 py-3 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map((article) => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 line-clamp-1">{article.title}</span>
                    {article.excerpt && (
                      <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{article.excerpt}</p>
                    )}
                  </td>
                  <td className="px-4 py-4 hidden md:table-cell text-gray-500">
                    {article.category || '—'}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      article.status === 'published'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {article.status === 'published' ? '● Published' : '○ Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-4 hidden lg:table-cell text-gray-500">
                    {formatDate(article.created_at)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      {article.status === 'published' && (
                        <Link
                          href={`/articles/${article.id}`}
                          target="_blank"
                          className="text-gray-400 hover:text-gray-700 text-xs transition-colors"
                        >
                          View
                        </Link>
                      )}
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(article.id)}
                        disabled={deleting === article.id}
                        className="text-red-500 hover:text-red-700 font-medium text-xs transition-colors disabled:opacity-50"
                      >
                        {deleting === article.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
