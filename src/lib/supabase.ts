import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(url, key)

export type DbProfile = {
  id: string
  name: string
  email: string
  wallet_address: string | null
  plan_id: string | null
  plan_name: string | null
  plan_duration: number | null
  plan_return_rate: number | null
  invested_amount: number
  status: 'pending_payment' | 'active' | 'completed'
  start_date: string | null
  end_date: string | null
  created_at: string
}

export type DbConversation = {
  id: string
  client_email: string
  client_name: string
  plan: string | null
  invested_amount: number
  last_message: string
  last_message_at: string | null
  unread_admin: number
  unread_client: number
  advisor_id: string
  advisor_name: string
  tags: string[]
  created_at: string
}

export type DbMessage = {
  id: string
  conversation_id: string
  sender_id: string
  sender_name: string
  sender_role: 'client' | 'advisor' | 'admin'
  text: string
  read: boolean
  created_at: string
}

export type DbGroup = {
  id: string
  name: string
  color: string
  advisor_id: string
  conversation_ids: string[]
  created_at: string
}
