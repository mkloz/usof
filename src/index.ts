import 'module-alias/register';
import 'reflect-metadata';
import { UsofServer } from './app';
import { cs } from './config/api-config.service';
import { startupLogger } from './shared/loggers/logger';

function start() {
  try {
    const server = new UsofServer();

    server.start(cs.getPort());
  } catch (e) {
    startupLogger.error(e);
    process.exit(1);
  }
}

start();
