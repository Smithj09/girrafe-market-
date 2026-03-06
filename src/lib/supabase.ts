import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Check if both environment variables are set before creating the client
export const supabase: any = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      from: (_table: string) => ({
        select: (_columns?: string) => ({
          eq: (_column: string, _value: any) => ({
            single: async () => ({ data: null, error: null })
          }),
          single: async () => ({ data: null, error: null })
        }),
        eq: (_column: string, _value: any) => ({
          select: (_columns?: string) => ({
            single: async () => ({ data: null, error: null })
          })
        }),
        insert: async (_data: any) => ({ data: null, error: null }),
        upsert: async (_data: any) => ({ error: null })
      }),
      auth: {
        signUp: async (_credentials: any) => ({ data: { user: null, session: null }, error: null }),
        signInWithPassword: async (_credentials: any) => ({ data: { user: null, session: null }, error: null }),
        signOut: async () => ({ error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
        resetPasswordForEmail: async (_email: string) => ({ error: null }),
        updateUser: async (_attributes: any) => ({ data: { user: null }, error: null }),
        onAuthStateChange: (_callback: (event: string, session: any) => void) => ({ 
          data: { 
            subscription: { 
              unsubscribe: () => {} 
            } 
          } 
        })
      }
    };