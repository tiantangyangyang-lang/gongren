'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { CATEGORIES } from '@angang/shared';

interface WorkCardProps {
  work: { id: number; title: string; category: string; thumbnail?: string | null; creator?: { username: string; avatar_url: string | null }; view_count: number; created_at: string; };
  index?: number;
}

export default function WorkCard({ work, index = 0 }: WorkCardProps) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const cat = CATEGORIES.find((c) => c.value === work.category);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.5, delay: index * 0.08, ease: 'power2.out' }
    );
  }, [index]);

  return (
    <Link ref={cardRef} href={`/work?id=${work.id}`} className="card block no-underline group opacity-0">
      <div className="aspect-[4/3] bg-red-950 flex items-center justify-center overflow-hidden relative">
        {work.thumbnail ? (
          <img src={`${process.env.NEXT_PUBLIC_API_URL}${work.thumbnail}`} alt={work.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        ) : (
          <span className="text-5xl group-hover:scale-125 transition-transform duration-500">{cat?.icon || '📦'}</span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-red-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="p-4">
        <span className="text-xs text-gold bg-gold/10 px-2 py-0.5 rounded-full">{cat?.label || work.category}</span>
        <h3 className="text-sm font-bold text-white truncate mt-2 mb-1 group-hover:text-gold transition-colors">{work.title}</h3>
        <div className="flex items-center justify-between text-xs text-red-200/50">
          <span>{work.creator?.username || '匿名'}</span>
          <span>{getTimeAgo(work.created_at)}</span>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(d: string): string {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return '今天'; if (days === 1) return '昨天';
  if (days < 30) return `${days}天前`;
  const m = Math.floor(days / 30);
  return m < 12 ? `${m}个月前` : `${Math.floor(m / 12)}年前`;
}
