import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import multer from 'multer';

const uploadsDir = path.join(process.cwd(), 'uploads');
const publicUploadsDir = path.join(uploadsDir, 'public');

fs.mkdirSync(publicUploadsDir, { recursive: true });

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
]);

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!allowedMimeTypes.has(file.mimetype)) {
    cb(new Error('Unsupported file type. Upload images, videos, or PDF/document files.'));
    return;
  }

  cb(null, true);
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, publicUploadsDir),
  filename: (_req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase().replace(/[^a-z0-9.]/g, '');
    cb(null, `${randomUUID()}${extension}`);
  },
});

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});
