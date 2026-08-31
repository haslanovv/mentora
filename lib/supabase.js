import { createClient } from '@supabase/supabase-js'

// Placeholder values keep local builds working; real data requires the two
// NEXT_PUBLIC_SUPABASE_* variables in the deployment environment.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
