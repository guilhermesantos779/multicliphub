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
      agency_clipper_members: {
        Row: {
          agency_profile_id: string
          id: string
          invited_at: string
          joined_at: string | null
          removed_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          agency_profile_id: string
          id?: string
          invited_at?: string
          joined_at?: string | null
          removed_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          agency_profile_id?: string
          id?: string
          invited_at?: string
          joined_at?: string | null
          removed_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_clipper_members_agency_profile_id_fkey"
            columns: ["agency_profile_id"]
            isOneToOne: false
            referencedRelation: "agency_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_invite_links: {
        Row: {
          agency_profile_id: string
          code: string
          created_at: string
          created_by: string
          expires_at: string | null
          id: string
          is_active: boolean
        }
        Insert: {
          agency_profile_id: string
          code: string
          created_at?: string
          created_by: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
        }
        Update: {
          agency_profile_id?: string
          code?: string
          created_at?: string
          created_by?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "agency_invite_links_agency_profile_id_fkey"
            columns: ["agency_profile_id"]
            isOneToOne: false
            referencedRelation: "agency_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_profiles: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string
          id: string
          kind: string
          logo_url: string | null
          social_links: Json
          type: string
          user_id: string
          verified: boolean
          website_url: string | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name: string
          id?: string
          kind?: string
          logo_url?: string | null
          social_links?: Json
          type: string
          user_id: string
          verified?: boolean
          website_url?: string | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string
          id?: string
          kind?: string
          logo_url?: string | null
          social_links?: Json
          type?: string
          user_id?: string
          verified?: boolean
          website_url?: string | null
        }
        Relationships: []
      }
      agency_team_members: {
        Row: {
          accepted_at: string | null
          agency_profile_id: string
          id: string
          invited_at: string
          role: string
          user_id: string
        }
        Insert: {
          accepted_at?: string | null
          agency_profile_id: string
          id?: string
          invited_at?: string
          role: string
          user_id: string
        }
        Update: {
          accepted_at?: string | null
          agency_profile_id?: string
          id?: string
          invited_at?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "agency_team_members_agency_profile_id_fkey"
            columns: ["agency_profile_id"]
            isOneToOne: false
            referencedRelation: "agency_profiles"
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
      campaign_assets: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          label: string | null
          type: string
          url: string
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          label?: string | null
          type: string
          url: string
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          label?: string | null
          type?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_assets_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_participants: {
        Row: {
          campaign_id: string
          id: string
          joined_at: string
          status: string
          user_id: string
        }
        Insert: {
          campaign_id: string
          id?: string
          joined_at?: string
          status?: string
          user_id: string
        }
        Update: {
          campaign_id?: string
          id?: string
          joined_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_participants_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_payouts: {
        Row: {
          amount: number
          asaas_transfer_id: string | null
          campaign_id: string
          campaign_post_id: string | null
          created_at: string
          id: string
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          asaas_transfer_id?: string | null
          campaign_id: string
          campaign_post_id?: string | null
          created_at?: string
          id?: string
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          asaas_transfer_id?: string | null
          campaign_id?: string
          campaign_post_id?: string | null
          created_at?: string
          id?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_payouts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_payouts_campaign_post_id_fkey"
            columns: ["campaign_post_id"]
            isOneToOne: false
            referencedRelation: "campaign_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_posts: {
        Row: {
          campaign_id: string
          caption_snapshot: string | null
          created_at: string
          discovered_via: string
          external_post_id: string
          id: string
          last_synced_at: string | null
          platform: string
          removal_reason: string | null
          removed_at: string | null
          removed_by: string | null
          review_status: string
          user_id: string
          views_count: number
        }
        Insert: {
          campaign_id: string
          caption_snapshot?: string | null
          created_at?: string
          discovered_via?: string
          external_post_id: string
          id?: string
          last_synced_at?: string | null
          platform: string
          removal_reason?: string | null
          removed_at?: string | null
          removed_by?: string | null
          review_status?: string
          user_id: string
          views_count?: number
        }
        Update: {
          campaign_id?: string
          caption_snapshot?: string | null
          created_at?: string
          discovered_via?: string
          external_post_id?: string
          id?: string
          last_synced_at?: string | null
          platform?: string
          removal_reason?: string | null
          removed_at?: string | null
          removed_by?: string | null
          review_status?: string
          user_id?: string
          views_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaign_posts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          agency_profile_id: string
          asaas_charge_id: string | null
          badge_label: string
          budget_spent: number
          budget_total: number | null
          category: string
          content_type: string
          cover_image_url: string | null
          cpm_rate: number | null
          created_at: string
          description: string | null
          duration_days: number
          ends_at: string | null
          id: string
          modality: string
          payment_status: string
          pix_copy_paste: string | null
          pix_qr_code: string | null
          platform_fee_percentage: number
          prize_structure: Json | null
          ranking_metric: string
          required_hashtag: string
          reviewed_at: string | null
          reviewed_by: string | null
          rules: string | null
          starts_at: string | null
          status: string
          title: string
          total_charged: number | null
          visibility: string
        }
        Insert: {
          agency_profile_id: string
          asaas_charge_id?: string | null
          badge_label?: string
          budget_spent?: number
          budget_total?: number | null
          category?: string
          content_type?: string
          cover_image_url?: string | null
          cpm_rate?: number | null
          created_at?: string
          description?: string | null
          duration_days: number
          ends_at?: string | null
          id?: string
          modality: string
          payment_status?: string
          pix_copy_paste?: string | null
          pix_qr_code?: string | null
          platform_fee_percentage?: number
          prize_structure?: Json | null
          ranking_metric?: string
          required_hashtag: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          rules?: string | null
          starts_at?: string | null
          status?: string
          title: string
          total_charged?: number | null
          visibility?: string
        }
        Update: {
          agency_profile_id?: string
          asaas_charge_id?: string | null
          badge_label?: string
          budget_spent?: number
          budget_total?: number | null
          category?: string
          content_type?: string
          cover_image_url?: string | null
          cpm_rate?: number | null
          created_at?: string
          description?: string | null
          duration_days?: number
          ends_at?: string | null
          id?: string
          modality?: string
          payment_status?: string
          pix_copy_paste?: string | null
          pix_qr_code?: string | null
          platform_fee_percentage?: number
          prize_structure?: Json | null
          ranking_metric?: string
          required_hashtag?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          rules?: string | null
          starts_at?: string | null
          status?: string
          title?: string
          total_charged?: number | null
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_agency_profile_id_fkey"
            columns: ["agency_profile_id"]
            isOneToOne: false
            referencedRelation: "agency_profiles"
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
      daily_activity: {
        Row: {
          activity_date: string
          count: number
          id: string
          source: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          activity_date: string
          count?: number
          id?: string
          source?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          activity_date?: string
          count?: number
          id?: string
          source?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      data_deletion_requests: {
        Row: {
          confirmation_code: string
          created_at: string | null
          id: string
          platform: string
          platform_user_id: string
          status: string | null
          user_id: string | null
        }
        Insert: {
          confirmation_code: string
          created_at?: string | null
          id?: string
          platform: string
          platform_user_id: string
          status?: string | null
          user_id?: string | null
        }
        Update: {
          confirmation_code?: string
          created_at?: string | null
          id?: string
          platform?: string
          platform_user_id?: string
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      discord_link_tokens: {
        Row: {
          created_at: string | null
          discord_id: string
          discord_username: string | null
          expires_at: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string | null
          discord_id: string
          discord_username?: string | null
          expires_at: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string | null
          discord_id?: string
          discord_username?: string | null
          expires_at?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      instagram_accounts: {
        Row: {
          access_token: string | null
          created_at: string
          id: string
          ig_user_id: string
          is_connected: boolean
          token_expires_at: string | null
          updated_at: string
          user_id: string
          username: string | null
        }
        Insert: {
          access_token?: string | null
          created_at?: string
          id?: string
          ig_user_id: string
          is_connected?: boolean
          token_expires_at?: string | null
          updated_at?: string
          user_id: string
          username?: string | null
        }
        Update: {
          access_token?: string | null
          created_at?: string
          id?: string
          ig_user_id?: string
          is_connected?: boolean
          token_expires_at?: string | null
          updated_at?: string
          user_id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instagram_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "instagram_accounts_user_id_fkey"
            columns: ["user_id"]
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
      platform_rankings: {
        Row: {
          id: string
          period_month: string
          platform: string
          rank_position: number | null
          score: number
          source: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          period_month: string
          platform: string
          rank_position?: number | null
          score?: number
          source?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          period_month?: string
          platform?: string
          rank_position?: number | null
          score?: number
          source?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      profiles: {
        Row: {
          asaas_wallet_id: string | null
          avatar_url: string | null
          banner_url: string | null
          bio: string | null
          checklist_completed: boolean
          cpf: string | null
          created_at: string
          discord_id: string | null
          discord_username: string | null
          email: string
          featured_achievements: string[] | null
          first_login_at: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean
          onboarding_step: number
          payout_status: string
          pix_key: string | null
          plan: string | null
          plan_expires_at: string | null
          posts_this_month: number
          ranking_position: number | null
          role: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          total_posts: number
          total_views: number
          tour_completed: boolean
          updated_at: string
          username: string
        }
        Insert: {
          asaas_wallet_id?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          checklist_completed?: boolean
          cpf?: string | null
          created_at?: string
          discord_id?: string | null
          discord_username?: string | null
          email: string
          featured_achievements?: string[] | null
          first_login_at?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean
          onboarding_step?: number
          payout_status?: string
          pix_key?: string | null
          plan?: string | null
          plan_expires_at?: string | null
          posts_this_month?: number
          ranking_position?: number | null
          role?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          total_posts?: number
          total_views?: number
          tour_completed?: boolean
          updated_at?: string
          username: string
        }
        Update: {
          asaas_wallet_id?: string | null
          avatar_url?: string | null
          banner_url?: string | null
          bio?: string | null
          checklist_completed?: boolean
          cpf?: string | null
          created_at?: string
          discord_id?: string | null
          discord_username?: string | null
          email?: string
          featured_achievements?: string[] | null
          first_login_at?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean
          onboarding_step?: number
          payout_status?: string
          pix_key?: string | null
          plan?: string | null
          plan_expires_at?: string | null
          posts_this_month?: number
          ranking_position?: number | null
          role?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          total_posts?: number
          total_views?: number
          tour_completed?: boolean
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      publications: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          instagram_likes: number | null
          instagram_url: string | null
          instagram_views: number | null
          published_at: string | null
          status: string | null
          thumbnail_url: string | null
          tiktok_likes: number | null
          tiktok_publish_id: string | null
          tiktok_url: string | null
          tiktok_views: number | null
          title: string | null
          total_likes: number | null
          total_views: number | null
          updated_at: string | null
          user_id: string
          youtube_likes: number | null
          youtube_url: string | null
          youtube_views: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          instagram_likes?: number | null
          instagram_url?: string | null
          instagram_views?: number | null
          published_at?: string | null
          status?: string | null
          thumbnail_url?: string | null
          tiktok_likes?: number | null
          tiktok_publish_id?: string | null
          tiktok_url?: string | null
          tiktok_views?: number | null
          title?: string | null
          total_likes?: number | null
          total_views?: number | null
          updated_at?: string | null
          user_id: string
          youtube_likes?: number | null
          youtube_url?: string | null
          youtube_views?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          instagram_likes?: number | null
          instagram_url?: string | null
          instagram_views?: number | null
          published_at?: string | null
          status?: string | null
          thumbnail_url?: string | null
          tiktok_likes?: number | null
          tiktok_publish_id?: string | null
          tiktok_url?: string | null
          tiktok_views?: number | null
          title?: string | null
          total_likes?: number | null
          total_views?: number | null
          updated_at?: string | null
          user_id?: string
          youtube_likes?: number | null
          youtube_url?: string | null
          youtube_views?: number | null
        }
        Relationships: []
      }
      site_news: {
        Row: {
          id: string
          titulo: string
          descricao: string
          tipo: string | null
          publicado_em: string
          criado_por: string
          created_at: string
        }
        Insert: {
          id?: string
          titulo: string
          descricao: string
          tipo?: string | null
          publicado_em?: string
          criado_por: string
          created_at?: string
        }
        Update: {
          id?: string
          titulo?: string
          descricao?: string
          tipo?: string | null
          publicado_em?: string
          criado_por?: string
          created_at?: string
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
      ticket_attachments: {
        Row: {
          created_at: string | null
          file_name: string | null
          file_size: number | null
          file_url: string
          id: string
          message_id: string | null
          mime_type: string | null
          ticket_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url: string
          id?: string
          message_id?: string | null
          mime_type?: string | null
          ticket_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string | null
          file_size?: number | null
          file_url?: string
          id?: string
          message_id?: string | null
          mime_type?: string | null
          ticket_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "ticket_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_messages: {
        Row: {
          author_id: string
          author_role: string
          body: string
          created_at: string | null
          id: string
          ticket_id: string
        }
        Insert: {
          author_id: string
          author_role: string
          body: string
          created_at?: string | null
          id?: string
          ticket_id: string
        }
        Update: {
          author_id?: string
          author_role?: string
          body?: string
          created_at?: string | null
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          category: string
          created_at: string | null
          discord_channel_id: string | null
          discord_thread_id: string | null
          id: string
          last_message_at: string | null
          last_message_by: string | null
          priority: string
          resolved_at: string | null
          status: string
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string | null
          discord_channel_id?: string | null
          discord_thread_id?: string | null
          id?: string
          last_message_at?: string | null
          last_message_by?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string | null
          discord_channel_id?: string | null
          discord_thread_id?: string | null
          id?: string
          last_message_at?: string | null
          last_message_by?: string | null
          priority?: string
          resolved_at?: string | null
          status?: string
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
      agency_clipper_metrics: {
        Row: {
          agency_profile_id: string | null
          user_id: string | null
          total_views: number | null
          total_earnings: number | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_clipper_members_agency_profile_id_fkey"
            columns: ["agency_profile_id"]
            isOneToOne: false
            referencedRelation: "agency_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      agency_membership_public: {
        Row: {
          user_id: string | null
          agency_profile_id: string | null
          agency_name: string | null
          agency_verified: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "agency_clipper_members_agency_profile_id_fkey"
            columns: ["agency_profile_id"]
            isOneToOne: false
            referencedRelation: "agency_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_leaderboard: {
        Row: {
          campaign_id: string | null
          position: number | null
          total_posts: number | null
          total_views: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "campaign_posts_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_rankings_public: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string | null
          period_month: string | null
          plan: string | null
          platform: string | null
          rank_position: number | null
          score: number | null
          source: string | null
          username: string | null
        }
        Relationships: []
      }
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
      get_platform_stats: { Args: never; Returns: Json }
      get_total_platform_views: { Args: never; Returns: number }
      is_admin: { Args: { uid: string }; Returns: boolean }
      is_agency_clipper_member: {
        Args: { target_agency_id: string; uid: string }
        Returns: boolean
      }
      is_agency_staff: {
        Args: { target_agency_id: string; uid: string }
        Returns: boolean
      }
      is_campaign_agency_staff: {
        Args: { target_campaign_id: string; uid: string }
        Returns: boolean
      }
      notify_discord_account_linked: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      notify_discord_new_ticket: {
        Args: { p_ticket_id: string }
        Returns: undefined
      }
      recompute_platform_ranking: {
        Args: { p_month: string; p_platform: string }
        Returns: undefined
      }
      redeem_agency_invite: {
        Args: { p_code: string; p_auto_approve?: boolean }
        Returns: {
          id: string
          agency_profile_id: string
          user_id: string
          status: string
          invited_at: string
          joined_at: string | null
          removed_at: string | null
        }
      }
      register_publication: {
        Args: { p_platform: string; p_user_id: string }
        Returns: undefined
      }
      resolve_agency_invite_code: {
        Args: { p_code: string }
        Returns: string
      }
      sync_my_achievements: { Args: never; Returns: undefined }
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
