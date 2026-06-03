export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          condition_type: string
          condition_value: number | null
          created_at: string | null
          description: string
          icon_type: string
          is_secret: boolean | null
          name: string
          slug: string
          tier: string
        }
        Insert: {
          condition_type: string
          condition_value?: number | null
          created_at?: string | null
          description: string
          icon_type: string
          is_secret?: boolean | null
          name: string
          slug: string
          tier: string
        }
        Update: {
          condition_type?: string
          condition_value?: number | null
          created_at?: string | null
          description?: string
          icon_type?: string
          is_secret?: boolean | null
          name?: string
          slug?: string
          tier?: string
        }
        Relationships: []
      }
      admin_users: {
        Row: {
          created_at: string
          granted_by: string | null
          id: string
          permissions: Json
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_by?: string | null
          id?: string
          permissions?: Json
          user_id: string
        }
        Update: {
          created_at?: string
          granted_by?: string | null
          id?: string
          permissions?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_users_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_users_granted_by_fkey"
            columns: ["granted_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      app_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "app_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "app_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          access_token: string | null
          channel_id: string | null
          channel_name: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          platform: string
          refresh_token: string | null
          user_id: string
        }
        Insert: {
          access_token?: string | null
          channel_id?: string | null
          channel_name: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          platform: string
          refresh_token?: string | null
          user_id: string
        }
        Update: {
          access_token?: string | null
          channel_id?: string | null
          channel_name?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          platform?: string
          refresh_token?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coupons: {
        Row: {
          code: string
          created_at: string
          created_by: string | null
          discount_percent: number
          id: string
          is_active: boolean
          max_uses: number | null
          plan_restriction: string | null
          used_count: number
          valid_until: string | null
        }
        Insert: {
          code: string
          created_at?: string
          created_by?: string | null
          discount_percent: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          plan_restriction?: string | null
          used_count?: number
          valid_until?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          created_by?: string | null
          discount_percent?: number
          id?: string
          is_active?: boolean
          max_uses?: number | null
          plan_restriction?: string | null
          used_count?: number
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "coupons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coupons_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          platforms: string[]
          scheduled_at: string | null
          status: string
          title: string
          total_views: number
          updated_at: string
          user_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          platforms?: string[]
          scheduled_at?: string | null
          status?: string
          title: string
          total_views?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          platforms?: string[]
          scheduled_at?: string | null
          status?: string
          title?: string
          total_views?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_links: {
        Row: {
          created_at: string | null
          display_name: string | null
          followers_count: string | null
          id: string
          is_primary: boolean | null
          platform: string
          sort_order: number | null
          updated_at: string | null
          url: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          display_name?: string | null
          followers_count?: string | null
          id?: string
          is_primary?: boolean | null
          platform: string
          sort_order?: number | null
          updated_at?: string | null
          url: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          display_name?: string | null
          followers_count?: string | null
          id?: string
          is_primary?: boolean | null
          platform?: string
          sort_order?: number | null
          updated_at?: string | null
          url?: string
          user_id?: string
        }
        Relationships: []
      }
      onboarding_checklist: {
        Row: {
          completed: boolean
          completed_at: string | null
          id: string
          item_key: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          item_key: string
          user_id: string
        }
        Update: {
          completed?: boolean
          completed_at?: string | null
          id?: string
          item_key?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          checklist_completed: boolean
          first_login_at: string | null
          onboarding_completed: boolean
          onboarding_step: number
          tour_completed: boolean
          created_at: string
          email: string
          featured_achievements: string[] | null
          full_name: string | null
          id: string
          plan: string | null
          plan_expires_at: string | null
          posts_this_month: number
          ranking_position: number | null
          role: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          total_posts: number
          total_views: number
          updated_at: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          checklist_completed?: boolean
          first_login_at?: string | null
          onboarding_completed?: boolean
          onboarding_step?: number
          tour_completed?: boolean
          created_at?: string
          email: string
          featured_achievements?: string[] | null
          full_name?: string | null
          id: string
          plan?: string | null
          plan_expires_at?: string | null
          posts_this_month?: number
          ranking_position?: number | null
          role?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          total_posts?: number
          total_views?: number
          updated_at?: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          checklist_completed?: boolean
          first_login_at?: string | null
          onboarding_completed?: boolean
          onboarding_step?: number
          tour_completed?: boolean
          created_at?: string
          email?: string
          featured_achievements?: string[] | null
          full_name?: string | null
          id?: string
          plan?: string | null
          plan_expires_at?: string | null
          posts_this_month?: number
          ranking_position?: number | null
          role?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          total_posts?: number
          total_views?: number
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          category: string
          created_at: string
          data: Json | null
          id: string
          level: string
          message: string
          user_id: string | null
        }
        Insert: {
          category: string
          created_at?: string
          data?: Json | null
          id?: string
          level: string
          message: string
          user_id?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          data?: Json | null
          id?: string
          level?: string
          message?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_achievements: {
        Row: {
          achievement_slug: string
          id: string
          unlocked_at: string | null
          user_id: string
        }
        Insert: {
          achievement_slug: string
          id?: string
          unlocked_at?: string | null
          user_id: string
        }
        Update: {
          achievement_slug?: string
          id?: string
          unlocked_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_slug_fkey"
            columns: ["achievement_slug"]
            isOneToOne: false
            referencedRelation: "achievements"
            referencedColumns: ["slug"]
          },
        ]
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          created_at: string | null
          featured_achievements: string[] | null
          full_name: string | null
          id: string | null
          plan: string | null
          ranking_position: number | null
          total_posts: number | null
          total_views: number | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string | null
          featured_achievements?: string[] | null
          full_name?: string | null
          id?: string | null
          plan?: string | null
          ranking_position?: number | null
          total_posts?: number | null
          total_views?: number | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          created_at?: string | null
          featured_achievements?: string[] | null
          full_name?: string | null
          id?: string | null
          plan?: string | null
          ranking_position?: number | null
          total_posts?: number | null
          total_views?: number | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_admin: { Args: { uid: string }; Returns: boolean }
      sync_my_achievements: { Args: Record<PropertyKey, never>; Returns: undefined }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
