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
    api.works.get(numId).then(setWork).catch((err) => setError(err.message || '作品不存在')).finally(() => setLoading(false));
  }, [id]);

  if (!id) return (<div className="max-w-4xl mx-auto px-4 py-20 text-center"><p className="text-red-200/60 text-lg">请指定作品 ID</p><a href="/explore" className="btn-gold mt-6 inline-block">返回探索</a></div>);
  if (loading) return (<div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-4"><div className="aspect-video bg-red-900/30 rounded-2xl" /><div className="h-8 bg-red-900/30 rounded w-1/2" /><div className="h-4 bg-red-900/30 rounded w-1/3" /></div>);
  if (error || !work) return (<div className="max-w-4xl mx-auto px-4 py-20 text-center"><p className="text-red-200/60 text-lg">{error || '作品不存在'}</p><a href="/explore" className="btn-gold mt-6 inline-block">返回探索</a></div>);

  const cat = CATEGORIES.find((c) => c.value === work.category);
  const API_BASE = '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {work.files && work.files.length > 0 && (
        <div className="mb-8 red-glass overflow-hidden">
          {work.files[0]?.file_type === 'image' ? (
            <img src={`${API_BASE}${work.files[0].file_url}`} alt={work.title} className="w-full max-h-[60vh] object-contain" />
          ) : work.files[0]?.file_type === 'video' ? (
            <video src={`${API_BASE}${work.files[0].file_url}`} controls className="w-full max-h-[60vh]" />
          ) : work.files[0]?.file_type === 'audio' ? (
            <audio src={`${API_BASE}${work.files[0].file_url}`} controls className="w-full mt-4" />
          ) : null}
          {work.files.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto">
              {work.files.slice(1).map((f: any) => (<img key={f.id} src={`${API_BASE}${f.file_url}`} alt="" className="w-20 h-20 object-cover rounded-lg bg-red-900/30" />))}
            </div>
          )}
        </div>
      )}

      <div className="mb-8">
        <span className="text-xs text-gold bg-gold/10 px-3 py-1 rounded-full">{cat?.icon} {cat?.label || work.category}</span>
        <h1 className="text-3xl font-black text-white mt-4 mb-3">{work.title}</h1>
        <div className="flex items-center gap-4 text-sm text-red-200/60">
          <a href={`/user?id=${work.creator?.id}`} className="hover:text-gold transition-colors font-medium">{work.creator?.username}</a>
          <span>👁 {work.view_count} 次浏览</span>
          <span>{new Date(work.created_at).toLocaleDateString('zh-CN')}</span>
        </div>
      </div>

      {work.tags && work.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {work.tags.map((tag: string) => (<span key={tag} className="text-xs bg-red-950/50 border border-red-400/20 text-red-200 px-3 py-1 rounded-full">{tag}</span>))}
        </div>
      )}

      {work.description && (
        <div className="red-glass p-6"><p className="text-red-100/80 leading-relaxed whitespace-pre-wrap">{work.description}</p></div>
      )}
    </div>
  );
}

export default function WorkDetailPage() {
  return (<Suspense fallback={<div className="max-w-4xl mx-auto px-4 py-20"><div className="animate-pulse h-8 bg-red-900/30 rounded w-32" /></div>}><WorkDetailContent /></Suspense>);
}
