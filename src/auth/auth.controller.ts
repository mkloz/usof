import { authService } from '@/auth/services/auth.service';
import { prisma } from '@/db/prisma.client';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import {
  BadRequestException,
  ConflictException,
  UnprocessableEntityException,
} from '../shared/exceptions/exceptions';
import { userService } from '../user/user.service';
import {
  LoginDtoValidator,
  RegisterDtoValidator,
  ResetPasswordDtoValidator,
  SendEmailVerificationDtoValidator,
  TokenDtoValidator,
  VerifyEmailDtoValidator,
} from './auth.dto';
import { jwtService } from './jwt/jwt.service';

export class AuthController {
  public static async login(req: Request, res: Response) {
    const dto = LoginDtoValidator.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: dto.email } });

    if (!user || !userService.verify(user.id, dto.password)) {
      throw new BadRequestException('Invalid email or password');
    }

    if (!user.emailVerified) {
      throw new UnprocessableEntityException('Email is not verified');
    }

    const tokens = jwtService.generateTokens({ userId: user.id });

    res.status(StatusCodes.OK).json(tokens);
  }

  public static async register(req: Request, res: Response) {
    const dto = RegisterDtoValidator.parse(req.body);
    const userFromDB = await userService.getSafe({ email: dto.email });

    if (userFromDB) {
      if (!userFromDB.emailVerified) {
        await authService.sendEmailVerification(userFromDB.email);
        throw new ConflictException(
          'User was already registered. Verification email was sent',
        );
      }
      throw new BadRequestException('User was already registered');
    }

    const user = await userService.create(dto);

    if (!user) {
      throw new UnprocessableEntityException('User was not created');
    }
    await authService.sendEmailVerification(user.email);
    res.status(StatusCodes.CREATED).json(user);
  }

  public static async refresh(req: Request, res: Response) {
    const dto = TokenDtoValidator.parse(req.body);
    const { userId } = jwtService.decodeRefreshToken(dto.token);
    const tokens = jwtService.generateTokens({ userId });

    res.status(StatusCodes.OK).json(tokens);
  }

  public static async sendVerification(req: Request, res: Response) {
    const { email } = SendEmailVerificationDtoValidator.parse(req.body);

    await authService.sendEmailVerification(email);

    res.status(StatusCodes.NO_CONTENT).end();
  }

  public static async verifyEmail(req: Request, res: Response) {
    const { email, code } = VerifyEmailDtoValidator.parse(req.body);
    await authService.verifyEmail(email, code);

    res.status(StatusCodes.NO_CONTENT).end();
  }

  public static async sendPasswordReset(req: Request, res: Response) {
    const { email } = SendEmailVerificationDtoValidator.parse(req.body);

    await authService.sendPasswordReset(email);

    res.status(StatusCodes.NO_CONTENT).end();
  }

  public static async resetPassword(req: Request, res: Response) {
    const { email, code, password } = ResetPasswordDtoValidator.parse(req.body);

    await authService.resetPassword(email, code, password);

    res.status(StatusCodes.NO_CONTENT).end();
  }
}
