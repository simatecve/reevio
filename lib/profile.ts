import { supabase, createSupabaseAdmin } from '@/lib/supabase';

export async function ensureUserProfile(userId: string, userEmail: string, userName?: string) {
  const supabaseAdmin = createSupabaseAdmin();

  try {
    console.log('ensureUserProfile - Input:', { userId, userEmail, userName });
    
    // Check if profile exists by userId first (more reliable)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single();

    if (profile && !profileError) {
      console.log('ensureUserProfile - Profile exists:', profile.id);
      return userId;
    }

    // Also check if profile exists by email
    const { data: profileByEmail, error: profileByEmailError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', userEmail)
      .single();

    if (profileByEmail && !profileByEmailError) {
      console.log('ensureUserProfile - Profile exists by email:', profileByEmail.id);
      return profileByEmail.id;
    }

    console.log('ensureUserProfile - Profile not found, creating new one');
    
    // First, check if user exists in auth.users
    const { data: authUser, error: authUserError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (authUserError || !authUser.user) {
      console.log('ensureUserProfile - Auth user not found, creating one');
      // Create auth user first
      const { data: newAuthUser, error: createAuthError } = await supabaseAdmin.auth.admin.createUser({
        id: userId,
        email: userEmail,
        email_confirm: true,
        user_metadata: {
          name: userName || userEmail
        }
      });
      
      if (createAuthError) {
        console.error('Error creating auth user:', createAuthError);
        throw createAuthError;
      }
      
      console.log('ensureUserProfile - Auth user created:', newAuthUser.user?.id);
    }
    
    // Now create profile (the trigger should handle this automatically, but let's be explicit)
    const { data: newProfile, error: createError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: userId,
        email: userEmail,
        name: userName || userEmail
      })
      .select('id')
      .single();

    if (createError) {
      console.error('Error creating profile:', createError);
      throw createError;
    }

    console.log('ensureUserProfile - Profile created:', newProfile.id);
    return userId;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    throw error;
  }
}

export async function getUserProfile(userEmail: string) {

  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', userEmail)
      .single();

    if (error) {
      console.error('Error getting user profile:', error);
      return null;
    }

    return profile;
  } catch (error) {
    console.error('Error:', error);
    return null;
  }
}