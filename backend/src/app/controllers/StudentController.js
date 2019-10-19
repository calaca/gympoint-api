import * as yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = yup.object().shape({
      name: yup.string(),
      email: yup.string().email(),
      age: yup
        .number()
        .integer()
        .positive(),
      weight: yup
        .number()
        .integer()
        .positive(),
      height: yup
        .number()
        .integer()
        .positive(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists' });
    }

    const student = await Student.create(req.body);
    return res.json(student);
  }

  async update(req, res) {
    const student = await Student.findByPk(req.body.id);

    if (req.body.email !== student.email) {
      const studentExists = await Student.findOne({ where: req.body.email });

      if (studentExists) {
        return res.status(400).json({ error: 'Student already exists ' });
      }
    }

    // eslint-disable-next-line no-unused-vars
    const { id, ...dataToUpdate } = req.body;

    const updatedStudent = await student.update(dataToUpdate);

    return res.json(updatedStudent);
  }
}

export default new StudentController();
