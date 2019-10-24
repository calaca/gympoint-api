import { parseISO, format } from 'date-fns';
import Mail from '../../lib/Mail';
import currencyFormatter from '../../helper/currencyFormatter';

class EnrollmentMail {
  get key() {
    return 'EnrollmentMail';
  }

  async handle({ data }) {
    const { enrollment } = data;

    await Mail.sendMail({
      to: `${enrollment.student.name} <${enrollment.student.email}>`,
      subject: 'Bem vindo ao Gympoint!',
      template: 'enrollment',
      context: {
        student: enrollment.student.name,
        plan: enrollment.plan.title,
        start_date: format(parseISO(enrollment.start_date), 'dd/MM/yyyy'),
        end_date: format(parseISO(enrollment.end_date), 'dd/MM/yyyy'),
        price: `R$ ${currencyFormatter(enrollment.price)}`,
      },
    });
  }
}

export default new EnrollmentMail();
