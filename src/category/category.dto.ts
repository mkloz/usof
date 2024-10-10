import { z } from 'zod';

export const CreateCategoryDtoValidator = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
});

export type CreateCategoryDto = z.infer<typeof CreateCategoryDtoValidator>;

export const UpdateCategoryDtoValidator = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
});

export type UpdateCategoryDto = z.infer<typeof UpdateCategoryDtoValidator>;
