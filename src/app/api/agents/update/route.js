import { dbConnect } from '@/lib/dbConnect'
import Agent from '@/models/Agent';

export async function PATCH(req) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, name, email } = body;

        if (!id || !name || !email) {
            return new Response(JSON.stringify({ success: false, message: 'Todos los campos son requeridos' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const agent = await Agent.findById(id);

        if (!agent) {
            return new Response(JSON.stringify({ success: false, message: 'Agente no encontrado' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        agent.name = name;
        agent.email = email;
        await agent.save();

        return new Response(JSON.stringify({ success: true, message: 'Agente actualizado correctamente', agent }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('❌ Error al actualizar el agente:', error);
        return new Response(JSON.stringify({ success: false, message: 'Error interno del servidor' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
