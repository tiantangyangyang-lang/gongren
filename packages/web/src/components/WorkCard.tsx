import Link from 'next/link';
import { CATEGORIES } from '@angang/shared';

interface WorkCardProps {
  work: {
    id: number;
    title: string;
    category: string;
    thumbnail?: string | null;
    creator?: { username: string; avatar_url: string | null };
    view_count: number;
    created_at: string;
  };
}

export default function WorkCard({ work }: WorkCardProps) {
  const cat = CATEGORIES.find((c) => c.value === work.category);
  const timeAgo = getTimeAgo(work.created_at);

  return (
    <Link href={`/work?id=${work.id}`} className="card block no-underline group">
      {/* Thumbnail */}
      <div className="aspect-[4/3] bg-dark-600 flex items-center justify-center overflow-hidden">
        {work.thumbnail ? (
          <img
            src={`${process.env.NEXT_PUBLIC_API_URL}${work.thumbnail}`}
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-4xl text-dark-500">{cat?.icon || '📦'}</span>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded">
            {cat?.label || work.category}
          </span>
        </div>

        <h3 className="text-sm font-semibold text-gray-100 truncate mb-2 group-hover:text-primary transition-colors">
          {work.title}
        </h3>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{work.creator?.username || '匿名'}</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </Link>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const date = new Date(dateStr).getTime();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return '今天';
  if (days === 1) return '昨天';
  if (days < 30) return `${days}天前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}个月前`;
  return `${Math.floor(months / 12)}年前`;
}
