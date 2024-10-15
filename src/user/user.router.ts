import { Router } from 'express';
import { UserController } from './user.controller';
import { auth } from '../auth/middlewares/auth.middleware';
import userExist from './middlewares/user-exist.middleware';

export const userRouter = Router();

userRouter
  .get('/users/me', auth, UserController.get)
  .get('/users/me/likes', auth, UserController.getLikes)
  .patch('/users/me', auth, UserController.update)
  .delete('/users/me', auth, UserController.delete)
  .get('/users/me/favorites', auth, UserController.getFavorites)
  .post('/users/me/favorites', auth, UserController.addFavorite)
  .delete('/users/me/favorites/:id', auth, UserController.removeFavorite)
  .get('/users/:id/posts', userExist, UserController.getPosts)
  .get('/users/:id/comments', userExist, UserController.getComments);
