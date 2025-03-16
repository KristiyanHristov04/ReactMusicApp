import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for interacting with your database
// export const supabase = createClient('https://gjrhtafxpahfuzttnjar.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqcmh0YWZ4cGFoZnV6dHRuamFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE1MTk0ODgsImV4cCI6MjA1NzA5NTQ4OH0.JeixryXODOszDTRxW6UoSXqiKsUg0qdZjPdBSBEowT4')
export const supabase = createClient(import.meta.env.VITE_SUPABASEURL, import.meta.env.VITE_SUPABASEKEY);