import mongoose from 'mongoose'

const AgentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: ['disponible', 'en llamada', 'ocupado'], default: 'disponible' },
    callStartTime: { type: Date, default: null },
    timeInCall: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Agent || mongoose.model('Agent', AgentSchema)
