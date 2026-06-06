import { writeFile, mkdir } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { MAX_UPLOAD_SIZE } from '@angang/shared';

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, '../../uploads');

const ALLOWED_TYPES: Record<string, string[]> = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'],
  video: ['.mp4', '.webm', '.mov'],
  audio: ['.mp3', '.wav', '.ogg', '.flac'],
  document: ['.pdf', '.txt', '.md', '.doc', '.docx'],
  other: [],
};

function getFileType(ext: string): string {
  for (const [type, extensions] of Object.entries(ALLOWED_TYPES)) {
    if (extensions.includes(ext.toLowerCase())) return type;
  }
  return 'other';
}

export interface UploadResult {
  file_url: string;
  file_type: string;
}

export async function saveUpload(file: File): Promise<UploadResult> {
  if (!existsSync(UPLOAD_DIR)) {
    await mkdir(UPLOAD_DIR, { recursive: true });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.length > MAX_UPLOAD_SIZE) {
    throw new Error('文件大小超过限制 (50MB)');
  }

  const ext = extname(file.name).toLowerCase();
  const fileType = getFileType(ext);
  const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
  const filePath = join(UPLOAD_DIR, uniqueName);

  await writeFile(filePath, buffer);

  return {
    file_url: `/uploads/${uniqueName}`,
    file_type: fileType,
  };
}
