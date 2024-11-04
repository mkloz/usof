import { SortOrder } from '@/db/types';
import { IDValidator } from '@/shared/validators/common.validator';
import { PostStatus } from '@prisma/client';
import { z } from 'zod';
import { PaginationOptValidator } from '../shared/pagination/pagination-option.validator';

export const CreatePostDtoValidator = z.object({
  title: z.string().min(2),
  content: z.string().min(2),
  status: z
    .enum([PostStatus.PUBLISHED, PostStatus.DRAFT, PostStatus.PRIVATE])
    .optional(),
});
export type CreatePostDto = z.infer<typeof CreatePostDtoValidator>;

export const UpdatePostDtoValidator = CreatePostDtoValidator.partial();
export type UpdatePostDto = z.infer<typeof UpdatePostDtoValidator>;

export const GetManyPostsDtoValidator = PaginationOptValidator.extend({
  categoryId: IDValidator.optional(),
  status: z.enum([PostStatus.ARCHIVED, PostStatus.PUBLISHED]).optional(),
  fromDate: z.coerce.date().optional(),
  tillDate: z.coerce.date().optional(),
  search: z.string().optional(),
  userId: IDValidator.optional(),
  sortByLikes: z.nativeEnum(SortOrder).optional(),
  sortByDate: z.nativeEnum(SortOrder).optional(),
});
export type GetManyPostsDto = z.infer<typeof GetManyPostsDtoValidator>;
