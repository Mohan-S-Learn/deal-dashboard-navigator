
export interface QuoteResourceEffort {
  id?: number;
  Deal_Id: string;
  Quote_Name: string;
  service_category_level_1_id?: number;
  service_category_level_2_id?: number;
  service_category_level_3_id?: number;
  service_category_level_4_id: number;
  experience_years: number;
  cost_category_id?: number;
  effort_year: number;
  effort_month: number;
  hours_allocated: number;
  created_at?: string;
}

export interface ResourceEffortsProps {
  dealId: string;
  quoteName: string;
  onBack: () => void;
}

export type EffortInputMode = 'year' | 'month';
