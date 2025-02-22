'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const { data: session, status } = useSession()
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        name: session.user.name,
        email: session.user.email,
        role: session.user.admin ? 'agent' : 'client' // Ajusta según el modelo
      })
    } else {
      setUser(null)
    }
  }, [session, status])

  return (
    <AuthContext.Provider value={{ user, status, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
