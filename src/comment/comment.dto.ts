import { RatingType } from '@prisma/client';
import { z } from 'zod';

export const CreateCommentDtoValidator = z.object({
  content: z.string().min(1),
});

export type CreateCommentDto = z.infer<typeof CreateCommentDtoValidator>;

export const UpdateCommentDtoValidator = z.object({
  content: z.string().min(1),
});

export type UpdateCommentDto = z.infer<typeof UpdateCommentDtoValidator>;

export const CreateCommentLikeDtoValidator = z.object({
  type: z.nativeEnum(RatingType),
});

export type CreateCommentLikeDto = z.infer<typeof CreateCommentDtoValidator>;
