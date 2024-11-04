import { Paginated } from '@/shared/pagination';
import { Comment as IComment } from '@prisma/client';
import {
  ClassTransformOptions,
  plainToClassFromExist,
  Type,
} from 'class-transformer';
import { User } from '../user/user.entity';

export class Comment implements IComment {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  rating: number | null;
  postId: number;
  parentId: number | null;

  @Type(() => Comment)
  subComments?: Comment[];
  @Type(() => User)
  user?: User | null;

  _count?: Record<string, number>;

  constructor(data: Comment, options?: ClassTransformOptions) {
    plainToClassFromExist(this, data, options);
  }
}

export class PaginatedComments extends Paginated<Comment> {
  @Type(() => Comment)
  items: Comment[];
}
