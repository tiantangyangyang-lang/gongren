import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env
config({ path: resolve(__dirname, '../../../.env') });

// Ensure uploads directory
const uploadsDir = join(__dirname, '../uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

import authRoutes from './routes/auth.js';
import worksRoutes from './routes/works.js';
import uploadRoutes from './routes/upload.js';
import usersRoutes from './routes/users.js';
import revenueRoutes from './routes/revenue.js';

const app = new Hono();

// CORS — allow frontend origin
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['Content-Type'],
  maxAge: 86400,
}));

// Static file serving for uploads
app.use('/uploads/*', serveStatic({ root: uploadsDir }));

// API routes
app.route('/api/auth', authRoutes);
app.route('/api/works', worksRoutes);
app.route('/api/upload', uploadRoutes);
app.route('/api/users', usersRoutes);
app.route('/api/revenue', revenueRoutes);

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

const port = Number(process.env.SERVER_PORT) || 3001;

console.log(`鞍钢 Server starting on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
