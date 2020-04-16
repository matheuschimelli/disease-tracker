import mongoose from 'mongoose'
import PointSchema from './utils/PointSchema'

const Schema = mongoose.Schema

const IncidentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  incidentType: { type: Schema.Types.ObjectId, ref: 'IncidentType' },
  dangerLevel: Number,
  title: String,
  description: String,
  person: {
    gender: String,
    age: Number,
    traveledAbroad: Boolean
  },
  verified: { type: Boolean, default: false },
  confirmationCode: String,
  confirmationEmmitedBy: String,
  medicalCenter: String,
  location: {
    type: PointSchema,
    index: '2dsphere'
  }

}, { timestamps: true })

export default mongoose.model('Incident', IncidentSchema)
