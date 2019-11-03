import { validationResult } from 'express-validator';
import User from '../models/User';

class UserController {
  async index(req, res) {
    const users = await User.findAll();

    const usersPublicData = users.map(user => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    });

    return res.json(usersPublicData);
  }

  async update(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    // check if there already is a user registered with the new email
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }
    }

    // is old password provided and does it really match?
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res
        .status(401)
        .json({ errors: [{ msg: 'Password does not match' }] });
    }

    // if all goes well, update user data
    const { id, name } = await user.update(req.body);

    return res.json({ id, name, email });
  }
}

export default new UserController();
