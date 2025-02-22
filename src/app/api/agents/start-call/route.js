import { dbConnect } from '@/lib/dbConnect'
import Agent from '@/models/Agent'

export async function PATCH(req) {
    await dbConnect()
    const { id } = await req.json()

    if (!id) {
        return new Response(JSON.stringify({ message: 'ID requerido' }), { status: 400 })
    }

    const agent = await Agent.findById(id)
    if (!agent) {
        return new Response(JSON.stringify({ message: 'Agente no encontrado' }), { status: 404 })
    }

    agent.status = 'en llamada'
    agent.callStartTime = new Date()
    await agent.save()

    return new Response(JSON.stringify(agent), { status: 200 })
}
