import { UserRole } from '@prisma/client';
import 'module-alias/register';
import 'reflect-metadata';
import { categoryService } from '../../src/category/category.service';
import { commentService } from '../../src/comment/comment.service';
import { prisma } from '../../src/db/prisma.client';
import { postService } from '../../src/post/post.service';
import { Logger } from '../../src/shared/loggers/logger';
import { UserService } from '../../src/user/user.service';
import { admin } from './admin';
import { initialCategories } from './categories';
import { initialComments } from './comments';
import { initialPosts } from './posts';

export const ADMIN_ID = 1_234_567_890;
class Seeder {
  static logger = new Logger('Seeder');

  constructor() {}

  async start() {
    await this.seedCategories();
    Seeder.logger.info('Categories were created ✔️');
    await this.createAdmin();
    Seeder.logger.info('Admin was created ✔️');
    await this.seedPosts();
    Seeder.logger.info('Posts were created ✔️');
    Seeder.logger.info('Seeding completed 🎉');
  }

  async seedCategories() {
    for (const category of initialCategories) {
      const res = await categoryService.create(category);
      Seeder.logger.info(`#Category created: ${res.id}`);
    }
  }

  async createAdmin() {
    return prisma.user.create({
      data: {
        id: ADMIN_ID,
        email: admin.email,
        fullName: admin.name,
        passwordHash: UserService.hash(admin.password),
        role: UserRole.ADMIN,
        emailVerified: true,
      },
    });
  }

  async seedPosts() {
    for (const post of initialPosts) {
      const res = await postService.create(ADMIN_ID, {
        title: post.title,
        content: post.content,
        status: post.status,
      });
      Seeder.logger.info(`#Post created: ${res.id}`);

      await this.addCategoriesToPost(res.id, post.categories ?? []);
      Seeder.logger.info(`Categories for post: ${res.id} were added ✔️`);
      await this.seedComments(res.id);
      Seeder.logger.info(`Comments for post: ${res.id} were created ✔️`);
    }
  }
  async addCategoriesToPost(postId: number, categories: number[]) {
    for (const categoryId of categories) {
      await postService.addCategory(postId, categoryId);
    }
  }
  async seedComments(postId: number) {
    const initComments = initialComments
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 8) + 3);

    for (const comment of initComments) {
      const res = await commentService.create(ADMIN_ID, postId, comment);
      Seeder.logger.info(`#Comments created: ${res.id}`);
    }
  }
}

function start() {
  try {
    Seeder.logger.info('Seeding started 🚀');
    const seeder = new Seeder();

    seeder.start();
  } catch (e) {
    Seeder.logger.error(e);
    process.exit(1);
  }
}

start();
