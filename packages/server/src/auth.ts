import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import type { Context, Next } from 'hono';
import { JWT_EXPIRY } from '@angang/shared';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

export interface JwtPayload {
  userId: number;
  role: string;
}

export function signToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/** Hono middleware: require valid JWT in Authorization header */
export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: '未提供认证令牌', code: 'UNAUTHORIZED' }, 401);
  }

  try {
    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    c.set('user', payload);
    await next();
  } catch {
    return c.json({ error: '令牌无效或已过期', code: 'INVALID_TOKEN' }, 401);
  }
}

/** Hono middleware: optional auth — injects user if token present, continues regardless */
export async function optionalAuth(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    try {
      const token = authHeader.slice(7);
      const payload = verifyToken(token);
      c.set('user', payload);
    } catch {
      // Token invalid — proceed without user
    }
  }
  await next();
}
