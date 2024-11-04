import { AuthController } from '@/auth/auth.controller';
import { Router } from 'express';

export const authRouter = Router()
  .post('/auth/login', AuthController.login)
  .post('/auth/register', AuthController.register)
  .post('/auth/refresh', AuthController.refresh)
  .post('/auth/send-verification', AuthController.sendVerification)
  .post('/auth/verify-email', AuthController.verifyEmail)
  .post('/auth/forgot-password', AuthController.sendPasswordReset)
  .post('/auth/reset-password', AuthController.resetPassword);
