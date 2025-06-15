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
      BenchmarkRate: {
        Row: {
          benchmark_rate_usd_per_hour: number | null
          cb_cost_usd_per_hour: number | null
          created_at: string | null
          experience_years: number
          geography_id: number | null
          id: number
          margin_percent: number | null
          service_category_level_1_id: number | null
          service_category_level_2_id: number | null
          service_category_level_3_id: number | null
          service_category_level_4_id: number
        }
        Insert: {
          benchmark_rate_usd_per_hour?: number | null
          cb_cost_usd_per_hour?: number | null
          created_at?: string | null
          experience_years: number
          geography_id?: number | null
          id?: number
          margin_percent?: number | null
          service_category_level_1_id?: number | null
          service_category_level_2_id?: number | null
          service_category_level_3_id?: number | null
          service_category_level_4_id: number
        }
        Update: {
          benchmark_rate_usd_per_hour?: number | null
          cb_cost_usd_per_hour?: number | null
          created_at?: string | null
          experience_years?: number
          geography_id?: number | null
          id?: number
          margin_percent?: number | null
          service_category_level_1_id?: number | null
          service_category_level_2_id?: number | null
          service_category_level_3_id?: number | null
          service_category_level_4_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "BenchmarkRate_geography_id_fkey"
            columns: ["geography_id"]
            isOneToOne: false
            referencedRelation: "Geography"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BenchmarkRate_service_category_level_1_id_fkey"
            columns: ["service_category_level_1_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BenchmarkRate_service_category_level_2_id_fkey"
            columns: ["service_category_level_2_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BenchmarkRate_service_category_level_3_id_fkey"
            columns: ["service_category_level_3_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "BenchmarkRate_service_category_level_4_id_fkey"
            columns: ["service_category_level_4_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
        ]
      }
      CostCategory: {
        Row: {
          created_at: string | null
          id: number
          name: string
          service_category_level_3_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
          service_category_level_3_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
          service_category_level_3_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "CostCategory_service_category_level_3_id_fkey"
            columns: ["service_category_level_3_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
        ]
      }
      Deals: {
        Row: {
          Created_Date: string
          Deal_Id: string
          Deal_Name: string
          Deal_Owner: string
          "Margin%": number
          Status: string
          Total_Revenue: number
        }
        Insert: {
          Created_Date: string
          Deal_Id: string
          Deal_Name: string
          Deal_Owner: string
          "Margin%": number
          Status: string
          Total_Revenue: number
        }
        Update: {
          Created_Date?: string
          Deal_Id?: string
          Deal_Name?: string
          Deal_Owner?: string
          "Margin%"?: number
          Status?: string
          Total_Revenue?: number
        }
        Relationships: []
      }
      Geography: {
        Row: {
          city: string
          country: string
          created_at: string | null
          id: number
          region: string | null
        }
        Insert: {
          city: string
          country: string
          created_at?: string | null
          id?: number
          region?: string | null
        }
        Update: {
          city?: string
          country?: string
          created_at?: string | null
          id?: number
          region?: string | null
        }
        Relationships: []
      }
      Market: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      QuoteGeography: {
        Row: {
          created_at: string | null
          Deal_Id: string
          geography_id: number
          id: number
          Quote_Name: string
        }
        Insert: {
          created_at?: string | null
          Deal_Id: string
          geography_id: number
          id?: number
          Quote_Name: string
        }
        Update: {
          created_at?: string | null
          Deal_Id?: string
          geography_id?: number
          id?: number
          Quote_Name?: string
        }
        Relationships: [
          {
            foreignKeyName: "QuoteGeography_Deal_Id_Quote_Name_fkey"
            columns: ["Deal_Id", "Quote_Name"]
            isOneToOne: false
            referencedRelation: "Quotes"
            referencedColumns: ["Deal_Id", "Quote_Name"]
          },
          {
            foreignKeyName: "QuoteGeography_geography_id_fkey"
            columns: ["geography_id"]
            isOneToOne: false
            referencedRelation: "Geography"
            referencedColumns: ["id"]
          },
        ]
      }
      QuoteResourceEffort: {
        Row: {
          cost_category_id: number | null
          created_at: string | null
          Deal_Id: string
          effort_month: number
          effort_year: number
          experience_years: number
          hours_allocated: number
          id: number
          Quote_Name: string
          service_category_level_1_id: number | null
          service_category_level_2_id: number | null
          service_category_level_3_id: number | null
          service_category_level_4_id: number
        }
        Insert: {
          cost_category_id?: number | null
          created_at?: string | null
          Deal_Id: string
          effort_month: number
          effort_year: number
          experience_years: number
          hours_allocated: number
          id?: number
          Quote_Name: string
          service_category_level_1_id?: number | null
          service_category_level_2_id?: number | null
          service_category_level_3_id?: number | null
          service_category_level_4_id: number
        }
        Update: {
          cost_category_id?: number | null
          created_at?: string | null
          Deal_Id?: string
          effort_month?: number
          effort_year?: number
          experience_years?: number
          hours_allocated?: number
          id?: number
          Quote_Name?: string
          service_category_level_1_id?: number | null
          service_category_level_2_id?: number | null
          service_category_level_3_id?: number | null
          service_category_level_4_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "QuoteResourceEffort_cost_category_id_fkey"
            columns: ["cost_category_id"]
            isOneToOne: false
            referencedRelation: "CostCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuoteResourceEffort_Deal_Id_Quote_Name_fkey"
            columns: ["Deal_Id", "Quote_Name"]
            isOneToOne: false
            referencedRelation: "Quotes"
            referencedColumns: ["Deal_Id", "Quote_Name"]
          },
          {
            foreignKeyName: "QuoteResourceEffort_service_category_level_1_id_fkey"
            columns: ["service_category_level_1_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuoteResourceEffort_service_category_level_2_id_fkey"
            columns: ["service_category_level_2_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuoteResourceEffort_service_category_level_3_id_fkey"
            columns: ["service_category_level_3_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuoteResourceEffort_service_category_level_4_id_fkey"
            columns: ["service_category_level_4_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
        ]
      }
      QuoteResourceType: {
        Row: {
          created_at: string | null
          Deal_Id: string
          id: number
          Quote_Name: string
          resource_type_id: number
        }
        Insert: {
          created_at?: string | null
          Deal_Id: string
          id?: number
          Quote_Name: string
          resource_type_id: number
        }
        Update: {
          created_at?: string | null
          Deal_Id?: string
          id?: number
          Quote_Name?: string
          resource_type_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "QuoteResourceType_Deal_Id_Quote_Name_fkey"
            columns: ["Deal_Id", "Quote_Name"]
            isOneToOne: false
            referencedRelation: "Quotes"
            referencedColumns: ["Deal_Id", "Quote_Name"]
          },
          {
            foreignKeyName: "QuoteResourceType_resource_type_id_fkey"
            columns: ["resource_type_id"]
            isOneToOne: false
            referencedRelation: "ResourceType"
            referencedColumns: ["id"]
          },
        ]
      }
      QuoteRevenue: {
        Row: {
          benchmark_rate_usd_per_hour: number | null
          cb_cost_usd_per_hour: number | null
          cost_category_id: number | null
          created_at: string | null
          Deal_Id: string
          experience_years: number
          geography_id: number | null
          id: number
          is_benchmark_rate_overridden: boolean | null
          is_cb_cost_overridden: boolean | null
          margin_percent: number | null
          Quote_Name: string
          service_category_level_1_id: number | null
          service_category_level_2_id: number | null
          service_category_level_3_id: number | null
          service_category_level_4_id: number
        }
        Insert: {
          benchmark_rate_usd_per_hour?: number | null
          cb_cost_usd_per_hour?: number | null
          cost_category_id?: number | null
          created_at?: string | null
          Deal_Id: string
          experience_years: number
          geography_id?: number | null
          id?: number
          is_benchmark_rate_overridden?: boolean | null
          is_cb_cost_overridden?: boolean | null
          margin_percent?: number | null
          Quote_Name: string
          service_category_level_1_id?: number | null
          service_category_level_2_id?: number | null
          service_category_level_3_id?: number | null
          service_category_level_4_id: number
        }
        Update: {
          benchmark_rate_usd_per_hour?: number | null
          cb_cost_usd_per_hour?: number | null
          cost_category_id?: number | null
          created_at?: string | null
          Deal_Id?: string
          experience_years?: number
          geography_id?: number | null
          id?: number
          is_benchmark_rate_overridden?: boolean | null
          is_cb_cost_overridden?: boolean | null
          margin_percent?: number | null
          Quote_Name?: string
          service_category_level_1_id?: number | null
          service_category_level_2_id?: number | null
          service_category_level_3_id?: number | null
          service_category_level_4_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "QuoteRevenue_cost_category_id_fkey"
            columns: ["cost_category_id"]
            isOneToOne: false
            referencedRelation: "CostCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuoteRevenue_Deal_Id_Quote_Name_fkey"
            columns: ["Deal_Id", "Quote_Name"]
            isOneToOne: false
            referencedRelation: "Quotes"
            referencedColumns: ["Deal_Id", "Quote_Name"]
          },
          {
            foreignKeyName: "QuoteRevenue_geography_id_fkey"
            columns: ["geography_id"]
            isOneToOne: false
            referencedRelation: "Geography"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuoteRevenue_service_category_level_1_id_fkey"
            columns: ["service_category_level_1_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuoteRevenue_service_category_level_2_id_fkey"
            columns: ["service_category_level_2_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuoteRevenue_service_category_level_3_id_fkey"
            columns: ["service_category_level_3_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuoteRevenue_service_category_level_4_id_fkey"
            columns: ["service_category_level_4_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
        ]
      }
      Quotes: {
        Row: {
          compliance_percent: number | null
          Created_By: string
          Created_Date: string
          deal_discount_amount: number | null
          deal_discount_percent: number | null
          Deal_Id: string
          infrastructure_percent: number | null
          knowledge_transition_end_date: string | null
          knowledge_transition_start_date: string | null
          licenses_percent: number | null
          "Margin %": number
          market_id: number | null
          other_costs_percent: number | null
          overall_duration_months: number | null
          Quote_ID: string | null
          Quote_Name: string
          Revenue: number
          Status: string
          steady_state_end_date: string | null
          steady_state_start_date: string | null
          training_percent: number | null
          travel_percent: number | null
        }
        Insert: {
          compliance_percent?: number | null
          Created_By: string
          Created_Date: string
          deal_discount_amount?: number | null
          deal_discount_percent?: number | null
          Deal_Id: string
          infrastructure_percent?: number | null
          knowledge_transition_end_date?: string | null
          knowledge_transition_start_date?: string | null
          licenses_percent?: number | null
          "Margin %": number
          market_id?: number | null
          other_costs_percent?: number | null
          overall_duration_months?: number | null
          Quote_ID?: string | null
          Quote_Name: string
          Revenue: number
          Status: string
          steady_state_end_date?: string | null
          steady_state_start_date?: string | null
          training_percent?: number | null
          travel_percent?: number | null
        }
        Update: {
          compliance_percent?: number | null
          Created_By?: string
          Created_Date?: string
          deal_discount_amount?: number | null
          deal_discount_percent?: number | null
          Deal_Id?: string
          infrastructure_percent?: number | null
          knowledge_transition_end_date?: string | null
          knowledge_transition_start_date?: string | null
          licenses_percent?: number | null
          "Margin %"?: number
          market_id?: number | null
          other_costs_percent?: number | null
          overall_duration_months?: number | null
          Quote_ID?: string | null
          Quote_Name?: string
          Revenue?: number
          Status?: string
          steady_state_end_date?: string | null
          steady_state_start_date?: string | null
          training_percent?: number | null
          travel_percent?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_quotes_market"
            columns: ["market_id"]
            isOneToOne: false
            referencedRelation: "Market"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Quotes_Deal_Id_fkey"
            columns: ["Deal_Id"]
            isOneToOne: false
            referencedRelation: "Deals"
            referencedColumns: ["Deal_Id"]
          },
        ]
      }
      QuoteServiceCategory: {
        Row: {
          category_level_1_id: number | null
          category_level_2_id: number | null
          category_level_3_id: number | null
          created_at: string | null
          Deal_Id: string
          id: number
          Quote_Name: string
        }
        Insert: {
          category_level_1_id?: number | null
          category_level_2_id?: number | null
          category_level_3_id?: number | null
          created_at?: string | null
          Deal_Id: string
          id?: number
          Quote_Name: string
        }
        Update: {
          category_level_1_id?: number | null
          category_level_2_id?: number | null
          category_level_3_id?: number | null
          created_at?: string | null
          Deal_Id?: string
          id?: number
          Quote_Name?: string
        }
        Relationships: [
          {
            foreignKeyName: "QuoteClientCategory_Deal_Id_Quote_Name_fkey"
            columns: ["Deal_Id", "Quote_Name"]
            isOneToOne: true
            referencedRelation: "Quotes"
            referencedColumns: ["Deal_Id", "Quote_Name"]
          },
          {
            foreignKeyName: "QuoteServiceCategory_category_level_1_id_fkey"
            columns: ["category_level_1_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuoteServiceCategory_category_level_2_id_fkey"
            columns: ["category_level_2_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QuoteServiceCategory_category_level_3_id_fkey"
            columns: ["category_level_3_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
        ]
      }
      ResourceType: {
        Row: {
          created_at: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      ServiceCategory: {
        Row: {
          created_at: string | null
          id: number
          level: number
          name: string
          parent_id: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          level: number
          name: string
          parent_id?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          level?: number
          name?: string
          parent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ServiceCategory_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "ServiceCategory"
            referencedColumns: ["id"]
          },
        ]
      }
      VolumeDiscount: {
        Row: {
          created_at: string | null
          Deal_Id: string
          discount_percent: number
          id: number
          Quote_Name: string
          range_end: number | null
          range_start: number
        }
        Insert: {
          created_at?: string | null
          Deal_Id: string
          discount_percent: number
          id?: number
          Quote_Name: string
          range_end?: number | null
          range_start: number
        }
        Update: {
          created_at?: string | null
          Deal_Id?: string
          discount_percent?: number
          id?: number
          Quote_Name?: string
          range_end?: number | null
          range_start?: number
        }
        Relationships: [
          {
            foreignKeyName: "VolumeDiscount_Deal_Id_Quote_Name_fkey"
            columns: ["Deal_Id", "Quote_Name"]
            isOneToOne: false
            referencedRelation: "Quotes"
            referencedColumns: ["Deal_Id", "Quote_Name"]
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
