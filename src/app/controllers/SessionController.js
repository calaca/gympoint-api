import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import authConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
  async store(req, res) {
    const errors = validationResult(req);

    // middleware field validation
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    // validate user
    if (!user) {
      return res.status(401).json({ errors: [{ msg: 'User not found' }] });
    }

    // validate password
    if (!(await user.checkPassword(password))) {
      return res
        .status(401)
        .json({ errors: [{ msg: 'Password does no match' }] });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
