export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          role: 'admin' | 'king' | 'pro' | 'clipper' | 'trial' | 'blocked'
          plan: 'clipper' | 'pro' | 'king' | 'trial'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          posts_this_month: number
          total_views: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
    }
  }
}
