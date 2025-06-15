
export interface ResourceSkill {
  id: number;
  name: string;
  created_at?: string;
}

export interface CostCategory {
  id: number;
  name: string;
  service_category_level_3_id?: number;
  created_at?: string;
}

export interface BenchmarkRate {
  id: number;
  service_category_level_1_id?: number;
  service_category_level_2_id?: number;
  service_category_level_3_id?: number;
  resource_skill_id: number;
  experience_years: number;
  geography_id?: number;
  benchmark_rate_usd_per_hour?: number;
  cb_cost_usd_per_hour?: number;
  margin_percent?: number;
  created_at?: string;
}

export interface QuoteRevenue {
  id?: number;
  Deal_Id: string;
  Quote_Name: string;
  service_category_level_1_id?: number;
  service_category_level_2_id?: number;
  service_category_level_3_id?: number;
  resource_skill_id: number;
  experience_years: number;
  cost_category_id?: number;
  geography_id?: number;
  benchmark_rate_usd_per_hour?: number;
  cb_cost_usd_per_hour?: number;
  margin_percent?: number;
  is_benchmark_rate_overridden?: boolean;
  is_cb_cost_overridden?: boolean;
  created_at?: string;
}

export interface RevenueProps {
  dealId: string;
  quoteName: string;
  onBack: () => void;
}
