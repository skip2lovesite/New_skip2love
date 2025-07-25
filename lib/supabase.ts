import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// For web applications, we don't need the Expo SecureStore
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Server-side client for admin operations
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          phone: string | null
          city: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          city?: string | null
          bio?: string | null
          avatar_url?: string | null
        }
        Update: {
          email?: string
          phone?: string | null
          city?: string | null
          bio?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
      }
      ads: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          price: number
          images: string[]
          category: string
          location: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          title: string
          description: string
          price: number
          images?: string[]
          category: string
          location: string
          is_active?: boolean
        }
        Update: {
          title?: string
          description?: string
          price?: number
          images?: string[]
          category?: string
          location?: string
          is_active?: boolean
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          sender_id: string
          receiver_id: string
          ad_id: string | null
          content: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          sender_id: string
          receiver_id: string
          ad_id?: string | null
          content: string
          is_read?: boolean
        }
        Update: {
          is_read?: boolean
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_type: string
          is_active: boolean
          expires_at: string | null
          venmo_transaction_id: string | null
          created_at: string
        }
        Insert: {
          user_id: string
          plan_type?: string
          is_active?: boolean
          expires_at?: string | null
          venmo_transaction_id?: string | null
        }
        Update: {
          plan_type?: string
          is_active?: boolean
          expires_at?: string | null
          venmo_transaction_id?: string | null
        }
      }
    }
  }
}
