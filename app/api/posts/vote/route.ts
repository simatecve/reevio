import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { createSupabaseAdmin } from '@/lib/supabase';
import { ensureUserProfile } from '@/lib/profile';

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

    // Asegurar que el perfil del usuario existe
    const userId = await ensureUserProfile(session.user.id, session.user.email, session.user.name);
    if (!userId) {
      return NextResponse.json(
        { error: 'Failed to create or get user profile' },
        { status: 500 }
      );
    }

    const { post_id, vote_type } = await request.json();

    // Validar datos requeridos
    if (!post_id || (vote_type !== 1 && vote_type !== -1)) {
      return NextResponse.json(
        { error: 'post_id and vote_type (1 or -1) are required' },
        { status: 400 }
      );
    }

    // Verificar que el post existe
    const { data: post, error: postError } = await supabaseAdmin
      .from('posts')
      .select('id')
      .eq('id', post_id)
      .single();

    if (postError || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Verificar si ya existe un voto del usuario para este post
    const { data: existingVote, error: voteError } = await supabaseAdmin
      .from('votes')
      .select('*')
      .eq('post_id', post_id)
      .eq('user_id', userId)
      .single();

    let result;

    if (existingVote) {
      if (existingVote.vote_type === vote_type) {
        // Si es el mismo tipo de voto, eliminar el voto
        const { error: deleteError } = await supabaseAdmin
          .from('votes')
          .delete()
          .eq('id', existingVote.id);

        if (deleteError) {
          console.error('Error removing vote:', deleteError);
          return NextResponse.json(
            { error: 'Failed to remove vote' },
            { status: 500 }
          );
        }

        result = { action: 'removed', vote: null };
      } else {
        // Si es diferente tipo de voto, actualizar
        const { data: updatedVote, error: updateError } = await supabaseAdmin
          .from('votes')
          .update({ vote_type: vote_type })
          .eq('id', existingVote.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating vote:', updateError);
          return NextResponse.json(
            { error: 'Failed to update vote' },
            { status: 500 }
          );
        }

        result = { action: 'updated', vote: updatedVote };
      }
    } else {
      // Crear nuevo voto
      const { data: newVote, error: createError } = await supabaseAdmin
        .from('votes')
        .insert({
          post_id: post_id,
          user_id: userId,
          vote_type: vote_type
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating vote:', createError);
        return NextResponse.json(
          { error: 'Failed to create vote' },
          { status: 500 }
        );
      }

      result = { action: 'created', vote: newVote };
    }

    // Obtener el conteo actualizado de votos
    const { data: updatedPost, error: postUpdateError } = await supabaseAdmin
      .from('posts')
      .select('votes_count')
      .eq('id', post_id)
      .single();

    if (postUpdateError) {
      console.error('Error fetching updated post:', postUpdateError);
    }

    return NextResponse.json({
      success: true,
      ...result,
      votes_count: updatedPost?.votes_count || 0
    });

  } catch (error) {
    console.error('Error in vote API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}