import { startScheduleService } from '@/db/schedule';
import { limiter } from '@/shared/middlewares/rate-limiter';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';
import { AppRouter } from './app.router';
import OpenApiDocs from './docs/open-api-docs';
import { ExceptionFilter } from './shared/exceptions/exception.filter';
import { startupLogger } from './shared/loggers/logger';
import { requestLogger } from './shared/loggers/request-logger.middleware';
import { GLOBAL_PREFIX } from './utils/prefix/global-prefix';
import { ApiVersion } from './utils/prefix/version-prefix.enum';

export const DOCS_PATH = '/api/docs';

export class UsofServer {
  private server: Application;

  public constructor() {
    this.server = UsofServer.create();
  }

  public static create(): Application {
    const app = express();

    app.disable('x-powered-by');
    app.use(limiter);
    app.use(cors());
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(requestLogger());
    app.all('/', AppRouter.greeting);
    app.use(`/${GLOBAL_PREFIX}/${ApiVersion.FIRST}`, AppRouter.routeV1());

    OpenApiDocs.setup(app, DOCS_PATH);
    startupLogger.info('RouterV1 was successfully set up');

    app.use(ExceptionFilter.throwNotFound);
    app.use(ExceptionFilter.handle);

    startupLogger.info('App was successfully created');

    return app;
  }

  public start(port?: number | string) {
    port = port ? port : process.env.PORT || 3000;

    startScheduleService();
    return this.server.listen(port, () => {
      startupLogger.info(`Server is running on http://localhost:${port}`);
    });
  }
}
