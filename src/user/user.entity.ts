import { Rating, UserRole } from '@prisma/client';
import { User as IUser } from '@prisma/client';
import { File } from '../file/file.entity';
import { Comment } from '../comment/comment.entity';
import { Post } from '../post/post.entity';

export class User implements Omit<IUser, 'passwordHash'> {
  id: number;
  email: string;
  fullName: string;
  passwordHash?: string;
  emailVerified: boolean;
  rating: number | null;
  role: UserRole;
  avatarId: number | null;
  createdAt: Date;
  updatedAt: Date;

  posts?: Post[];
  avatar?: File | null;
  ratings?: Rating[];
  comments?: Comment[];

  constructor(data: Partial<User>) {
    Object.assign(this, data);

    this.passwordHash = undefined;

    if (this.posts?.length) {
      this.posts = data.posts?.map((post) => new Post(post));
    }

    if (this.comments?.length) {
      this.comments = this.comments.map((comment) => new Comment(comment));
    }

    if (this.avatar) {
      this.avatar = new File(this.avatar);
    }
  }
}
