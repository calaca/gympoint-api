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
    check('email', 'Por favor, informa um email válido.').isEmail(),
    check('password', 'Senha é obrigatória.')
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
    check('name', 'Nome deve ser do tipo texto.').isString(),
    check('email', 'Por favor, informa um email válido.').isEmail(),
    check(
      'oldPassword',
      'Senha antiga deve ter pelo menos 6 caracteres.'
    ).isLength({ min: 6 }),
    check('password', 'Senha é obrigatória.')
      .if((value, { req }) => req.body.oldPassword)
      .not()
      .isEmpty(),
    check('confirmPassword', 'Confirmação de senha é obrigatória.')
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
      .withMessage('Name é obrigatório.')
      .isString()
      .withMessage('Nome deve ser do tipo texto.'),
    check('email', 'Por favor, informa um email válido.').isEmail(),
    check('age')
      .isInt({ gt: 0 })
      .withMessage('Idade deve ser um número inteiro positivo.')
      .exists()
      .withMessage('Idade é obrigatória.'),
    check('weight')
      .isInt({ gt: 0 })
      .withMessage('Peso deve ser um número inteiro positivo.')
      .exists()
      .withMessage('Peso é obrigatório.'),
    check('height')
      .isInt({ gt: 0 })
      .withMessage('Altura deve ser um número inteiro positivo.')
      .exists()
      .withMessage('Altura é obrigatória.'),
  ],
  StudentController.store
);
routes.put(
  '/students/:id',
  [
    check('name', 'Nome deve ser do tipo texto.')
      .isString()
      .optional(),
    check('email', 'Por favor, informa um email válido.')
      .isEmail()
      .optional(),
    check('age')
      .isInt({ gt: 0 })
      .withMessage('Idade deve ser um número inteiro positivo.')
      .optional(),
    check('weight')
      .isInt({ gt: 0 })
      .withMessage('Peso deve ser um número inteiro positivo.')
      .optional(),
    check('height')
      .isInt({ gt: 0 })
      .withMessage('Altura deve ser um número inteiro positivo.')
      .optional(),
  ],
  StudentController.update
);
routes.delete('/students/:id', StudentController.delete);

routes.get('/help-orders/unanswered', AnswerController.index);
routes.post('/help-orders/:id/answer', AnswerController.store);

routes.get('/plans', PlanController.index);
routes.post(
  '/plans',
  [
    check('title')
      .isString()
      .withMessage('Título deve ser do tipo texto.')
      .exists('Título é obrigatório.'),
    check('duration')
      .isInt({ min: 1 })
      .withMessage('Duração deve ser maior que 1 mês.')
      .exists()
      .withMessage('Duração é obrigatória.'),
    check('price')
      .isInt({ min: 0 })
      .withMessage('Preço deve ser maior que R$0,00.')
      .exists()
      .withMessage('Preço é obrigatório.'),
  ],
  PlanController.store
);
routes.put(
  '/plans/:id',
  [
    check('title')
      .isString()
      .withMessage('Título deve ser do tipo texto.')
      .optional(),
    check('duration')
      .isInt({ min: 1 })
      .withMessage('Duração deve ser maior que 1 mês.')
      .optional(),
    check('price')
      .isInt({ min: 0 })
      .withMessage('Preço deve ser maior que R$0,00.')
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
