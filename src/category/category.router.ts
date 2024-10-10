import { Router } from 'express';
import { CategoryController } from './category.controller';
import { admin } from '../auth/middlewares/admin.middleware';
import categoryExist from './middlewares/category-exist.middleware';
export const categoryRouter = Router();

categoryRouter
  .get('/categories/:id', categoryExist, CategoryController.get)
  .get('/categories', CategoryController.getMany)
  .post('/categories', admin, CategoryController.create)
  .patch('/categories/:id', admin, categoryExist, CategoryController.update)
  .delete('/categories/:id', admin, categoryExist, CategoryController.delete)
  .get('/categories/:id/posts', categoryExist, CategoryController.getPosts);
