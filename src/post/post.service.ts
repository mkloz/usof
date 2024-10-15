import { Post } from './post.entity';
import {
  PostStatus,
  Prisma,
  PrismaClient,
  Rating,
  RatingType,
} from '@prisma/client';
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
import { CreatePostDto, GetManyPostsDto, UpdatePostDto } from './post.dto';

class PostRating {
  myLike?: Rating | null;
  likes: number;
  dislikes: number;

  constructor(comment: Partial<PostRating>) {
    Object.assign(this, comment);
  }
}

export class PostService {
  static readonly include: Prisma.PostInclude = {
    author: true,
    pictures: true,
  };
  constructor(private readonly prisma: PrismaClient) {}

  private getManyQuery(pag: GetManyPostsDto): Prisma.PostFindManyArgs {
    return {
      take: pag.limit,
      include: PostService.include,
      where: {
        categories: pag.categoryId
          ? { some: { id: pag.categoryId } }
          : undefined,
        status: pag.status ?? {
          in: [PostStatus.ARCHIVED, PostStatus.PUBLISHED],
        },
        authorId: pag.userId,
        createdAt: {
          gte: pag.fromDate,
          lte: pag.tillDate,
        },

        OR: pag.search
          ? [
              { title: { contains: pag.search } },
              { content: { contains: pag.search } },
            ]
          : undefined,
      },
      skip: (pag.page - 1) * pag.limit,
      orderBy: [
        {
          rating: pag.sortByLikes ?? undefined,
        },
        {
          createdAt: pag.sortByDate ?? undefined,
        },
      ],
    };
  }

  async getMany(
    { page, limit, ...pag }: GetManyPostsDto,
    url: string,
  ): Promise<Paginated<Post>> {
    const query = this.getManyQuery({ page, limit, ...pag });
    const posts = await this.prisma.post.findMany(query);

    return Paginator.paginate(
      {
        data: posts.map((task) => new Post(task)),
        page: page,
        limit: limit,
        route: url,
        count: await this.prisma.post.count(),
      },
      pag,
    );
  }

  async getComments(
    postId: number,
    pag: PaginationOptionsDto,
    url: string,
  ): Promise<Paginated<Post>> {
    const comments = await this.prisma.comment.findMany({
      take: pag.limit,
      where: { postId },
      skip: (pag.page - 1) * pag.limit,
    });

    return Paginator.paginate({
      data: comments.map((task) => new Post(task)),
      page: pag.page,
      limit: pag.limit,
      route: url,
      count: await this.prisma.comment.count({ where: { postId } }),
    });
  }

  async getCategories(
    postId: number,
    pag: PaginationOptionsDto,
    url: string,
  ): Promise<Paginated<Post>> {
    const categories = await this.prisma.category.findMany({
      take: pag.limit,
      where: { posts: { some: { id: postId } } },
      skip: (pag.page - 1) * pag.limit,
    });

    return Paginator.paginate({
      data: categories.map((task) => new Post(task)),
      page: pag.page,
      limit: pag.limit,
      route: url,
      count: await this.prisma.category.count({
        where: { posts: { some: { id: postId } } },
      }),
    });
  }

  async update(id: number, dto: UpdatePostDto): Promise<Post> {
    const post = await this.prisma.post.update({
      where: { id },
      include: PostService.include,
      data: dto,
    });

    if (!post) {
      throw new NotFoundException('Post does not exist.');
    }

    return new Post(post);
  }

  async delete(id: number): Promise<Post> {
    const post = await this.prisma.post.delete({
      where: { id },
      include: PostService.include,
    });

    if (!post) {
      throw new NotFoundException('Post does not exist.');
    }

    return new Post(post);
  }

  async create(userId: number, dto: CreatePostDto): Promise<Post> {
    const post = await this.prisma.post.create({
      data: { ...dto, authorId: userId },
      include: PostService.include,
    });
    if (!post) {
      throw new InternalServerErrorException('Cant create post.');
    }

    return new Post(post);
  }

  async get(id: number): Promise<Post> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: PostService.include,
    });

    if (!post) {
      throw new NotFoundException('Post does not exist.');
    }

    return new Post(post);
  }

  async getRating(postId: number, userId: number): Promise<PostRating> {
    const myLike = await this.prisma.rating.findFirst({
      where: { userId, postId },
    });
    const likes = await this.prisma.rating.count({
      where: { postId, type: RatingType.LIKE },
    });
    const dislikes = await this.prisma.rating.count({
      where: { postId, type: RatingType.DISLIKE },
    });

    return new PostRating({ myLike, likes, dislikes });
  }

  async createRating(
    postId: number,
    userId: number,
    type: RatingType,
  ): Promise<PostRating> {
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

    return this.getRating(postId, userId);
  }

  async deleteRating(postId: number, userId: number): Promise<void> {
    const myLike = await this.prisma.rating.deleteMany({
      where: { userId, postId },
    });

    if (!myLike || myLike.count === 0) {
      throw new InternalServerErrorException('Cant delete post rate.');
    }
  }
}

export const postService = new PostService(prisma);
