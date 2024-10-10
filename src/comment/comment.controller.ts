import { commentService } from './comment.service';
import { Helper } from '../utils/helpers/helper';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IdDtoValidator } from '../shared/validators/common.validator';
import {
  CreateCommentLikeDtoValidator,
  UpdateCommentDtoValidator,
} from './comment.dto';
import { PaginationOptValidator } from '../shared/pagination/pagination-option.validator';
import { parseAuthToken } from '../auth/middlewares/auth.middleware';

export class CommentController {
  public static async get(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const comment = await commentService.get(id);

    res.status(StatusCodes.OK).json(comment);
  }

  public static async getMany(req: Request, res: Response) {
    const data = PaginationOptValidator.parse(req.query);
    const comment = await commentService.getMany(data, Helper.getPathname(req));

    res.status(StatusCodes.OK).json(comment);
  }

  public static async update(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const data = UpdateCommentDtoValidator.parse(req.body);
    const comment = await commentService.update(id, data);

    res.status(StatusCodes.OK).json(comment);
  }

  public static async delete(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const comment = await commentService.delete(id);

    res.status(StatusCodes.OK).json(comment);
  }

  public static async like(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);
    const data = CreateCommentLikeDtoValidator.parse(req.body);
    const comment = await commentService.createRating(id, userId, data.type);

    res.status(StatusCodes.CREATED).json(comment);
  }

  public static async unlike(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);
    await commentService.deleteRating(id, userId);

    res.status(StatusCodes.NO_CONTENT).end();
  }

  public static async getRating(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);
    const rating = await commentService.getRating(id, userId);

    res.status(StatusCodes.OK).json(rating);
  }
}
