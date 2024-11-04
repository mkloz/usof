import { parseAuthToken } from '@/auth/middlewares/admin.middleware';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@/shared/exceptions/exceptions';
import { IdDtoValidator } from '@/shared/validators/common.validator';
import { NextFunction, Request, Response } from 'express';
import { commentService } from '../comment.service';

export default async function usersComment(
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
