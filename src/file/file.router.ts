import { admin } from '@/auth/middlewares/admin.middleware';
import fileExist from '@/file/middlewares/file-exist.middleware';
import { Router } from 'express';
import multer from 'multer';
import { FileController } from './file.controller';
export const fileRouter = Router();

const FILE_KEY = 'file';
const FIVE_MB = 1024 * 1024 * 5;

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: FIVE_MB * 3 },
});

fileRouter
  .post('/files', upload.single(FILE_KEY), FileController.create)
  .get('/files/:id', fileExist, FileController.get)
  .delete('/files/:id', fileExist, admin, FileController.delete);
