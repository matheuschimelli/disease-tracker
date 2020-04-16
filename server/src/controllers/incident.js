import { check, validationResult } from 'express-validator'

import User from '../models/User'
import Incident from '../models/Incident'
import IncidentType from '../models/IncidentType'

export default {

  async index (req, res) {
    try {
      const incidents = await Incident
        .find()
        .sort({ dangerLevel: -1 })
        .populate({ path: 'incidentType', select: 'name dangerousLevel description createdAt updateAt' })
      return res.send(incidents)
    } catch (error) {
      console.log(error)
      return res.status(404).send()
    }
  },

  async show (req, res) {
    try {
      const incident = await Incident.findById(req.params.id)
      if (!incident) return res.status(404).send()
      return res.send(incident)
    } catch (error) {
      console.log(error)
      return res.status(404).send()
    }
  },

  async create (req, res) {
    const authUser = req.user._id

    await check('description').isString().run(req)
    await check('title').isString().run(req)
    await check('dangerLevel').isNumeric().run(req)
    await check('lat').isFloat().run(req)
    await check('lng').isFloat().run(req)

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() })
    }
    console.log(req.body)

    const { incidentType, title, person, description, dangerLevel, lat, lng } = req.body

    const location = {
      type: 'Point',
      coordinates: [lng, lat]
    }
    try {
      const newIncident = await new Incident({
        author: authUser,
        incidentType: incidentType._id,
        title,
        person,
        description,
        dangerLevel,
        location
      }).save()

      await IncidentType.findOneAndUpdate(
        { _id: incidentType._id },
        { $push: { incidents: newIncident._id } }
      )
      await User.findOneAndUpdate(
        { _id: authUser },
        { $push: { incidents: newIncident._id } }
      )

      return res.status(201).send(newIncident)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, message: 'Cannot add new incident. Please try again later' })
    }
  },
  async delete (req, res) {
    try {
      const incident = await Incident.findOneAndDelete(req.params.id)
      return res.send(incident)
    } catch (error) {
      console.log(error)
    }
  }
}
