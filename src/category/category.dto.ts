import { PaginationOptValidator } from '@/shared/pagination/pagination-option.validator';
import { z } from 'zod';

export const CreateCategoryDtoValidator = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategoryDtoValidator>;

export const UpdateCategoryDtoValidator = CreateCategoryDtoValidator.partial();

export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDtoValidator>;

export const GetManyCategoryDtoValidator = PaginationOptValidator.extend({
  search: z.string().optional(),
});

export type GetManyCategoryDto = z.infer<typeof GetManyCategoryDtoValidator>;
