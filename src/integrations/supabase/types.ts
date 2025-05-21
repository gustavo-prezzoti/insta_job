export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      instagram_credentials: {
        Row: {
          created_at: string
          encrypted_password: string
          id: string
          is_active: boolean | null
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          encrypted_password: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          encrypted_password?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      instagram_post_logs: {
        Row: {
          caption: string | null
          created_at: string
          error_message: string | null
          id: string
          instagram_post_id: string | null
          post_type: string
          posted_at: string | null
          response_data: Json | null
          status: string
          updated_at: string
          user_id: string
          video_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          instagram_post_id?: string | null
          post_type: string
          posted_at?: string | null
          response_data?: Json | null
          status: string
          updated_at?: string
          user_id: string
          video_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          instagram_post_id?: string | null
          post_type?: string
          posted_at?: string | null
          response_data?: Json | null
          status?: string
          updated_at?: string
          user_id?: string
          video_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "instagram_post_logs_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      instagram_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          is_active: boolean | null
          session_data: Json
          updated_at: string
          user_id: string
          username: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
          is_active?: boolean | null
          session_data: Json
          updated_at?: string
          user_id: string
          username: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean | null
          session_data?: Json
          updated_at?: string
          user_id?: string
          username?: string
        }
        Relationships: []
      }
      kiwify_users: {
        Row: {
          created_at: string
          email: string
          force_password_change: boolean | null
          id: string
          last_login: string | null
          name: string | null
          password: string
          product_id: string | null
          product_name: string | null
          status: string
          subscription_id: string | null
          transaction_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          force_password_change?: boolean | null
          id?: string
          last_login?: string | null
          name?: string | null
          password: string
          product_id?: string | null
          product_name?: string | null
          status?: string
          subscription_id?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          force_password_change?: boolean | null
          id?: string
          last_login?: string | null
          name?: string | null
          password?: string
          product_id?: string | null
          product_name?: string | null
          status?: string
          subscription_id?: string | null
          transaction_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      scheduled_posts: {
        Row: {
          caption: string | null
          created_at: string
          error_message: string | null
          id: string
          platform: string
          posted: boolean | null
          scheduled_for: string
          updated_at: string
          user_id: string
          video_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          platform: string
          posted?: boolean | null
          scheduled_for: string
          updated_at?: string
          user_id: string
          video_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          platform?: string
          posted?: boolean | null
          scheduled_for?: string
          updated_at?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheduled_posts_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      search_history: {
        Row: {
          created_at: string
          id: string
          platform: string
          search_term: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          search_term: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          search_term?: string
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          description: string | null
          download_status: string | null
          id: string
          likes: number | null
          platform: string
          shares: number | null
          source_url: string
          thumbnail_url: string | null
          title: string
          updated_at: string
          user_id: string
          video_url: string
          views: number | null
          watermark_removed: boolean | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          download_status?: string | null
          id?: string
          likes?: number | null
          platform: string
          shares?: number | null
          source_url: string
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          user_id: string
          video_url: string
          views?: number | null
          watermark_removed?: boolean | null
        }
        Update: {
          created_at?: string
          description?: string | null
          download_status?: string | null
          id?: string
          likes?: number | null
          platform?: string
          shares?: number | null
          source_url?: string
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          video_url?: string
          views?: number | null
          watermark_removed?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
