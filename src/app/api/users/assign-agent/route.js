import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/User'
import Agent from '@/models/Agent'
import mongoose from 'mongoose'

export async function PATCH(req) {
    try {
        await dbConnect()
        const { userId, agentId } = await req.json()

        console.log("📨 Recibido userId (Cliente):", userId)
        console.log("📨 Recibido agentId (Agente):", agentId)

        if (!userId || !agentId) {
            console.error("❌ Error: Faltan IDs en la solicitud.")
            return new Response(JSON.stringify({ error: 'IDs de Usuario y Agente son requeridos' }), { status: 400 })
        }

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(agentId)) {
            console.error("❌ Error: Uno de los IDs no es válido en MongoDB")
            return new Response(JSON.stringify({ error: 'Formato de ID inválido' }), { status: 400 })
        }

        const agent = await Agent.findById(agentId)
        if (!agent) {
            console.error("⚠️ Agente no encontrado en la BD con ID:", agentId)
            return new Response(JSON.stringify({ error: 'Agente no encontrado' }), { status: 404 })
        }

        const user = await User.findById(userId)
        if (!user) {
            console.error("⚠️ Usuario no encontrado en la BD con ID:", userId)
            return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404 })
        }

        // 🔄 Asegurar que los datos se guardan correctamente
        agent.status = "en llamada"
        agent.callStartTime = new Date()
        agent.currentCallClient = user._id
        await agent.save()

        user.inQueue = false
        user.assignedAgent = agent._id
        await user.save()

        console.log(`✅ Llamada iniciada entre el agente ${agent.name} y el usuario ${user.name}`)
        console.log("📌 Estado de usuario después de la actualización:", user)
        console.log("📌 Estado de agente después de la actualización:", agent)

        return new Response(JSON.stringify({ 
            message: 'Llamada iniciada',
            agent: { name: agent.name, email: agent.email, currentCallClient: agent.currentCallClient },
            user: { name: user.name, email: user.email, assignedAgent: user.assignedAgent }
        }), { status: 200 })
    } catch (error) {
        console.error("❌ Error en el servidor:", error)
        return new Response(JSON.stringify({ error: 'Error interno en el servidor' }), { status: 500 })
    }
}
