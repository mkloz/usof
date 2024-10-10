import { Request } from 'express';
import { format } from 'url';
import { cs } from '../../config/api-config.service';

export class Helper {
  private static instance: Helper;

  constructor() {
    if (Helper.instance) {
      return Helper.instance;
    }
    Helper.instance = this;
  }

  static getInstance() {
    return Helper.instance;
  }

  static getFullUrl(req: Request) {
    const [pathname] = req.originalUrl.split('?');

    return format({
      protocol: req.protocol,
      host: cs.getHost(),
      pathname: pathname,
    });
  }

  static getPathname(req: Request) {
    return req.baseUrl + req.path;
  }

  public static objToQuery(
    obj: Record<string, string | number | boolean | undefined | Date>,
  ): string {
    return Object.keys(obj)
      .filter((k) => obj[k] !== undefined)
      .map(
        (k) =>
          `${encodeURIComponent(k)}=${encodeURIComponent(obj[k]?.toString() || '')}`,
      )
      .join('&');
  }
}
