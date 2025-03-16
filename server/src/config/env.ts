export const PORT = process.env.PORT || 3001; // Changed from 3000 to 3001
export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '5242880', 10); // 5MB
export const DEFAULT_QUALITY = parseInt(process.env.DEFAULT_QUALITY || '80', 10);
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];