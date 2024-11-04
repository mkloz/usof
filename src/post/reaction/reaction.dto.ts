import { RatingType } from '@prisma/client';
import { z } from 'zod';

export const CreatePostReactionDtoValidator = z.object({
  type: z.nativeEnum(RatingType),
});
