import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Aquí iría la lógica de autenticación
    // Por ahora, simulamos una respuesta exitosa
    if (email && password) {
      return NextResponse.json(
        { 
          success: true, 
          message: 'Login exitoso',
          user: { email, id: '1' }
        },
        { status: 200 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Credenciales inválidas' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Error del servidor' },
      { status: 500 }
    )
  }
}