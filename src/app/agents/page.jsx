'use client'

import Footer from '@/components/Footer'
import Navbar from '@/components/NavBar'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

const AgentsPage = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [agents, setAgents] = useState([])
    const [queue, setQueue] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [editingAgent, setEditingAgent] = useState(null) // 🔹 Nuevo estado para editar agentes
    const [inQueue, setInQueue] = useState(false)
    const [callStatus, setCallStatus] = useState({ assignedAgent: null, callDuration: 0 })

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login')
        }
    }, [status, router])

    useEffect(() => {
        fetchAgents()
        if (session?.user) checkQueueStatus()
        if (session?.user?.admin) fetchQueue()

        const interval = setInterval(() => {
            fetchAgents()
            if (session?.user?.admin) fetchQueue()
        }, 5000)

        return () => clearInterval(interval)
    }, [session])

    const fetchAgents = async () => {
        try {
            const res = await fetch('/api/agents');
            const data = await res.json();
            setAgents(data);
        } catch (error) {
            console.error('❌ Error al obtener agentes:', error);
        }
    };

    const fetchQueue = async () => {
        try {
            const res = await fetch('/api/users/in-queue')
            const data = await res.json()
            setQueue(data)
        } catch (error) {
            console.error('❌ Error al obtener la cola de clientes:', error)
        }
    }

    const checkQueueStatus = async () => {
        try {
            if (!session?.user?.id) return

            const res = await fetch(`/api/users/${session.user.id}`)
            if (!res.ok) return

            const data = await res.json()
            setInQueue(data.inQueue)
        } catch (error) {
            console.error('❌ Error al verificar estado de la cola:', error)
        }
    }

    const handleRequestCall = async () => {
        try {
            if (!session?.user?.id) return

            const res = await fetch('/api/users/request-call', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: session.user.id })
            })

            if (!res.ok) return

            const data = await res.json()
            setInQueue(true)
        } catch (error) {
            console.error("❌ Error en la solicitud de llamada:", error)
        }
    }

    const handleCreateOrUpdateAgent = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = editingAgent ? `/api/agents/update` : `/api/agents`;
            const method = editingAgent ? 'PATCH' : 'POST';

            await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingAgent?._id, name, email })
            });

            setEditingAgent(null) // Limpiar edición
            setName('');
            setEmail('');
            fetchAgents();
        } catch (error) {
            console.error('❌ Error al crear/actualizar agente:', error)
        } finally {
            setLoading(false)
        }
    }

    // 📌 Cargar datos del agente para edición
    const handleEditAgent = (agent) => {
        setEditingAgent(agent)
        setName(agent.name)
        setEmail(agent.email)
    }

    const handleEndCall = async (id) => {
        try {
            const res = await fetch('/api/agents/end-call', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });

            if (!res.ok) return

            await fetchAgents();
            await fetchQueue();
            await fetchCallStatus();
        } catch (error) {
            console.error("❌ Error al finalizar la llamada:", error);
        }
    };

    // 📌 ELIMINAR AGENTE (desde el CRUD)
    const handleDeleteAgent = async () => {
        if (!editingAgent) return;

        try {
            await fetch('/api/agents/delete', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: editingAgent._id })
            });

            setEditingAgent(null)
            setName('');
            setEmail('');
            fetchAgents();
        } catch (error) {
            console.error('❌ Error al eliminar agente:', error);
        }
    }

    return (
        <div className="text-white">
            <Navbar />
            <div className="p-4">
                <h1 className="text-2xl font-bold mb-4">Lista de Agentes</h1>

                {/* 🟢 FORMULARIO CRUD */}
                {session?.user?.admin && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold mb-2">{editingAgent ? "Editar Agente" : "Crear Agente"}</h2>
                        <form onSubmit={handleCreateOrUpdateAgent} className="flex flex-col gap-2 mb-4 text-black">
                            <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} className="border p-2" />
                            <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2" />
                            <div className="flex gap-2">
                                <button type="submit" disabled={loading} className="bg-blue-500 text-white p-2 w-full">
                                    {loading ? 'Guardando...' : editingAgent ? 'Actualizar Agente' : 'Crear Agente'}
                                </button>
                                {editingAgent && (
                                    <button type="button" onClick={handleDeleteAgent} className="bg-red-500 text-white p-2 w-full">
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}

                <h2 className="text-xl font-semibold mb-2">Agentes en turno</h2>
                <div>
                    {agents.map((agent) => (
                        <div key={agent._id} className="flex justify-between gap-3 p-2 border mb-2">
                            <p className="w-1/3">{agent.name} - {agent.email}</p>
                            <div className="w-1/3 text-center">
                                {agent.currentCallClient ? (
                                    <span className="text-green-400">En llamada con {agent.currentCallClient.name}</span>
                                ) : (
                                    <span className="text-gray-400">Disponible</span>
                                )}
                            </div>
                            {session?.user?.admin && (
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditAgent(agent)} className=" text-white p-1">
                                    <MdEdit />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default AgentsPage
