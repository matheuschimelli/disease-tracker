import * as jwtUtils from '../utils/jwt'
const AUTH_TOKEN_EXPIRY = '1y'
export default {
  googleCallback (req, res) {
    console.log(req.user)
    const token = jwtUtils.generateToken(req.user, process.env.TOKEN_SECRET, AUTH_TOKEN_EXPIRY)
    req.user.tokens = undefined
    req.user.google = undefined
    req.user.createdAt = undefined
    req.user.updatedAt = undefined
    req.user.phoneVerificationToken = undefined
    req.user.phoneVerified = undefined
    req.user.phoneTokenExpires = undefined
    req.user.__v = undefined
    return res.redirect(`${process.env.CLIENT_URL}/verify?token=${token}`)
  }
}
