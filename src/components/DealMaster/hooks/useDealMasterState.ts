
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
  // Initialize with empty state
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

  // Only update state when loadedQuoteData changes and is not null
  useEffect(() => {
    console.log('useDealMasterState - Quote data effect triggered:', { loadedQuoteData });
    if (loadedQuoteData !== null && loadedQuoteData !== undefined) {
      console.log('useDealMasterState - Setting quote data to:', loadedQuoteData);
      setQuoteData(loadedQuoteData);
    }
  }, [loadedQuoteData]);

  // Only update state when loadedSelectedResourceTypes changes and is not empty
  useEffect(() => {
    console.log('useDealMasterState - Resource types effect triggered:', { loadedSelectedResourceTypes });
    if (loadedSelectedResourceTypes && loadedSelectedResourceTypes.length > 0) {
      console.log('useDealMasterState - Setting resource types to:', loadedSelectedResourceTypes);
      setSelectedResourceTypes(loadedSelectedResourceTypes);
    }
  }, [loadedSelectedResourceTypes]);

  // Only update state when loadedSelectedGeographies changes and is not empty
  useEffect(() => {
    console.log('useDealMasterState - Geographies effect triggered:', { loadedSelectedGeographies });
    if (loadedSelectedGeographies && loadedSelectedGeographies.length > 0) {
      console.log('useDealMasterState - Setting geographies to:', loadedSelectedGeographies);
      setSelectedGeographies(loadedSelectedGeographies);
    }
  }, [loadedSelectedGeographies]);

  // Only update state when loadedSelectedCategories changes and is not null
  useEffect(() => {
    console.log('useDealMasterState - Categories effect triggered:', { loadedSelectedCategories });
    if (loadedSelectedCategories !== null && loadedSelectedCategories !== undefined) {
      console.log('useDealMasterState - Setting categories to:', loadedSelectedCategories);
      setSelectedCategories(loadedSelectedCategories);
    }
  }, [loadedSelectedCategories]);

  // Only update state when loadedVolumeDiscounts changes and is not empty
  useEffect(() => {
    console.log('useDealMasterState - Volume discounts effect triggered:', { loadedVolumeDiscounts });
    if (loadedVolumeDiscounts && loadedVolumeDiscounts.length > 0) {
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

  // Debug current state
  useEffect(() => {
    console.log('useDealMasterState - Current state summary:', {
      hasQuoteData: !!quoteData.market_id,
      marketId: quoteData.market_id,
      resourceTypesCount: selectedResourceTypes.length,
      geographiesCount: selectedGeographies.length,
      hasCategories: !!(selectedCategories.level1 || selectedCategories.level2 || selectedCategories.level3),
      volumeDiscountsCount: volumeDiscounts.length
    });
  }, [quoteData, selectedResourceTypes, selectedGeographies, selectedCategories, volumeDiscounts]);

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
