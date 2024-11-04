import { parseAuthToken } from '@/auth/middlewares/auth.middleware';
import { CreateCommentDtoValidator } from '@/comment/comment.dto';
import { commentService } from '@/comment/comment.service';
import { PostStatus } from '@prisma/client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { BadRequestException } from '../shared/exceptions/exceptions';
import { PaginationOptValidator } from '../shared/pagination/pagination-option.validator';
import {
  IdDtoValidator,
  IDValidator,
} from '../shared/validators/common.validator';
import { Helper } from '../utils/helpers/helper';
import {
  CreatePostDtoValidator,
  GetManyPostsDtoValidator,
  UpdatePostDtoValidator,
} from './post.dto';
import { postService } from './post.service';

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

  public static async createComment(req: Request, res: Response) {
    const data = CreateCommentDtoValidator.parse(req.body);
    const { userId } = parseAuthToken(req);
    const { id } = IdDtoValidator.parse(req.params);
    const post = await postService.get(id);

    if (!post || post.status !== PostStatus.PUBLISHED) {
      throw new BadRequestException("Post doesn't exist or is inactive");
    }
    const comment = await commentService.create(userId, id, data);

    if (!comment) {
      throw new BadRequestException('Comment not created');
    }
    res.status(StatusCodes.CREATED).json(comment);
  }

  public static async getMany(req: Request, res: Response) {
    const data = GetManyPostsDtoValidator.parse(req.query);
    const posts = await postService.getPaginated(data, Helper.getPathname(req));

    res.status(StatusCodes.OK).json(posts);
  }

  public static async getCategories(req: Request, res: Response) {
    const data = PaginationOptValidator.parse(req.query);
    const { id } = IdDtoValidator.parse(req.params);
    const posts = await postService.getPaginatedCategories(
      id,
      data,
      Helper.getPathname(req),
    );

    res.status(StatusCodes.OK).json(posts);
  }

  public static async addCategory(req: Request, res: Response) {
    const { id, categoryId } = IdDtoValidator.extend({
      categoryId: IDValidator,
    }).parse(req.params);
    const post = await postService.addCategory(id, categoryId);

    res.status(StatusCodes.OK).json(post);
  }

  public static async removeCategory(req: Request, res: Response) {
    const { id, categoryId } = IdDtoValidator.extend({
      categoryId: IDValidator,
    }).parse(req.params);
    const post = await postService.removeCategory(id, categoryId);

    res.status(StatusCodes.OK).json(post);
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
}
