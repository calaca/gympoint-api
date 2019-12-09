import { isBefore, parseISO, addMonths } from 'date-fns';
import Enrollment from '../models/Enrollment';
import Student from '../models/Student';
import Plan from '../models/Plan';
import Queue from '../../lib/Queue';
import EnrollmentMail from '../jobs/EnrollmentMail';

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
        'active',
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
      return res
        .status(404)
        .json({ errors: [{ msg: 'Aluno não encontrado.' }] });
    }

    if (!planExists) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Plano não encontrado.' }] });
    }

    if (isBefore(startDateParsed, new Date())) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Datas passadas não são permitidas.' }] });
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

    await Queue.add(EnrollmentMail.key, {
      enrollment: {
        student: {
          name: studentExists.name,
          email: studentExists.email,
        },
        plan: {
          title: planExists.title,
        },
        start_date,
        end_date,
        price,
      },
    });

    return res.json(enrollment);
  }

  async update(req, res) {
    const { student_id, plan_id, start_date } = req.body;
    const studentExists = await Student.findByPk(student_id);
    const planExists = await Plan.findByPk(plan_id);
    const startDateParsed = parseISO(start_date);

    if (!studentExists) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Aluno não encontrado.' }] });
    }

    if (!planExists) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Plano não encontrado.' }] });
    }

    if (isBefore(startDateParsed, new Date())) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Datas passadas não são permitidas.' }] });
    }

    const end_date = addMonths(startDateParsed, planExists.duration);
    const price = planExists.price * planExists.duration;

    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Matrícula não encontrada.' }] });
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
      return res
        .status(404)
        .json({ errors: [{ msg: 'Matrícula não encontrada.' }] });
    }

    await enrollment.destroy();

    const enrollments = await Enrollment.findAll();

    return res.json(enrollments);
  }
}

export default new EnrollmentController();
