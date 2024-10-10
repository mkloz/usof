import { Router } from 'express';
import { AuthController } from './auth.controller';

export const authRouter = Router()
  .post('/auth/login', AuthController.login)
  .post('/auth/register', AuthController.register)
  .post('/auth/refresh', AuthController.refresh)
  .post('/auth/send-verification', AuthController.sendVerification)
  .post('/auth/verify-email', AuthController.verifyEmail)
  .post('/auth/forgot-password', AuthController.sendPasswordReset)
  .post('/auth/reset-password', AuthController.resetPassword);
