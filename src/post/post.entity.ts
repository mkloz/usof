import { PostStatus } from '@prisma/client';
import { Post as IPost } from '@prisma/client';
import { Comment } from '../comment/comment.entity';
import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { File } from '../file/file.entity';

export class Post implements IPost {
  id: number;
  title: string;
  content: string;
  authorId: number | null;
  status: PostStatus;
  createdAt: Date;
  updatedAt: Date;
  rating: number | null;

  author?: User | null;
  comments?: Comment[];
  categories?: Category[];
  pictures?: File[];

  constructor(data: Partial<Post>) {
    Object.assign(this, data);

    if (this.comments?.length) {
      this.comments = this.comments.map((comment) => new Comment(comment));
    }

    if (this.author) {
      this.author = new User(this.author);
    }

    if (this.categories?.length) {
      this.categories = this.categories.map(
        (category) => new Category(category),
      );
    }

    if (this.pictures?.length) {
      this.pictures = data.pictures?.map((picture) => {
        return new File(picture);
      });
    }
  }
}
