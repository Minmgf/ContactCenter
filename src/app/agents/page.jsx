'use client'

import Footer from '@/components/Footer'
import Navbar from '@/components/NavBar'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MdEdit } from "react-icons/md";
import { FaPhoneSlash } from "react-icons/fa";

const AgentsPage = () => {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [agents, setAgents] = useState([])
    const [queue, setQueue] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [editingAgent, setEditingAgent] = useState(null)
    const [inQueue, setInQueue] = useState(false)
    const [callStatus, setCallStatus] = useState({ assignedAgent: null, callDuration: 0 })
    const [filterStatus, setFilterStatus] = useState('todos')
    const [filterTime, setFilterTime] = useState('todos');

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

            console.log("📞 Lista de Agentes desde la API:", data);

            setAgents(data);
        } catch (error) {
            console.error('❌ Error al obtener agentes:', error);
        }
    };

    const fetchQueue = async () => {
        try {
            const res = await fetch('/api/users/in-queue');
            const data = await res.json();
    
            console.log("🔍 Datos de la cola desde API:", data);
    
            const updatedQueue = data.map(client => {
                if (!client.requestTime || isNaN(client.requestTime)) {
                    return { ...client, waitTime: 'Tiempo no disponible' }; // ⛔ Evita NaN
                }
    
                const waitTime = Math.floor((Date.now() - Number(client.requestTime)) / 1000); // ⏳ Calcular en segundos
                return { ...client, waitTime };
            });
    
            setQueue(updatedQueue);
    
            // ✅ Mantener `inQueue` en `true` si el usuario aún está en la cola
            if (session?.user) {
                const isUserStillInQueue = updatedQueue.some(client => client._id === session.user.id);
                setInQueue(isUserStillInQueue);
            }
    
        } catch (error) {
            console.error('❌ Error al obtener la cola de clientes:', error);
        }
    };


    const checkQueueStatus = async () => {
        try {
            if (!session?.user?.id) return

            console.log("📨 Verificando estado de la cola para ID:", session.user.id)

            const res = await fetch(`/api/users/${session.user.id}`)
            if (!res.ok) {
                const text = await res.text()
                console.error("❌ Respuesta inesperada:", text)
                return
            }

            const data = await res.json()
            setInQueue(data.inQueue)
        } catch (error) {
            console.error('❌ Error al verificar estado de la cola:', error)
        }
    }

    const handleRequestCall = async () => {
        try {
            if (!session?.user?.id) {
                console.error("⚠️ El usuario no tiene un ID válido:", session?.user)
                return
            }

            console.log("📨 Enviando solicitud con ID:", session.user.id)

            const res = await fetch('/api/users/request-call', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: session.user.id })
            })

            if (!res.ok) {
                const text = await res.text()
                console.error("❌ Respuesta inesperada:", text)
                return
            }

            const data = await res.json()
            console.log("✅ Usuario agregado a la cola:", data)
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

            if (!res.ok) {
                const text = await res.text();
                console.error("❌ Error en `handleEndCall()`, estado:", res.status, "Respuesta:", text);
                return;
            }

            console.log("✅ Llamada finalizada para el agente:", id);

            // 🔄 Refrescar datos después de finalizar la llamada
            await fetchAgents();
            await fetchQueue();
            await fetchCallStatus();
        } catch (error) {
            console.error("❌ Error al finalizar la llamada:", error);
        }
    };

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

    const handleAssignAgent = async (userId, agentId) => {
        try {
            console.log("📨 Asignando agente:", agentId, "a usuario:", userId)

            const res = await fetch('/api/users/assign-agent', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, agentId })
            })

            if (!res.ok) {
                const text = await res.text()
                console.error("❌ Respuesta inesperada en `handleAssignAgent()`, estado:", res.status, "Respuesta:", text)
                return
            }

            const data = await res.json()
            console.log("✅ Llamada asignada correctamente:", data)

            fetchQueue()
            fetchAgents()
            fetchCallStatus()
        } catch (error) {
            console.error('❌ Error al asignar agente:', error)
        }
    }

    const fetchCallStatus = async () => {
        try {
            const res = await fetch(`/api/users/call-status/${session.user.id}`);
            if (!res.ok) {
                const text = await res.text();
                console.error("❌ Error en `fetchCallStatus()`:", text);
                return;
            }

            const data = await res.json();

            console.log("📞 Estado de llamada actualizado desde la API:", data);

            setCallStatus({
                assignedAgent: data.assignedAgent || null,
                currentCallClient: data.currentCallClient || null,
                callDuration: data.callDuration || 0
            });


            await fetchAgents();
        } catch (error) {
            console.error('❌ Error al obtener estado de la llamada:', error);
        }
    };

    useEffect(() => {
        if (session?.user) {
            const interval = setInterval(() => {
                fetchCallStatus()
            }, 5000)
            return () => clearInterval(interval)
        }
    }, [session])



    // FILTROS
    const filteredAgents = agents.filter(agent => {
        if (filterStatus === 'todos') return true;
        if (filterStatus === 'disponible' && !agent.currentCallClient) return true;
        if (filterStatus === 'en llamada' && agent.currentCallClient) return true;
        return false;
    });

    const filteredQueue = queue.filter(client => {
        if (filterTime === 'todos') return true;
        if (filterTime === 'corto' && client.waitTime < 120) return true;
        if (filterTime === 'medio' && client.waitTime >= 120 && client.waitTime <= 300) return true;
        if (filterTime === 'largo' && client.waitTime > 300) return true;
        return false;
    });

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
                {!session?.user?.admin && (
                    <button
                        onClick={handleRequestCall}
                        disabled={inQueue || callStatus.assignedAgent}
                        className={`mb-4 p-2 mx-auto w-full rounded-lg text-white ${callStatus.assignedAgent ? 'bg-green-500' : inQueue ? 'bg-gray-500' : 'bg-yellow-500'}`}
                    >
                        {callStatus.assignedAgent
                            ? `En llamada con el Agente ${callStatus.assignedAgent.name}`
                            // ? `En llamada con el Agente ${callStatus.assignedAgent.name} (${callStatus.callDuration}s)`
                            : inQueue
                                ? 'Pronto se te atenderá'
                                : 'Solicitar Llamada'}
                    </button>
                )}
                <div>

                    {/* 🔹 Filtro de Agentes */}
                    <label className="text-white">Filtrar Agentes:</label>
                    <select onChange={(e) => setFilterStatus(e.target.value)} className="p-1 mb-2 border text-black">
                        <option value="todos">Todos</option>
                        <option value="disponible">Disponibles</option>
                        <option value="en llamada">En Llamada</option>
                    </select>

                    {filteredAgents.map((agent) => (

                        <div key={agent._id} className="flex justify-between gap-3 p-2 border mb-2">

                            <p className="w-1/3">{agent.name} - {agent.email}</p>
                            <div className="w-1/3 text-center">
                                {agent.currentCallClient ? (
                                    <span className="text-red-400">En llamada</span>
                                ) : (
                                    <span className="text-green-400">Disponible</span>
                                )}
                            </div>
                            {session?.user?.admin && (
                                <div className="flex gap-2">
                                    {agent.currentCallClient && (
                                        <button onClick={() => handleEndCall(agent._id)} className="text-red-500 text-x p-1">
                                            <FaPhoneSlash />
                                        </button>
                                    )}
                                    <button onClick={() => handleEditAgent(agent)} className=" text-white p-1">
                                        <MdEdit />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 🔴 Solo los administradores ven la cola de espera */}
                {session?.user?.admin && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">Clientes en Cola</h2>
                        <label className="text-white">Filtrar Clientes:</label>
                        <select onChange={(e) => setFilterTime(e.target.value)} className="p-1 border text-black my-2">
                            <option value="todos">Todos</option>
                            <option value="corto">Menos de 2 min</option>
                            <option value="medio">2 - 5 min</option>
                            <option value="largo">Más de 5 min</option>
                        </select>

                        <ul>
                            {filteredQueue.length === 0 ? (
                                <p>No hay clientes en espera</p>
                            ) : (
                                filteredQueue.map(user => (
                                    <li key={user._id} className="flex justify-between p-2 border mb-2">
                                        {user.name} - {user.email}
                                        <span className="text-yellow-400">
                                            {/* ✅ Ahora muestra correctamente el tiempo de espera */}
                                            ({`Espera: ${user.waitTime} segundos`})
                                        </span>
                                        <select onChange={(e) => handleAssignAgent(user._id, e.target.value)} className="p-1 border text-gray-800">
                                            <option value="">Seleccionar Agente</option>
                                            {agents.map(agent => (
                                                <option key={agent._id} value={agent._id}>{agent.name}</option>
                                            ))}
                                        </select>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}

            </div>
            <Footer />
        </div>
    )
}

export default AgentsPage