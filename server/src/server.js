import express from 'express'
import compression from 'compression'
import * as bodyParser from 'body-parser'
import lusca from 'lusca'
import * as dotenv from 'dotenv'
import errorHandler from 'errorhandler'
import passport from 'passport'
import mongoose from 'mongoose'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import chalk from 'chalk'
import routes from './routes'
import User from './models/User'

dotenv.config({ path: '.env.example' })

const app = express()

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)
mongoose.set('useNewUrlParser', true)
mongoose.set('useUnifiedTopology', true)
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('error', (err) => {
  console.error(err)
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'))
  process.exit()
})
app.set('host', process.env.HOST || '0.0.0.0')
app.set('port', process.env.PORT || 8080)
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(passport.initialize())
app.use(passport.session())

app.use(lusca.xframe('SAMEORIGIN'))
app.use(lusca.xssProtection(true))
app.disable('x-powered-by')

app.use(cors({
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

app.use(async (req, res, next) => {
  req.isAuthenticated = () => {
    let token = req.headers.authorization
    if (token) {
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length)
      }
      try {
        return jwt.verify(token, process.env.TOKEN_SECRET)
      } catch (err) {
        console.log(err)
        return false
      }
    } else {
      return false
    }
  }

  if (req.isAuthenticated()) {
    const payload = req.isAuthenticated()
    try {
      const user = await User.findById(payload.id)
      user.tokens = undefined
      user.google = undefined
      user.createdAt = undefined
      user.updatedAt = undefined
      user.phoneVerificationToken = undefined
      user.phoneVerified = undefined
      user.phoneTokenExpires = undefined
      user.__v = undefined
      req.user = user
      next()
    } catch (error) {
      console.log(error)
    }
  } else {
    next()
  }
})
app.use((req, res, next) => {
  res.locals.user = req.user
  next()
})

app.use(routes)

if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorHandler())
} else {
  app.use((err, req, res, next) => {
    console.error(err)
    res.status(500).send('Server Error')
  })
}

app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env'))
})
