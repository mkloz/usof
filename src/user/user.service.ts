import { User } from './user.entity';
import { Prisma, PrismaClient, Rating } from '@prisma/client';
import { prisma } from '../db/prisma.client';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../utils/exceptions/exceptions';
import { compareSync, hashSync } from 'bcryptjs';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import {
  Paginated,
  PaginationOptionsDto,
  Paginator,
} from '../shared/pagination';
import { Post } from '../post/post.entity';
import { Comment } from '../comment/comment.entity';
import { PostService } from '../post/post.service';

export class UserService {
  readonly include: Prisma.UserInclude = {
    avatar: true,
  };

  constructor(private readonly prisma: PrismaClient) {}

  async getPosts(
    userId: number,
    pag: PaginationOptionsDto,
    url: string,
  ): Promise<Paginated<Post>> {
    const posts = await this.prisma.post.findMany({
      where: { authorId: userId },
      take: pag.limit,
      skip: (pag.page - 1) * pag.limit,
    });

    return Paginator.paginate({
      data: posts.map((task) => new Post(task)),
      page: pag.page,
      limit: pag.limit,
      route: url,
      count: await this.prisma.post.count({ where: { authorId: userId } }),
    });
  }

  async getComments(
    userId: number,
    pag: PaginationOptionsDto,
    url: string,
  ): Promise<Paginated<Comment>> {
    const comments = await this.prisma.comment.findMany({
      where: { userId },
      include: { post: true },
      take: pag.limit,
      skip: (pag.page - 1) * pag.limit,
    });

    return Paginator.paginate({
      data: comments.map((task) => new Comment(task)),
      page: pag.page,
      limit: pag.limit,
      route: url,
      count: await this.prisma.comment.count({ where: { userId } }),
    });
  }

  async getFavorites(userId: number): Promise<Post[]> {
    return this.prisma.post.findMany({
      where: { favorites: { some: { id: userId } } },
      include: PostService.include,
    });
  }

  async update(
    userId: number,
    { password, ...dto }: UpdateUserDto,
  ): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      include: this.include,
      data: {
        ...dto,
        passwordHash: password ? UserService.hash(password) : undefined,
      },
    });
    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return new User(user);
  }

  async delete(id: number): Promise<User> {
    const user = await this.prisma.user.delete({
      where: { id },
      include: this.include,
    });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return new User(user);
  }

  public static compare(pass: string, hash: string): boolean {
    return compareSync(pass, hash);
  }

  public static hash(string: string): string {
    return hashSync(string);
  }

  async create({ password, ...dto }: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      include: this.include,
      data: {
        ...dto,
        passwordHash: UserService.hash(password),
      },
    });

    if (!user) {
      throw new InternalServerErrorException('Cant create user.');
    }

    return new User(user);
  }

  async get(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where,
      include: this.include,
    });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return new User(user);
  }

  async getSafe(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where,
      include: this.include,
    });

    return user ? new User(user) : null;
  }

  async verifyEmail(email: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });
  }
  async getLikes(userId: number): Promise<Rating[]> {
    return this.prisma.rating.findMany({
      where: { userId },
    });
  }

  async addFavorite(userId: number, postId: number): Promise<Post> {
    const post = await this.prisma.post.update({
      where: { id: postId },
      include: PostService.include,
      data: { favorites: { connect: { id: userId } } },
    });

    if (!post) {
      throw new NotFoundException('Post does not exist.');
    }

    return new Post(post);
  }

  async removeFavorite(userId: number, postId: number): Promise<Post> {
    const post = await this.prisma.post.update({
      where: { id: postId },
      include: PostService.include,
      data: { favorites: { disconnect: { id: userId } } },
    });

    if (!post) {
      throw new NotFoundException('Post does not exist.');
    }

    return new Post(post);
  }
}

export const userService = new UserService(prisma);
