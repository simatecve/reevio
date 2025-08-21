import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    // Validaciones básicas
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Todos los campos son requeridos' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener al menos 6 caracteres' },
        { status: 400 }
      )
    }

    // Aquí iría la lógica de registro (crear usuario en base de datos)
    // Por ahora, simulamos una respuesta exitosa
    return NextResponse.json(
      { 
        success: true, 
        message: 'Usuario registrado exitosamente',
        user: { email, name, id: Date.now().toString() }
      },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    )
  }
}