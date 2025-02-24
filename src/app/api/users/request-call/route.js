import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/User'

export async function PATCH(req) {
    try {
        await dbConnect()
        const { id } = await req.json()

        console.log("🔍 ID recibido:", id)

        if (!id) {
            return new Response(JSON.stringify({ error: 'ID no proporcionado' }), { status: 400 })
        }

        const user = await User.findById(id)
        if (!user) {
            console.log("⚠️ Usuario no encontrado en la BD con ID:", id)
            return new Response(JSON.stringify({ error: 'Usuario no encontrado' }), { status: 404 })
        }

        user.inQueue = true
        await user.save()

        console.log("✅ Usuario actualizado correctamente:", user)
        return new Response(JSON.stringify(user), { status: 200 })
    } catch (error) {
        console.error("❌ Error en el servidor:", error)
        return new Response(JSON.stringify({ error: 'Error al solicitar llamada' }), { status: 500 })
    }
}
