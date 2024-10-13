import { supabase } from './supabaseClient';
import { User, Session, AuthError } from '@supabase/supabase-js';

// Signup function
export const signUp = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { user: data?.user ?? null, error: error ? error.message : null };
};

// Login function
export const signIn = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  return { user: data?.user ?? null, error: error ? error.message : null };
};

// Get current session
export const getSession = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getSession();
  return data?.session?.user ?? null;
};

// Logout
export const signOut = async (): Promise<void> => {
  await supabase.auth.signOut();
};

// Listen to auth state changes
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void): void => {
  supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
};
