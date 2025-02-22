'use client'

import Footer from '@/components/Footer'
import Navbar from '@/components/NavBar'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const AgentsPage = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [agents, setAgents] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    // Redirigir si el usuario no está autenticado
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login')
        }
    }, [status, router])

    useEffect(() => {
        fetchAgents()
    }, [])

    const fetchAgents = async () => {
        const res = await fetch('/api/agents')
        const data = await res.json()
        setAgents(data)
    }

    const handleCreateAgent = async (e) => {
        e.preventDefault()
        setLoading(true)

        await fetch('/api/agents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        })

        setLoading(false)
        fetchAgents()
    }

    const handleStartCall = async (id) => {
        await fetch('/api/agents/start-call', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        fetchAgents()
    }

    const handleEndCall = async (id) => {
        await fetch('/api/agents/end-call', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        fetchAgents()
    }

    const handleDeleteAgent = async (id) => {
        await fetch('/api/agents/delete', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        fetchAgents()
    }

    return (
        <div className="text-white">
            <Navbar />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Lista de Agentes</h1>

                {/* 🟢 Solo los Admins ven el CRUD */}
                {session?.user?.admin && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">Crear Agente</h2>
                        <form onSubmit={handleCreateAgent} className="flex flex-col gap-2 mb-4 text-black">
                            <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} className="border p-2" />
                            <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2" />
                            <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2">
                                {loading ? 'Creando...' : 'Crear Agente'}
                            </button>
                        </form>
                    </div>
                )}

                <h2 className="text-xl font-semibold mb-2">Agentes Disponibles</h2>
                <ul>
                    {agents.map((agent) => (
                        <li key={agent._id} className="flex justify-between p-2 border mb-2">
                            {agent.name} - {agent.email} - {agent.status}

                            {/* 🟢 Solo los Admins pueden gestionar llamadas y eliminar */}
                            {session?.user?.admin && (
                                <div className="flex gap-2">
                                    {agent.status === 'disponible' && (
                                        <button onClick={() => handleStartCall(agent._id)} className="bg-green-500 text-white p-1">Iniciar Llamada</button>
                                    )}
                                    {agent.status === 'en llamada' && (
                                        <button onClick={() => handleEndCall(agent._id)} className="bg-red-500 text-white p-1">Finalizar Llamada</button>
                                    )}
                                    <button onClick={() => handleDeleteAgent(agent._id)} className="bg-red-500 text-white p-1">Eliminar</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <Footer />
        </div>
    )
}

export default AgentsPage
