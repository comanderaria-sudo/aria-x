# Supabase Setup Guide for ARIA-X

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign in or create account
4. Click "New project"
5. Fill in:
   - **Name**: aria-x
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project" (takes 2-3 minutes)

---

## Step 2: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **Anon Key** (starts with `eyJ...`)
   - **Service Role Key** (starts with `eyJ...`)

3. Add to your `.env` file:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

---

## Step 3: Create Users Table

1. Go to **SQL Editor** in Supabase dashboard
2. Click "New Query"
3. Paste this SQL:

```sql
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT NOT NULL UNIQUE,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Create policy for users to update their own data
CREATE POLICY "Users can update their own data"
  ON users
  FOR UPDATE
  USING (auth.uid() = id);
```

4. Click "Run"

---

## Step 4: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Click "Email"
3. Toggle "Enable Email provider"
4. Configure email settings:
   - **Email confirmations**: Off (for testing)
   - **Double confirm email changes**: Off (for testing)

---

## Step 5: Configure Redirect URLs

1. Go to **Authentication** → **URL Configuration**
2. Add your Vercel domain to **Redirect URLs**:
   ```
   https://your-vercel-domain.vercel.app/dashboard
   https://your-vercel-domain.vercel.app/login
   https://localhost:3000/dashboard
   https://localhost:3000/login
   ```

---

## Step 6: Test Locally

1. Update your `.env` file with Supabase credentials
2. Run `pnpm dev`
3. Go to `http://localhost:3000`
4. Click "Sign up"
5. Create a test account
6. Verify you can log in

---

## Step 7: Enable Row Level Security (RLS)

1. Go to **SQL Editor**
2. Run this query to ensure RLS is enabled:

```sql
-- Check RLS status
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

---

## Troubleshooting

**"Invalid API key"**
- Verify you're using the **Anon Key**, not the Service Role Key
- Check for extra spaces in the key

**"Email already exists"**
- Supabase requires unique emails
- Use a different email for testing

**"Redirect URL mismatch"**
- Add your exact domain to URL Configuration
- Include protocol (https://)

**"User not found after signup"**
- Check that the users table was created
- Verify RLS policies are correct

---

## Next Steps

1. Set up automatic backups in Supabase
2. Configure email templates for production
3. Enable 2FA for your Supabase account
4. Set up monitoring alerts
5. Create a staging environment for testing
