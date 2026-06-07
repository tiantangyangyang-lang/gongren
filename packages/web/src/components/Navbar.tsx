'use client';

import Link from 'next/link';
import { useAuth } from './AuthProvider';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.3 });
  }, []);

  return (
    <nav ref={navRef} className="sticky top-0 z-50 bg-red-950/80 backdrop-blur-xl border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 no-underline group">
            <span className="text-2xl font-black tracking-widest text-gold group-hover:scale-105 transition-transform">
              鞍钢
            </span>
            <span className="text-xs text-red-200/60 hidden sm:inline tracking-wide">共享世界</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/explore" className="text-sm text-red-100 hover:text-gold transition-colors font-medium">
              探索
            </Link>
            {user ? (
              <>
                <Link href="/upload" className="text-sm text-red-100 hover:text-gold transition-colors font-medium">创作</Link>
                <Link href={`/user?id=${user.id}`} className="text-sm text-red-100 hover:text-gold transition-colors font-medium">{user.username}</Link>
                <button onClick={logout} className="text-sm text-red-300/60 hover:text-gold transition-colors">退出</button>
              </>
            ) : (
              <Link href="/auth" className="btn-outline text-sm !px-4 !py-1.5">登录</Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
