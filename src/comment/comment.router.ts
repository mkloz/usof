import { Router } from 'express';
import { CommentController } from './comment.controller';
import commentBelongsToUser from './middlewares/comment-belongs-to-user.middleware';
import { auth } from '../auth/middlewares/auth.middleware';
import commentExist from './middlewares/comment-exist.middleware';

export const commentRouter = Router();

commentRouter
  .get('/comments/:id', commentExist, CommentController.get)
  .get('/comments', CommentController.getMany)
  .patch(
    '/comments/:id',
    commentExist,
    commentBelongsToUser,
    CommentController.update,
  )
  .delete(
    '/comments/:id',
    commentExist,
    commentBelongsToUser,
    CommentController.delete,
  )
  .post('/comments/:id/like', auth, commentExist, CommentController.like)
  .delete('/comments/:id/like', auth, commentExist, CommentController.unlike)
  .get('/comments/:id/like', auth, commentExist, CommentController.getRating);
