import { NextFunction, Request, RequestHandler, Response } from 'express';

export function and(args: RequestHandler[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (args.length < 1) {
      throw new Error(
        'The args array must contain at least one RequestHandler.',
      );
    }

    for (const arg of args) {
      await arg(req, res, () => {});
    }
    next();
  };
}
