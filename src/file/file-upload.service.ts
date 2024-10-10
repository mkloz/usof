import { v4 as uuid } from 'uuid';
import { Readable } from 'stream';
import {
  DeleteObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { ApiConfigService, cs, IAWS } from '../config/api-config.service';
import { IFile } from './file.interface';

export const S3_ARTICLE_PHOTO_DIR = 'article/photos';

export class FileS3Service {
  private readonly aws: IAWS;

  public constructor(
    private readonly cs: ApiConfigService,
    private readonly s3: S3Client,
  ) {
    this.aws = this.cs.getAWS();
  }

  public async addFile(file: IFile) {
    const params: PutObjectCommandInput = {
      Bucket: this.aws.s3.bucketName,
      Body: Readable.from(file.buffer),
      Key: `${S3_ARTICLE_PHOTO_DIR}/${uuid()}-${file.originalname}`,
      ContentDisposition: 'inline',
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    await new Upload({ client: this.s3, params }).done();

    return {
      name: params.Key || uuid(),
      url: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`,
    };
  }

  public async removeFile(name: string) {
    await this.s3.send(
      new DeleteObjectCommand({
        Bucket: this.aws.s3.bucketName,
        Key: `${S3_ARTICLE_PHOTO_DIR}/${name}`,
      }),
    );
  }
}

export const fileS3Service = new FileS3Service(
  cs,
  new S3Client({
    region: cs.getAWS().s3.region,
    credentials: {
      accessKeyId: cs.getAWS().s3.accessKeyId,
      secretAccessKey: cs.getAWS().s3.secretAccessKey,
    },
  }),
);
