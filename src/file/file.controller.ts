import { fileService } from './file.service';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { IdDtoValidator } from '../shared/validators/common.validator';
import { parseAuthToken } from '../auth/middlewares/auth.middleware';
import { fileS3Service } from './file-upload.service';
import { UnprocessableEntityException } from '../utils/exceptions/exceptions';

export class FileController {
  public static async get(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const task = await fileService.get(id);

    res.status(StatusCodes.OK).json(task);
  }

  public static async create(req: Request, res: Response) {
    parseAuthToken(req);
    if (!req.file) {
      throw new UnprocessableEntityException('File is required');
    }
    const data = await fileS3Service.addFile(req.file);
    const file = await fileService.create(data);

    res.status(StatusCodes.CREATED).json(file);
  }

  public static async delete(req: Request, res: Response) {
    const { id } = IdDtoValidator.parse(req.params);
    const file = await fileService.delete(id);

    await fileS3Service.removeFile(file.name);

    res.status(StatusCodes.OK).json(file);
  }
}
