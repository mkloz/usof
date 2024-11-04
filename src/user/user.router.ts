import { auth } from '@/auth/middlewares/auth.middleware';
import { Router } from 'express';
import { admin } from '../auth/middlewares/admin.middleware';
import userExist from './middlewares/user-exist.middleware';
import { UserController } from './user.controller';

export const userRouter = Router();

userRouter
  .get('/users/me', auth, UserController.getMe)
  .patch('/users/me', auth, UserController.updateMe)
  .delete('/users/me', auth, UserController.deleteMe)
  .get('/users/me/reactions', auth, UserController.getReactions)
  .patch('/users/me/password', auth, UserController.updatePassword)
  .get('/users/me/posts', auth, UserController.getPosts)
  .get('/users/me/favorites', auth, UserController.getFavorites)
  .post('/users/me/favorites', auth, UserController.addFavorite)
  .delete('/users/me/favorites/:id', auth, UserController.removeFavorite)
  .get('/users', admin, UserController.getMany)
  .get('/users/:id', userExist, UserController.get)
  .delete('/users/:id', admin, UserController.delete)
  .patch('/users/:id', admin, UserController.update)
  .get('/users/:id/posts', UserController.getPosts)
  .get('/users/:id/comments', userExist, UserController.getComments);
