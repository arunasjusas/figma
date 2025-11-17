import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Using figma project for shared data
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://ddtdyacwcaihupjkswoy.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkdGR5YWN3Y2FpaHVwamtzd295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNzcxMzgsImV4cCI6MjA3ODk1MzEzOH0.quWx9OAh1GCA_CVlkwPNMfhSksNhurdo6XUvpbWY0jk';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn('⚠️ Missing Supabase environment variables');
  console.warn('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable Supabase');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false, // We're using mock auth, not Supabase auth
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

