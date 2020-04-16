import express from 'express'
import passport from 'passport'

import * as passportConfig from './config/passport'

import userController from './controllers/user'
import authController from './controllers/auth'
import socialAuthController from './controllers/socialauth'

import incidentController from './controllers/incident'
import incidentTypeController from './controllers/incidentType'

const routes = express.Router()

routes.get('/', (req, res) => {
  res.send('rocket coolde')
})

routes.post('/auth/phone', authController.loginWithNumber)
routes.post('/auth/phone/verify', authController.verifyToken)
routes.get('/auth/google', passport.authenticate('google', {
  scope: ['openid',
    'profile',
    'email'],
  accessType: 'offline',
  prompt: 'consent'
}))
routes.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), socialAuthController.googleCallback)
routes.get('/api/auth/user', passportConfig.isAuthenticated, userController.show)

routes.get('/api/v1/incidents', incidentController.index)
routes.get('/api/v1/incidents/:id', incidentController.show)
routes.post('/api/v1/incidents', passportConfig.isAuthenticated, incidentController.create)
// routes.put('/api/v1/incidents/:id', passportConfig.isAuthenticated, incidentController.update)
routes.delete('/api/v1/incidents/:id', passportConfig.isAuthenticated, incidentController.delete)

routes.get('/api/v1/incidenttypes', incidentTypeController.index)
routes.get('/api/v1/incidenttypes/:id', incidentTypeController.show)
routes.post('/api/v1/incidenttypes', passportConfig.isAuthenticated, incidentTypeController.create)
routes.put('/api/v1/incidenttypes/:id', passportConfig.isAuthenticated, incidentTypeController.update)
routes.delete('/api/v1/incidenttypes/:id', passportConfig.isAuthenticated, incidentTypeController.delete)

export default routes
