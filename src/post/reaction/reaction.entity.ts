import { Paginated } from '@/shared/pagination';
import { Rating as IRating, RatingType } from '@prisma/client';
import {
  ClassTransformOptions,
  plainToClassFromExist,
  Type,
} from 'class-transformer';

export class Reaction implements IRating {
  id: number;
  createdAt: Date;
  type: RatingType;
  userId: number;
  postId: number | null;
  commentId: number | null;

  constructor(data: Reaction, options?: ClassTransformOptions) {
    plainToClassFromExist(this, data, options);
  }
}
export class PaginatedReactions extends Paginated<Reaction> {
  @Type(() => Reaction)
  items: Reaction[];
}
