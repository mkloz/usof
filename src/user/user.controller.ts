import { userService } from './user.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { UpdateUserDtoValidator } from './user.dto';
import { parseAuthToken } from '../auth/middlewares/auth.middleware';
import { PaginationOptValidator } from '../shared/pagination/pagination-option.validator';
import { IdDtoValidator } from '../shared/validators/common.validator';
import { Helper } from '../utils/helpers/helper';

export class UserController {
  public static async get(req: Request, res: Response) {
    const { userId } = parseAuthToken(req);
    const task = await userService.get({ id: userId });

    res.status(StatusCodes.OK).json(task);
  }

  public static async getPosts(req: Request, res: Response) {
    const data = PaginationOptValidator.parse(req.query);
    const { id } = IdDtoValidator.parse(req.params);
    const posts = await userService.getPosts(id, data, Helper.getPathname(req));

    res.status(StatusCodes.OK).json(posts);
  }

  public static async getComments(req: Request, res: Response) {
    const data = PaginationOptValidator.parse(req.query);
    const { id } = IdDtoValidator.parse(req.params);
    const comments = await userService.getComments(
      id,
      data,
      Helper.getPathname(req),
    );

    res.status(StatusCodes.OK).json(comments);
  }

  public static async update(req: Request, res: Response) {
    const { userId } = parseAuthToken(req);
    const data = UpdateUserDtoValidator.parse(req.body);
    const task = await userService.update(userId, data);

    res.status(StatusCodes.OK).json(task);
  }

  public static async delete(req: Request, res: Response) {
    const { userId } = parseAuthToken(req);
    const task = await userService.delete(userId);

    res.status(StatusCodes.OK).json(task);
  }
}
