import { Hono } from 'hono';
import pool from '../db.js';
import { authMiddleware } from '../auth.js';
import type { JwtPayload } from '../auth.js';

type Variables = {
  user: JwtPayload;
};

const revenue = new Hono<{ Variables: Variables }>();

// GET /api/revenue — current user's revenue records
revenue.get('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as JwtPayload;

    const [rows] = await pool.query(
      `SELECT r.*, w.title as work_title, w.category as work_category
       FROM revenue_records r
       JOIN works w ON r.work_id = w.id
       WHERE r.creator_id = ?
       ORDER BY r.created_at DESC`,
      [user.userId]
    ) as any;

    return c.json(rows);
  } catch (err: any) {
    console.error('Get revenue error:', err);
    return c.json({ error: '获取收益记录失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

export default revenue;
