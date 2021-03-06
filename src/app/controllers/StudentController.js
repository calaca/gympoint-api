import { validationResult } from 'express-validator';
import { Op, fn, where, col } from 'sequelize';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const { q } = req.query;
    let students;

    if (q) {
      students = await Student.findAll({
        where: where(fn('lower', col('name')), {
          [Op.like]: fn('lower', `%${q}%`),
        }),
      });
    } else {
      students = await Student.findAll();
    }

    const studentsPublicData = students.map(student => {
      return {
        id: student.id,
        name: student.name,
        email: student.email,
        age: student.age,
        weight: student.weight,
        height: student.height,
      };
    });

    return res.json(studentsPublicData);
  }

  async show(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Aluno não encontrado.' }] });
    }

    return res.json(student);
  }

  async store(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({
        errors: [{ msg: 'Um aluno já possui esse email cadastrado.' }],
      });
    }

    const student = await Student.create(req.body);
    return res.json(student);
  }

  async update(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const student = await Student.findByPk(req.params.id);

    if (req.body.email && req.body.email !== student.email) {
      const studentExists = await Student.findOne({
        where: { email: req.body.email },
      });

      if (studentExists) {
        return res.status(400).json({
          errors: [{ msg: 'Um aluno já possui esse email cadastrado.' }],
        });
      }
    }

    const updatedStudent = await student.update(req.body);

    return res.json(updatedStudent);
  }

  async delete(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Aluno não encntrado.' }] });
    }

    await student.destroy();

    const students = await Student.findAll();

    return res.json(students);
  }
}

export default new StudentController();
