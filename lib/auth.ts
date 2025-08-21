import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Simple auth state management
let currentUser: any = null;

export const setCurrentUser = (user: any) => {
  currentUser = user;
  if (typeof window !== 'undefined') {
    localStorage.setItem('currentUser', JSON.stringify(user));
  }
};

export const getCurrentUser = () => {
  if (currentUser) return currentUser;
  
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem('currentUser');
    if (stored) {
      currentUser = JSON.parse(stored);
      return currentUser;
    }
  }
  
  return null;
};

export const clearCurrentUser = () => {
  currentUser = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentUser');
  }
};

// Mock user for testing
export const mockUser = {
  id: '03ab357e-4e23-40d7-bfb4-8a767f59b3d4',
  email: 'nocodeveloper2024@gmail.com',
  name: 'NOcodeveloper'
};

// Set mock user for testing
if (typeof window !== 'undefined') {
  setCurrentUser(mockUser);
}