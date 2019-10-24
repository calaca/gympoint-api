// import Checkin from '../models/Checkin';

class CheckinController {
  async store(req, res) {
    return res.json({ method: 'store' });
  }

  async index(req, res) {
    return res.json({ method: 'index' });
  }
}

export default new CheckinController();
