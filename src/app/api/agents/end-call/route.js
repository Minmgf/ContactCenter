import { dbConnect } from '@/lib/dbConnect'
import Agent from '@/models/Agent'

export async function PATCH(req) {
    await dbConnect()
    const { id } = await req.json()

    if (!id) {
        return new Response(JSON.stringify({ message: 'ID requerido' }), { status: 400 })
    }

    const agent = await Agent.findById(id)
    if (!agent || !agent.callStartTime) {
        return new Response(JSON.stringify({ message: 'Agente no encontrado o sin llamada activa' }), { status: 404 })
    }

    const callDuration = Math.floor((new Date() - agent.callStartTime) / 1000) // En segundos
    agent.timeInCall += callDuration
    agent.callStartTime = null
    agent.status = 'disponible'
    await agent.save()

    return new Response(JSON.stringify({ message: 'Llamada finalizada', agent }), { status: 200 })
}
