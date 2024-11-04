import { BadRequestException } from '@/shared/exceptions/exceptions';
import { Request, RequestHandler, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';

export function or(...args: RequestHandler[]) {
  if (args.length < 1) {
    throw new Error('The args array must contain at least one RequestHandler.');
  }
  return async (req: Request, res: Response, next: NextFunction) => {
    const errors: Error[] = [];

    for (const arg of args) {
      try {
        await arg(req, res, next);
        return;
      } catch (error) {
        if (error instanceof Error) {
          errors.push(error);
        }
        continue;
      }
    }
    throw new BadRequestException(errors.map((error) => error.message).join());
  };
}
