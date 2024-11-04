import { CreateUserDtoValidator, PasswordValidator } from '@/user/user.dto';
import { z } from 'zod';

export const TokenDtoValidator = z.object({
  token: z.string(),
});
export type TokenDto = z.infer<typeof TokenDtoValidator>;

export const LoginDtoValidator = z.object({
  email: z.string().email(),
  password: PasswordValidator,
});

export const RegisterDtoValidator = CreateUserDtoValidator;

export const ResetPasswordDtoValidator = z.object({
  code: z.string().min(6),
  email: z.string().email(),
  password: PasswordValidator,
});
export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoValidator>;

export const VerifyEmailDtoValidator = z.object({
  code: z.string().min(6),
  email: z.string().email(),
});

export type VerifyEmailDto = z.infer<typeof VerifyEmailDtoValidator>;

export const SendEmailVerificationDtoValidator = z.object({
  email: z.string().email(),
});

export type SendEmailVerificationDto = z.infer<
  typeof SendEmailVerificationDtoValidator
>;
