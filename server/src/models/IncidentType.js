import mongoose from 'mongoose'

const Schema = mongoose.Schema

const IncidentTypeSchema = new Schema({
  incidents: [{ type: Schema.Types.ObjectId, ref: 'Incident' }],
  name: String,
  dangerousLevel: Number,
  description: String,
  createdAt: String,
  updateAt: String
}, { timestamps: true })

export default mongoose.model('IncidentType', IncidentTypeSchema)
