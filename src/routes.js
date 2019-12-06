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

routes.get('/students', StudentController.index);
routes.post(
  '/students',
  [
    check('name')
      .exists()
      .withMessage('Name is required')
      .isString()
      .withMessage('Name should be a string'),
    check('email', 'Please include a valid email').isEmail(),
    check('age')
      .isInt({ gt: 0 })
      .withMessage('Age should be a positive integer number')
      .exists()
      .withMessage('Age is required'),
    check('weight')
      .isInt({ gt: 0 })
      .withMessage('Weight should be a positive integer number')
      .exists()
      .withMessage('Weight is required'),
    check('height')
      .isInt({ gt: 0 })
      .withMessage('Height should be a positive integer number')
      .exists()
      .withMessage('Height is required'),
  ],
  StudentController.store
);
routes.put(
  '/students/:id',
  [
    check('name', 'Name should be a string')
      .isString()
      .optional(),
    check('email', 'Please include a valid email')
      .isEmail()
      .optional(),
    check('age')
      .isInt({ gt: 0 })
      .withMessage('Age should be a positive integer number')
      .optional(),
    check('weight')
      .isInt({ gt: 0 })
      .withMessage('Weight should be a positive integer number')
      .optional(),
    check('height')
      .isInt({ gt: 0 })
      .withMessage('Height should be a positive integer number')
      .optional(),
  ],
  StudentController.update
);

routes.get('/help-orders/unanswered', AnswerController.index);
routes.post('/help-orders/:id/answer', AnswerController.store);

routes.get('/plans', PlanController.index);
routes.post(
  '/plans',
  [
    check('title')
      .isString()
      .withMessage('Title should be a string')
      .exists('Title is required'),
    check('duration')
      .isInt({ min: 1 })
      .withMessage('Duration should be greater than 1')
      .exists()
      .withMessage('Duration is required'),
    check('price')
      .isInt({ min: 0 })
      .withMessage('Price should be greater than 0')
      .exists()
      .withMessage('Price is required'),
  ],
  PlanController.store
);
routes.put(
  '/plans/:id',
  [
    check('title')
      .isString()
      .withMessage('Title should be a string')
      .optional(),
    check('duration')
      .isInt({ min: 1 })
      .withMessage('Duration should be greater than 1')
      .optional(),
    check('price')
      .isInt({ min: 0 })
      .withMessage('Price should be greater than 0')
      .optional(),
  ],
  PlanController.update
);
routes.delete('/plans/:id', PlanController.delete);

routes.get('/enrollments', EnrollmentController.index);
routes.post('/enrollments', EnrollmentController.store);
routes.put('/enrollments/:id', EnrollmentController.update);
routes.delete('/enrollments/:id', EnrollmentController.delete);

export default routes;
