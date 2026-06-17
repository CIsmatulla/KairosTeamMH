import { createClient } from '@supabase/supabase-js'

// Public, client-safe values. Security is enforced by Row Level Security, not by hiding the anon key.
const url = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// When env vars are absent the whole app gracefully falls back to localStorage + seed data.
export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
    })
  : null
