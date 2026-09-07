import { createClient } from '@supabase/supabase-js'

const defaultSupabaseUrl = 'https://vqronqrqpjvlgcxmumgu.supabase.co'
const defaultPublishableKey = 'sb_publishable_AlnjEHxIzyiCAj8HqCnxnA_mWMyn8BS'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim() || defaultSupabaseUrl
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim() || defaultPublishableKey

export const supabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
