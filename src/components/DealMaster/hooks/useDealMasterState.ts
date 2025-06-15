
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

  // Initialize state with loaded data immediately when it becomes available
  useEffect(() => {
    console.log('useDealMasterState - Effect triggered with loadedQuoteData:', loadedQuoteData);
    if (loadedQuoteData) {
      console.log('useDealMasterState - Setting quote data to:', loadedQuoteData);
      setQuoteData(loadedQuoteData);
    }
  }, [loadedQuoteData]);

  useEffect(() => {
    console.log('useDealMasterState - Effect triggered with loadedSelectedResourceTypes:', loadedSelectedResourceTypes);
    if (loadedSelectedResourceTypes) {
      console.log('useDealMasterState - Setting resource types to:', loadedSelectedResourceTypes);
      setSelectedResourceTypes(loadedSelectedResourceTypes);
    }
  }, [loadedSelectedResourceTypes]);

  useEffect(() => {
    console.log('useDealMasterState - Effect triggered with loadedSelectedGeographies:', loadedSelectedGeographies);
    if (loadedSelectedGeographies) {
      console.log('useDealMasterState - Setting geographies to:', loadedSelectedGeographies);
      setSelectedGeographies(loadedSelectedGeographies);
    }
  }, [loadedSelectedGeographies]);

  useEffect(() => {
    console.log('useDealMasterState - Effect triggered with loadedSelectedCategories:', loadedSelectedCategories);
    if (loadedSelectedCategories) {
      console.log('useDealMasterState - Setting categories to:', loadedSelectedCategories);
      setSelectedCategories(loadedSelectedCategories);
    }
  }, [loadedSelectedCategories]);

  useEffect(() => {
    console.log('useDealMasterState - Effect triggered with loadedVolumeDiscounts:', loadedVolumeDiscounts);
    if (loadedVolumeDiscounts) {
      console.log('useDealMasterState - Setting volume discounts to:', loadedVolumeDiscounts);
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

  // Debug log current state
  useEffect(() => {
    console.log('useDealMasterState - Current quoteData state:', quoteData);
  }, [quoteData]);

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
