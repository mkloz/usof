import { IDValidator } from '@/shared/validators/common.validator';
import { UserRole } from '@prisma/client';
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

export const UpdateMeDtoValidator = z.object({
  fullName: z.string().min(2).optional(),
  avatarId: IDValidator.optional().nullable(),
});
export type UpdateMeDto = z.infer<typeof UpdateMeDtoValidator>;

export const UpdateUserDtoValidator = UpdateMeDtoValidator.extend({
  role: z.nativeEnum(UserRole).optional(),
});

export type UpdateUserDto = z.infer<typeof UpdateUserDtoValidator>;
export const UpdatePasswordDtoValidator = z.object({
  oldPassword: PasswordValidator,
  newPassword: PasswordValidator,
});

export type UpdatePasswordDto = z.infer<typeof UpdatePasswordDtoValidator>;

export const MakePostFavoriteDtoValidator = z.object({
  postId: IDValidator,
});
export type MakePostFavoriteDto = z.infer<typeof MakePostFavoriteDtoValidator>;
