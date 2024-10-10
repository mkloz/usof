import { NextFunction, Request, Response } from 'express';
import { parseAuthToken } from '../../auth/middlewares/auth.middleware';
import { IdDtoValidator } from '../../shared/validators/common.validator';
import { commentService } from '../comment.service';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '../../utils/exceptions/exceptions';

export default async function commentBelongsToUser(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const { userId } = parseAuthToken(req);
  const commentId = IdDtoValidator.parse(req.params).id;
  const comment = await commentService.get(commentId);

  if (!comment) {
    throw new NotFoundException('Comment does not exist.');
  }
  if (comment.userId !== userId) {
    throw new UnprocessableEntityException('Comment does not belong to user.');
  }

  next();
}
