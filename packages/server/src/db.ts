import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../.env') });

const sslEnabled = process.env.DATABASE_SSL === 'true' || process.env.DATABASE_PORT === '21052';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST || '127.0.0.1',
  port: Number(process.env.DATABASE_PORT) || 3306,
  user: process.env.DATABASE_USER || 'root',
  password: process.env.DATABASE_PASSWORD || '',
  database: process.env.DATABASE_NAME || 'shared_world',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ...(sslEnabled ? { ssl: { rejectUnauthorized: false } } : {}),
});

export default pool;
