'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-dark-900/95 backdrop-blur border-b border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <span className="text-xl font-bold tracking-widest text-primary">鞍钢</span>
            <span className="text-xs text-gray-500 hidden sm:inline">共享世界</span>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-6">
            <Link href="/explore" className="text-sm text-gray-300 hover:text-primary transition-colors">
              探索
            </Link>

            {user ? (
              <>
                <Link href="/upload" className="text-sm text-gray-300 hover:text-primary transition-colors">
                  创作
                </Link>
                <Link href={`/user?id=${user.id}`} className="text-sm text-gray-300 hover:text-primary transition-colors">
                  {user.username}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-300 transition-colors"
                >
                  退出
                </button>
              </>
            ) : (
              <Link href="/auth" className="btn-outline text-sm !px-4 !py-1.5">
                登录
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
