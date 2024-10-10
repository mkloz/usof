import { Category } from './category.entity';
import { PrismaClient } from '@prisma/client';
import {
  Paginated,
  PaginationOptionsDto,
  Paginator,
} from '../shared/pagination';
import { prisma } from '../db/prisma.client';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../utils/exceptions/exceptions';
import { CreateCategoryDto, UpdateCategoryDto } from './category.dto';
import { Post } from '../post/post.entity';

export class CategoryService {
  constructor(private readonly prisma: PrismaClient) {}

  async getMany(
    pag: PaginationOptionsDto,
    url: string,
  ): Promise<Paginated<Category>> {
    const tasks = await this.prisma.comment.findMany({
      take: pag.limit,
      skip: (pag.page - 1) * pag.limit,
    });

    return Paginator.paginate({
      data: tasks.map((task) => new Category(task)),
      page: pag.page,
      limit: pag.limit,
      route: url,
      count: await this.prisma.comment.count(),
    });
  }

  async getPosts(
    categoryId: number,
    pag: PaginationOptionsDto,
    url: string,
  ): Promise<Paginated<Post>> {
    const posts = await this.prisma.post.findMany({
      where: { categories: { some: { id: categoryId } } },
      take: pag.limit,
      skip: (pag.page - 1) * pag.limit,
    });

    return Paginator.paginate({
      data: posts.map((task) => new Post(task)),
      page: pag.page,
      limit: pag.limit,
      route: url,
      count: await this.prisma.post.count({
        where: { categories: { some: { id: categoryId } } },
      }),
    });
  }
  async getManyFromPost(
    postId: number,
    pag: PaginationOptionsDto,
    url: string,
  ): Promise<Paginated<Category>> {
    const categories = await this.prisma.category.findMany({
      where: { posts: { some: { id: postId } } },
      take: pag.limit,
      skip: (pag.page - 1) * pag.limit,
    });

    return Paginator.paginate({
      data: categories.map((task) => new Category(task)),
      page: pag.page,
      limit: pag.limit,
      route: url,
      count: await this.prisma.category.count({
        where: { posts: { some: { id: postId } } },
      }),
    });
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.update({
      where: { id },
      data: dto,
    });

    if (!category) {
      throw new NotFoundException('Category does not exist.');
    }

    return new Category(category);
  }

  async delete(id: number): Promise<Category> {
    const category = await this.prisma.category.delete({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category does not exist.');
    }

    return new Category(category);
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.create({
      data: dto,
    });

    if (!category) {
      throw new InternalServerErrorException('Cant create category.');
    }

    return new Category(category);
  }

  async get(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Category does not exist.');
    }

    return new Category(category);
  }
}

export const categoryService = new CategoryService(prisma);
