import { Comment } from '@/comment/comment.entity';
import { File } from '@/file/file.entity';
import { Paginated } from '@/shared/pagination';
import { Post as IPost, PostStatus } from '@prisma/client';
import {
  ClassTransformOptions,
  plainToClassFromExist,
  Type,
} from 'class-transformer';
import { Category } from '../category/category.entity';
import { User } from '../user/user.entity';

export class Post implements IPost {
  id: number;
  title: string;
  content: string;
  authorId: number | null;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  rating: number | null;

  @Type(() => User)
  author?: User | null;
  @Type(() => Comment)
  comments?: Comment[];
  @Type(() => Category)
  categories?: Category[];
  @Type(() => File)
  pictures?: File[];

  _count?: Record<string, number>;

  constructor(data: Post, options?: ClassTransformOptions) {
    plainToClassFromExist(this, data, options);
  }
}
export class PaginatedPosts extends Paginated<Post> {
  @Type(() => Post)
  items: Post[];
}
