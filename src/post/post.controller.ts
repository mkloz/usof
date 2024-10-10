import { postService } from './post.service';
import { Helper } from '../utils/helpers/helper';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IdDtoValidator } from '../shared/validators/common.validator';
import {
  CreatePostDtoValidator,
  CreatePostLikeDtoValidator,
  GetManyPostsDtoValidator,
  UpdatePostDtoValidator,
} from './post.dto';
import { PaginationOptValidator } from '../shared/pagination/pagination-option.validator';
import { parseAuthToken } from '../auth/middlewares/auth.middleware';
import { CreateCommentDtoValidator } from '../comment/comment.dto';
import { commentService } from '../comment/comment.service';
import { BadRequestException } from '../utils/exceptions/exceptions';

export class PostController {
  public static async get(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const post = await postService.get(id);

    res.status(StatusCodes.OK).json(post);
  }

  public static async create(req: Request, res: Response) {
    const data = CreatePostDtoValidator.parse(req.body);
    const { userId } = parseAuthToken(req);
    const post = await postService.create(userId, data);

    res.status(StatusCodes.CREATED).json(post);
  }

  public static async comment(req: Request, res: Response) {
    const data = CreateCommentDtoValidator.parse(req.body);
    const { userId } = parseAuthToken(req);
    const { id } = IdDtoValidator.parse(req.params);
    const post = await postService.get(id);

    if (!post || post.status === 'INACTIVE') {
      throw new BadRequestException("Post doesn't exist or is inactive");
    }
    const comment = await commentService.create(userId, id, data);

    res.status(StatusCodes.CREATED).json(comment);
  }

  public static async getMany(req: Request, res: Response) {
    const data = GetManyPostsDtoValidator.parse(req.query);
    const posts = await postService.getMany(data, Helper.getPathname(req));

    res.status(StatusCodes.OK).json(posts);
  }

  public static async getComments(req: Request, res: Response) {
    const data = PaginationOptValidator.parse(req.query);
    const { id } = IdDtoValidator.parse(req.params);
    const posts = await postService.getComments(
      id,
      data,
      Helper.getPathname(req),
    );

    res.status(StatusCodes.OK).json(posts);
  }

  public static async getCategories(req: Request, res: Response) {
    const data = PaginationOptValidator.parse(req.query);
    const { id } = IdDtoValidator.parse(req.params);
    const posts = await postService.getCategories(
      id,
      data,
      Helper.getPathname(req),
    );

    res.status(StatusCodes.OK).json(posts);
  }

  public static async update(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const data = UpdatePostDtoValidator.parse(req.body);
    const post = await postService.update(id, data);

    res.status(StatusCodes.OK).json(post);
  }

  public static async delete(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const post = await postService.delete(id);

    res.status(StatusCodes.OK).json(post);
  }

  public static async like(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);

    const data = CreatePostLikeDtoValidator.parse(req.body);
    const comment = await postService.createRating(id, userId, data.type);

    res.status(StatusCodes.CREATED).json(comment);
  }

  public static async unlike(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);
    await postService.deleteRating(id, userId);

    res.status(StatusCodes.NO_CONTENT).end();
  }

  public static async getRating(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const { userId } = parseAuthToken(req);
    const rating = await postService.getRating(id, userId);

    res.status(StatusCodes.OK).json(rating);
  }
}
