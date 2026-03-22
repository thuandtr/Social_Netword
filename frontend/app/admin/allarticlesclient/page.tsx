import { redirect } from 'next/navigation'
import { getCurrentUser } from '../../lib/user'
import AllArticlesClient from './AllArticlesClient'

export default async function AllArticlesPage() {
  const userData = await getCurrentUser()

  if (!userData || userData.user.role !== 'admin') {
    redirect('/admin/login')
  }

  return <AllArticlesClient />
}
