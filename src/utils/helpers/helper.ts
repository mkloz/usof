import { Request } from 'express';

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
