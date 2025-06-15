
import { useState, useEffect } from 'react';
import { calculateDuration } from '../utils/dateUtils';
import { QuoteData, VolumeDiscountRange, SelectedCategories } from '../types';

export const useDealMasterState = (
  dealId: string, 
  quoteName: string,
  loadedQuoteData?: QuoteData | null,
  loadedSelectedResourceTypes?: number[],
  loadedSelectedGeographies?: number[],
  loadedSelectedCategories?: SelectedCategories | null,
  loadedVolumeDiscounts?: VolumeDiscountRange[]
) => {
  const [quoteData, setQuoteData] = useState<QuoteData>({
    knowledge_transition_start_date: null,
    knowledge_transition_end_date: null,
    steady_state_start_date: null,
    steady_state_end_date: null,
    overall_duration_months: null,
    market_id: null,
    deal_discount_amount: null,
    deal_discount_percent: null,
    travel_percent: null,
    training_percent: null,
    other_costs_percent: null,
    infrastructure_percent: null,
    compliance_percent: null,
    licenses_percent: null,
  });

  const [selectedResourceTypes, setSelectedResourceTypes] = useState<number[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>({
    level1: null,
    level2: null,
    level3: null,
  });
  const [volumeDiscounts, setVolumeDiscounts] = useState<VolumeDiscountRange[]>([]);
  const [geographyTableData, setGeographyTableData] = useState<any[]>([]);
  const [categoryTableData, setCategoryTableData] = useState<any[]>([]);

  // Update state when loaded data changes
  useEffect(() => {
    if (loadedQuoteData) {
      console.log('useDealMasterState - Updating quote data with loaded data:', loadedQuoteData);
      setQuoteData(loadedQuoteData);
    }
  }, [loadedQuoteData]);

  useEffect(() => {
    if (loadedSelectedResourceTypes) {
      console.log('useDealMasterState - Updating resource types:', loadedSelectedResourceTypes);
      setSelectedResourceTypes(loadedSelectedResourceTypes);
    }
  }, [loadedSelectedResourceTypes]);

  useEffect(() => {
    if (loadedSelectedGeographies) {
      console.log('useDealMasterState - Updating geographies:', loadedSelectedGeographies);
      setSelectedGeographies(loadedSelectedGeographies);
    }
  }, [loadedSelectedGeographies]);

  useEffect(() => {
    if (loadedSelectedCategories) {
      console.log('useDealMasterState - Updating categories:', loadedSelectedCategories);
      setSelectedCategories(loadedSelectedCategories);
    }
  }, [loadedSelectedCategories]);

  useEffect(() => {
    if (loadedVolumeDiscounts) {
      console.log('useDealMasterState - Updating volume discounts:', loadedVolumeDiscounts);
      setVolumeDiscounts(loadedVolumeDiscounts);
    }
  }, [loadedVolumeDiscounts]);

  // Auto-calculate duration when dates change
  useEffect(() => {
    const duration = calculateDuration(
      quoteData.knowledge_transition_start_date,
      quoteData.steady_state_end_date
    );
    if (duration !== null && duration !== quoteData.overall_duration_months) {
      console.log('useDealMasterState - Auto-calculating duration:', duration);
      setQuoteData(prev => ({ ...prev, overall_duration_months: duration }));
    }
  }, [quoteData.knowledge_transition_start_date, quoteData.steady_state_end_date, quoteData.overall_duration_months]);

  return {
    quoteData,
    setQuoteData,
    selectedResourceTypes,
    setSelectedResourceTypes,
    selectedGeographies,
    setSelectedGeographies,
    selectedCategories,
    setSelectedCategories,
    volumeDiscounts,
    setVolumeDiscounts,
    geographyTableData,
    setGeographyTableData,
    categoryTableData,
    setCategoryTableData,
  };
};
