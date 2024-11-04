import { PostReactionController } from '@/post/reaction/reaction.controller';
import { Router } from 'express';

export const postReactionRouter = Router({ mergeParams: true })
  .get('/reactions/my', PostReactionController.get)
  .post('/reactions/my', PostReactionController.create)
  .delete('/reactions/my', PostReactionController.delete)
  .patch('/reactions/my', PostReactionController.update);
