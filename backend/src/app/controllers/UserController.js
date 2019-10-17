import User from '../models/User';

class UserController {
  async index(req, res) {
    const users = await User.findAll();

    return res.json(users);
  }

  async update(req, res) {
    return res.json({ message: req.userId });
  }
}

export default new UserController();
