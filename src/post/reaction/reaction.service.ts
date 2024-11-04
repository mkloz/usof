import { prisma } from '@/db/prisma.client';
import { Reaction } from '@/post/reaction/reaction.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@/shared/exceptions/exceptions';
import { PrismaClient, RatingType } from '@prisma/client';

export class PostReactionService {
  constructor(private prisma: PrismaClient) {}

  async get(postId: number, userId: number): Promise<Reaction> {
    const myLike = await this.prisma.rating.findFirst({
      where: { userId, postId },
    });
    if (!myLike) {
      throw new NotFoundException('Rating does not exist.');
    }
    return new Reaction(myLike);
  }

  async update(
    postId: number,
    userId: number,
    type: RatingType,
  ): Promise<Reaction> {
    const count = await this.prisma.rating.updateMany({
      where: { userId, postId },
      data: { type },
    });
    if (!count) {
      throw new NotFoundException('Rating does not exist.');
    }

    return this.get(postId, userId);
  }

  async create(
    postId: number,
    userId: number,
    type: RatingType,
  ): Promise<Reaction> {
    const myLike = await this.prisma.rating.create({
      data: {
        userId,
        postId,
        type,
      },
    });

    if (!myLike) {
      throw new InternalServerErrorException('Cant rate post.');
    }

    return new Reaction(myLike);
  }

  async delete(postId: number, userId: number): Promise<void> {
    const myLike = await this.prisma.rating.deleteMany({
      where: { userId, postId },
    });

    if (!myLike || myLike.count === 0) {
      throw new InternalServerErrorException('Cant delete post rate.');
    }
  }
}

export const postReactionService = new PostReactionService(prisma);
