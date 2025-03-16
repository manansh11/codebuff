import { Request } from 'express';
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from '../config/env';

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'FileValidationError';
  }
}

export const validateFile = (req: Request): void => {
  if (!req.file) {
    throw new FileValidationError('No file uploaded');
  }

  if (!ALLOWED_MIME_TYPES.includes(req.file.mimetype)) {
    throw new FileValidationError('Invalid file type. Only JPEG, PNG and WebP are allowed');
  }

  if (req.file.size > MAX_FILE_SIZE) {
    throw new FileValidationError(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }
};