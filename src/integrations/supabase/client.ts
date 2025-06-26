
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://aigusgidjcfkhcmsghmn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFpZ3VzZ2lkamNma2hjbXNnaG1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxOTUzNzEsImV4cCI6MjA2Mzc3MTM3MX0.c9eQqGnSbMdtAZLi_jwvZezv7ZZhYb9rlC9-7cup1b4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
