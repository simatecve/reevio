import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase';
import { getUserProfile } from '@/lib/profile';

const supabaseAdmin = createSupabaseAdmin();

export async function POST(request: NextRequest) {
  try {
    const { userEmail } = await request.json();

    if (!userEmail) {
      return NextResponse.json(
        { error: 'User email is required' },
        { status: 400 }
      );
    }

    console.log('GET BOARDS - Getting user profile for:', userEmail);
    
    // Get user profile by email using admin client
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', userEmail)
      .single();

    if (profileError || !profile) {
      console.log('GET BOARDS - No profile found for:', userEmail);
      return NextResponse.json(
        { boards: [] },
        { status: 200 }
      );
    }

    console.log('GET BOARDS - Profile found:', profile.id);

    // Get boards for this user using admin client
    const { data: boards, error: boardsError } = await supabaseAdmin
      .from('boards')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (boardsError) {
      console.error('GET BOARDS - Error loading boards:', boardsError);
      return NextResponse.json(
        { error: 'Failed to load boards' },
        { status: 500 }
      );
    }

    console.log('GET BOARDS - Boards loaded:', boards?.length || 0);

    return NextResponse.json({
      success: true,
      boards: boards || []
    });

  } catch (error) {
    console.error('GET BOARDS - Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}