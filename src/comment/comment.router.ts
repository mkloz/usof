import { admin } from '@/auth/middlewares/admin.middleware';
import { auth } from '@/auth/middlewares/auth.middleware';
import usersComment from '@/comment/middlewares/comment-belongs-to-user.middleware';
import commentExist from '@/comment/middlewares/comment-exist.middleware';
import { commentReactionRouter } from '@/comment/reaction/reaction.router';
import { or } from '@/shared/middlewares/or';
import { Router } from 'express';
import { CommentController } from './comment.controller';

export const commentRouter = Router();
const usersCommentOrAdmin = or(usersComment, admin);

commentRouter
  .get('/comments/:id', commentExist, CommentController.get)
  .get('/comments', CommentController.getMany)
  .patch(
    '/comments/:id',
    commentExist,
    usersCommentOrAdmin,
    CommentController.update,
  )
  .delete(
    '/comments/:id',
    commentExist,
    usersCommentOrAdmin,
    CommentController.delete,
  )
  .use('/comments/:id', auth, commentExist, commentReactionRouter);
