// import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    return res.json({ message: 'testing route' });
  }
}

export default new StudentController();
