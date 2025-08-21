import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { createSupabaseAdmin } from '@/lib/supabase';
import { ensureUserProfile } from '@/lib/profile';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, post_id, user_id, user_email, user_name } = body;
    
    // Check if we have user info from the request body (fallback auth)
    let userId = user_id;
    let userEmail = user_email;
    let userName = user_name;
    
    // Try NextAuth session first
    const session = await getServerSession(authOptions);
    if (session?.user?.email) {
      userId = session.user.id;
      userEmail = session.user.email;
      userName = session.user.name;
    }
    
    if (!userId || !userEmail) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Validate required fields
    if (!content || !post_id) {
      return NextResponse.json(
        { error: 'Content and post_id are required' },
        { status: 400 }
      );
    }

    if (content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content cannot be empty' },
        { status: 400 }
      );
    }

    // Ensure user profile exists
    const finalUserId = await ensureUserProfile(userId, userEmail, userName);
    if (!finalUserId) {
      return NextResponse.json(
        { error: 'Failed to create or get user profile' },
        { status: 404 }
      );
    }

    const supabase = createSupabaseAdmin();

    // Verify post exists
    const { data: post, error: postError } = await supabase
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

    // Create the comment
    const insertData = {
      content: content.trim(),
      post_id: post_id,
      user_id: finalUserId
    };
    
    console.log('Comment insert data:', insertData);
    console.log('finalUserId type:', typeof finalUserId, 'value:', finalUserId);
    
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .insert(insertData)
      .select(`
        id,
        content,
        post_id,
        user_id,
        created_at,
        updated_at,
        profiles (
          name,
          email
        )
      `)
      .single();

    if (commentError) {
      console.error('Error creating comment:', commentError);
      return NextResponse.json(
        { error: 'Failed to create comment' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      comment,
      message: 'Comment created successfully'
    });

  } catch (error) {
    console.error('Error in POST /api/comments/create:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}