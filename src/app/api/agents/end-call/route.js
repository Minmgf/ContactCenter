import { dbConnect } from '@/lib/dbConnect';
import Agent from '@/models/Agent';
import User from '@/models/User';

export async function PATCH(req) {
    try {
        await dbConnect();
        const { id } = await req.json();

        if (!id) {
            return new Response(JSON.stringify({ error: 'ID del agente es requerido' }), { status: 400 });
        }

        const agent = await Agent.findById(id);
        if (!agent) {
            return new Response(JSON.stringify({ error: 'Agente no encontrado' }), { status: 404 });
        }

        if (!agent.currentCallClient) {
            return new Response(JSON.stringify({ message: 'El agente no tiene llamada activa' }), { status: 200 });
        }

        // ✅ Buscar el usuario en llamada con este agente
        const user = await User.findById(agent.currentCallClient);

        if (user) {
            user.assignedAgent = null; // Limpiar referencia del agente
            await user.save();
        }

        // ✅ Limpiar estado del agente
        agent.currentCallClient = null;
        agent.status = 'disponible';
        await agent.save();

        return new Response(JSON.stringify({ message: 'Llamada finalizada correctamente', agent, user }), { status: 200 });
    } catch (error) {
        console.error("❌ Error al finalizar llamada:", error);
        return new Response(JSON.stringify({ error: 'Error al finalizar llamada' }), { status: 500 });
    }
}
