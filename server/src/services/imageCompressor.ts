import sharp from 'sharp';
import { DEFAULT_QUALITY } from '../config/env';

export interface CompressionOptions {
  quality?: number;
  width?: number;
  height?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export const compressImage = async (
  buffer: Buffer,
  options: CompressionOptions = {}
): Promise<Buffer> => {
  const {
    quality = DEFAULT_QUALITY,
    width,
    height,
    format = 'jpeg'
  } = options;

  let image = sharp(buffer);

  if (width || height) {
    image = image.resize(width, height, {
      fit: 'inside',
      withoutEnlargement: true
    });
  }

  switch (format) {
    case 'jpeg':
      image = image.jpeg({ quality });
      break;
    case 'png':
      image = image.png({ quality });
      break;
    case 'webp':
      image = image.webp({ quality });
      break;
  }

  return image.toBuffer();
};