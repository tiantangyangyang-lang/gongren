import { Hono } from 'hono';
import { authMiddleware } from '../auth.js';
import { saveUpload } from '../lib/upload.js';

const upload = new Hono();

// POST /api/upload — multipart file upload
upload.post('/', authMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return c.json({ error: '未提供文件', code: 'NO_FILE' }, 400);
    }

    const result = await saveUpload(file);
    return c.json(result, 201);
  } catch (err: any) {
    console.error('Upload error:', err);
    if (err.message?.includes('大小超过限制')) {
      return c.json({ error: err.message, code: 'FILE_TOO_LARGE' }, 400);
    }
    return c.json({ error: '文件上传失败', code: 'UPLOAD_ERROR' }, 500);
  }
});

export default upload;
