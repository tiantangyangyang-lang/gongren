import { Hono } from 'hono';
import pool from '../db.js';
import { authMiddleware } from '../auth.js';
import type { JwtPayload } from '../auth.js';

type Variables = {
  user: JwtPayload;
};

const users = new Hono<{ Variables: Variables }>();

// GET /api/users/me — current user (auth required)
users.get('/me', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as JwtPayload;
    const [rows] = await pool.query(
      'SELECT id, username, email, avatar_url, bio, role, created_at FROM users WHERE id = ?',
      [user.userId]
    ) as any;

    if (rows.length === 0) {
      return c.json({ error: '用户不存在', code: 'NOT_FOUND' }, 404);
    }

    return c.json(rows[0]);
  } catch (err: any) {
    console.error('Get me error:', err);
    return c.json({ error: '获取用户信息失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

// GET /api/users/:id — public user profile with works
users.get('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: '无效的用户ID', code: 'INVALID_ID' }, 400);
    }

    const [rows] = await pool.query(
      'SELECT id, username, avatar_url, bio, role, created_at FROM users WHERE id = ?',
      [id]
    ) as any;

    if (rows.length === 0) {
      return c.json({ error: '用户不存在', code: 'NOT_FOUND' }, 404);
    }

    const [works] = await pool.query(
      `SELECT w.*, u.username, u.avatar_url
       FROM works w
       JOIN users u ON w.creator_id = u.id
       WHERE w.creator_id = ? AND w.status = 'published'
       ORDER BY w.created_at DESC`,
      [id]
    ) as any;

    return c.json({ ...rows[0], works });
  } catch (err: any) {
    console.error('Get user error:', err);
    return c.json({ error: '获取用户信息失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

export default users;
