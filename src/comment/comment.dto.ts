import { SortOrder } from '@/db/types';
import { IDValidator } from '@/shared/validators/common.validator';
import { z } from 'zod';
import { PaginationOptValidator } from '../shared/pagination/pagination-option.validator';
export const CreateCommentDtoValidator = z.object({
  content: z.string().min(1),
  parentId: IDValidator.optional(),
});

export type CreateCommentDto = z.infer<typeof CreateCommentDtoValidator>;

export const UpdateCommentDtoValidator = z.object({
  content: z.string().min(1).optional(),
});

export type UpdateCommentDto = z.infer<typeof UpdateCommentDtoValidator>;

export const GetManyCommentsDtoValidator = PaginationOptValidator.extend({
  postId: IDValidator.optional(),
  userId: IDValidator.optional(),
  parentId: IDValidator.optional(),
  sortByLikes: z.nativeEnum(SortOrder).optional(),
  sortByDate: z.nativeEnum(SortOrder).optional(),
});

export type GetManyCommentsDto = z.infer<typeof GetManyCommentsDtoValidator>;
