-- First, let's handle the conversations table issue
-- Only drop if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'conversations') THEN
        DROP TABLE conversations CASCADE;
    END IF;
END $$;

-- Drop existing policies only if they exist
DO $$ 
BEGIN
    -- Profiles policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view all profiles') THEN
        DROP POLICY "Users can view all profiles" ON profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update own profile') THEN
        DROP POLICY "Users can update own profile" ON profiles;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can insert own profile') THEN
        DROP POLICY "Users can insert own profile" ON profiles;
    END IF;

    -- Ads policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ads' AND policyname = 'Users can view all active ads') THEN
        DROP POLICY "Users can view all active ads" ON ads;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ads' AND policyname = 'Users can insert own ads') THEN
        DROP POLICY "Users can insert own ads" ON ads;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ads' AND policyname = 'Users can update own ads') THEN
        DROP POLICY "Users can update own ads" ON ads;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ads' AND policyname = 'Users can delete own ads') THEN
        DROP POLICY "Users can delete own ads" ON ads;
    END IF;

    -- Messages policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can view messages they sent or received') THEN
        DROP POLICY "Users can view messages they sent or received" ON messages;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can insert messages they send') THEN
        DROP POLICY "Users can insert messages they send" ON messages;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Users can update messages they received') THEN
        DROP POLICY "Users can update messages they received" ON messages;
    END IF;

    -- Subscriptions policies
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can view own subscription') THEN
        DROP POLICY "Users can view own subscription" ON subscriptions;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can insert own subscription') THEN
        DROP POLICY "Users can insert own subscription" ON subscriptions;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users can update own subscription') THEN
        DROP POLICY "Users can update own subscription" ON subscriptions;
    END IF;

    -- Conversations policies (if they exist)
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversations' AND policyname = 'Users can view their conversations') THEN
        DROP POLICY "Users can view their conversations" ON conversations;
    END IF;
    
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'conversations' AND policyname = 'Users can create conversations') THEN
        DROP POLICY "Users can create conversations" ON conversations;
    END IF;
END $$;

-- Create tables if they don't exist
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  city TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  images TEXT[] DEFAULT '{}',
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  ad_id UUID REFERENCES ads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  venmo_transaction_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Create fresh policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view all active ads" ON ads FOR SELECT USING (is_active = true);
CREATE POLICY "Users can insert own ads" ON ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ads" ON ads FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ads" ON ads FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages they sent or received" ON messages 
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can insert messages they send" ON messages 
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update messages they received" ON messages 
  FOR UPDATE USING (auth.uid() = receiver_id);

CREATE POLICY "Users can view own subscription" ON subscriptions 
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own subscription" ON subscriptions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscription" ON subscriptions 
  FOR UPDATE USING (auth.uid() = user_id);
