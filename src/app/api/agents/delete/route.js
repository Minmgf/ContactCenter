import { dbConnect } from '@/lib/dbConnect'
import Agent from '@/models/Agent'

export async function DELETE(req) {
    await dbConnect()
    const { id } = await req.json()

    if (!id) {
        return new Response(JSON.stringify({ message: 'ID requerido' }), { status: 400 })
    }

    await Agent.findByIdAndDelete(id)
    return new Response(JSON.stringify({ message: 'Agente eliminado' }), { status: 200 })
}
