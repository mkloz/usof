import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IdDtoValidator } from '../shared/validators/common.validator';
import { Helper } from '../utils/helpers/helper';
import {
  GetManyCommentsDtoValidator,
  UpdateCommentDtoValidator,
} from './comment.dto';
import { commentService } from './comment.service';

export class CommentController {
  public static async get(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const comment = await commentService.get(id);

    res.status(StatusCodes.OK).json(comment);
  }

  public static async getMany(req: Request, res: Response) {
    const data = GetManyCommentsDtoValidator.parse(req.query);
    const comment = await commentService.getPaginated(
      data,
      Helper.getPathname(req),
    );
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
}
