import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/User'
import Agent from '@/models/Agent'

export async function GET(req, context) {
    try {
        await dbConnect()

        // ✅ Extraer `id` correctamente desde `context.params`
        const { id } = await context.params
        console.log("🔍 Buscando estado de llamada para el usuario o agente con ID:", id)

        if (!id) {
            console.error("❌ Error: No se proporcionó un ID válido en params.")
            return new Response(JSON.stringify({ error: 'ID no proporcionado' }), { status: 400 })
        }

        // Buscar el usuario en `users` y el agente en `agents`
        const user = await User.findById(id).populate({
            path: 'assignedAgent',
            select: 'name email'
        })

        const agent = await Agent.findById(id).populate({
            path: 'currentCallClient',
            select: 'name email'
        })

        if (!user && !agent) {
            console.log("⚠️ Usuario o Agente no encontrado en la BD con ID:", id)
            return new Response(JSON.stringify({ error: 'Usuario o Agente no encontrado' }), { status: 404 })
        }

        const callDuration = agent?.callStartTime
            ? Math.floor((new Date() - agent.callStartTime) / 1000)
            : 0

        console.log("📞 Estado de llamada encontrado:", {
            assignedAgent: user?.assignedAgent ? user.assignedAgent.name : null,
            currentCallClient: agent?.currentCallClient ? agent.currentCallClient.name : null,
            callDuration
        })

        return new Response(JSON.stringify({
            assignedAgent: user?.assignedAgent ? { name: user.assignedAgent.name, email: user.assignedAgent.email } : null,
            currentCallClient: agent?.currentCallClient ? { name: agent.currentCallClient.name, email: agent.currentCallClient.email } : null,
            callDuration
        }), { status: 200 })
    } catch (error) {
        console.error("❌ Error en el servidor:", error)
        return new Response(JSON.stringify({ error: 'Error al obtener estado de la llamada' }), { status: 500 })
    }
}
