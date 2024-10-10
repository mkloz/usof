import { Router } from 'express';
import { PostController } from './post.controller';

import postBelongsToUser from './middlewares/post-belongs-to-user.middleware';
import { auth } from '../auth/middlewares/auth.middleware';
import postExist from './middlewares/post-exist.middleware';

export const postRouter = Router();

postRouter
  .get('/posts', PostController.getMany)
  .get('/posts/:id', postExist, PostController.get)
  .post('/posts', auth, PostController.create)
  .patch('/posts/:id', postExist, postBelongsToUser, PostController.update)
  .delete('/posts/:id', postExist, postBelongsToUser, PostController.delete)
  .get('/posts/:id/comments', postExist, PostController.getComments)
  .post('/posts/:id/comments', auth, postExist, PostController.comment)
  .get('/posts/:id/categories', postExist, PostController.getCategories)
  .get('/posts/:id/like', auth, postExist, PostController.getRating)
  .post('/posts/:id/like', auth, postExist, PostController.like)
  .delete('/posts/:id/like', auth, postExist, PostController.unlike);
