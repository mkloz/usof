import { Comment } from './comment.entity';
import { Prisma, PrismaClient, Rating, RatingType } from '@prisma/client';
import {
  Paginated,
  PaginationOptionsDto,
  Paginator,
} from '../shared/pagination';
import { prisma } from '../db/prisma.client';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../utils/exceptions/exceptions';
import { CreateCommentDto, UpdateCommentDto } from './comment.dto';

class CommentRating {
  myLike?: Rating | null;
  likes: number;
  dislikes: number;

  constructor(comment: Partial<CommentRating>) {
    Object.assign(this, comment);
  }
}

export class CommentService {
  static readonly include: Prisma.CommentInclude = {
    user: true,
  };
  constructor(private readonly prisma: PrismaClient) {}

  async getMany(
    pag: PaginationOptionsDto,
    url: string,
  ): Promise<Paginated<Comment>> {
    const comments = await this.prisma.comment.findMany({
      take: pag.limit,
      include: CommentService.include,
      skip: (pag.page - 1) * pag.limit,
    });

    return Paginator.paginate({
      data: comments.map((task) => new Comment(task)),
      page: pag.page,
      limit: pag.limit,
      route: url,
      count: await this.prisma.comment.count(),
    });
  }

  async update(id: number, dto: UpdateCommentDto): Promise<Comment> {
    const comment = await this.prisma.comment.update({
      where: { id },
      include: CommentService.include,
      data: dto,
    });

    if (!comment) {
      throw new NotFoundException('Comment does not exist.');
    }

    return new Comment(comment);
  }

  async delete(id: number): Promise<Comment> {
    const comment = await this.prisma.comment.delete({
      where: { id },
      include: CommentService.include,
    });

    if (!comment) {
      throw new NotFoundException('Comment does not exist.');
    }

    return new Comment(comment);
  }

  async create(
    userId: number,
    postId: number,
    dto: CreateCommentDto,
  ): Promise<Comment> {
    const comment = await this.prisma.comment.create({
      data: { userId, postId, ...dto },
      include: CommentService.include,
    });

    if (!comment) {
      throw new InternalServerErrorException('Cant create comment.');
    }

    return new Comment(comment);
  }

  async get(id: number): Promise<Comment> {
    const comment = await this.prisma.comment.findUnique({
      where: { id },
      include: CommentService.include,
    });

    if (!comment) {
      throw new NotFoundException('Comment does not exist.');
    }

    return new Comment(comment);
  }

  async getRating(commentId: number, userId: number): Promise<CommentRating> {
    const myLike = await this.prisma.rating.findFirst({
      where: { userId, commentId },
    });
    const likes = await this.prisma.rating.count({
      where: { commentId, type: RatingType.LIKE },
    });
    const dislikes = await this.prisma.rating.count({
      where: { commentId, type: RatingType.DISLIKE },
    });

    return new CommentRating({ myLike, likes, dislikes });
  }

  async createRating(
    commentId: number,
    userId: number,
    type: RatingType,
  ): Promise<CommentRating> {
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

    return this.getRating(commentId, userId);
  }

  async deleteRating(commentId: number, userId: number): Promise<void> {
    const myLike = await this.prisma.rating.deleteMany({
      where: { userId, commentId },
    });

    if (!myLike || myLike.count === 0) {
      throw new InternalServerErrorException('Cant delete comment rate.');
    }
  }
}

export const commentService = new CommentService(prisma);
