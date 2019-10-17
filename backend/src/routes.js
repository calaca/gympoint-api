import { Router } from 'express';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// public
routes.get('/users', UserController.index);
routes.post('/sessions', SessionController.store);

// private
routes.use(authMiddleware);
routes.put('/users', UserController.update);

export default routes;
