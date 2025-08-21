import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { createSupabaseAdmin } from '@/lib/supabase';
import { ensureUserProfile } from '@/lib/profile';

const supabaseAdmin = createSupabaseAdmin();

export async function GET(
  request: NextRequest,
  { params }: { params: { board_id: string } }
) {
  try {
    // Verificar autenticación
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Asegurar que el perfil del usuario existe
    const userId = await ensureUserProfile(session.user.id, session.user.email, session.user.name);
    if (!userId) {
      return NextResponse.json(
        { error: 'Failed to create or get user profile' },
        { status: 500 }
      );
    }

    const board_id = params.board_id;

    if (!board_id) {
      return NextResponse.json(
        { error: 'Board ID is required' },
        { status: 400 }
      );
    }

    // Obtener todos los posts del board para luego filtrar los votos
    const { data: posts, error: postsError } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('board_id', board_id);

    if (postsError) {
      console.error('Error fetching posts:', postsError);
      return NextResponse.json(
        { error: 'Failed to fetch posts' },
        { status: 500 }
      );
    }

    if (!posts || posts.length === 0) {
      return NextResponse.json({
        success: true,
        votes: []
      });
    }

    const postIds = posts.map(post => post.id);

    // Obtener votos del usuario para estos posts
    const { data: votes, error: votesError } = await supabaseAdmin
      .from('votes')
      .select('*')
      .eq('user_id', userId)
      .in('post_id', postIds);

    if (votesError) {
      console.error('Error fetching user votes:', votesError);
      return NextResponse.json(
        { error: 'Failed to fetch user votes' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      votes: votes || []
    });

  } catch (error) {
    console.error('Error in get user votes API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}