import { dbConnect } from '@/lib/dbConnect'
import Agent from '@/models/Agent'

export async function PATCH(req) {
    await dbConnect()
    const { id, status } = await req.json()

    if (!id || !status) {
        return new Response(JSON.stringify({ message: 'ID y estado son requeridos' }), { status: 400 })
    }

    const updatedAgent = await Agent.findByIdAndUpdate(id, { status }, { new: true })
    return new Response(JSON.stringify(updatedAgent), { status: 200 })
}
