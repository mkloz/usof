import { PostStatus, RatingType } from '@prisma/client';
import { z } from 'zod';
import { PaginationOptValidator } from '../shared/pagination/pagination-option.validator';
import { SortOrder } from '../db/types';

export const CreatePostDtoValidator = z.object({
  title: z.string().min(2),
  content: z.string().min(2),
});
export type CreatePostDto = z.infer<typeof CreatePostDtoValidator>;

export const UpdatePostDtoValidator = z.object({
  title: z.string().min(2),
  content: z.string().min(2),
});
export type UpdatePostDto = z.infer<typeof UpdatePostDtoValidator>;
export const CreatePostLikeDtoValidator = z.object({
  type: z.nativeEnum(RatingType),
});

export const GetManyPostsDtoValidator = PaginationOptValidator.extend({
  categoryId: z.coerce.number().positive().optional(),
  status: z.nativeEnum(PostStatus).optional(),
  fromDate: z.coerce.date().optional(),
  tillDate: z.coerce.date().optional(),
  search: z.string().optional(),
  userId: z.coerce.number().positive().optional(),
  sortByLikes: z.nativeEnum(SortOrder).optional(),
  sortByDate: z.nativeEnum(SortOrder).optional(),
});
export type GetManyPostsDto = z.infer<typeof GetManyPostsDtoValidator>;
