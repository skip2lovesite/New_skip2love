import { createClient } from "@supabase/supabase-js"
import * as SecureStore from "expo-secure-store"

const supabaseUrl = "https://earodrhfffzvwgrajhhg.supabase.co"
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhcm9kcmhmZmZ6dndncmFqaGhnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM0MDg1NTcsImV4cCI6MjA2ODk4NDU1N30.-utvtVO3-KaaK_fNxSorZxIgMD7pHta522EkXaFQaBM"

// Custom storage implementation for React Native
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key)
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value)
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key)
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

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
