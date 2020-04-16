import twilio from 'twilio'
import { customAlphabet } from 'nanoid'

import User from '../models/User'
import * as jwtUtils from '../utils/jwt'

// const twilioModule = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN)
export default {
  async test (req, res) {
    const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)

    return res.send(nanoid())
  },
  async loginWithNumber (req, res) {
    try {
      const { phone } = req.body

      const user = await User.findOne({ phone })
      const nanoid = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', 6)

      if (user) {
        console.log('usuario existe')
        const genToken = nanoid()
        user.phoneVerificationToken = genToken
        user.phoneTokenExpires = Date.now() + 360000
        await user.save()

        console.log(genToken)

        return res.json({ success: true, message: `Login token sent to ${phone}` })
      } else {
        const genToken = nanoid()

        console.log('usuario nao existe')

        await User.create({
          email: phone,
          phone,
          phoneVerificationToken: genToken,
          phoneVerified: false,
          phoneTokenExpires: Date.now() + 360000
        })
        console.log(genToken)

        return res.json({ success: true, message: `Login token sent to ${phone}` })
      }
    } catch (error) {
      console.log(error)
    }
  },
  async verifyToken (req, res) {
    try {
      const { token, phone } = req.body

      const user = await User.findOne({ phone }).where('phoneTokenExpires').gt(Date.now())
      if (!user) {
        return res.status(404).json({ success: false, message: 'Phone number not found or token has expired.' })
      }
      if (!user.phoneVerificationToken) {
        return res.status(404).json({ success: false, message: 'Token is invalid' })
      }

      const tokenVerified = await user.checkPhoneToken(token)

      if (tokenVerified) {
        const authToken = jwtUtils.generateToken(user, process.env.TOKEN_SECRET, '7 days')

        user.phoneVerificationToken = undefined
        user.phoneVerified = undefined
        user.phoneTokenExpires = undefined

        return res.json({ user, authToken })
      }
      return res.status(404).json({ success: false, message: 'Token not found' })
    } catch (error) {

    }
  }
}
