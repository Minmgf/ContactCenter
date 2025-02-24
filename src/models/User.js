// import mongoose from 'mongoose'

// const UserSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     admin: { type: Boolean, default: false },
//     inQueue: { type: Boolean, default: false },
//     assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
//     callStartTime: { type: Date, default: null },
//     currentCallClient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
// })

// export default mongoose.models.User || mongoose.model('User', UserSchema)


import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    inQueue: { type: Boolean, default: false },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'Agent', default: null } // ✅ Referencia correcta a Agent
})

export default mongoose.models.User || mongoose.model('User', UserSchema)
