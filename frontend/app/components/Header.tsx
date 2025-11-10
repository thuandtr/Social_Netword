'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import axios from '../lib/axios';

type HeaderProps = {
  user?: {
    username: string;
  } | null;
};

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const isAuthenticated = !!user;
  const username = user?.username;

  const handleLogout = async () => {
    try {
      // Call the logout API endpoint
      await axios.post('/user/logout');
      
      // Redirect to login page after successful logout
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, redirect to login
      window.location.href = '/login';
    }
  };

  // Don't show header on auth pages
  if (pathname?.startsWith('/login') || pathname?.startsWith('/signup')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-xl font-bold text-foreground hover:opacity-80 transition-opacity"
            >
              Social Network
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                pathname === '/' ? 'text-foreground' : 'text-foreground/60'
              }`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/newfeed"
                  className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                    pathname === '/newfeed' ? 'text-foreground' : 'text-foreground/60'
                  }`}
                >
                  News Feed
                </Link>
                <Link
                  href="/profile"
                  className={`text-sm font-medium transition-colors hover:text-foreground/80 ${
                    pathname === '/profile' ? 'text-foreground' : 'text-foreground/60'
                  }`}
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link
                href={`/profile/${username}`}
                className="flex items-center gap-2 rounded-full border border-solid border-gray-200 dark:border-gray-700 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 font-medium text-sm h-9 px-4"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                  {username?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline">{username}</span>
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground/60 hover:text-foreground transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background hover:bg-foreground/90 font-medium text-sm h-9 px-4"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
