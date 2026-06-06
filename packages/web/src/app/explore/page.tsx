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
    } catch {
      setWorks([]);
    } finally {
      setLoading(false);
    }
  }, [page, category, sort]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-100 mb-2">探索创作</h1>
        <div className="gold-line my-4"></div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setCategory(''); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded transition-colors ${
              !category ? 'bg-primary text-dark-800' : 'bg-dark-900 text-gray-400 hover:text-gray-200'
            }`}
          >
            全部
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(1); }}
              className={`text-xs px-3 py-1.5 rounded transition-colors ${
                category === cat.value ? 'bg-primary text-dark-800' : 'bg-dark-900 text-gray-400 hover:text-gray-200'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        <div className="ml-auto">
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="input-field !w-auto text-xs py-1.5"
          >
            <option value="latest">最新</option>
            <option value="popular">最热</option>
            <option value="oldest">最早</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-dark-600" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-dark-600 rounded w-1/3" />
                <div className="h-4 bg-dark-600 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : works.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">暂无该分类的作品</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {works.map((work) => (
            <WorkCard key={work.id} work={work} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            disabled={page <= 1}
            onClick={() => setPage(page - 1)}
            className="btn-outline text-sm !px-3 !py-1"
          >
            上一页
          </button>
          <span className="text-sm text-gray-400">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
            className="btn-outline text-sm !px-3 !py-1"
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
