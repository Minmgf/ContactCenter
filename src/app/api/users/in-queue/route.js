import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/User'

export async function GET() {
    try {
        await dbConnect()
        const usersInQueue = await User.find({ inQueue: true })
        return new Response(JSON.stringify(usersInQueue), { status: 200 })
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Error al obtener usuarios en cola' }), { status: 500 })
    }
}
