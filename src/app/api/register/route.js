import { dbConnect } from '@/lib/dbConnect'
import User from '@/models/User'
import bcrypt from 'bcryptjs'

export async function POST(request) {
    try {
        // 📌 Conectamos a la BD
        await dbConnect()

        // 📌 Obtenemos los datos del body
        const body = await request.json()
        const { name, email, password } = body

        // 📌 Validaciones
        if (!name || !email || !password) {
            return new Response(JSON.stringify({ message: 'Todos los campos son requeridos.' }), { status: 400 })
        }

        // 📌 Verificamos si el usuario ya existe
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return new Response(JSON.stringify({ message: 'El usuario ya existe.' }), { status: 400 })
        }

        // 📌 Hasheamos la contraseña con bcrypt
        const hashedPassword = await bcrypt.hash(password, 10)

        // 📌 Creamos un nuevo usuario
        const newUser = new User({
            name,
            email,
            password: hashedPassword,
            admin: false
        })
        await newUser.save()

        // 📌 Devolvemos una respuesta exitosa
        return new Response(JSON.stringify({
            message: 'Usuario creado correctamente.',
            user: { id: newUser._id, email: newUser.email, name: newUser.name, admin: newUser.admin }
        }), { status: 201 })

    } catch (error) {
        console.error('❌ Error en el registro:', error)
        return new Response(JSON.stringify({ message: 'Error interno del servidor.' }), { status: 500 })
    }
}
