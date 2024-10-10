import { File as IFile } from '@prisma/client';

export class File implements IFile {
  id: number;
  name: string;
  url: string | null;
  createdAt: Date;

  constructor(data: Partial<File>) {
    Object.assign(this, data);
  }
}
