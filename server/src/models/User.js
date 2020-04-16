import bcrypt from 'bcrypt'
import crypto from 'crypto'
import mongoose from 'mongoose'

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: { type: String, unique: true, trim: true, lowercase: true },
  password: String,
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailVerificationToken: String,
  emailVerified: Boolean,

  phone: String,
  phoneVerificationToken: String,
  phoneVerified: Boolean,
  phoneTokenExpires: Date,

  facebook: String,
  google: String,
  tokens: Array,

  profile: {
    name: String,
    gender: String,
    location: String,
    website: String,
    picture: String
  },

  incidents: [{ type: Schema.Types.ObjectId, ref: 'Incident' }]
}, { timestamps: true })

/**
 * Password hash middleware.
 */
userSchema.pre('save', function save (next) {
  const user = this
  if (!user.isModified('password')) { return next() }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) { return next(err) }
      user.password = hash
      next()
    })
  })
})
userSchema.pre('save', function save (next) {
  const user = this
  if (!user.isModified('phoneVerificationToken')) { return next() }

  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err) }
    bcrypt.hash(user.phoneVerificationToken, salt, (err, hash) => {
      if (err) { return next(err) }
      user.phoneVerificationToken = hash
      next()
    })
  })
})

/**
 * Helper method for validating user's password.
 */
userSchema.methods.comparePassword = function comparePassword (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch)
  })
}

/**
 * Helper method for validating user's password.
 */
userSchema.methods.checkPhoneToken = function checkToken (token) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(token, this.phoneVerificationToken, (err, isMatch) => {
      if (err) {
        reject(err)
      }
      resolve(isMatch)
    })
  })
}

/**
 * Helper method for getting user's gravatar.
 */
userSchema.methods.gravatar = function gravatar (size) {
  if (!size) {
    size = 200
  }
  if (!this.email) {
    return `https://gravatar.com/avatar/?s=${size}&d=retro`
  }
  const md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=${size}&d=retro`
}

export default mongoose.model('User', userSchema)
