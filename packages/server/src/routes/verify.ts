import { Hono } from 'hono';
import pool from '../db.js';
import { sendVerificationCode } from '../lib/email.js';

const verify = new Hono();

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

// POST /api/verify/send-code — send verification code to email
verify.post('/send-code', async (c) => {
  try {
    const { email } = await c.req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ error: '请输入有效的邮箱地址', code: 'INVALID_EMAIL' }, 400);
    }

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store code in DB
    await pool.query(
      'INSERT INTO verification_codes (email, code, expires_at) VALUES (?, ?, ?)',
      [email, code, expiresAt]
    );

    // Send email
    const sent = await sendVerificationCode(email, code);
    if (!sent) {
      return c.json({ error: '验证码发送失败，请稍后重试', code: 'EMAIL_FAILED' }, 500);
    }

    return c.json({ message: '验证码已发送' });
  } catch (err: any) {
    console.error('Send code error:', err);
    return c.json({ error: '发送验证码失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

// POST /api/verify/check-code — verify code is valid
verify.post('/check-code', async (c) => {
  try {
    const { email, code } = await c.req.json();
    if (!email || !code) {
      return c.json({ error: '邮箱和验证码不能为空', code: 'INVALID_INPUT' }, 400);
    }

    const [rows] = await pool.query(
      `SELECT * FROM verification_codes
       WHERE email = ? AND code = ? AND expires_at > NOW() AND used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [email, code]
    ) as any;

    if (rows.length === 0) {
      return c.json({ error: '验证码无效或已过期', code: 'INVALID_CODE' }, 400);
    }

    // Mark as used
    await pool.query('UPDATE verification_codes SET used = TRUE WHERE id = ?', [rows[0].id]);

    return c.json({ verified: true, email });
  } catch (err: any) {
    console.error('Check code error:', err);
    return c.json({ error: '验证失败', code: 'INTERNAL_ERROR' }, 500);
  }
});

export default verify;
