'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { CATEGORIES } from '@angang/shared';

function WorkDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [work, setWork] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    const numId = Number(id);
    if (isNaN(numId)) { setLoading(false); return; }
    api.works.get(numId)
      .then(setWork)
      .catch((err) => setError(err.message || '作品不存在'))
      .finally(() => setLoading(false));
  }, [id]);

  if (!id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg">请指定作品 ID</p>
        <a href="/explore" className="btn-primary mt-4 inline-block">返回探索</a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-4">
        <div className="aspect-video bg-dark-600 rounded-lg" />
        <div className="h-8 bg-dark-600 rounded w-1/2" />
        <div className="h-4 bg-dark-600 rounded w-1/3" />
        <div className="h-20 bg-dark-600 rounded" />
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg">{error || '作品不存在'}</p>
        <a href="/explore" className="btn-primary mt-4 inline-block">返回探索</a>
      </div>
    );
  }

  const cat = CATEGORIES.find((c) => c.value === work.category);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {work.files && work.files.length > 0 && (
        <div className="mb-8">
          {work.files[0]?.file_type === 'image' ? (
            <img src={`${API_BASE}${work.files[0].file_url}`} alt={work.title}
              className="w-full max-h-[60vh] object-contain bg-dark-900 rounded-lg" />
          ) : work.files[0]?.file_type === 'video' ? (
            <video src={`${API_BASE}${work.files[0].file_url}`} controls
              className="w-full max-h-[60vh] bg-dark-900 rounded-lg" />
          ) : work.files[0]?.file_type === 'audio' ? (
            <audio src={`${API_BASE}${work.files[0].file_url}`} controls className="w-full mt-4" />
          ) : null}
          {work.files.length > 1 && (
            <div className="flex gap-2 mt-2 overflow-x-auto">
              {work.files.slice(1).map((f: any) => (
                <img key={f.id} src={`${API_BASE}${f.file_url}`} alt=""
                  className="w-20 h-20 object-cover rounded bg-dark-600" />
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mb-6">
        <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
          {cat?.icon} {cat?.label || work.category}
        </span>
        <h1 className="text-2xl font-bold text-gray-100 mt-3 mb-2">{work.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <a href={`/user?id=${work.creator?.id}`} className="hover:text-primary transition-colors">
            {work.creator?.username}
          </a>
          <span>👁 {work.view_count} 次浏览</span>
          <span>{new Date(work.created_at).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      {work.tags && work.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {work.tags.map((tag: string) => (
            <span key={tag} className="text-xs bg-dark-600 text-gray-300 px-2 py-1 rounded">{tag}</span>
          ))}
        </div>
      )}

      {work.description && (
        <div className="bg-dark-900 rounded-lg p-6 mb-8">
          <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{work.description}</p>
        </div>
      )}
    </div>
  );
}

export default function WorkDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-16"><div className="animate-pulse h-8 bg-dark-600 rounded w-32" /></div>}>
      <WorkDetailContent />
    </Suspense>
  );
}
