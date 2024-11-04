import { parseAuthToken } from '@/auth/middlewares/admin.middleware';
import { CreatePostReactionDtoValidator } from '@/post/reaction/reaction.dto';
import { postReactionService } from '@/post/reaction/reaction.service';
import { IdDtoValidator } from '@/shared/validators/common.validator';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export class PostReactionController {
  public static async create(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);

    const data = CreatePostReactionDtoValidator.parse(req.body);
    const comment = await postReactionService.create(id, userId, data.type);

    res.status(StatusCodes.CREATED).json(comment);
  }

  public static async delete(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);
    await postReactionService.delete(id, userId);

    res.status(StatusCodes.NO_CONTENT).end();
  }

  public static async get(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);
    const rating = await postReactionService.get(id, userId);

    res.status(StatusCodes.OK).json(rating);
  }

  public static async update(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);
    const data = CreatePostReactionDtoValidator.parse(req.body);
    const rating = await postReactionService.update(id, userId, data.type);

    res.status(StatusCodes.OK).json(rating);
  }
}
