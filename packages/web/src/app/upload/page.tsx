'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import api from '@/lib/api';
import { CATEGORIES } from '@angang/shared';
import Link from 'next/link';

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>(CATEGORIES[0]?.value || 'other');
  const [tags, setTags] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="animate-pulse h-8 bg-dark-600 rounded w-32" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-400 text-lg mb-4">请先登录才能上传作品</p>
        <Link href="/auth" className="btn-primary">去登录</Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('请输入作品标题');
      return;
    }

    setSubmitting(true);
    try {
      const uploadedFiles = [];
      for (const file of files) {
        const result = await api.upload.file(file);
        uploadedFiles.push({ file_url: result.file_url, file_type: result.file_type });
      }

      const tagList = tags
        .split(/[,，]/)
        .map((t) => t.trim())
        .filter(Boolean);

      await api.works.create({
        title: title.trim(),
        description: description.trim() || undefined,
        category,
        tags: tagList.length > 0 ? tagList : undefined,
        files: uploadedFiles.length > 0 ? uploadedFiles : undefined,
      });

      router.push('/explore');
    } catch (err: any) {
      setError(err.message || '上传失败');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold text-gray-100 mb-8">发布创作</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm text-gray-300 mb-2">作品标题 *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            placeholder="给你的创作起个名字"
            maxLength={200}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">分类</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">描述</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field min-h-[120px] resize-y"
            placeholder="描述你的创作..."
            maxLength={5000}
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">标签（逗号分隔）</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input-field"
            placeholder="例如：红色, 连衣裙, 夏季"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-300 mb-2">上传文件</label>
          <input
            type="file"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files || []))}
            className="block w-full text-sm text-gray-400
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:text-sm file:font-semibold
              file:bg-dark-600 file:text-gray-200
              hover:file:bg-dark-500
              file:cursor-pointer"
          />
          {files.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">已选择 {files.length} 个文件</p>
          )}
        </div>

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? '发布中...' : '发布作品'}
        </button>
      </form>
    </div>
  );
}
