import { z } from 'zod';

export const PasswordValidator = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(50, 'Password must be less than 50 characters long')
  .regex(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/,
    'Password must contain at least one uppercase letter, one lowercase letter, one digit, and one special character',
  );

export const CreateUserDtoValidator = z.object({
  email: z.string().email(),
  fullName: z.string().min(2),
  password: PasswordValidator,
  avatarId: z.number().int().positive().optional().nullable(),
});
export type CreateUserDto = z.infer<typeof CreateUserDtoValidator>;

export const UpdateUserDtoValidator = z.object({
  fullName: z.string().min(2).optional(),
  password: PasswordValidator.optional(),
  avatarId: z.number().int().positive().optional().nullable(),
});
export type UpdateUserDto = z.infer<typeof UpdateUserDtoValidator>;

export const MakePostFavoriteDtoValidator = z.object({
  postId: z.number().int().positive(),
});
export type MakePostFavoriteDto = z.infer<typeof MakePostFavoriteDtoValidator>;
