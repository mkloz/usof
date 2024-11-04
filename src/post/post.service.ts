import { prisma } from '@/db/prisma.client';
import {
  Rating as IRating,
  PostStatus,
  Prisma,
  PrismaClient,
  RatingType,
} from '@prisma/client';
import { Category, PaginatedCategories } from '../category/category.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../shared/exceptions/exceptions';
import { Paginated, PaginationOptionsDto } from '../shared/pagination';
import { CreatePostDto, GetManyPostsDto, UpdatePostDto } from './post.dto';
import { PaginatedPosts, Post } from './post.entity';

export class Rating implements IRating {
  id: number;
  createdAt: Date;
  type: RatingType;
  userId: number;
  postId: number | null;
  commentId: number | null;

  constructor(comment: Partial<Rating>) {
    Object.assign(this, comment);
  }
}

export class PostService {
  static readonly include: Prisma.PostInclude = {
    author: {
      include: {
        avatar: true,
      },
    },
    pictures: true,
    _count: {
      select: {
        comments: true,
      },
    },
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
              { author: { fullName: { contains: pag.search } } },
              { categories: { some: { name: { contains: pag.search } } } },
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

  async getPaginated(
    { page, limit, ...pag }: GetManyPostsDto,
    url: string,
  ): Promise<Paginated<Post>> {
    const query = this.getManyQuery({ page, limit, ...pag });
    const posts = await this.prisma.post.findMany(query);

    return new PaginatedPosts(
      {
        data: posts,
        page: page,
        limit: limit,
        route: url,
        count: await this.prisma.post.count({ where: query.where }),
      },
      pag,
    );
  }

  async getPaginatedCategories(
    postId: number,
    pag: PaginationOptionsDto,
    url: string,
  ): Promise<Paginated<Category>> {
    const categories = await this.prisma.category.findMany({
      take: pag.limit,
      where: { posts: { some: { id: postId } } },
      skip: (pag.page - 1) * pag.limit,
    });

    return new PaginatedCategories({
      data: categories,
      page: pag.page,
      limit: pag.limit,
      route: url,
      count: await this.prisma.category.count({
        where: { posts: { some: { id: postId } } },
      }),
    });
  }

  async addCategory(postId: number, categoryId: number): Promise<Post> {
    const post = await this.prisma.post.update({
      where: { id: postId },
      include: PostService.include,
      data: {
        categories: {
          connect: { id: categoryId },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post does not exist.');
    }

    return new Post(post);
  }

  async removeCategory(postId: number, categoryId: number): Promise<Post> {
    const post = await this.prisma.post.update({
      where: { id: postId },
      include: PostService.include,
      data: {
        categories: {
          disconnect: { id: categoryId },
        },
      },
    });

    if (!post) {
      throw new NotFoundException('Post does not exist.');
    }

    return new Post(post);
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
}

export const postService = new PostService(prisma);
