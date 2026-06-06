import { Hono } from 'hono';
import pool from '../db.js';
import { authMiddleware } from '../auth.js';
import { createWorkSchema, updateWorkSchema, paginationSchema } from '@angang/shared';
import type { JwtPayload } from '../auth.js';

type Variables = {
  user: JwtPayload;
};

const works = new Hono<{ Variables: Variables }>();

// GET /api/works — public list with pagination & filtering
works.get('/', async (c) => {
  try {
    const query = c.req.query();
    const parsed = paginationSchema.safeParse(query);
    if (!parsed.success) {
      return c.json({ error: '参数无效', code: 'VALIDATION_ERROR' }, 400);
    }

    const { page, limit, category, tag, sort } = parsed.data;
    const offset = (page - 1) * limit;

    let whereClause = "WHERE w.status = 'published'";
    const params: any[] = [];

    if (category) {
      whereClause += ' AND w.category = ?';
      params.push(category);
    }
    if (tag) {
      whereClause += ' AND JSON_CONTAINS(w.tags, ?)';
      params.push(JSON.stringify(tag));
    }

    let orderClause = 'ORDER BY w.created_at DESC';
    if (sort === 'popular') orderClause = 'ORDER BY w.view_count DESC';
    if (sort === 'oldest') orderClause = 'ORDER BY w.created_at ASC';

    const [countResult] = await pool.query(
      `SELECT COUNT(*) as total FROM works w ${whereClause}`,
      params
    ) as any;
    const total = countResult[0].total;

    const [rows] = await pool.query(
      `SELECT w.*, u.username, u.avatar_url
       FROM works w
       JOIN users u ON w.creator_id = u.id
       ${whereClause}
       ${orderClause}
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    ) as any;

    // Attach first file as thumbnail
    const workIds = rows.map((r: any) => r.id);
    let filesMap: Record<number, any> = {};
    if (workIds.length > 0) {
      const [files] = await pool.query(
        `SELECT wf.* FROM work_files wf WHERE wf.work_id IN (?) AND wf.sort_order = 0`,
        [workIds]
      ) as any;
      for (const f of files) {
        if (!filesMap[f.work_id]) filesMap[f.work_id] = f;
      }
    }

    const data = rows.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      category: row.category,
      tags: row.tags,
      creator_id: row.creator_id,
      status: row.status,
      view_count: row.view_count,
      created_at: row.created_at,
      updated_at: row.updated_at,
      creator: { username: row.username, avatar_url: row.avatar_url },
      thumbnail: filesMap[row.id]?.file_url || null,
    }));

    return c.json({
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: any) {
    console.error('List works error:', err);
    return c.json({ error: '获取作品列表失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

// GET /api/works/:id — single work with files
works.get('/:id', async (c) => {
  try {
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: '无效的作品ID', code: 'INVALID_ID' }, 400);
    }

    // Increment view count
    await pool.query('UPDATE works SET view_count = view_count + 1 WHERE id = ?', [id]);

    const [rows] = await pool.query(
      `SELECT w.*, u.username, u.avatar_url, u.bio as creator_bio
       FROM works w
       JOIN users u ON w.creator_id = u.id
       WHERE w.id = ?`,
      [id]
    ) as any;

    if (rows.length === 0) {
      return c.json({ error: '作品不存在', code: 'NOT_FOUND' }, 404);
    }

    const [files] = await pool.query(
      'SELECT * FROM work_files WHERE work_id = ? ORDER BY sort_order',
      [id]
    ) as any;

    const work = rows[0];
    return c.json({
      ...work,
      tags: work.tags,
      creator: { id: work.creator_id, username: work.username, avatar_url: work.avatar_url, bio: work.creator_bio },
      files,
    });
  } catch (err: any) {
    console.error('Get work error:', err);
    return c.json({ error: '获取作品详情失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

// POST /api/works — create work (auth required)
works.post('/', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as JwtPayload;
    const body = await c.req.json();
    const parsed = createWorkSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: '输入数据无效', code: 'VALIDATION_ERROR', details: parsed.error.flatten() }, 400);
    }

    const { title, description, category, tags, files } = parsed.data;

    const [result] = await pool.query(
      'INSERT INTO works (title, description, category, tags, creator_id) VALUES (?, ?, ?, ?, ?)',
      [title, description || null, category, tags ? JSON.stringify(tags) : null, user.userId]
    ) as any;

    const workId = result.insertId;

    // Insert files
    if (files && files.length > 0) {
      const fileValues = files.map((f, i) => [workId, f.file_url, f.file_type, f.sort_order ?? i]);
      await pool.query(
        'INSERT INTO work_files (work_id, file_url, file_type, sort_order) VALUES ?',
        [fileValues]
      );
    }

    // Also create a revenue record (12 months)
    const periodStart = new Date();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 12);
    await pool.query(
      'INSERT INTO revenue_records (work_id, creator_id, amount, period_start, period_end, status) VALUES (?, ?, 0.00, ?, ?, ?)',
      [workId, user.userId, periodStart.toISOString().slice(0, 10), periodEnd.toISOString().slice(0, 10), 'active']
    );

    const [rows] = await pool.query('SELECT * FROM works WHERE id = ?', [workId]) as any;
    return c.json(rows[0], 201);
  } catch (err: any) {
    console.error('Create work error:', err);
    return c.json({ error: '创建作品失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

// PUT /api/works/:id — update work (auth required, owner only)
works.put('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as JwtPayload;
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: '无效的作品ID', code: 'INVALID_ID' }, 400);
    }

    const [existing] = await pool.query('SELECT * FROM works WHERE id = ?', [id]) as any;
    if (existing.length === 0) {
      return c.json({ error: '作品不存在', code: 'NOT_FOUND' }, 404);
    }
    if (existing[0].creator_id !== user.userId) {
      return c.json({ error: '无权修改此作品', code: 'FORBIDDEN' }, 403);
    }

    const body = await c.req.json();
    const parsed = updateWorkSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: '输入数据无效', code: 'VALIDATION_ERROR' }, 400);
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (parsed.data.title !== undefined) { updates.push('title = ?'); values.push(parsed.data.title); }
    if (parsed.data.description !== undefined) { updates.push('description = ?'); values.push(parsed.data.description); }
    if (parsed.data.category !== undefined) { updates.push('category = ?'); values.push(parsed.data.category); }
    if (parsed.data.tags !== undefined) { updates.push('tags = ?'); values.push(JSON.stringify(parsed.data.tags)); }
    if (parsed.data.status !== undefined) { updates.push('status = ?'); values.push(parsed.data.status); }

    if (updates.length > 0) {
      values.push(id);
      await pool.query(`UPDATE works SET ${updates.join(', ')} WHERE id = ?`, values);
    }

    const [rows] = await pool.query('SELECT * FROM works WHERE id = ?', [id]) as any;
    return c.json(rows[0]);
  } catch (err: any) {
    console.error('Update work error:', err);
    return c.json({ error: '更新作品失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

// DELETE /api/works/:id — delete work (auth required, owner only)
works.delete('/:id', authMiddleware, async (c) => {
  try {
    const user = c.get('user') as JwtPayload;
    const id = Number(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: '无效的作品ID', code: 'INVALID_ID' }, 400);
    }

    const [existing] = await pool.query('SELECT * FROM works WHERE id = ?', [id]) as any;
    if (existing.length === 0) {
      return c.json({ error: '作品不存在', code: 'NOT_FOUND' }, 404);
    }
    if (existing[0].creator_id !== user.userId) {
      return c.json({ error: '无权删除此作品', code: 'FORBIDDEN' }, 403);
    }

    await pool.query('DELETE FROM works WHERE id = ?', [id]);
    return c.json({ message: '作品已删除' });
  } catch (err: any) {
    console.error('Delete work error:', err);
    return c.json({ error: '删除作品失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

export default works;
