-- AURUM Capital — Supabase Schema
-- Run this in: Supabase Dashboard > SQL Editor

-- 1. Profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  wallet_address TEXT,
  plan_id TEXT,
  plan_name TEXT,
  plan_duration INTEGER,
  plan_return_rate NUMERIC,
  invested_amount NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending_payment',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Conversations (one per client)
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,
  client_email TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  plan TEXT,
  invested_amount NUMERIC DEFAULT 0,
  last_message TEXT,
  last_message_at TIMESTAMPTZ,
  unread_admin INTEGER DEFAULT 0,
  unread_client INTEGER DEFAULT 0,
  advisor_id TEXT DEFAULT 'carlos',
  advisor_name TEXT DEFAULT 'Carlos M.',
  tags TEXT[] DEFAULT '{}'
);

-- 3. Messages
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  sender_role TEXT NOT NULL CHECK (sender_role IN ('client', 'advisor', 'admin')),
  text TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Chat groups
CREATE TABLE IF NOT EXISTS chat_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  advisor_id TEXT NOT NULL,
  conversation_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. Enable Realtime on conversations and messages
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_groups;

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_conversations_client_email ON conversations(client_email);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
