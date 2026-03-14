import { redirect } from 'next/navigation'
import { getCurrentUser } from '../../lib/user'
import AdminDashboardClient from './AdminDashboardClient'

export default async function AdminDashboardPage() {
  const userData = await getCurrentUser()

  if (!userData || userData.user.role !== 'admin') {
    redirect('/admin/login')
  }

  return <AdminDashboardClient />
}
