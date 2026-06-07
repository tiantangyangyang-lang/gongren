import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from '@hono/node-server/serve-static';
import { serve } from '@hono/node-server';
import { config } from 'dotenv';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, readFileSync } from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env (silently skip if missing — Docker uses platform env vars)
config({ path: resolve(__dirname, '../../../.env'), override: false });

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
import verifyRoutes from './routes/verify.js';

const app = new Hono();

// CORS — allow frontend and production domain
const ALLOWED_ORIGINS = [
  'http://localhost:3000', 'http://127.0.0.1:3000',
  'http://localhost:3001', 'http://127.0.0.1:3001',
  'https://gongren.xyz', 'https://www.gongren.xyz',
];
app.use('*', cors({
  origin: (origin) => (origin && ALLOWED_ORIGINS.includes(origin)) || !origin ? origin || '*' : null,
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
app.route('/api/verify', verifyRoutes);

// Health check
app.get('/api/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Serve frontend static files AFTER API routes
const publicDir = join(__dirname, '../public');
if (existsSync(publicDir)) {
  // Static assets
  app.get('/_next/*', serveStatic({ root: publicDir }));
  app.get('/favicon.ico', serveStatic({ root: publicDir }));

  // Custom handler: map request path to index.html in subdirectories
  app.get('/*', (c) => {
    let filePath = c.req.path.slice(1); // remove leading /
    if (!filePath || filePath.endsWith('/')) {
      filePath = filePath + 'index.html';
    }
    const fullPath = join(publicDir, filePath);
    if (existsSync(fullPath)) {
      const ext = filePath.split('.').pop()?.toLowerCase();
      const mimeMap: Record<string, string> = {
        html: 'text/html', css: 'text/css', js: 'application/javascript',
        json: 'application/json', png: 'image/png', jpg: 'image/jpeg',
        jpeg: 'image/jpeg', svg: 'image/svg+xml', ico: 'image/x-icon',
        txt: 'text/plain',
      };
      const mime = mimeMap[ext || ''] || 'application/octet-stream';
      return c.body(readFileSync(fullPath), 200, { 'Content-Type': mime });
    }
    // SPA fallback: serve root index.html for client-side routes
    return c.body(readFileSync(join(publicDir, 'index.html')), 200, { 'Content-Type': 'text/html' });
  });
}

const port = Number(process.env.PORT || process.env.SERVER_PORT) || 3001;

console.log(`鞍钢 Server starting on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
