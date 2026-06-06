import { Hono } from 'hono';
import pool from '../db.js';
import { signToken, hashPassword, comparePassword, authMiddleware } from '../auth.js';
import { registerSchema, loginSchema } from '@angang/shared';
import type { JwtPayload } from '../auth.js';

const auth = new Hono();

// POST /api/auth/register (requires email verification)
auth.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: '输入数据无效', code: 'VALIDATION_ERROR', details: parsed.error.flatten() }, 400);
    }

    const { username, email, password } = parsed.data;

    // Verify that email was verified (check for a used code in last 15 min)
    const [verified] = await pool.query(
      `SELECT id FROM verification_codes
       WHERE email = ? AND used = TRUE AND created_at > DATE_SUB(NOW(), INTERVAL 15 MINUTE)
       LIMIT 1`,
      [email]
    ) as any;
    if (verified.length === 0) {
      return c.json({ error: '请先验证邮箱', code: 'EMAIL_NOT_VERIFIED' }, 400);
    }

    // Check existing user
    const [existing] = await pool.query(
      'SELECT id FROM users WHERE email = ? OR username = ?',
      [email, username]
    ) as any;
    if (existing.length > 0) {
      return c.json({ error: '用户名或邮箱已被注册', code: 'DUPLICATE_USER' }, 409);
    }

    const hashedPassword = await hashPassword(password);
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword]
    ) as any;

    const userId = result.insertId;
    const token = signToken({ userId, role: 'member' });

    const [users] = await pool.query(
      'SELECT id, username, email, avatar_url, bio, role, created_at FROM users WHERE id = ?',
      [userId]
    ) as any;

    return c.json({ token, user: users[0] }, 201);
  } catch (err: any) {
    console.error('Register error:', err);
    return c.json({ error: '注册失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

// POST /api/auth/login
auth.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return c.json({ error: '输入数据无效', code: 'VALIDATION_ERROR' }, 400);
    }

    const { email, password } = parsed.data;

    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]) as any;
    if (users.length === 0) {
      return c.json({ error: '邮箱或密码错误', code: 'INVALID_CREDENTIALS' }, 401);
    }

    const user = users[0];
    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return c.json({ error: '邮箱或密码错误', code: 'INVALID_CREDENTIALS' }, 401);
    }

    const token = signToken({ userId: user.id, role: user.role });
    const { password: _, ...userWithoutPassword } = user;

    return c.json({ token, user: userWithoutPassword });
  } catch (err: any) {
    console.error('Login error:', err);
    return c.json({ error: '登录失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

export default auth;
