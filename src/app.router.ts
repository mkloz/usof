import { Request, Response, Router } from 'express';
import { userRouter } from './user/user.router';
import { authRouter } from './auth/auth.router';
import { startupLogger } from './shared/loggers/logger';
import StringHelper from './utils/helpers/string';
import { postRouter } from './post/post.router';
import { commentRouter } from './comment/comment.router';
import { StatusCodes } from 'http-status-codes';
import { DOCS_PATH } from './app';

export class AppRouter {
  public static routersV1: Record<string, Router> = {
    userRouter,
    authRouter,
    postRouter,
    commentRouter,
  };

  static greeting(_req: Request, res: Response) {
    res.status(StatusCodes.OK).json({
      message: 'Hi there! Are you for real?',
      github: 'https://github.com/mkloz',
      docs: DOCS_PATH,
    });
  }

  static routeV1(): Router {
    const router: Router = Router();

    for (const [key, value] of Object.entries(AppRouter.routersV1)) {
      router.use(value);
      startupLogger.info(`${StringHelper.capitalize(key)} was set up`);
    }

    return router;
  }
}
