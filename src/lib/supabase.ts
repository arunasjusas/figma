import { createClient } from '@supabase/supabase-js';

// Supabase configuration
// Using development branch for shared data
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://stbhwafhrjisprjtzypr.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0Ymh3YWZocmppc3ByanR6eXByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3Nzg0NDgsImV4cCI6MjA3NjM1NDQ0OH0.CQHv3t5XYjZTwgCOxq8Oko28XNP4hoo0HVwA-esVKH4';

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

