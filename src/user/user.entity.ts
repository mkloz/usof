import { Comment } from '@/comment/comment.entity';
import { File } from '@/file/file.entity';
import { Post } from '@/post/post.entity';
import { Rating } from '@/post/post.service';
import { Paginated } from '@/shared/pagination';
import { User as IUser, UserRole } from '@prisma/client';
import {
  ClassTransformOptions,
  Exclude,
  Expose,
  plainToClassFromExist,
  Type,
} from 'class-transformer';

export class User implements Omit<IUser, 'passwordHash' | 'email'> {
  id: number;
  fullName: string;
  emailVerified: boolean;
  rating: number | null;
  role: UserRole;
  avatarId: number | null;
  createdAt: Date;
  updatedAt: Date;

  @Expose({ groups: [UserRole.ADMIN, 'ME'] })
  email?: string;
  @Exclude()
  passwordHash?: string;

  @Type(() => Post)
  posts?: Post[];
  @Type(() => File)
  avatar?: File | null;
  @Type(() => Rating)
  ratings?: Rating[];
  @Type(() => Comment)
  comments?: Comment[];

  constructor(data: User, options?: ClassTransformOptions) {
    plainToClassFromExist(this, data, options);
  }
}

export class PaginatedUsers extends Paginated<User> {
  @Type(() => User)
  items: User[];
}
