import { prisma } from '@/db/prisma.client';
import { Prisma, PrismaClient } from '@prisma/client';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../shared/exceptions/exceptions';
import { Paginated } from '../shared/pagination';
import {
  CreateCommentDto,
  GetManyCommentsDto,
  UpdateCommentDto,
} from './comment.dto';
import { Comment, PaginatedComments } from './comment.entity';

export class CommentService {
  static readonly include: Prisma.CommentInclude = {
    user: { include: { avatar: true } },
    _count: { select: { subComments: true } },
  };
  constructor(private readonly prisma: PrismaClient) {}

  async getPaginated(
    { page, limit, ...pag }: GetManyCommentsDto,
    url: string,
  ): Promise<Paginated<Comment>> {
    const comments = await this.prisma.comment.findMany({
      take: limit,
      where: {
        postId: pag.postId,
        userId: pag.userId,
        parentId: pag.parentId,
      },
      orderBy: [
        {
          rating: pag.sortByLikes ?? undefined,
        },
        {
          createdAt: pag.sortByDate ?? undefined,
        },
      ],
      include: CommentService.include,
      skip: (page - 1) * limit,
    });

    return new PaginatedComments(
      {
        data: comments,
        page: page,
        limit: limit,
        route: url,
        count: await this.prisma.comment.count({
          where: {
            postId: pag.postId,
            userId: pag.userId,
            parentId: pag.parentId,
          },
        }),
      },
      pag,
    );
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
}

export const commentService = new CommentService(prisma);
