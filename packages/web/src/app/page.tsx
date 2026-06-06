'use client';

import { useEffect, useState } from 'react';
import HeroBanner from '@/components/HeroBanner';
import WorkCard from '@/components/WorkCard';
import api from '@/lib/api';

export default function HomePage() {
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.works.list({ limit: 8, sort: 'popular' })
      .then((res) => setWorks(res.data))
      .catch(() => setWorks([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <HeroBanner />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="section-title">热门创作</h2>
          <div className="gold-line my-4"></div>
          <p className="section-subtitle">发现来自人民创造者的精彩作品</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            <p className="text-gray-500 text-lg mb-4">还没有作品</p>
            <p className="text-gray-600 text-sm">成为第一个创作者，分享你的作品</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {works.map((work) => (
              <WorkCard key={work.id} work={work} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-dark-900 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="section-title mb-4">集体所有制创作平台</h2>
          <div className="gold-line my-4"></div>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mx-auto">
            创作者上传作品后，在12个月内获得全部收益。之后该作品进入共享池，所有人可以按成本价获取。
            我们不支持知识产权永久垄断——创造属于人民，最终实现按需分配。
          </p>
        </div>
      </section>
    </>
  );
}
