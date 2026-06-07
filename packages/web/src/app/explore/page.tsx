'use client';

import { useEffect, useState, useCallback } from 'react';
import WorkCard from '@/components/WorkCard';
import api from '@/lib/api';
import { CATEGORIES } from '@angang/shared';

export default function ExplorePage() {
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchWorks = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { page, limit: 12, sort };
      if (category) params.category = category;
      const res = await api.works.list(params);
      setWorks(res.data);
      setTotalPages(res.totalPages);
    } catch { setWorks([]); } finally { setLoading(false); }
  }, [page, category, sort]);

  useEffect(() => { fetchWorks(); }, [fetchWorks]);

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 pt-4">
          <h1 className="text-4xl font-black text-gold mb-3">探索创作</h1>
          <div className="gold-line my-4"></div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-8 red-glass p-4">
          <div className="flex flex-wrap gap-2">
            <button onClick={() => { setCategory(''); setPage(1); }}
              className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-300 ${!category ? 'bg-gold text-red-900 shadow-lg shadow-gold/30' : 'bg-red-950/50 text-red-200 hover:text-gold border border-red-400/20'}`}>全部</button>
            {CATEGORIES.map((cat) => (
              <button key={cat.value} onClick={() => { setCategory(cat.value); setPage(1); }}
                className={`text-xs px-4 py-2 rounded-full font-medium transition-all duration-300 ${category === cat.value ? 'bg-gold text-red-900 shadow-lg shadow-gold/30' : 'bg-red-950/50 text-red-200 hover:text-gold border border-red-400/20'}`}>{cat.icon} {cat.label}</button>
            ))}
          </div>
          <div className="ml-auto">
            <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="input-field !w-auto text-sm py-2">
              <option value="latest">最新</option><option value="popular">最热</option><option value="oldest">最早</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="red-glass animate-pulse"><div className="aspect-[4/3] bg-red-900/30 rounded-t-2xl" /><div className="p-4 space-y-2"><div className="h-3 bg-red-800/30 rounded w-1/3" /><div className="h-4 bg-red-800/30 rounded w-2/3" /></div></div>
            ))}
          </div>
        ) : works.length === 0 ? (
          <div className="text-center py-20 red-glass"><p className="text-red-200/60">暂无该分类的作品</p></div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {works.map((work, i) => (<WorkCard key={work.id} work={work} index={i} />))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 mt-12">
            <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-outline text-sm !px-4 !py-2 disabled:opacity-30">上一页</button>
            <span className="text-gold font-bold">{page} / {totalPages}</span>
            <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn-outline text-sm !px-4 !py-2 disabled:opacity-30">下一页</button>
          </div>
        )}
      </div>
    </div>
  );
}
