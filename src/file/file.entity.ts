import { Paginated } from '@/shared/pagination';
import { File as IFile } from '@prisma/client';
import {
  ClassTransformOptions,
  plainToClassFromExist,
  Type,
} from 'class-transformer';

export class File implements IFile {
  id: number;
  name: string;
  url: string | null;
  createdAt: Date;

  constructor(data: File, options?: ClassTransformOptions) {
    plainToClassFromExist(this, data, options);
  }
}
export class PaginatedFiles extends Paginated<File> {
  @Type(() => File)
  items: File[];
}
