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

      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-red-900/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="section-title text-gold">热门创作</h2>
            <div className="gold-line my-4"></div>
            <p className="section-subtitle">发现来自人民创造者的精彩作品</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="red-glass animate-pulse"><div className="aspect-[4/3] bg-red-900/30 rounded-t-2xl" /><div className="p-4 space-y-2"><div className="h-3 bg-red-800/30 rounded w-1/3" /><div className="h-4 bg-red-800/30 rounded w-2/3" /></div></div>
              ))}
            </div>
          ) : works.length === 0 ? (
            <div className="text-center py-20 red-glass max-w-lg mx-auto">
              <p className="text-gold text-xl mb-4">还没有作品</p>
              <p className="text-red-200/60">成为第一个创作者，分享你的作品</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {works.map((work, i) => (<WorkCard key={work.id} work={work} index={i} />))}
            </div>
          )}
        </div>
      </section>

      <section className="relative py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950 via-red-900/80 to-red-950" />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1 bg-gold/20 border border-gold/30 text-gold text-xs tracking-[0.2em] rounded-full mb-6">平 台 理 念</span>
          <h2 className="text-3xl font-black text-white mb-8">集体所有制创作平台</h2>
          <div className="gold-line mb-8"></div>
          <p className="text-red-100/80 text-lg leading-relaxed max-w-2xl mx-auto">
            创作者上传作品后，在<strong className="text-gold">12个月</strong>内获得全部收益。<br />
            之后该作品进入共享池，所有人可以按成本价获取。<br />
            <strong className="text-white">创造属于人民，最终实现按需分配。</strong>
          </p>
        </div>
      </section>
    </>
  );
}
