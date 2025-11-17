# Supabase Setup Guide

This application now uses Supabase for shared data storage with real-time synchronization. All users see and interact with the same data.

## 🚀 Quick Setup

### 1. Database Schema

The database schema is defined in `supabase/migrations/001_initial_schema.sql`. 

**To apply the schema:**

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_initial_schema.sql`
4. Run the SQL script

Or use Supabase CLI:
```bash
supabase db push
```

### 2. Seed Initial Data

After creating the tables, seed them with initial data:

```bash
# Set environment variables
export VITE_SUPABASE_URL="https://stbhwafhrjisprjtzypr.supabase.co"
export VITE_SUPABASE_ANON_KEY="your-anon-key"

# Run seed script
npx tsx scripts/seed-database.ts
```

### 3. Environment Variables

For local development, create a `.env.local` file:

```env
VITE_SUPABASE_URL=https://stbhwafhrjisprjtzypr.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

For Vercel deployment, add these as environment variables in the Vercel dashboard.

## 📊 Database Tables

### `invoices`
- Stores all invoice data
- Supports soft delete (`deleted` flag)
- Real-time updates enabled

### `clients`
- Stores client information
- Real-time updates enabled

## 🔄 Real-Time Features

The application automatically:
- Fetches data on app load
- Subscribes to real-time changes
- Updates UI when any user makes changes
- All users see the same data instantly

## 🔐 Security

Currently, the database uses public access policies for shared data. In production, you may want to:
- Add authentication
- Implement Row Level Security (RLS) policies
- Restrict access based on user roles

## 🐛 Troubleshooting

### Data not syncing?
1. Check Supabase connection in browser console
2. Verify environment variables are set correctly
3. Check Supabase dashboard for connection status

### Real-time not working?
1. Ensure Realtime is enabled in Supabase dashboard
2. Check that tables are added to `supabase_realtime` publication
3. Verify WebSocket connections are not blocked

