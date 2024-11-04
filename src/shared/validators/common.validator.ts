import { z } from 'zod';

export const IDValidator = z.coerce.number().int().positive();

export const IdDtoValidator = z.object({
  id: IDValidator,
});
