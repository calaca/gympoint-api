class HelpOrderController {
  async index(req, res) {
    return res.json({ ok: true });
  }

  async store(req, res) {
    return res.json({ ok: true });
  }
}

export default new HelpOrderController();
