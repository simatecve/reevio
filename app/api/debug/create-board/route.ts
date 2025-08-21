import { NextRequest, NextResponse } from 'next/server';
import { supabase, createSupabaseAdmin } from '@/lib/supabase';
import { getUserProfile, ensureUserProfile } from '@/lib/profile';
import { generateUniqueSlug } from '@/lib/utils';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

// Service role client for admin operations
const supabaseAdmin = createSupabaseAdmin();

export async function POST(request: NextRequest) {
  try {
    const { name, description, color, userEmail } = await request.json();
    
    console.log('DEBUG CREATE BOARD - Request data:', { name, description, color, userEmail });
    
    if (!name || !userEmail) {
      return NextResponse.json({ error: 'Name and userEmail are required' }, { status: 400 });
    }
    
    // Get the current session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Get user profile by email and also try by ID
    console.log('DEBUG CREATE BOARD - Getting user profile for:', userEmail);
    let profile = await getUserProfile(userEmail);
    console.log('DEBUG CREATE BOARD - Profile result:', profile);
    
    // If not found by email, try to get profile by email using admin client
    if (!profile) {
      console.log('DEBUG CREATE BOARD - Trying to get profile by email with admin client');
      const { data: profileByEmail, error: profileError } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', userEmail)
        .single();
      
      if (profileError) {
        console.error('DEBUG CREATE BOARD - Error getting profile by email with admin:', profileError);
      } else {
        console.log('DEBUG CREATE BOARD - Profile found by email with admin:', profileByEmail);
        profile = profileByEmail;
      }
    }
    
    if (!profile) {
      console.log('DEBUG CREATE BOARD - Profile not found, creating one...');
      // Create a profile for this user using the authenticated user ID
       try {
         // Use the authenticated user's ID from the session
         const userId = session.user.id;
         
         // Create profile directly with admin client using the authenticated user ID
         const { data: newProfile, error: createError } = await supabaseAdmin
           .from('profiles')
           .insert({
             id: userId,
             email: userEmail,
             name: session.user.name || 'User'
           })
           .select()
           .single();
         
         if (createError) {
           console.error('DEBUG CREATE BOARD - Error creating profile with admin:', createError);
           return NextResponse.json({ error: 'Could not create user profile' }, { status: 500 });
         }
         
         console.log('DEBUG CREATE BOARD - Profile created with admin:', newProfile);
         profile = newProfile;
      } catch (error) {
        console.error('DEBUG CREATE BOARD - Error creating profile:', error);
        return NextResponse.json({ error: 'Could not create user profile' }, { status: 500 });
      }
    }
    
    if (!profile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }
    
    // Get existing slugs to ensure uniqueness
    console.log('DEBUG CREATE BOARD - Getting existing slugs');
    const { data: existingBoards } = await supabase
      .from('boards')
      .select('slug');
    
    const existingSlugs = existingBoards?.map(board => board.slug) || [];
    const uniqueSlug = generateUniqueSlug(name.trim(), existingSlugs);
    console.log('DEBUG CREATE BOARD - Generated slug:', uniqueSlug);
    
    const boardData = {
      name: name.trim(),
      description: description?.trim() || null,
      slug: uniqueSlug,
      user_id: profile.id,
      color: color || '#3B82F6'
    };
    console.log('DEBUG CREATE BOARD - Board data to insert:', boardData);
    
    // Create the board using admin client
    const { data, error } = await supabaseAdmin
      .from('boards')
      .insert(boardData)
      .select()
      .single();
    
    console.log('DEBUG CREATE BOARD - Insert result:', { data, error });
    
    if (error) {
      console.error('DEBUG CREATE BOARD - Error creating board:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log('DEBUG CREATE BOARD - Board created successfully:', data);
    return NextResponse.json({ success: true, board: data });
    
  } catch (error) {
    console.error('DEBUG CREATE BOARD - Catch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}