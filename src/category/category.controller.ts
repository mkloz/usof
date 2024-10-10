import { categoryService } from './category.service';
import { Helper } from '../utils/helpers/helper';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IdDtoValidator } from '../shared/validators/common.validator';
import {
  CreateCategoryDtoValidator,
  UpdateCategoryDtoValidator,
} from './category.dto';
import { PaginationOptValidator } from '../shared/pagination/pagination-option.validator';

export class CategoryController {
  public static async get(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const comment = await categoryService.get(id);

    res.status(StatusCodes.OK).json(comment);
  }

  public static async create(req: Request, res: Response) {
    const data = CreateCategoryDtoValidator.parse(req.body);
    const comment = await categoryService.create(data);

    res.status(StatusCodes.CREATED).json(comment);
  }

  public static async getMany(req: Request, res: Response) {
    const data = PaginationOptValidator.parse(req.query);
    const comment = await categoryService.getMany(
      data,
      Helper.getPathname(req),
    );

    res.status(StatusCodes.OK).json(comment);
  }

  public static async getPosts(req: Request, res: Response) {
    const data = PaginationOptValidator.parse(req.query);
    const { id } = IdDtoValidator.parse(req.params);
    const posts = await categoryService.getPosts(
      id,
      data,
      Helper.getPathname(req),
    );

    res.status(StatusCodes.OK).json(posts);
  }

  public static async update(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const data = UpdateCategoryDtoValidator.parse(req.body);
    const comment = await categoryService.update(id, data);

    res.status(StatusCodes.OK).json(comment);
  }

  public static async delete(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const comment = await categoryService.delete(id);

    res.status(StatusCodes.OK).json(comment);
  }
}
