import { prisma } from '@/db/prisma.client';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../shared/exceptions/exceptions';
import { Paginated } from '../shared/pagination';
import {
  CreateCategoryDto,
  GetManyCategoryDto,
  UpdateCategoryDto,
} from './category.dto';
import { Category, PaginatedCategories } from './category.entity';

export class CategoryService {
  static include: Prisma.CategoryInclude = {
    _count: {
      select: { posts: true },
    },
  };
  constructor(private readonly prisma: PrismaClient) {}
  private getManyQuery(pag: GetManyCategoryDto): Prisma.CategoryFindManyArgs {
    return {
      take: pag.limit,
      skip: (pag.page - 1) * pag.limit,
      where: pag.search
        ? {
            OR: [
              {
                name: {
                  contains: pag.search,
                },
              },
              {
                description: {
                  contains: pag.search,
                },
              },
            ],
          }
        : undefined,
      include: CategoryService.include,
    };
  }

  async getPaginated(
    { page, limit, ...pag }: GetManyCategoryDto,
    url: string,
  ): Promise<Paginated<Category>> {
    const query = this.getManyQuery({ page, limit, ...pag });
    const categories = await this.prisma.category.findMany(query);

    return new PaginatedCategories(
      {
        data: categories,
        page: page,
        limit: limit,
        route: url,
        count: await this.prisma.category.count({ where: query.where }),
      },
      pag,
    );
  }

  async update(id: number, dto: UpdateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.update({
      where: { id },
      include: CategoryService.include,
      data: dto,
    });

    if (!category) {
      throw new NotFoundException('Category does not exist.');
    }

    return new Category(category);
  }

  async delete(id: number): Promise<Category> {
    const category = await this.prisma.category.delete({
      where: { id },
      include: CategoryService.include,
    });

    if (!category) {
      throw new NotFoundException('Category does not exist.');
    }

    return new Category(category);
  }

  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = await this.prisma.category.create({
      include: CategoryService.include,
      data: dto,
    });

    if (!category) {
      throw new InternalServerErrorException('Cant create category.');
    }

    return new Category(category);
  }

  async get(id: number): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: CategoryService.include,
    });

    if (!category) {
      throw new NotFoundException('Category does not exist.');
    }
    return new Category(category);
  }
}

export const categoryService = new CategoryService(prisma);
