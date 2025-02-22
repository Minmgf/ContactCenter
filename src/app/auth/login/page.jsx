'use client'

import React from 'react'
import InputItem from '@/components/InputItem'
import Image from 'next/image'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import useForm from '@/hooks/useForm'
import { useRouter } from 'next/navigation'

const Login = () => {
  const { email, password, onInputChange, onResetForm } = useForm({
    email: '',
    password: '',
  })

  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    if (!result?.error) {
      router.push('/')
    }
  }

  return (
    <div className="flex items-center min-h-screen w-full ">
      <section className="w-1/2 flex justify-center items-center h-screen p-4">
        <Image src="/logo.png" width={500} height={500} alt="Logo" />
      </section>

      <section className="flex-col w-1/2 flex items-center justify-center h-screen">
        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-4 justify-center items-center p-4 rounded-lg bg-gray-500 bg-opacity-55 drop-shadow-lg">
          <span>
            <h1 className="text-xl font-bold text-white">Bienvenido de nuevo</h1>
            <h1 className="text-xl font-bold text-center text-white">Inicia Sesión</h1>
          </span>

          <InputItem labelName="Correo" name="email" type="email" value={email} onChange={onInputChange} />
          <InputItem labelName="Contraseña" name="password" type="password" value={password} onChange={onInputChange} />

          <button type="submit" className="bg-white rounded-lg  py-2 w-[80%]">Iniciar Sesión</button>
          <span className="text-sm">¿No tienes cuenta? <Link href="/auth/register" className="text-white">Regístrate</Link></span>
        </form>
      </section>
    </div>
  )
}

export default Login
