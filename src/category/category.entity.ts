import { Paginated } from '@/shared/pagination';
import { Category as ICategory } from '@prisma/client';
import {
  ClassTransformOptions,
  plainToClassFromExist,
  Type,
} from 'class-transformer';

export class Category implements ICategory {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  _count?: Record<string, number>;

  constructor(data: Category, options?: ClassTransformOptions) {
    plainToClassFromExist(this, data, options);
  }
}

export class PaginatedCategories extends Paginated<Category> {
  @Type(() => Category)
  items: Category[];
}
