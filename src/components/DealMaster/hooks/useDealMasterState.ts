
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
  console.log('=== useDealMasterState INITIALIZATION ===');
  console.log('Loaded quote data:', loadedQuoteData);
  console.log('Loaded resource types:', loadedSelectedResourceTypes);
  console.log('Loaded geographies:', loadedSelectedGeographies);
  console.log('Loaded categories:', loadedSelectedCategories);
  console.log('Loaded volume discounts:', loadedVolumeDiscounts);

  // Initialize state with loaded data or defaults
  const [quoteData, setQuoteData] = useState<QuoteData>(() => {
    const initialData = loadedQuoteData || {
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
    };
    console.log('Initial quote data state:', initialData);
    return initialData;
  });

  const [selectedResourceTypes, setSelectedResourceTypes] = useState<number[]>(() => {
    const initial = loadedSelectedResourceTypes || [];
    console.log('Initial resource types state:', initial);
    return initial;
  });
  
  const [selectedGeographies, setSelectedGeographies] = useState<number[]>(() => {
    const initial = loadedSelectedGeographies || [];
    console.log('Initial geographies state:', initial);
    return initial;
  });
  
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>(() => {
    const initial = loadedSelectedCategories || {
      level1: null,
      level2: null,
      level3: null,
    };
    console.log('Initial categories state:', initial);
    return initial;
  });
  
  const [volumeDiscounts, setVolumeDiscounts] = useState<VolumeDiscountRange[]>(() => {
    const initial = loadedVolumeDiscounts || [];
    console.log('Initial volume discounts state:', initial);
    return initial;
  });

  const [geographyTableData, setGeographyTableData] = useState<any[]>([]);
  const [categoryTableData, setCategoryTableData] = useState<any[]>([]);

  // Update state when loaded data changes
  useEffect(() => {
    if (loadedQuoteData) {
      console.log('=== UPDATING QUOTE DATA STATE ===');
      console.log('New loaded quote data:', loadedQuoteData);
      setQuoteData(prev => {
        console.log('Previous quote data:', prev);
        console.log('Setting new quote data:', loadedQuoteData);
        return loadedQuoteData;
      });
    }
  }, [loadedQuoteData]);

  useEffect(() => {
    if (loadedSelectedResourceTypes && loadedSelectedResourceTypes.length > 0) {
      console.log('=== UPDATING RESOURCE TYPES STATE ===');
      console.log('New loaded resource types:', loadedSelectedResourceTypes);
      setSelectedResourceTypes(loadedSelectedResourceTypes);
    }
  }, [loadedSelectedResourceTypes]);

  useEffect(() => {
    if (loadedSelectedGeographies && loadedSelectedGeographies.length > 0) {
      console.log('=== UPDATING GEOGRAPHIES STATE ===');
      console.log('New loaded geographies:', loadedSelectedGeographies);
      setSelectedGeographies(loadedSelectedGeographies);
    }
  }, [loadedSelectedGeographies]);

  useEffect(() => {
    if (loadedSelectedCategories) {
      console.log('=== UPDATING CATEGORIES STATE ===');
      console.log('New loaded categories:', loadedSelectedCategories);
      setSelectedCategories(loadedSelectedCategories);
    }
  }, [loadedSelectedCategories]);

  useEffect(() => {
    if (loadedVolumeDiscounts && loadedVolumeDiscounts.length > 0) {
      console.log('=== UPDATING VOLUME DISCOUNTS STATE ===');
      console.log('New loaded volume discounts:', loadedVolumeDiscounts);
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
      console.log('Auto-calculating duration:', duration);
      setQuoteData(prev => ({ ...prev, overall_duration_months: duration }));
    }
  }, [quoteData.knowledge_transition_start_date, quoteData.steady_state_end_date, quoteData.overall_duration_months]);

  // Debug current state
  useEffect(() => {
    console.log('=== CURRENT STATE DEBUG ===');
    console.log('Current quote data:', quoteData);
    console.log('Current selected resource types:', selectedResourceTypes);
    console.log('Current selected geographies:', selectedGeographies);
    console.log('Current selected categories:', selectedCategories);
    console.log('Current volume discounts:', volumeDiscounts);
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
