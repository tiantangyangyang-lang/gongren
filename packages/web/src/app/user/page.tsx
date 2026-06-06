'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import WorkCard from '@/components/WorkCard';

function UserProfileContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const numId = Number(id);
    if (isNaN(numId)) { setLoading(false); return; }
    api.users.get(numId)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg">请指定用户 ID</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-dark-600 rounded-full" />
          <div className="space-y-2">
            <div className="h-6 bg-dark-600 rounded w-32" />
            <div className="h-4 bg-dark-600 rounded w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg">用户不存在</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-full bg-dark-600 flex items-center justify-center text-2xl text-gray-300 font-bold">
          {user.username?.[0]?.toUpperCase() || '?'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-100">{user.username}</h1>
          {user.bio && <p className="text-gray-400 text-sm mt-1">{user.bio}</p>}
          <p className="text-gray-500 text-xs mt-1">
            加入于 {new Date(user.created_at).toLocaleDateString('zh-CN')}
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold text-gray-100 mb-6">
        {user.username} 的作品
        {user.works && <span className="text-gray-500 text-sm ml-2">({user.works.length})</span>}
      </h2>

      {!user.works || user.works.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">还没有发布作品</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {user.works.map((work: any) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function UserPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-16"><div className="animate-pulse h-8 bg-dark-600 rounded w-32" /></div>}>
      <UserProfileContent />
    </Suspense>
  );
}
