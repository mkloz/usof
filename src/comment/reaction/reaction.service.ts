import { prisma } from '@/db/prisma.client';
import { Reaction } from '@/post/reaction/reaction.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@/shared/exceptions/exceptions';
import { PrismaClient, RatingType } from '@prisma/client';

export class CommentReactionService {
  constructor(private prisma: PrismaClient) {}

  async get(commentId: number, userId: number): Promise<Reaction> {
    const myLike = await this.prisma.rating.findFirst({
      where: { userId, commentId },
    });
    if (!myLike) {
      throw new NotFoundException('Rating does not exist.');
    }
    return new Reaction(myLike);
  }

  async update(
    commentId: number,
    userId: number,
    type: RatingType,
  ): Promise<Reaction> {
    const count = await this.prisma.rating.updateMany({
      where: { userId, commentId },
      data: { type },
    });
    if (!count) {
      throw new NotFoundException('Rating does not exist.');
    }

    return this.get(commentId, userId);
  }

  async create(
    commentId: number,
    userId: number,
    type: RatingType,
  ): Promise<Reaction> {
    const myLike = await this.prisma.rating.create({
      data: {
        userId,
        commentId,
        type,
      },
    });

    if (!myLike) {
      throw new InternalServerErrorException('Cant rate comment.');
    }

    return new Reaction(myLike);
  }

  async delete(commentId: number, userId: number): Promise<void> {
    const myLike = await this.prisma.rating.deleteMany({
      where: { userId, commentId },
    });
    if (!myLike || myLike.count === 0) {
      throw new InternalServerErrorException('Cant delete comment rate.');
    }
  }
}

export const commentReactionService = new CommentReactionService(prisma);
