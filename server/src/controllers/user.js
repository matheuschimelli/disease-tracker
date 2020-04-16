import User from '../models/User'
export default {
  async index (req, res) {
    const users = await User.find()
    return res.send(users)
  },
  show (req, res) {
    return res.send(req.user)
  }
}
