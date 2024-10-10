import dotenv from 'dotenv';
import { z } from 'zod';
import { IApiConfig } from './api-config.service';
import { v4 as uuidV4 } from 'uuid';

export enum Env {
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
  TEST = 'test',
}

type IEnvConfig = z.infer<typeof EnvSchema>;

export const EnvSchema = z.object({
  PORT: z.coerce.number().nonnegative().default(3000),
  NODE_ENV: z.nativeEnum(Env).default(Env.PRODUCTION),
  JWT_ACCESS_TOKEN_SECRET: z.string().min(6).default(uuidV4()),
  JWT_ACCESS_TOKEN_TIME: z.string().default('30m'),
  JWT_REFRESH_TOKEN_SECRET: z.string().min(6).default(uuidV4()),
  JWT_REFRESH_TOKEN_TIME: z.string().default('7d'),
  SELF_HOST: z.string().min(2),
  DB_PORT: z.coerce.number().nonnegative().min(0).max(65535),
  DB_HOST: z.string().min(2),
  DB_PASS: z.string().min(2),
  DB_USER: z.string().min(1),
  DB_NAME: z.string().min(1),
  DATABASE_URL: z.string().min(8),
  AWS_S3_REGION: z.string().min(2),
  AWS_S3_ACCESS_KEY_ID: z.string().min(2),
  AWS_S3_SECRET_ACCESS_KEY: z.string().min(2),
  AWS_PUBLIC_BUCKET_NAME: z.string().min(2),
  MAIL_HOST: z.string().min(2),
  MAIL_PORT: z.coerce.number().min(0).max(65535).default(465),
  MAIL_SECURE: z
    .enum(['true', 'false'])
    .default('true')
    .transform((value) => value === 'true'),
  MAIL_AUTH_USER: z.string().min(2),
  MAIL_AUTH_PASS: z.string().min(2),
  MAIL_FROM_ADDRESS: z.string().min(2),
  MAIL_FROM_NAME: z.string().min(2),
});

export class ConfigCreator {
  private config: IApiConfig;

  constructor() {
    dotenv.config();

    const env = this.validate(process.env);

    this.config = this.map(env);
  }

  public validate(config: unknown): IEnvConfig {
    return EnvSchema.parse(config);
  }

  public map(env: IEnvConfig): IApiConfig {
    return {
      env: env.NODE_ENV,
      port: env.PORT,
      host: env.SELF_HOST,
      jwt: {
        accessToken: {
          secret: env.JWT_ACCESS_TOKEN_SECRET,
          time: env.JWT_ACCESS_TOKEN_TIME,
        },
        refreshToken: {
          secret: env.JWT_REFRESH_TOKEN_SECRET,
          time: env.JWT_REFRESH_TOKEN_TIME,
        },
      },
      mail: {
        host: env.MAIL_HOST,
        port: env.MAIL_PORT,
        secure: env.MAIL_SECURE,
        auth: {
          user: env.MAIL_AUTH_USER,
          pass: env.MAIL_AUTH_PASS,
        },
        from: {
          name: env.MAIL_FROM_NAME,
          address: env.MAIL_FROM_ADDRESS ?? (env.MAIL_AUTH_USER || ''),
        },
      },
      database: {
        port: env.DB_PORT,
        host: env.DB_HOST,
        password: env.DB_PASS,
        username: env.DB_USER,
        dbName: env.DB_NAME,
      },
      aws: {
        s3: {
          region: env.AWS_S3_REGION,
          accessKeyId: env.AWS_S3_ACCESS_KEY_ID,
          secretAccessKey: env.AWS_S3_SECRET_ACCESS_KEY,
          bucketName: env.AWS_PUBLIC_BUCKET_NAME,
        },
      },
    };
  }

  getConfig(): IApiConfig {
    return this.config;
  }
}
