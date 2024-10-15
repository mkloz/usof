import { ConfigCreator, Env } from './config';

export interface IMysqlConfig {
  port: number;
  host: string;
  password: string;
  username: string;
  dbName: string;
}
export interface IJWTOpt {
  secret: string;
  time: string;
}

export interface IJWTConfig {
  accessToken: IJWTOpt;
  refreshToken: IJWTOpt;
}
export interface IAWS {
  s3: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucketName: string;
  };
}

export interface IMail {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  from: {
    name: string;
    address: string;
  };
}
export interface IApiConfig {
  env: string;
  port: number;
  host: string;
  database: IMysqlConfig;
  jwt: IJWTConfig;
  aws: IAWS;
  mail: IMail;
}

export class ApiConfigService {
  private readonly config: IApiConfig;
  private static instance: ApiConfigService;

  constructor() {
    if (ApiConfigService.instance) {
      return ApiConfigService.instance;
    }
    this.config = new ConfigCreator().getConfig();

    return (ApiConfigService.instance = this);
  }

  public getEnv() {
    return this.config.env;
  }

  public getPort() {
    return this.config.port;
  }

  public getHost() {
    return this.config.host;
  }

  public isDevelopment(): boolean {
    return this.getEnv() === Env.DEVELOPMENT;
  }

  public isProduction(): boolean {
    return this.getEnv() === Env.PRODUCTION;
  }

  public isTest(): boolean {
    return this.getEnv() === Env.TEST;
  }

  public getConfig() {
    return this.config;
  }

  public getDB(): IMysqlConfig {
    return this.config.database;
  }

  public getAWS(): IAWS {
    return this.config.aws;
  }

  public getMail(): IMail {
    return this.config.mail;
  }
}

export const cs = new ApiConfigService();
