import { admin } from '@/auth/middlewares/admin.middleware';
import { auth } from '@/auth/middlewares/auth.middleware';
import usersPost from '@/post/middlewares/post-belongs-to-user.middleware';
import postExist from '@/post/middlewares/post-exist.middleware';
import { postReactionRouter } from '@/post/reaction/reaction.router';
import { or } from '@/shared/middlewares/or';
import { Router } from 'express';
import { PostController } from './post.controller';

export const postRouter = Router();
const userOrAdmin = or(usersPost, admin);

postRouter
  .get('/posts', PostController.getMany)
  .post('/posts', auth, PostController.create)
  .get('/posts/:id', postExist, PostController.get)
  .patch('/posts/:id', postExist, userOrAdmin, PostController.update)
  .delete('/posts/:id', postExist, userOrAdmin, PostController.delete)
  .post('/posts/:id/comments', auth, postExist, PostController.createComment)
  .get('/posts/:id/categories', postExist, PostController.getCategories)
  .post(
    '/posts/:id/categories/:categoryId',
    postExist,
    userOrAdmin,
    PostController.addCategory,
  )
  .delete(
    '/posts/:id/categories/:categoryId',
    postExist,
    userOrAdmin,
    PostController.removeCategory,
  )
  .use('/posts/:id', auth, postExist, postReactionRouter);
