import { Router } from 'express';
import multer from 'multer';
import { MAX_FILE_SIZE } from '../config/env';
import { compressImageHandler } from '../controllers/compressionController';

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE
  }
});

router.post('/compress', upload.single('image'), compressImageHandler);

export default router;