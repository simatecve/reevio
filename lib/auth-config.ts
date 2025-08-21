import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { createSupabaseAdmin } from '@/lib/supabase';

const supabase = createSupabaseAdmin();

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production' // Use HTTPS in production
      }
    }
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error || !data.user) {
            return null;
          }

          return {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.name || data.user.email,
          };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log('SignIn callback - User:', user);
      console.log('SignIn callback - Account:', account);
      
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if user already exists in profiles
          const { data: existingProfile } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', user.email)
            .single();

          console.log('Existing profile found:', existingProfile);

          if (existingProfile) {
            // User exists, use their existing UUID
            user.id = existingProfile.id;
            console.log('Using existing user ID:', user.id);
          } else {
            // Create user in Supabase Auth first
            const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
              email: user.email,
              email_confirm: true,
              user_metadata: {
                name: user.name || user.email,
                provider: 'google'
              }
            });
            
            if (authError || !authUser.user) {
              console.error('Error creating auth user:', authError);
              return false;
            }
            
            // The profile will be created automatically by the trigger
            user.id = authUser.user.id;
            console.log('Created new user with ID:', user.id);
          }
        } catch (error) {
          console.error('Error in signIn callback:', error);
          return false;
        }
      }
      
      console.log('SignIn callback - Final user ID:', user.id);
      return true;
    },
    async session({ session, token }) {
      console.log('Session callback - Token:', token);
      console.log('Session callback - Session before:', session);
      
      if (token?.sub) {
        session.user.id = token.sub;
      }
      
      console.log('Session callback - Session after:', session);
      return session;
    },
    async jwt({ token, user }) {
      console.log('JWT callback - User:', user);
      console.log('JWT callback - Token before:', token);
      
      if (user) {
        token.sub = user.id;
      }
      
      console.log('JWT callback - Token after:', token);
      return token;
    },
    async redirect({ url, baseUrl }) {
      // Use production URL if available
      const productionUrl = process.env.NEXTAUTH_URL || baseUrl;
      
      if (url.startsWith('/')) {
        return `${productionUrl}${url}`;
      }
      if (url.startsWith(productionUrl) || url.startsWith(baseUrl)) {
        return url;
      }
      return `${productionUrl}/dashboard`;
    },
  },
};