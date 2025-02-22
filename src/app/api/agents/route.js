import { dbConnect } from '@/lib/dbConnect'
import Agent from '@/models/Agent'

// Obtener todos los agentes
export async function GET() {
    await dbConnect()
    const agents = await Agent.find()
    return new Response(JSON.stringify(agents), { status: 200 })
}

// Crear un nuevo agente
export async function POST(req) {
    await dbConnect()
    const { name, email } = await req.json()

    if (!name || !email) {
        return new Response(JSON.stringify({ message: 'Todos los campos son requeridos' }), { status: 400 })
    }

    const existingAgent = await Agent.findOne({ email })
    if (existingAgent) {
        return new Response(JSON.stringify({ message: 'El agente ya existe' }), { status: 400 })
    }

    const newAgent = await Agent.create({ name, email })
    return new Response(JSON.stringify(newAgent), { status: 201 })
}
