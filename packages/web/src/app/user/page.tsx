'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import WorkCard from '@/components/WorkCard';

function UserProfileContent() {
  const sp = useSearchParams();
  const id = sp.get('id');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const n = Number(id); if (isNaN(n)) { setLoading(false); return; }
    api.users.get(n).then(setUser).catch(() => setUser(null)).finally(() => setLoading(false));
  }, [id]);

  if (!id) return (<div className="max-w-7xl mx-auto px-4 py-20 text-center"><p className="text-red-200/60 text-lg">请指定用户 ID</p></div>);
  if (loading) return (<div className="max-w-7xl mx-auto px-4 py-20 animate-pulse"><div className="flex items-center gap-4"><div className="w-20 h-20 bg-red-900/30 rounded-full" /><div className="space-y-2"><div className="h-8 bg-red-900/30 rounded w-40" /><div className="h-4 bg-red-900/30 rounded w-60" /></div></div></div>);
  if (!user) return (<div className="max-w-7xl mx-auto px-4 py-20 text-center"><p className="text-red-200/60 text-lg">用户不存在</p></div>);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="red-glass p-8 mb-12">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold to-primary flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-gold/20">
              {user.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div>
              <h1 className="text-3xl font-black text-white">{user.username}</h1>
              {user.bio && <p className="text-red-200/60 mt-1">{user.bio}</p>}
              <p className="text-red-300/40 text-sm mt-1">加入于 {new Date(user.created_at).toLocaleDateString('zh-CN')}</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-black text-gold mb-8">{user.username} 的作品 {user.works && <span className="text-red-200/40 text-lg ml-2">({user.works.length})</span>}</h2>

        {!user.works || user.works.length === 0 ? (
          <div className="text-center py-20 red-glass"><p className="text-red-200/60">还没有发布作品</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {user.works.map((work: any, i: number) => (<WorkCard key={work.id} work={work} index={i} />))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function UserPage() {
  return (<Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20"><div className="animate-pulse h-8 bg-red-900/30 rounded w-32" /></div>}><UserProfileContent /></Suspense>);
}
