import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string) => {
  const value = process.env[key];
  // Handle cases where the variable might be the literal string "undefined" or "null"
  if (!value || value === 'undefined' || value === 'null' || value === '') {
    return '';
  }
  return value;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase configuration is missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Secrets panel.');
}

// Ensure we pass a valid URL format to createClient even if config is missing
const finalUrl = supabaseUrl.startsWith('http') 
  ? supabaseUrl 
  : 'https://placeholder-project.supabase.co';

const finalKey = supabaseAnonKey || 'placeholder-key';

export const supabase = createClient(finalUrl, finalKey);
