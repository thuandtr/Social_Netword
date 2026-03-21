'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import axios from '../lib/axios'
import { useRouter } from 'next/navigation'

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/admin/articles/new', label: 'New Article', icon: '✏️' },
  { href: '/admin/media', label: 'Media', icon: '🖼️' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const handleLogout = async () => {
    try {
      await axios.post('/user/logout')
    } catch {}
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar — fixed height, never grows */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <Link href="/" className="text-lg font-bold text-blue-700">TechCorp</Link>
          <span className="ml-2 text-xs text-gray-400 font-medium bg-gray-100 px-2 py-0.5 rounded">Admin</span>
        </div>

        {/* Nav scrolls independently if items overflow */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.href
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Footer always pinned to bottom */}
        <div className="p-3 border-t border-gray-200 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <span>🌐</span>
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-1"
          >
            <span>🚪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-end px-6 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
          >
            <span>🚪</span>
            Logout
          </button>
        </header>
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}