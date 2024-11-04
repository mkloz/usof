import { Router } from 'express';
import { admin } from '../auth/middlewares/admin.middleware';
import { CategoryController } from './category.controller';
import categoryExist from './middlewares/category-exist.middleware';
export const categoryRouter = Router();

categoryRouter
  .get('/categories', CategoryController.getMany)
  .post('/categories', admin, CategoryController.create)
  .get('/categories/:id', categoryExist, CategoryController.get)
  .patch('/categories/:id', admin, categoryExist, CategoryController.update)
  .delete('/categories/:id', admin, categoryExist, CategoryController.delete);
