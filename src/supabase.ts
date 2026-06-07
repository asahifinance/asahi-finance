import { createClient } from '@supabase/Bolt Database-js'

export const Bolt Database = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
