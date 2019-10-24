class AnswerController {
  async index(req, res) {
    return res.json({ ok: true });
  }

  async store(req, res) {
    return res.json({ ok: true });
  }
}

export default new AnswerController();
