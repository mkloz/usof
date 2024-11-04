import { parseAuthToken } from '@/auth/middlewares/admin.middleware';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@/shared/exceptions/exceptions';
import { IdDtoValidator } from '@/shared/validators/common.validator';
import { NextFunction, Request, Response } from 'express';
import { postService } from '../post.service';

export default async function usersPost(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  const { userId } = parseAuthToken(req);
  const { id } = IdDtoValidator.parse(req.params);
  const post = await postService.get(id);
  if (!post) {
    throw new NotFoundException('Post does not exist.');
  }
  if (post.authorId !== userId) {
    throw new UnprocessableEntityException('Post does not belong to user.');
  }

  next();
}
