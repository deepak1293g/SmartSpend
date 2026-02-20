
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lpwfhyfpunivwxqzouqr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxwd2ZoeWZwdW5pdnd4cXpvdXFyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0ODY5MjQsImV4cCI6MjA4NzA2MjkyNH0.d-6h2UfoJLxuM3841ATyef5fT0s1CRjSEme0POjVB1M';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const checkSupabaseConfig = () => {
  // Config is now provided and valid
  return true;
};
