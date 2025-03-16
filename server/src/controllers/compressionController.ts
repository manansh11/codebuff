import { Request, Response } from 'express';
import { validateFile, FileValidationError } from '../validators/fileValidator';
import { compressImage, CompressionOptions } from '../services/imageCompressor';

export const compressImageHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    validateFile(req);

    const options: CompressionOptions = {
      quality: req.body.quality ? parseInt(req.body.quality, 10) : undefined,
      width: req.body.width ? parseInt(req.body.width, 10) : undefined,
      height: req.body.height ? parseInt(req.body.height, 10) : undefined,
      format: req.body.format as CompressionOptions['format']
    };

    const compressedImage = await compressImage(req.file!.buffer, options);

    res.set('Content-Type', `image/${options.format || 'jpeg'}`);
    res.send(compressedImage);
  } catch (error: unknown) {
    if (error instanceof FileValidationError) {
      res.status(400).json({ error: error.message });
    } else {
      console.error('Compression error:', error);
      res.status(500).json({ error: 'Internal server error during compression' });
    }
  }
};