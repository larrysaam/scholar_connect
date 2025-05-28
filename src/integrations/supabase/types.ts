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
      consultations: {
        Row: {
          amount: number
          completed_at: string | null
          consultation_id: string
          created_at: string | null
          description: string | null
          duration_hours: number | null
          expert_id: string
          meeting_link: string | null
          notes: string | null
          status: Database["public"]["Enums"]["consultation_status"] | null
          student_id: string
          timeslot: string
          title: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          completed_at?: string | null
          consultation_id?: string
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          expert_id: string
          meeting_link?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["consultation_status"] | null
          student_id: string
          timeslot: string
          title: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          completed_at?: string | null
          consultation_id?: string
          created_at?: string | null
          description?: string | null
          duration_hours?: number | null
          expert_id?: string
          meeting_link?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["consultation_status"] | null
          student_id?: string
          timeslot?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          aid_id: string
          amount: number
          approved_at: string | null
          completion_notes: string | null
          created_at: string | null
          deadline: string | null
          delivery_files: Json | null
          description: string | null
          files: Json | null
          job_id: string
          status: Database["public"]["Enums"]["job_status"] | null
          student_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          aid_id: string
          amount: number
          approved_at?: string | null
          completion_notes?: string | null
          created_at?: string | null
          deadline?: string | null
          delivery_files?: Json | null
          description?: string | null
          files?: Json | null
          job_id?: string
          status?: Database["public"]["Enums"]["job_status"] | null
          student_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          aid_id?: string
          amount?: number
          approved_at?: string | null
          completion_notes?: string | null
          created_at?: string | null
          deadline?: string | null
          delivery_files?: Json | null
          description?: string | null
          files?: Json | null
          job_id?: string
          status?: Database["public"]["Enums"]["job_status"] | null
          student_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          consultation_id: string | null
          created_at: string | null
          job_id: string | null
          payment_id: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          processing_fee: number | null
          provider_id: string
          receipt_url: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id: string | null
          student_id: string
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          amount: number
          consultation_id?: string | null
          created_at?: string | null
          job_id?: string | null
          payment_id?: string
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_type: Database["public"]["Enums"]["payment_type"]
          processing_fee?: number | null
          provider_id: string
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          student_id: string
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          amount?: number
          consultation_id?: string | null
          created_at?: string | null
          job_id?: string | null
          payment_id?: string
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_type?: Database["public"]["Enums"]["payment_type"]
          processing_fee?: number | null
          provider_id?: string
          receipt_url?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          stripe_payment_intent_id?: string | null
          student_id?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          name: string | null
          payout_details: Json | null
          preferred_payout_method:
            | Database["public"]["Enums"]["payout_method"]
            | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          user_id: string | null
          wallet_balance: number | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          name?: string | null
          payout_details?: Json | null
          preferred_payout_method?:
            | Database["public"]["Enums"]["payout_method"]
            | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string | null
          wallet_balance?: number | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          name?: string | null
          payout_details?: Json | null
          preferred_payout_method?:
            | Database["public"]["Enums"]["payout_method"]
            | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          user_id?: string | null
          wallet_balance?: number | null
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string | null
          payout_details: Json
          payout_method: Database["public"]["Enums"]["payout_method"]
          processed_at: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference: string | null
          user_id: string
          withdrawal_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          payout_details: Json
          payout_method: Database["public"]["Enums"]["payout_method"]
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference?: string | null
          user_id: string
          withdrawal_id?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          payout_details?: Json
          payout_method?: Database["public"]["Enums"]["payout_method"]
          processed_at?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference?: string | null
          user_id?: string
          withdrawal_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_release_payments: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      consultation_status: "pending" | "confirmed" | "completed" | "cancelled"
      job_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "approved"
        | "cancelled"
      payment_method: "mobile_money" | "card" | "wallet"
      payment_status: "pending" | "paid" | "released" | "refunded" | "failed"
      payment_type: "consultation" | "service" | "subscription"
      payout_method: "mobile_money" | "bank_transfer"
      sex_type: "male" | "female"
      study_level: "undergraduate" | "masters" | "phd" | "postdoc"
      user_role: "student" | "expert" | "aid" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      consultation_status: ["pending", "confirmed", "completed", "cancelled"],
      job_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "approved",
        "cancelled",
      ],
      payment_method: ["mobile_money", "card", "wallet"],
      payment_status: ["pending", "paid", "released", "refunded", "failed"],
      payment_type: ["consultation", "service", "subscription"],
      payout_method: ["mobile_money", "bank_transfer"],
      sex_type: ["male", "female"],
      study_level: ["undergraduate", "masters", "phd", "postdoc"],
      user_role: ["student", "expert", "aid", "admin"],
    },
  },
} as const
