import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

const handler = NextAuth({
    session: { strategy: 'jwt' },
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                await dbConnect() // 📌 Asegurar que la BD está conectada

                const { email, password } = credentials

                // 📌 Buscar usuario en la base de datos
                const user = await User.findOne({ email })
                if (!user) {
                    console.error('❌ Usuario no encontrado:', email)
                    throw new Error('No existe el usuario')
                }

                // 📌 Comparar la contraseña hasheada
                const isPasswordValid = await bcrypt.compare(password, user.password)
                if (!isPasswordValid) {
                    console.error('❌ Contraseña incorrecta para:', email)
                    throw new Error('Credenciales inválidas')
                }

                console.log('✅ Usuario autenticado correctamente:', user.email)

                return {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    admin: user.admin
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.admin = user.admin
            }
            return token
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id
                session.user.admin = token.admin
            }
            return session
        }
    },
    pages: { signIn: '/login' }
})

export { handler as GET, handler as POST }
