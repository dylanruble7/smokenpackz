import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vcujwekschxbopapkhsz.supabase.co'
const supabaseAnonKey = 'sb_publishable_ZoCz1UOxHBjDNYrQopMlng_W9_XZpjf'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})
