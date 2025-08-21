import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { createSupabaseAdmin } from '@/lib/supabase';

const supabaseAdmin = createSupabaseAdmin();

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { title, description, board_id } = await request.json();

    // Validar datos requeridos
    if (!title?.trim() || !board_id) {
      return NextResponse.json(
        { error: 'Title and board_id are required' },
        { status: 400 }
      );
    }

    // Verificar que el board existe
    const { data: board, error: boardError } = await supabaseAdmin
      .from('boards')
      .select('id')
      .eq('id', board_id)
      .single();

    if (boardError || !board) {
      return NextResponse.json(
        { error: 'Board not found' },
        { status: 404 }
      );
    }

    // Crear el post
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .insert({
        title: title.trim(),
        description: description?.trim() || null,
        board_id: board_id,
        user_id: session.user.id
      })
      .select(`
        *,
        profiles (
          name,
          email
        )
      `)
      .single();

    if (postError) {
      console.error('Error creating post:', postError);
      return NextResponse.json(
        { error: 'Failed to create post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post: post
    });

  } catch (error) {
    console.error('Error in create post API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}