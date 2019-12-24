import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

class HelpOrderController {
  async index(req, res) {
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Aluno não encontrado.' }] });
    }

    const helpOrders = await HelpOrder.findAll({ where: { student_id: id } });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const { id } = req.params;
    const { question } = req.body;

    const student = await Student.findByPk(id);

    if (!student) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Aluno não encontrado.' }] });
    }

    if (!question) {
      return res
        .status(404)
        .json({ errors: [{ msg: 'Pergunta é obrigatória.' }] });
    }

    const helpOrder = await HelpOrder.create({
      question,
      student_id: id,
    });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
