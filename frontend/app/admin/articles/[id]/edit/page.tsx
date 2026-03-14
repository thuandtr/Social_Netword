import { redirect } from 'next/navigation'
import { getCurrentUser } from '../../../../lib/user'
import axiosInstance from '../../../../lib/axios'
import { getAuthHeaders } from '../../../../lib/validateAuth'
import ArticleForm from '../../ArticleForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditArticlePage({ params }: PageProps) {
  const userData = await getCurrentUser()
  if (!userData || userData.user.role !== 'admin') {
    redirect('/admin/login')
  }

  const { id } = await params

  let article: any = null
  try {
    const headers = await getAuthHeaders()
    const res = await axiosInstance.get(`/articles/admin/${id}`, { headers })
    article = res.data.article
  } catch {
    redirect('/admin/dashboard')
  }

  if (!article) redirect('/admin/dashboard')

  const initialData = {
    id: article.id,
    title: article.title ?? '',
    content: article.content ?? '',
    excerpt: article.excerpt ?? '',
    thumbnail_url: article.thumbnail_url ?? '',
    category: article.category ?? '',
    tags: Array.isArray(article.tags) ? article.tags.join(', ') : (article.tags ?? ''),
    status: article.status as 'draft' | 'published',
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Edit Article</h1>
      <ArticleForm mode="edit" initialData={initialData} />
    </div>
  )
}
