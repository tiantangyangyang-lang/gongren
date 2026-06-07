'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';
import Link from 'next/link';

export default function AuthPage() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, register, user } = useAuth();
  const router = useRouter();

  if (user) { router.push('/'); return null; }

  const handleSendCode = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('请输入有效的邮箱地址'); return; }
    setError(''); setSendingCode(true);
    try {
      await api.verify.sendCode(email);
      setCodeSent(true); setCountdown(60);
      const timer = setInterval(() => { setCountdown((prev) => { if (prev <= 1) { clearInterval(timer); return 0; } return prev - 1; }); }, 1000);
    } catch (err: any) {
      setError(err.message || '验证码发送失败，请稍后重试');
    } finally { setSendingCode(false); }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length !== 6) { setError('请输入6位验证码'); return; }
    setError('');
    try {
      await api.verify.checkCode(email, code);
      setCodeVerified(true); setError('');
    } catch (err: any) {
      setError(err.message || '验证码无效或已过期');
      setCode('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setSubmitting(true);
    try {
      if (tab === 'login') { await login(email, password); }
      else {
        if (!username.trim()) { setError('请输入用户名'); setSubmitting(false); return; }
        // Backend will reject if email not verified (when SKIP_EMAIL_VERIFY != true)
        await register(username, email, password);
      }
      router.push('/');
    } catch (err: any) { setError(err.message || '操作失败'); } finally { setSubmitting(false); }
  };

  const switchTab = (t: 'login' | 'register') => { setTab(t); setError(''); setCodeSent(false); setCodeVerified(false); setCode(''); };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md red-glass p-8">
        <h2 className="text-2xl font-black text-gold text-center mb-6 tracking-widest">鞍 钢</h2>
        <div className="flex mb-6 bg-red-950/50 rounded-lg p-1">
          <button onClick={() => switchTab('login')} className={`flex-1 py-2.5 text-sm rounded-md font-bold transition-all duration-300 ${tab === 'login' ? 'bg-gold text-red-900 shadow-lg' : 'text-red-200/60 hover:text-gold'}`}>登录</button>
          <button onClick={() => switchTab('register')} className={`flex-1 py-2.5 text-sm rounded-md font-bold transition-all duration-300 ${tab === 'register' ? 'bg-gold text-red-900 shadow-lg' : 'text-red-200/60 hover:text-gold'}`}>注册</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (<div className="bg-red-500/20 border border-red-400/40 text-red-100 px-4 py-3 rounded-lg text-sm">{error}</div>)}

          {tab === 'register' && (
            <div><label className="block text-sm text-red-200/80 mb-1">用户名</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input-field" placeholder="你的用户名" minLength={2} maxLength={50} required /></div>
          )}

          <div><label className="block text-sm text-red-200/80 mb-1">邮箱</label>
            <div className="flex gap-2">
              <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setCodeVerified(false); }} className="input-field flex-1" placeholder="your@email.com" required />
              {tab === 'register' && (
                <button type="button" onClick={handleSendCode} disabled={sendingCode || countdown > 0 || codeVerified}
                  className="btn-gold text-xs !px-3 !py-0 whitespace-nowrap disabled:opacity-50">{codeVerified ? '已验证' : sendingCode ? '发送中' : countdown > 0 ? `${countdown}s` : '获取验证码'}</button>
              )}
            </div>
          </div>

          {tab === 'register' && !codeVerified && (
            <div>
              <label className="block text-sm text-red-200/80 mb-1">验证码 {codeSent && <span className="text-gold text-xs">(已发送到邮箱)</span>}</label>
              <div className="flex gap-2">
                <input type="text" value={code} onChange={(e) => setCode(e.target.value)} className="input-field flex-1" placeholder="输入6位验证码" maxLength={6} inputMode="numeric" />
                <button type="button" onClick={handleVerifyCode} className="btn-outline text-xs !px-3 !py-0 whitespace-nowrap">验证</button>
              </div>
            </div>
          )}

          {tab === 'register' && codeVerified && (
            <div className="bg-green-500/20 border border-green-400/40 text-green-200 px-4 py-2 rounded-lg text-xs">✅ 邮箱已验证成功</div>
          )}

          <div><label className="block text-sm text-red-200/80 mb-1">密码</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-field" placeholder="至少6位" minLength={6} maxLength={100} required /></div>

          <button type="submit" disabled={submitting} className="btn-gold w-full !py-3 text-base">{submitting ? '处理中...' : tab === 'login' ? '登录' : '注册'}</button>
        </form>

        <p className="text-center text-xs text-red-300/40 mt-6">登录即表示你同意平台的 <Link href="/" className="text-gold">集体所有制原则</Link></p>
      </div>
    </div>
  );
}
