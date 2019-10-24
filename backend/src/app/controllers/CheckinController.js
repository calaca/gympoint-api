import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const startDay = new Date();
    const endDay = subDays(startDay, 6);

    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
        updatedAt: {
          [Op.between]: [endDay, startDay],
        },
      },
    });

    if (checkins.length >= 5) {
      return res.status(400).json({
        error: 'Student have already checked in during last 7 days',
      });
    }

    // const checkin = await Checkin.create({ student_id: id });

    return res.json(checkins);
  }

  async index(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id: id,
      },
    });

    return res.json(checkins);
  }
}

export default new CheckinController();
