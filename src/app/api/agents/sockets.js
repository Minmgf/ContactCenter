import { WebSocketServer } from 'ws'
import { dbConnect } from '@/lib/dbConnect'
import Agent from '@/models/Agent'

let wss = null 

export function setupWebSocket(server) {
    if (!wss) {
        wss = new WebSocketServer({ server })

        wss.on('connection', (ws) => {
            console.log('Cliente conectado a WebSocket')

            ws.on('message', async (message) => {
                const data = JSON.parse(message)

                if (data.type === 'UPDATE_AGENT') {
                    await dbConnect()
                    await Agent.findByIdAndUpdate(data.id, { status: data.status }, { new: true })
                    broadcastAgents()
                }
            })

            ws.on('close', () => console.log('Cliente desconectado'))
        })
    }
}

// enviar la lista de agentes a todos los clientes conectados
export async function broadcastAgents() {
    await dbConnect()
    const agents = await Agent.find()

    wss.clients.forEach((client) => {
        if (client.readyState === 1) {
            client.send(JSON.stringify({ type: 'AGENTS_UPDATE', agents }))
        }
    })
}
