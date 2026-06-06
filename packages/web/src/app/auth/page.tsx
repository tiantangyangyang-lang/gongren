'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, register, user } = useAuth();
  const router = useRouter();

  if (user) {
    router.push('/');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      if (tab === 'login') {
        await login(email, password);
      } else {
        if (!username.trim()) {
          setError('请输入用户名');
          setSubmitting(false);
          return;
        }
        await register(username, email, password);
      }
      router.push('/');
    } catch (err: any) {
      setError(err.message || '操作失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="flex mb-8 bg-dark-900 rounded-lg p-1">
          <button
            onClick={() => { setTab('login'); setError(''); }}
            className={`flex-1 py-2 text-sm rounded transition-colors ${
              tab === 'login' ? 'bg-primary text-dark-800 font-semibold' : 'text-gray-400'
            }`}
          >
            登录
          </button>
          <button
            onClick={() => { setTab('register'); setError(''); }}
            className={`flex-1 py-2 text-sm rounded transition-colors ${
              tab === 'register' ? 'bg-primary text-dark-800 font-semibold' : 'text-gray-400'
            }`}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {tab === 'register' && (
            <div>
              <label className="block text-sm text-gray-300 mb-1">用户名</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="你的用户名"
                minLength={2}
                maxLength={50}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm text-gray-300 mb-1">邮箱</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="your@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="至少6位"
              minLength={6}
              maxLength={100}
              required
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? '处理中...' : tab === 'login' ? '登录' : '注册'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-600 mt-8">
          登录即表示你同意平台的
          <Link href="/" className="text-primary ml-1">集体所有制原则</Link>
        </p>
      </div>
    </div>
  );
}
