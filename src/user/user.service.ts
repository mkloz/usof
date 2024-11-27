import { Comment, PaginatedComments } from '@/comment/comment.entity';
import { prisma } from '@/db/prisma.client';
import { PaginatedPosts } from '@/post/post.entity';
import { PostService } from '@/post/post.service';
import { PaginatedUsers } from '@/user/user.entity';
import { Post, Prisma, PrismaClient, Rating, User } from '@prisma/client';
import { compareSync, hashSync } from 'bcryptjs';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../shared/exceptions/exceptions';
import { Paginated, PaginationOptionsDto } from '../shared/pagination';
import { CreateUserDto, UpdateUserDto } from './user.dto';

export class UserService {
  static include: Prisma.UserInclude = {
    avatar: true,
  };

  constructor(private readonly prisma: PrismaClient) {}

  async getPaginatedPosts(
    userId: number,
    pag: PaginationOptionsDto,
    url: string,
  ): Promise<Paginated<Post>> {
    const posts = await this.prisma.post.findMany({
      where: { authorId: userId },
      take: pag.limit,
      include: PostService.include,
      skip: (pag.page - 1) * pag.limit,
    });

    return new PaginatedPosts({
      data: posts,
      page: pag.page,
      limit: pag.limit,
      route: url,
      count: await this.prisma.post.count({ where: { authorId: userId } }),
    });
  }

  async getPaginatedComments(
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

    return new PaginatedComments({
      data: comments,
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

  async updatePassword(userId: number, password: string): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: UserService.hash(password) },
      include: UserService.include,
    });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return user;
  }

  async update(userId: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      include: UserService.include,
      data: dto,
    });
    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return user;
  }

  async delete(id: number): Promise<User> {
    const user = await this.prisma.user.delete({
      where: { id },
      include: UserService.include,
    });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return user;
  }

  public static compare(pass: string, hash: string): boolean {
    return compareSync(pass, hash);
  }

  public async verify(userId: number, pass: string, hashed?: boolean) {
    const passwordHash = hashed ? pass : UserService.hash(pass);

    const user = await this.prisma.user.findUnique({
      where: { id: userId, passwordHash },
    });

    return !!user;
  }

  public static hash(string: string): string {
    return hashSync(string);
  }

  async create({ password, ...dto }: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.create({
      include: UserService.include,
      data: {
        ...dto,
        passwordHash: UserService.hash(password),
      },
    });

    if (!user) {
      throw new InternalServerErrorException('Cant create user.');
    }

    return user;
  }

  async get(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where,
      include: UserService.include,
    });

    if (!user) {
      throw new NotFoundException('User does not exist.');
    }

    return user;
  }

  async getPaginated(
    pag: PaginationOptionsDto,
    route: string,
  ): Promise<PaginatedUsers> {
    const users = await this.prisma.user.findMany({
      take: pag.limit,
      skip: (pag.page - 1) * pag.limit,
      include: UserService.include,
    });

    return new PaginatedUsers({
      data: users,
      page: pag.page,
      limit: pag.limit,
      route: route,
      count: await this.prisma.user.count(),
    });
  }

  async getSafe(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where,
      include: UserService.include,
    });

    return user ? user : null;
  }

  async verifyEmail(email: string): Promise<void> {
    await this.prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  async getReactions(userId: number): Promise<Rating[]> {
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

    return post;
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

    return post;
  }
}

export const userService = new UserService(prisma);
