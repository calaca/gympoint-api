import { Router } from 'express';
import { check } from 'express-validator';
import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import StudentController from './app/controllers/StudentController';
import PlanController from './app/controllers/PlanController';
import EnrollmentController from './app/controllers/EnrollmentController';
import CheckinController from './app/controllers/CheckinController';
import HelpOrderController from './app/controllers/HelpOrderController';
import AnswerController from './app/controllers/AnswerController';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();

// public
routes.get('/users', UserController.index);
routes.post(
  '/sessions',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required')
      .isString()
      .exists(),
  ],
  SessionController.store
);

routes.get('/students/:id/checkins', CheckinController.index);
routes.post('/students/:id/checkins', CheckinController.store);

routes.get('/students/:id/help-orders', HelpOrderController.index);
routes.post('/students/:id/help-orders', HelpOrderController.store);

// private
routes.use(authMiddleware);

routes.put(
  '/users',
  [
    check('name', 'Name should be a string').isString(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'oldPassword',
      'Old password should have 6 or more characters'
    ).isLength({ min: 6 }),
    check('password', 'Password is required')
      .if((value, { req }) => req.body.oldPassword)
      .not()
      .isEmpty(),
    check('confirmPassword', 'Password confirmation is required')
      .if((value, { req }) => req.body.password)
      .not()
      .isEmpty(),
  ],
  UserController.update
);

routes.post('/students', StudentController.store);
routes.put('/students/:id', StudentController.update);

routes.get('/help-orders/unanswered', AnswerController.index);
routes.post('/help-orders/:id/answer', AnswerController.store);

routes.get('/plans', PlanController.index);
routes.post('/plans', PlanController.store);
routes.put('/plans/:id', PlanController.update);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:id', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);

export default routes;
