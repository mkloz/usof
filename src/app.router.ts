import { authRouter } from '@/auth/auth.router';
import { commentRouter } from '@/comment/comment.router';
import { fileRouter } from '@/file/file.router';
import { postRouter } from '@/post/post.router';
import { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { DOCS_PATH } from './app';
import { categoryRouter } from './category/category.router';
import { startupLogger } from './shared/loggers/logger';
import { userRouter } from './user/user.router';
import StringHelper from './utils/helpers/string';

export class AppRouter {
  public static routersV1: Record<string, Router> = {
    userRouter,
    authRouter,
    postRouter,
    commentRouter,
    fileRouter,
    categoryRouter,
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
