
export interface Market {
  id: number;
  name: string;
}

export interface ResourceType {
  id: number;
  name: string;
}

export interface Geography {
  id: number;
  country: string;
  city: string;
  region: string;
}

export interface ServiceCategory {
  id: number;
  level: number;
  name: string;
  parent_id: number | null;
}

export interface VolumeDiscountRange {
  id?: number;
  range_start: number;
  range_end: number | null;
  discount_percent: number;
}

export interface SelectedGeographyRow {
  id: string;
  region: string;
  country: string;
  city: string;
}

export interface QuoteData {
  knowledge_transition_start_date: Date | null;
  knowledge_transition_end_date: Date | null;
  steady_state_start_date: Date | null;
  steady_state_end_date: Date | null;
  overall_duration_months: number | null;
  market_id: number | null;
  deal_discount_amount: number | null;
  deal_discount_percent: number | null;
  travel_percent: number | null;
  training_percent: number | null;
  other_costs_percent: number | null;
  infrastructure_percent: number | null;
  compliance_percent: number | null;
  licenses_percent: number | null;
}

export interface SelectedCategories {
  level1: number | null;
  level2: number | null;
  level3: number | null;
}

export interface DealMasterProps {
  dealId: string;
  quoteName: string;
  onBack: () => void;
}
