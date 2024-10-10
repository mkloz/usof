import { NextFunction, Request, Response } from 'express';
import { JwtAuthService, jwtService } from '../jwt/jwt.service';
import { JwtAuthPayload } from '../jwt/jwt-payload.dto';
import { userService } from '../../user/user.service';
import { ForbiddenException } from '../../utils/exceptions/exceptions';

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
