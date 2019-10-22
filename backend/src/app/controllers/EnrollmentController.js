import { isBefore, parseISO, addMonths } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollment.findAll({
      attributes: [
        'id',
        'student_id',
        'plan_id',
        'start_date',
        'end_date',
        'price',
      ],
      order: ['start_date'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name', 'email', 'age', 'weight', 'height'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title', 'duration', 'price'],
        },
      ],
    });
    return res.json(enrollments);
  }

  async store(req, res) {
    const { student_id, plan_id, start_date } = req.body;

    const studentExists = await Student.findByPk(student_id);
    const planExists = await Plan.findByPk(plan_id);
    const startDateParsed = parseISO(start_date);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    if (!planExists) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    if (isBefore(startDateParsed, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const end_date = addMonths(startDateParsed, planExists.duration);
    const price = planExists.price * planExists.duration;

    const enrollment = await Enrollment.create({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const { student_id, plan_id, start_date } = req.body;
    const studentExists = await Student.findByPk(student_id);
    const planExists = await Plan.findByPk(plan_id);
    const startDateParsed = parseISO(start_date);

    if (!studentExists) {
      return res.status(400).json({ error: 'Student does not exist' });
    }

    if (!planExists) {
      return res.status(400).json({ error: 'Plan does not exist' });
    }

    if (isBefore(startDateParsed, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permitted' });
    }

    const end_date = addMonths(startDateParsed, planExists.duration);
    const price = planExists.price * planExists.duration;

    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    const updatedEnrollment = await enrollment.update({
      student_id,
      plan_id,
      start_date,
      end_date,
      price,
    });

    return res.json(updatedEnrollment);
  }

  async delete(req, res) {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(404).json({ error: 'Enrollment not found' });
    }

    await enrollment.destroy();

    return res.json({ message: 'Enrollment deleted successfully' });
  }
}

export default new EnrollmentController();
