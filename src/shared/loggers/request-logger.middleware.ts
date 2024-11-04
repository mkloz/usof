import { cs } from '@/config/api-config.service';
import logger from 'morgan';
import { Logger } from './logger';

export function requestLogger() {
  const log = new Logger('Request');

  return logger(cs.isDevelopment() ? 'dev' : 'short', {
    stream: {
      write: function (msg: string) {
        log.info(msg.trimEnd());
      },
    },
  });
}
