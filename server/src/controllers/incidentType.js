import User from '../models/User'
import IncidentType from '../models/IncidentType'

export default {
  async index (req, res) {
    try {
      const incidents = await IncidentType.find().populate('incidents')
      return res.send(incidents)
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'No incidents to show' })
    }
  },
  async show (req, res) {
    const { id } = req.params
    try {
      const incident = await IncidentType.findOne({ _id: id }).populate('incidents')
      return res.send(incident)
    } catch (error) {
      console.log(error)
      return res.status(404).json({ message: 'No incidents to show' })
    }
  },
  async create (req, res) {
    const { name, description } = req.body
    try {
      const newIncidentType = await new IncidentType({
        name,
        description
      }).save()
      return res.status(201).send(newIncidentType)
    } catch (error) {
      return res.status(400).json({ message: 'No incidents to show' })
    }
  },
  async update (req, res) {
    const { id } = req.params

    console.log(id)

    try {
      const updateIncidentType = await IncidentType.findOneAndUpdate(id,
        req.body
      )
      return res.send(updateIncidentType)
    } catch (error) {
      console.log(error)
      return res.status(400).json({ message: 'No incidents to show' })
    }
  },
  async delete (req, res) {
    const id = req.params
    try {
      const deletedIncidentType = await IncidentType.findOneAndDelete({ _id: id })
      return res.send(deletedIncidentType)
    } catch (error) {
      return res.status(400).json({ message: 'No incidents to show' })
    }
  }

}
