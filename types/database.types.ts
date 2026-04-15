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
      availability: {
        Row: {
          end_time: string
          expert_id: string
          id: string
          is_active: boolean
          start_time: string
          weekday: number
        }
        Insert: {
          end_time: string
          expert_id: string
          id?: string
          is_active?: boolean
          start_time: string
          weekday: number
        }
        Update: {
          end_time?: string
          expert_id?: string
          id?: string
          is_active?: boolean
          start_time?: string
          weekday?: number
        }
        Relationships: [
          {
            foreignKeyName: "availability_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      client_profiles: {
        Row: {
          company_name: string | null
          created_at: string
          id: string
          sessions_count: number
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          id?: string
          sessions_count?: number
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          id?: string
          sessions_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_profiles: {
        Row: {
          bio: string | null
          created_at: string
          headline: string | null
          id: string
          is_active: boolean
          rating_avg: number | null
          response_time_hours: number | null
          sessions_count: number
          user_id: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          headline?: string | null
          id?: string
          is_active?: boolean
          rating_avg?: number | null
          response_time_hours?: number | null
          sessions_count?: number
          user_id: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          headline?: string | null
          id?: string
          is_active?: boolean
          rating_avg?: number | null
          response_time_hours?: number | null
          sessions_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      expert_skills: {
        Row: {
          created_at: string
          expert_id: string
          id: string
          skill_id: string
          years_exp: number | null
        }
        Insert: {
          created_at?: string
          expert_id: string
          id?: string
          skill_id: string
          years_exp?: number | null
        }
        Update: {
          created_at?: string
          expert_id?: string
          id?: string
          skill_id?: string
          years_exp?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "expert_skills_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_profiles: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          sessions_completed: number
          user_id: string
          xp_points: number
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          sessions_completed?: number
          user_id: string
          xp_points?: number
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          sessions_completed?: number
          user_id?: string
          xp_points?: number
        }
        Relationships: [
          {
            foreignKeyName: "learner_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      learner_skill_history: {
        Row: {
          created_at: string
          id: string
          last_session_at: string | null
          learner_id: string
          sessions_count: number
          skill_id: string
          total_hours: number
        }
        Insert: {
          created_at?: string
          id?: string
          last_session_at?: string | null
          learner_id: string
          sessions_count?: number
          skill_id: string
          total_hours?: number
        }
        Update: {
          created_at?: string
          id?: string
          last_session_at?: string | null
          learner_id?: string
          sessions_count?: number
          skill_id?: string
          total_hours?: number
        }
        Relationships: [
          {
            foreignKeyName: "learner_skill_history_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "learner_skill_history_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          id: string
          read_at: string | null
          recipient_id: string
          sender_id: string
          sent_at: string
          session_id: string | null
        }
        Insert: {
          body: string
          id?: string
          read_at?: string | null
          recipient_id: string
          sender_id: string
          sent_at?: string
          session_id?: string | null
        }
        Update: {
          body?: string
          id?: string
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
          sent_at?: string
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      offers: {
        Row: {
          base_price: number
          created_at: string
          description: string | null
          duration_min: number | null
          expert_id: string
          id: string
          is_active: boolean
          location_type: Database["public"]["Enums"]["location_type"] | null
          max_learners: number | null
          min_price: number | null
          offer_type: Database["public"]["Enums"]["offer_type"]
          skill_id: string
          title: string
        }
        Insert: {
          base_price: number
          created_at?: string
          description?: string | null
          duration_min?: number | null
          expert_id: string
          id?: string
          is_active?: boolean
          location_type?: Database["public"]["Enums"]["location_type"] | null
          max_learners?: number | null
          min_price?: number | null
          offer_type: Database["public"]["Enums"]["offer_type"]
          skill_id: string
          title: string
        }
        Update: {
          base_price?: number
          created_at?: string
          description?: string | null
          duration_min?: number | null
          expert_id?: string
          id?: string
          is_active?: boolean
          location_type?: Database["public"]["Enums"]["location_type"] | null
          max_learners?: number | null
          min_price?: number | null
          offer_type?: Database["public"]["Enums"]["offer_type"]
          skill_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "offers_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          captured_at: string | null
          created_at: string
          expert_payout: number
          gateway: string | null
          gateway_payment_id: string | null
          id: string
          payer_id: string
          pix_code: string | null
          platform_fee: number
          refunded_at: string | null
          released_at: string | null
          session_id: string
          status: Database["public"]["Enums"]["payment_status"]
        }
        Insert: {
          amount: number
          captured_at?: string | null
          created_at?: string
          expert_payout: number
          gateway?: string | null
          gateway_payment_id?: string | null
          id?: string
          payer_id: string
          pix_code?: string | null
          platform_fee: number
          refunded_at?: string | null
          released_at?: string | null
          session_id: string
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Update: {
          amount?: number
          captured_at?: string | null
          created_at?: string
          expert_payout?: number
          gateway?: string | null
          gateway_payment_id?: string | null
          id?: string
          payer_id?: string
          pix_code?: string | null
          platform_fee?: number
          refunded_at?: string | null
          released_at?: string | null
          session_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
        }
        Relationships: [
          {
            foreignKeyName: "payments_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          cpf_hash: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          is_verified: boolean
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          verified_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          cpf_hash?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          is_verified?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          verified_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          cpf_hash?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          verified_at?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          session_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          reviewee_id: string
          reviewer_id: string
          session_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          reviewee_id?: string
          reviewer_id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      session_requests: {
        Row: {
          counter_price: number | null
          created_at: string
          expires_at: string | null
          id: string
          message: string | null
          offer_id: string
          proposed_date: string | null
          proposed_price: number | null
          requester_id: string
          responded_at: string | null
          status: Database["public"]["Enums"]["session_request_status"]
        }
        Insert: {
          counter_price?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string | null
          offer_id: string
          proposed_date?: string | null
          proposed_price?: number | null
          requester_id: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["session_request_status"]
        }
        Update: {
          counter_price?: number | null
          created_at?: string
          expires_at?: string | null
          id?: string
          message?: string | null
          offer_id?: string
          proposed_date?: string | null
          proposed_price?: number | null
          requester_id?: string
          responded_at?: string | null
          status?: Database["public"]["Enums"]["session_request_status"]
        }
        Relationships: [
          {
            foreignKeyName: "session_requests_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "session_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          client_id: string | null
          completed_at: string | null
          created_at: string
          duration_min: number
          expert_id: string
          id: string
          learner_id: string | null
          location_detail: string | null
          location_type: Database["public"]["Enums"]["location_type"]
          offer_id: string
          offer_type: Database["public"]["Enums"]["offer_type"]
          price_paid: number
          request_id: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["session_status"]
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          duration_min?: number
          expert_id: string
          id?: string
          learner_id?: string | null
          location_detail?: string | null
          location_type: Database["public"]["Enums"]["location_type"]
          offer_id: string
          offer_type: Database["public"]["Enums"]["offer_type"]
          price_paid: number
          request_id?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["session_status"]
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string
          duration_min?: number
          expert_id?: string
          id?: string
          learner_id?: string | null
          location_detail?: string | null
          location_type?: Database["public"]["Enums"]["location_type"]
          offer_id?: string
          offer_type?: Database["public"]["Enums"]["offer_type"]
          price_paid?: number
          request_id?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["session_status"]
        }
        Relationships: [
          {
            foreignKeyName: "sessions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "expert_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_learner_id_fkey"
            columns: ["learner_id"]
            isOneToOne: false
            referencedRelation: "learner_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "offers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sessions_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: true
            referencedRelation: "session_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      skill_categories: {
        Row: {
          color_token: string | null
          created_at: string
          icon_name: string | null
          id: string
          name: string
          slug: string
          type: Database["public"]["Enums"]["skill_category"]
        }
        Insert: {
          color_token?: string | null
          created_at?: string
          icon_name?: string | null
          id?: string
          name: string
          slug: string
          type: Database["public"]["Enums"]["skill_category"]
        }
        Update: {
          color_token?: string | null
          created_at?: string
          icon_name?: string | null
          id?: string
          name?: string
          slug?: string
          type?: Database["public"]["Enums"]["skill_category"]
        }
        Relationships: []
      }
      skills: {
        Row: {
          category_id: string
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          category_id: string
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          category_id?: string
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "skill_categories"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      location_type: "in_person" | "remote" | "hybrid"
      offer_type: "practical_experience" | "hourly_mentoring" | "service"
      payment_status:
        | "pending"
        | "captured"
        | "released"
        | "refunded"
        | "failed"
      session_request_status:
        | "pending"
        | "accepted"
        | "declined"
        | "counter_proposed"
        | "expired"
      session_status:
        | "scheduled"
        | "in_progress"
        | "completed"
        | "cancelled"
        | "disputed"
      skill_category: "digital" | "physical"
      user_role: "learner" | "expert" | "client" | "admin"
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
    Enums: {
      location_type: ["in_person", "remote", "hybrid"],
      offer_type: ["practical_experience", "hourly_mentoring", "service"],
      payment_status: ["pending", "captured", "released", "refunded", "failed"],
      session_request_status: [
        "pending",
        "accepted",
        "declined",
        "counter_proposed",
        "expired",
      ],
      session_status: [
        "scheduled",
        "in_progress",
        "completed",
        "cancelled",
        "disputed",
      ],
      skill_category: ["digital", "physical"],
      user_role: ["learner", "expert", "client", "admin"],
    },
  },
} as const
