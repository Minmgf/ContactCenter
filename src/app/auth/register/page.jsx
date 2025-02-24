'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import InputItem from '@/components/InputItem'
import useForm from '@/hooks/useForm'

const Register = () => {
    const { formState, name, email, password, onInputChange, onResetForm } = useForm({
        name: '',
        email: '',
        password: '',
    })

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleRegister = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            if (!res.ok) {
                const { message } = await res.json()
                throw new Error(message || 'Ocurrió un error al registrar')
            }

            onResetForm()
            router.push('/auth/login') // Redirige al login después del registro exitoso
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex justify-center items-center min-h-screen w-full'>
            <section className='w-1/2 hidden md:flex justify-center items-center h-screen p-4'>
                <Image
                    className='mx-auto'
                    src="/logo.png"
                    width={500}
                    height={500}
                    alt="Logo"
                />
            </section>

            <section className="flex-col md:w-1/2 flex items-center justify-center h-screen">
                <form
                    onSubmit={handleRegister}
                    className="flex flex-col gap-4 justify-center items-center p-4 rounded-lg bg-gray-500 bg-opacity-55 drop-shadow-lg">
                    <h1 className='text-center text-xl font-bold text-white'>Crea tu cuenta</h1>

                    <InputItem
                        id={'name'}
                        name='name'
                        value={name}
                        onChange={onInputChange}
                        labelName={'Nombre Completo'}
                        placeholder={'Ingresa tu nombre'}
                        type={'text'}
                    />
                    <InputItem
                        id={'email'}
                        name='email'
                        value={email}
                        onChange={onInputChange}
                        labelName={'Correo'}
                        placeholder={'test@gmail.com'}
                        type={'email'}
                    />
                    <InputItem
                        id={'password'}
                        name='password'
                        value={password}
                        onChange={onInputChange}
                        labelName={'Contraseña'}
                        placeholder={'********'}
                        type={'password'}
                    />

                    {error && <p className='text-red-500'>{error}</p>}

                    <button
                        type='submit'
                        disabled={loading}
                        className='bg-white rounded-lg py-2 w-[80%]'>
                        {loading ? 'Registrando...' : 'Registrar'}
                    </button>

                    <span className='text-sm'>
                        ¿Ya tienes cuenta? <Link href='/auth/login' className='text-white'>Inicia sesión aquí</Link>
                    </span>
                </form>
            </section>
        </div>
    )
}

export default Register
