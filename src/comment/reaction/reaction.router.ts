import { CommentReactionController } from '@/comment/reaction/reaction.controller';
import { Router } from 'express';

export const commentReactionRouter = Router({ mergeParams: true })
  .get('/reactions/my', CommentReactionController.get)
  .post('/reactions/my', CommentReactionController.create)
  .delete('/reactions/my', CommentReactionController.delete)
  .patch('/reactions/my', CommentReactionController.update);
