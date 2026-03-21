import { redirect } from 'next/navigation'
import { getCurrentUser } from '../../lib/user'
import MediaClient from './MediaClient'

export default async function MediaPage() {
  const userData = await getCurrentUser()
  if (!userData || userData.user.role !== 'admin') {
    redirect('/admin/login')
  }
  return <MediaClient />
}
