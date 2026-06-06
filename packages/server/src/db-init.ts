import mysql from 'mysql2/promise';
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, '../../../.env') });

const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  email       VARCHAR(255) NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  avatar_url  VARCHAR(500) DEFAULT NULL,
  bio         TEXT         DEFAULT NULL,
  role        ENUM('creator','member','admin') DEFAULT 'member',
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS works (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  title       VARCHAR(200) NOT NULL,
  description TEXT         DEFAULT NULL,
  category    VARCHAR(50)  NOT NULL,
  tags        JSON         DEFAULT NULL,
  creator_id  INT          NOT NULL,
  status      ENUM('published','draft','hidden') DEFAULT 'published',
  view_count  INT          DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS work_files (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  work_id     INT          NOT NULL,
  file_url    VARCHAR(500) NOT NULL,
  file_type   ENUM('image','video','audio','document','other') NOT NULL,
  sort_order  INT          DEFAULT 0,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_id) REFERENCES works(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS revenue_records (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  work_id       INT            NOT NULL,
  creator_id    INT            NOT NULL,
  amount        DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  period_start  DATE           NOT NULL,
  period_end    DATE           NOT NULL,
  status        ENUM('active','expired') DEFAULT 'active',
  created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (work_id)    REFERENCES works(id) ON DELETE CASCADE,
  FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
`;

async function initDB() {
  const host = process.env.DATABASE_HOST || '127.0.0.1';
  const port = Number(process.env.DATABASE_PORT) || 3306;
  const user = process.env.DATABASE_USER || 'root';
  const password = process.env.DATABASE_PASSWORD || '';
  const database = process.env.DATABASE_NAME || 'shared_world';

  // First connect without database to create it if needed
  const conn = await mysql.createConnection({ host, port, user, password });
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.query(`USE \`${database}\``);

  // Run schema
  const statements = SCHEMA_SQL.split(';').filter(s => s.trim());
  for (const stmt of statements) {
    await conn.query(stmt);
  }

  console.log(`Database "${database}" initialized successfully.`);
  await conn.end();
  process.exit(0);
}

initDB().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
