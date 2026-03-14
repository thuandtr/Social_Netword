import { notFound } from 'next/navigation'
import Link from 'next/link'
import axiosInstance from '../../lib/axios'

interface PageProps {
  params: Promise<{ id: string }>
}

interface Article {
  id: number
  title: string
  content: string
  excerpt: string | null
  thumbnail_url: string | null
  category: string | null
  tags: string[] | null
  created_at: string
  updated_at: string | null
  author_username: string
  author_avatar: string | null
}

async function getArticle(id: string): Promise<Article | null> {
  try {
    const res = await axiosInstance.get(`/articles/${id}`)
    return res.data.article ?? null
  } catch {
    return null
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
}

function resolveImageUrl(url: string) {
  if (url.startsWith('/uploads')) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}${url}`
  }
  return url
}

export default async function ArticleDetailPage({ params }: PageProps) {
  const { id } = await params
  const article = await getArticle(id)

  if (!article) notFound()

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Thumbnail */}
      {article.thumbnail_url && (
        <div className="w-full h-72 sm:h-96 overflow-hidden">
          <img
            src={resolveImageUrl(article.thumbnail_url)}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400">
          <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <span className="text-gray-600">{article.title}</span>
        </nav>

        {/* Category & tags */}
        {(article.category || article.tags?.length) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.category && (
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide bg-blue-50 px-3 py-1 rounded-full">
                {article.category}
              </span>
            )}
            {article.tags?.map((tag) => (
              <span key={tag} className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 leading-tight mb-4">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-8 pb-8 border-b border-gray-200">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-sm font-bold">
            {article.author_username.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{article.author_username}</p>
            <p className="text-xs text-gray-400">
              {formatDate(article.created_at)}
              {article.updated_at && article.updated_at !== article.created_at && (
                <> · Updated {formatDate(article.updated_at)}</>
              )}
            </p>
          </div>
        </div>

        {/* Content */}
        <article className="prose prose-blue max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
          {article.content}
        </article>

        {/* Back link */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          >
            ← Back to all articles
          </Link>
        </div>
      </div>

    </main>
  )
}
