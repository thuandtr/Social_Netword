import { redirect } from 'next/navigation'
import { getCurrentUser } from '../../../lib/user'
import ArticleForm from '../ArticleForm'

export default async function NewArticlePage() {
  const userData = await getCurrentUser()

  if (!userData || userData.user.role !== 'admin') {
    redirect('/admin/login')
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">New Article</h1>
      <ArticleForm mode="create" />
    </div>
  )
}
