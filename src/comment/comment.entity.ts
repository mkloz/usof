import { Comment as IComment } from '@prisma/client';
import { User } from '../user/user.entity';

export class Comment implements IComment {
  id: number;
  userId: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  rating: number | null;
  postId: number;

  user?: User | null;

  constructor(data: Partial<Comment>) {
    Object.assign(this, data);

    if (data.user) {
      this.user = new User(data.user);
    }
  }
}
