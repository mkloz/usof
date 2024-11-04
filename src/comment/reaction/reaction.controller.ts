import { parseAuthToken } from '@/auth/middlewares/admin.middleware';
import { commentReactionService } from '@/comment/reaction/reaction.service';
import { CreatePostReactionDtoValidator } from '@/post/reaction/reaction.dto';
import { IdDtoValidator } from '@/shared/validators/common.validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class CommentReactionController {
  public static async create(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);

    const data = CreatePostReactionDtoValidator.parse(req.body);
    const comment = await commentReactionService.create(id, userId, data.type);

    res.status(StatusCodes.CREATED).json(comment);
  }

  public static async delete(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);
    await commentReactionService.delete(id, userId);

    res.status(StatusCodes.NO_CONTENT).end();
  }

  public static async get(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);
    const rating = await commentReactionService.get(id, userId);

    res.status(StatusCodes.OK).json(rating);
  }

  public static async update(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);
    const data = CreatePostReactionDtoValidator.parse(req.body);
    const rating = await commentReactionService.update(id, userId, data.type);

    res.status(StatusCodes.OK).json(rating);
  }
}
