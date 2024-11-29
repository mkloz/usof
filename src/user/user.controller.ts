import { parseAuthToken } from '@/auth/middlewares/auth.middleware';
import { User } from '@/user/user.entity';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { NotFoundException } from '../shared/exceptions/exceptions';
import { PaginationOptValidator } from '../shared/pagination/pagination-option.validator';
import { IdDtoValidator } from '../shared/validators/common.validator';
import { Helper } from '../utils/helpers/helper';
import {
  MakePostFavoriteDtoValidator,
  UpdateMeDtoValidator,
  UpdatePasswordDtoValidator,
  UpdateUserDtoValidator,
} from './user.dto';
import { userService } from './user.service';

export class UserController {
  public static async getMe(req: Request, res: Response) {
    const { userId } = parseAuthToken(req);
    const user = await userService.get({ id: userId });

    res.status(StatusCodes.OK).json(new User(user, { groups: ['ME'] }));
  }

  public static async get(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const user = await userService.get({ id });

    res.status(StatusCodes.OK).json(new User(user));
  }

  public static async getMany(req: Request, res: Response) {
    const data = PaginationOptValidator.parse(req.query);
    const users = await userService.getPaginated(data, Helper.getPathname(req));

    res.status(StatusCodes.OK).json(users);
  }
  public static async getFavorites(req: Request, res: Response) {
    const { userId } = parseAuthToken(req);
    const favorites = await userService.getFavorites(userId);

    res.status(StatusCodes.OK).json(favorites);
  }

  public static async addFavorite(req: Request, res: Response) {
    const { userId } = parseAuthToken(req);
    const { postId } = MakePostFavoriteDtoValidator.parse(req.body);
    const task = await userService.addFavorite(userId, postId);

    res.status(StatusCodes.CREATED).json(task);
  }

  public static async removeFavorite(req: Request, res: Response) {
    const { userId } = parseAuthToken(req);
    const { id } = IdDtoValidator.parse(req.params);
    const task = await userService.removeFavorite(userId, id);

    res.status(StatusCodes.OK).json(task);
  }

  public static async getPosts(req: Request, res: Response) {
    const data = PaginationOptValidator.parse(req.query);
    const { userId } = parseAuthToken(req);
    const posts = await userService.getPaginatedPosts(
      userId,
      data,
      Helper.getPathname(req),
    );

    res.status(StatusCodes.OK).json(posts);
  }

  public static async getComments(req: Request, res: Response) {
    const data = PaginationOptValidator.parse(req.query);
    const { id } = IdDtoValidator.parse(req.params);
    const comments = await userService.getPaginatedComments(
      id,
      data,
      Helper.getPathname(req),
    );

    res.status(StatusCodes.OK).json(comments);
  }
  public static async getReactions(req: Request, res: Response) {
    const { userId } = parseAuthToken(req);
    const likes = await userService.getReactions(userId);

    res.status(StatusCodes.OK).json(likes);
  }
  public static async updateMe(req: Request, res: Response) {
    const { userId } = parseAuthToken(req);
    const data = UpdateMeDtoValidator.parse(req.body);
    const user = await userService.update(userId, data);

    res.status(StatusCodes.OK).json(new User(user, { groups: ['ME'] }));
  }

  public static async update(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const data = UpdateUserDtoValidator.parse(req.body);
    const user = await userService.update(id, data);

    res.status(StatusCodes.OK).json(new User(user));
  }

  public static async updatePassword(req: Request, res: Response) {
    const { userId } = parseAuthToken(req);
    const { oldPassword, newPassword } = UpdatePasswordDtoValidator.parse(
      req.body,
    );
    if (!(await userService.verify(userId, oldPassword))) {
      throw new NotFoundException('Invalid old password');
    }

    await userService.updatePassword(userId, newPassword);

    res.status(StatusCodes.NO_CONTENT).end();
  }

  public static async deleteMe(req: Request, res: Response) {
    const { userId } = parseAuthToken(req);
    const user = await userService.delete(userId);

    res.status(StatusCodes.OK).json(new User(user, { groups: ['ME'] }));
  }

  public static async delete(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const user = await userService.delete(id);

    res.status(StatusCodes.OK).json(new User(user));
  }
}
