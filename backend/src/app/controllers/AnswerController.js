import { Op } from 'sequelize';
import HelpOrder from '../models/HelpOrder';

class AnswerController {
  async index(req, res) {
    const helpOrders = await HelpOrder.findAll({
      where: {
        answer_at: {
          [Op.ne]: null,
        },
      },
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const { id } = req.params;
    const { answer } = req.body;

    const helpOrder = await HelpOrder.findByPk(id);

    if (!helpOrder) {
      return res.status(404).json({ error: 'Help order not found' });
    }

    const updatedHelpOrder = await helpOrder.update({
      answer,
      answer_at: new Date(),
    });

    return res.json(updatedHelpOrder);
  }
}

export default new AnswerController();
