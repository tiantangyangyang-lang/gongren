import { z } from 'zod';

export const registerSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email().max(255),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const createWorkSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(5000).optional(),
  category: z.string().min(1).max(50),
  tags: z.array(z.string().max(30)).max(10).optional(),
  files: z
    .array(
      z.object({
        file_url: z.string(),
        file_type: z.enum(['image', 'video', 'audio', 'document', 'other']),
        sort_order: z.number().int().min(0).optional(),
      })
    )
    .max(20)
    .optional(),
});

export const updateWorkSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  category: z.string().min(1).max(50).optional(),
  tags: z.array(z.string().max(30)).max(10).optional(),
  status: z.enum(['published', 'draft', 'hidden']).optional(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  category: z.string().optional(),
  tag: z.string().optional(),
  sort: z.enum(['latest', 'popular', 'oldest']).default('latest'),
});
