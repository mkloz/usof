import { File } from './file.entity';
import { Prisma, PrismaClient } from '@prisma/client';
import { prisma } from '../db/prisma.client';
import {
  InternalServerErrorException,
  NotFoundException,
} from '../utils/exceptions/exceptions';

export class FileService {
  constructor(private readonly prisma: PrismaClient) {}

  async delete(id: number): Promise<File> {
    const file = await this.prisma.file.delete({ where: { id } });

    if (!file) {
      throw new NotFoundException('File does not exist.');
    }

    return new File(file);
  }

  async create(dto: Prisma.FileCreateInput): Promise<File> {
    const file = await this.prisma.file.create({ data: dto });

    if (!file) {
      throw new InternalServerErrorException('Cant create file.');
    }

    return new File(file);
  }

  async get(id: number): Promise<File> {
    const file = await this.prisma.file.findUnique({ where: { id } });

    if (!file) {
      throw new NotFoundException('File does not exist.');
    }

    return new File(file);
  }
}

export const fileService = new FileService(prisma);
