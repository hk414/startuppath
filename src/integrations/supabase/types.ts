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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      journal_entries: {
        Row: {
          content: string
          created_at: string | null
          id: string
          mood: string | null
          tags: string[] | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          mood?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          mood?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "journal_entries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      journey_timeline: {
        Row: {
          achieved_at: string
          created_at: string
          id: string
          notes: string | null
          stage: Database["public"]["Enums"]["startup_stage"]
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          achieved_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          stage: Database["public"]["Enums"]["startup_stage"]
          status: string
          updated_at?: string
          user_id: string
        }
        Update: {
          achieved_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          stage?: Database["public"]["Enums"]["startup_stage"]
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lessons: {
        Row: {
          category: string
          context: string | null
          created_at: string | null
          id: string
          impact_level: string | null
          lesson: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: string
          context?: string | null
          created_at?: string | null
          id?: string
          impact_level?: string | null
          lesson: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: string
          context?: string | null
          created_at?: string | null
          id?: string
          impact_level?: string | null
          lesson?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      match_messages: {
        Row: {
          created_at: string
          id: string
          match_id: string
          message: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          message: string
          sender_id: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_messages_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      match_requests: {
        Row: {
          created_at: string
          id: string
          mentee_id: string
          mentor_id: string
          message: string | null
          status: Database["public"]["Enums"]["match_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          mentee_id: string
          mentor_id: string
          message?: string | null
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          mentee_id?: string
          mentor_id?: string
          message?: string | null
          status?: Database["public"]["Enums"]["match_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "match_requests_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "mentee_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "match_requests_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          created_at: string
          ended_at: string | null
          id: string
          mentee_id: string
          mentor_id: string
          shared_goals: string | null
          started_at: string
          status: Database["public"]["Enums"]["mentorship_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          ended_at?: string | null
          id?: string
          mentee_id: string
          mentor_id: string
          shared_goals?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["mentorship_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          ended_at?: string | null
          id?: string
          mentee_id?: string
          mentor_id?: string
          shared_goals?: string | null
          started_at?: string
          status?: Database["public"]["Enums"]["mentorship_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_mentee_id_fkey"
            columns: ["mentee_id"]
            isOneToOne: false
            referencedRelation: "mentee_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_mentor_id_fkey"
            columns: ["mentor_id"]
            isOneToOne: false
            referencedRelation: "mentor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mentee_profiles: {
        Row: {
          challenges: string[]
          created_at: string
          goals: string[]
          id: string
          industry: string
          preferred_mentor_traits: string[]
          startup_name: string | null
          startup_stage: Database["public"]["Enums"]["startup_stage"]
          timezone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          challenges?: string[]
          created_at?: string
          goals?: string[]
          id?: string
          industry: string
          preferred_mentor_traits?: string[]
          startup_name?: string | null
          startup_stage: Database["public"]["Enums"]["startup_stage"]
          timezone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          challenges?: string[]
          created_at?: string
          goals?: string[]
          id?: string
          industry?: string
          preferred_mentor_traits?: string[]
          startup_name?: string | null
          startup_stage?: Database["public"]["Enums"]["startup_stage"]
          timezone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      mentor_profiles: {
        Row: {
          availability: string | null
          bio: string | null
          company: string | null
          created_at: string
          expertise_areas: Database["public"]["Enums"]["expertise_area"][]
          id: string
          industries: string[]
          is_active: boolean | null
          linkedin_url: string | null
          max_mentees: number | null
          preferred_communication: string | null
          timezone: string | null
          title: string | null
          updated_at: string
          user_id: string
          years_experience: number | null
        }
        Insert: {
          availability?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          expertise_areas?: Database["public"]["Enums"]["expertise_area"][]
          id?: string
          industries?: string[]
          is_active?: boolean | null
          linkedin_url?: string | null
          max_mentees?: number | null
          preferred_communication?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string
          user_id: string
          years_experience?: number | null
        }
        Update: {
          availability?: string | null
          bio?: string | null
          company?: string | null
          created_at?: string
          expertise_areas?: Database["public"]["Enums"]["expertise_area"][]
          id?: string
          industries?: string[]
          is_active?: boolean | null
          linkedin_url?: string | null
          max_mentees?: number | null
          preferred_communication?: string | null
          timezone?: string | null
          title?: string | null
          updated_at?: string
          user_id?: string
          years_experience?: number | null
        }
        Relationships: []
      }
      mentorship_sessions: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          match_id: string
          meeting_link: string | null
          notes: string | null
          scheduled_at: string
          status: Database["public"]["Enums"]["session_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          match_id: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at: string
          status?: Database["public"]["Enums"]["session_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          match_id?: string
          meeting_link?: string | null
          notes?: string | null
          scheduled_at?: string
          status?: Database["public"]["Enums"]["session_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mentorship_sessions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      pivots: {
        Row: {
          created_at: string | null
          decision_made: string
          description: string
          id: string
          lessons_learned: string | null
          outcome: string | null
          pivot_date: string
          reasoning: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          decision_made: string
          description: string
          id?: string
          lessons_learned?: string | null
          outcome?: string | null
          pivot_date: string
          reasoning?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          decision_made?: string
          description?: string
          id?: string
          lessons_learned?: string | null
          outcome?: string | null
          pivot_date?: string
          reasoning?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "pivots_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          startup_name: string | null
          startup_stage: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          startup_name?: string | null
          startup_stage?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          startup_name?: string | null
          startup_stage?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      session_feedback: {
        Row: {
          continue_mentorship: boolean | null
          created_at: string
          feedback_text: string | null
          id: string
          rating: number
          session_id: string
          user_id: string
        }
        Insert: {
          continue_mentorship?: boolean | null
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating: number
          session_id: string
          user_id: string
        }
        Update: {
          continue_mentorship?: boolean | null
          created_at?: string
          feedback_text?: string | null
          id?: string
          rating?: number
          session_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "session_feedback_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "mentorship_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_current_stage: {
        Row: {
          current_stage: Database["public"]["Enums"]["startup_stage"]
          updated_at: string
          user_id: string
        }
        Insert: {
          current_stage: Database["public"]["Enums"]["startup_stage"]
          updated_at?: string
          user_id: string
        }
        Update: {
          current_stage?: Database["public"]["Enums"]["startup_stage"]
          updated_at?: string
          user_id?: string
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
      expertise_area:
        | "product"
        | "marketing"
        | "sales"
        | "fundraising"
        | "operations"
        | "tech"
        | "hr"
        | "legal"
        | "design"
      match_status: "pending" | "accepted" | "rejected" | "cancelled"
      mentorship_status: "active" | "paused" | "completed"
      session_status: "scheduled" | "completed" | "cancelled"
      startup_stage:
        | "idea"
        | "validation"
        | "building"
        | "testing"
        | "launch"
        | "growth"
        | "scaling"
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
      expertise_area: [
        "product",
        "marketing",
        "sales",
        "fundraising",
        "operations",
        "tech",
        "hr",
        "legal",
        "design",
      ],
      match_status: ["pending", "accepted", "rejected", "cancelled"],
      mentorship_status: ["active", "paused", "completed"],
      session_status: ["scheduled", "completed", "cancelled"],
      startup_stage: [
        "idea",
        "validation",
        "building",
        "testing",
        "launch",
        "growth",
        "scaling",
      ],
    },
  },
} as const
