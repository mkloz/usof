import express, { Application } from 'express';
import { ExceptionFilter } from './utils/exceptions/exception.filter';
import cors from 'cors';
import { GLOBAL_PREFIX } from './utils/prefix/global-prefix';
import { ApiVersion } from './utils/prefix/version-prefix.enum';
import { AppRouter } from './app.router';
import { requestLogger } from './shared/loggers/request-logger.middleware';
import { startupLogger } from './shared/loggers/logger';
import OpenApiDocs from './docs/open-api-docs';
import { startScheduleService } from './db/schedule';

export const DOCS_PATH = '/api/docs';

export class UsofServer {
  private server: Application;

  public constructor() {
    this.server = UsofServer.create();
  }

  public static create(): Application {
    const app = express();

    app.use(cors());
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
