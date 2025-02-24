'use client' // ✅ MARCA EL NAVBAR COMO CLIENT COMPONENT

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { LuLogIn } from "react-icons/lu";
import { LuLogOut } from "react-icons/lu";



function AuthLinks() {
    const { status, user, signOut } = useAuth()

    if (status === 'authenticated') {
        return (
            <div className='flex items-center gap-4'>
                <Link href={'/'} className=" hidden md:flex lg:flex whitespace-nowrap ">
                    Hola, {user?.name}
                </Link>
                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="p-2 text-white rounded-full bg-gray-300 bg-opacity-25"
                >
                    <LuLogOut />
                </button>
            </div>
        )
    }

    if (status === 'unauthenticated') {
        return (
            <div className=' p-2 rounded-full bg-opacity-25 bg-gray-300 '>
                <Link href={'auth/login'} ><LuLogIn /></Link>
            </div>
        )
    }

    return null
}

export default function Navbar() {
    return (
        <nav className="flex justify-between p-4  text-white">
            <div className="font-bold">
                <Link href={'/'}>ContactCenter</Link>
            </div>
            <div className="flex gap-4">
                <Link className='hidden md:block' href={'/'}>Inicio</Link>
                <Link href={'/agents'}>Agentes</Link>
            </div>
            <div className="">
                <AuthLinks />
            </div>
        </nav>
    )
}
