import { ForbiddenException } from '@/shared/exceptions/exceptions';
import { userService } from '@/user/user.service';
import { NextFunction, Request, Response } from 'express';
import { JwtAuthPayload } from '../jwt/jwt-payload.dto';
import { JwtAuthService, jwtService } from '../jwt/jwt.service';

export async function admin(req: Request, _res: Response, next: NextFunction) {
  const payload = parseAuthToken(req);

  const user = await userService.get({ id: payload.userId });

  if (!user) {
    throw new ForbiddenException(
      "You don't have permission to access this resource",
    );
  }
  next();
}

export function parseAuthToken(req: Request): JwtAuthPayload {
  const token = JwtAuthService.extractJwtToken(req);

  return jwtService.decodeAccessToken(token);
}
