import { prisma } from '@/db/prisma.client';
import { NotFoundException } from '@/shared/exceptions/exceptions';
import { IdDtoValidator } from '@/shared/validators/common.validator';
import { NextFunction, Request, Response } from 'express';

export default async function categoryExist(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { id } = IdDtoValidator.parse(req.params);
  const post = await prisma.category.findUnique({ where: { id } });

  if (!post) {
    throw new NotFoundException('Category does not exist');
  }
  next();
}
