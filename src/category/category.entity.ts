import { Category as ICategory } from '@prisma/client';

export class Category implements ICategory {
  id: number;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<Category>) {
    Object.assign(this, data);
  }
}
