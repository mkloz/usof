import { prisma } from '@/db/prisma.client';
import { NotFoundException } from '@/shared/exceptions/exceptions';
import { IdDtoValidator } from '@/shared/validators/common.validator';
import { NextFunction, Request, Response } from 'express';

export default async function fileExist(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { id } = IdDtoValidator.parse(req.params);
  const post = await prisma.file.findUnique({ where: { id } });

  if (!post) {
    throw new NotFoundException('File does not exist');
  }
  next();
}
