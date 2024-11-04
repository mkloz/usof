import { RatingType } from '@prisma/client';
import { z } from 'zod';

export const CreateCommentReactionDtoValidator = z.object({
  type: z.nativeEnum(RatingType),
});
