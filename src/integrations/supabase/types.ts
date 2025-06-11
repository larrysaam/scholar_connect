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
          student_id?: string
          timeslot?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_metadata: {
        Row: {
          ai_generated_summary: string | null
          author_name: string | null
          content_id: string
          content_type: string
          created_at: string | null
          currency: string | null
          description: string | null
          download_count: number | null
          file_format: string | null
          file_size: number | null
          id: string
          institution: string | null
          keywords: string[] | null
          language_code: string | null
          license_type: string | null
          price: number | null
          publication_date: string | null
          subject_areas: string[] | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          ai_generated_summary?: string | null
          author_name?: string | null
          content_id: string
          content_type: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          download_count?: number | null
          file_format?: string | null
          file_size?: number | null
          id?: string
          institution?: string | null
          keywords?: string[] | null
          language_code?: string | null
          license_type?: string | null
          price?: number | null
          publication_date?: string | null
          subject_areas?: string[] | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          ai_generated_summary?: string | null
          author_name?: string | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          download_count?: number | null
          file_format?: string | null
          file_size?: number | null
          id?: string
          institution?: string | null
          keywords?: string[] | null
          language_code?: string | null
          license_type?: string | null
          price?: number | null
          publication_date?: string | null
          subject_areas?: string[] | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      content_quality_assessments: {
        Row: {
          ai_quality_level: string | null
          ai_quality_score: number | null
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          peer_review_score: number | null
          plagiarism_score: number | null
          review_count: number | null
          updated_at: string | null
        }
        Insert: {
          ai_quality_level?: string | null
          ai_quality_score?: number | null
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          peer_review_score?: number | null
          plagiarism_score?: number | null
          review_count?: number | null
          updated_at?: string | null
        }
        Update: {
          ai_quality_level?: string | null
          ai_quality_score?: number | null
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          peer_review_score?: number | null
          plagiarism_score?: number | null
          review_count?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      content_reviews: {
        Row: {
          content_id: string
          content_type: string
          created_at: string | null
          id: string
          is_verified_purchase: boolean | null
          rating: number | null
          review_text: string | null
          reviewer_id: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string | null
          id?: string
          is_verified_purchase?: boolean | null
          rating?: number | null
          review_text?: string | null
          reviewer_id?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string | null
          id?: string
          is_verified_purchase?: boolean | null
          rating?: number | null
          review_text?: string | null
          reviewer_id?: string | null
        }
        Relationships: []
      }
      discussion_forums: {
        Row: {
          category: string
          created_at: string | null
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean | null
          title: string
        }
        Insert: {
          category: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title: string
        }
        Update: {
          category?: string
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          downvotes: number | null
          forum_id: string | null
          id: string
          parent_post_id: string | null
          title: string | null
          updated_at: string | null
          upvotes: number | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          downvotes?: number | null
          forum_id?: string | null
          id?: string
          parent_post_id?: string | null
          title?: string | null
          updated_at?: string | null
          upvotes?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          downvotes?: number | null
          forum_id?: string | null
          id?: string
          parent_post_id?: string | null
          title?: string | null
          updated_at?: string | null
          upvotes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "discussion_forums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_parent_post_id_fkey"
            columns: ["parent_post_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      institutional_profiles: {
        Row: {
          admin_contact_name: string
          admin_email: string
          admin_notes: string | null
          application_status: string | null
          approved_at: string | null
          banner_url: string | null
          certifications: string[] | null
          country_region: string
          created_at: string | null
          data_ownership_confirmed: boolean | null
          department_name: string | null
          ethics_policy_url: string | null
          existing_repositories: string[] | null
          id: string
          institution_type: string
          institutional_address: string | null
          irb_reference: string | null
          logo_url: string | null
          official_website: string
          organization_name: string
          output_types: string[]
          phone_number: string | null
          primary_research_fields: string[]
          primary_uploader_id: string | null
          rejected_at: string | null
          social_media: Json | null
          updated_at: string | null
        }
        Insert: {
          admin_contact_name: string
          admin_email: string
          admin_notes?: string | null
          application_status?: string | null
          approved_at?: string | null
          banner_url?: string | null
          certifications?: string[] | null
          country_region: string
          created_at?: string | null
          data_ownership_confirmed?: boolean | null
          department_name?: string | null
          ethics_policy_url?: string | null
          existing_repositories?: string[] | null
          id?: string
          institution_type: string
          institutional_address?: string | null
          irb_reference?: string | null
          logo_url?: string | null
          official_website: string
          organization_name: string
          output_types: string[]
          phone_number?: string | null
          primary_research_fields: string[]
          primary_uploader_id?: string | null
          rejected_at?: string | null
          social_media?: Json | null
          updated_at?: string | null
        }
        Update: {
          admin_contact_name?: string
          admin_email?: string
          admin_notes?: string | null
          application_status?: string | null
          approved_at?: string | null
          banner_url?: string | null
          certifications?: string[] | null
          country_region?: string
          created_at?: string | null
          data_ownership_confirmed?: boolean | null
          department_name?: string | null
          ethics_policy_url?: string | null
          existing_repositories?: string[] | null
          id?: string
          institution_type?: string
          institutional_address?: string | null
          irb_reference?: string | null
          logo_url?: string | null
          official_website?: string
          organization_name?: string
          output_types?: string[]
          phone_number?: string | null
          primary_research_fields?: string[]
          primary_uploader_id?: string | null
          rejected_at?: string | null
          social_media?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      institutional_team_members: {
        Row: {
          added_at: string | null
          id: string
          institutional_profile_id: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          added_at?: string | null
          id?: string
          institutional_profile_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          added_at?: string | null
          id?: string
          institutional_profile_id?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "institutional_team_members_institutional_profile_id_fkey"
            columns: ["institutional_profile_id"]
            isOneToOne: false
            referencedRelation: "institutional_profiles"
            referencedColumns: ["id"]
          },
        ]
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
          processing_fee: number | null
          provider_id: string
          receipt_url: string | null
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
          processing_fee?: number | null
          provider_id: string
          receipt_url?: string | null
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
          processing_fee?: number | null
          provider_id?: string
          receipt_url?: string | null
          stripe_payment_intent_id?: string | null
          student_id?: string
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      search_analytics: {
        Row: {
          clicked_content_ids: string[] | null
          filters_applied: Json | null
          id: string
          results_count: number | null
          search_query: string
          search_timestamp: string | null
          user_id: string | null
        }
        Insert: {
          clicked_content_ids?: string[] | null
          filters_applied?: Json | null
          id?: string
          results_count?: number | null
          search_query: string
          search_timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          clicked_content_ids?: string[] | null
          filters_applied?: Json | null
          id?: string
          results_count?: number | null
          search_query?: string
          search_timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      seller_profiles: {
        Row: {
          academic_credentials: string
          admin_notes: string | null
          affiliation: string
          application_status: string | null
          approved_at: string | null
          country_region: string
          created_at: string | null
          data_collection_methodology: string | null
          ethical_approval_ref: string
          fields_expertise: string[]
          full_name: string
          id: string
          languages_spoken: string[]
          license_preference: string | null
          linkedin_profile: string | null
          orcid_id: string | null
          pricing_model: string
          profile_photo_url: string | null
          rejected_at: string | null
          researcher_id: string | null
          researchgate_profile: string | null
          seller_tier: string | null
          tools_software: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          academic_credentials: string
          admin_notes?: string | null
          affiliation: string
          application_status?: string | null
          approved_at?: string | null
          country_region: string
          created_at?: string | null
          data_collection_methodology?: string | null
          ethical_approval_ref: string
          fields_expertise: string[]
          full_name: string
          id?: string
          languages_spoken: string[]
          license_preference?: string | null
          linkedin_profile?: string | null
          orcid_id?: string | null
          pricing_model: string
          profile_photo_url?: string | null
          rejected_at?: string | null
          researcher_id?: string | null
          researchgate_profile?: string | null
          seller_tier?: string | null
          tools_software?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          academic_credentials?: string
          admin_notes?: string | null
          affiliation?: string
          application_status?: string | null
          approved_at?: string | null
          country_region?: string
          created_at?: string | null
          data_collection_methodology?: string | null
          ethical_approval_ref?: string
          fields_expertise?: string[]
          full_name?: string
          id?: string
          languages_spoken?: string[]
          license_preference?: string | null
          linkedin_profile?: string | null
          orcid_id?: string | null
          pricing_model?: string
          profile_photo_url?: string | null
          rejected_at?: string | null
          researcher_id?: string | null
          researchgate_profile?: string | null
          seller_tier?: string | null
          tools_software?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          country: string | null
          created_at: string | null
          date_of_birth: string | null
          email: string
          experience: string | null
          expertise: string[] | null
          faculty: string | null
          id: string
          institution: string | null
          languages: string[] | null
          linkedin_url: string | null
          name: string | null
          other_expertise: string | null
          payout_details: Json | null
          phone_number: string | null
          preferred_payout_method:
            | Database["public"]["Enums"]["payout_method"]
            | null
          research_areas: string[] | null
          research_stage: string | null
          role: Database["public"]["Enums"]["user_role"]
          sex: Database["public"]["Enums"]["sex_type"] | null
          study_level: Database["public"]["Enums"]["study_level"] | null
          topic_title: string | null
          updated_at: string | null
          user_id: string | null
          wallet_balance: number | null
        }
        Insert: {
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email: string
          experience?: string | null
          expertise?: string[] | null
          faculty?: string | null
          id: string
          institution?: string | null
          languages?: string[] | null
          linkedin_url?: string | null
          name?: string | null
          other_expertise?: string | null
          payout_details?: Json | null
          phone_number?: string | null
          preferred_payout_method?:
            | Database["public"]["Enums"]["payout_method"]
            | null
          research_areas?: string[] | null
          research_stage?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sex?: Database["public"]["Enums"]["sex_type"] | null
          study_level?: Database["public"]["Enums"]["study_level"] | null
          topic_title?: string | null
          updated_at?: string | null
          user_id?: string | null
          wallet_balance?: number | null
        }
        Update: {
          country?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          email?: string
          experience?: string | null
          expertise?: string[] | null
          faculty?: string | null
          id?: string
          institution?: string | null
          languages?: string[] | null
          linkedin_url?: string | null
          name?: string | null
          other_expertise?: string | null
          payout_details?: Json | null
          phone_number?: string | null
          preferred_payout_method?:
            | Database["public"]["Enums"]["payout_method"]
            | null
          research_areas?: string[] | null
          research_stage?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sex?: Database["public"]["Enums"]["sex_type"] | null
          study_level?: Database["public"]["Enums"]["study_level"] | null
          topic_title?: string | null
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
          processed_at: string | null
          transaction_reference: string | null
          user_id: string
          withdrawal_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          payout_details: Json
          processed_at?: string | null
          transaction_reference?: string | null
          user_id: string
          withdrawal_id?: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          payout_details?: Json
          processed_at?: string | null
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
        | "assigned"
        | "in_progress"
        | "completed"
        | "cancelled"
      payment_method: "stripe" | "mobile_money" | "bank_transfer"
      payment_status: "pending" | "paid" | "failed" | "refunded" | "released"
      payment_type: "consultation" | "service"
      payout_method: "mobile_money" | "bank_transfer" | "paypal"
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
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
      payment_method: ["stripe", "mobile_money", "bank_transfer"],
      payment_status: ["pending", "paid", "failed", "refunded", "released"],
      payment_type: ["consultation", "service"],
      payout_method: ["mobile_money", "bank_transfer", "paypal"],
      sex_type: ["male", "female"],
      study_level: ["undergraduate", "masters", "phd", "postdoc"],
      user_role: ["student", "expert", "aid", "admin"],
    },
  },
} as const
