import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async store(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Aluno não encontrado.' }] });
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
      return res.status(404).json({
        errors: [{ msg: 'Este aluno já fez checkin nos últimos 7 dias.' }],
      });
    }

    const checkin = await Checkin.create({ student_id: id });

    return res.json(checkin);
  }

  async index(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Aluno não encontrado.' }] });
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
