import { NextFunction, Request, Response } from 'express';
import { postService } from '../post.service';
import { IdDtoValidator } from '../../shared/validators/common.validator';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '../../utils/exceptions/exceptions';
import { parseAuthToken } from '../../auth/middlewares/admin.middleware';

export default async function postBelongsToUser(
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
