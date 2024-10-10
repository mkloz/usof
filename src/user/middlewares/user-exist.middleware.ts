import { NextFunction, Request, Response } from 'express';
import { IdDtoValidator } from '../../shared/validators/common.validator';
import { NotFoundException } from '../../utils/exceptions/exceptions';
import { prisma } from '../../db/prisma.client';

export default async function userExist(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const { id } = IdDtoValidator.parse(req.params);
  const post = await prisma.user.findUnique({ where: { id } });

  if (!post) {
    throw new NotFoundException('User does not exist');
  }
  next();
}
