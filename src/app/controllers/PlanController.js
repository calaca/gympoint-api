import * as yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll({
      attributes: ['id', 'title', 'duration', 'price'],
      order: ['duration'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = yup.object().shape({
      title: yup.string().required(),
      duration: yup
        .number()
        .integer()
        .moreThan(0)
        .required(),
      price: yup
        .number()
        .integer()
        .moreThan(0)
        .required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = yup.object().shape({
      title: yup.string(),
      duration: yup
        .number()
        .integer()
        .moreThan(0),
      price: yup
        .number()
        .integer()
        .moreThan(0),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    await plan.destroy();

    return res.json({ message: 'Plan deleted successfully' });
  }
}

export default new PlanController();
