
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Market, 
  ResourceType, 
  Geography, 
  ServiceCategory, 
  QuoteData, 
  SelectedCategories, 
  VolumeDiscountRange 
} from '../types';

export const useDealMasterData = (dealId: string, quoteName: string) => {
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

  const [markets, setMarkets] = useState<Market[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [geographies, setGeographies] = useState<Geography[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [selectedResourceTypes, setSelectedResourceTypes] = useState<number[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories>({
    level1: null,
    level2: null,
    level3: null,
  });
  const [volumeDiscounts, setVolumeDiscounts] = useState<VolumeDiscountRange[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  const loadMasterData = async () => {
    try {
      console.log('useDealMasterData - Loading master data...');
      
      // Load markets
      const { data: marketsData } = await supabase.from('Market').select('*').order('name');
      setMarkets(marketsData || []);
      console.log('useDealMasterData - Loaded markets:', marketsData?.length);

      // Load resource types
      const { data: resourceTypesData } = await supabase.from('ResourceType').select('*').order('name');
      setResourceTypes(resourceTypesData || []);
      console.log('useDealMasterData - Loaded resource types:', resourceTypesData?.length);

      // Load geographies
      const { data: geographiesData } = await supabase.from('Geography').select('*').order('country, city');
      setGeographies(geographiesData || []);
      console.log('useDealMasterData - Loaded geographies:', geographiesData?.length);

      // Load service categories
      const { data: categoriesData } = await supabase.from('ServiceCategory').select('*').order('level, name');
      setServiceCategories(categoriesData || []);
      console.log('useDealMasterData - Loaded service categories:', categoriesData?.length);
    } catch (error) {
      console.error('Error loading master data:', error);
      toast({
        title: "Error",
        description: "Failed to load master data",
        variant: "destructive"
      });
    }
  };

  const loadQuoteData = async () => {
    try {
      setLoading(true);
      console.log('useDealMasterData - Loading quote data for:', { dealId, quoteName });
      
      // Load quote data
      const { data: quote } = await supabase
        .from('Quotes')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName)
        .single();

      console.log('useDealMasterData - Loaded quote:', quote);

      if (quote) {
        const loadedQuoteData = {
          knowledge_transition_start_date: quote.knowledge_transition_start_date ? new Date(quote.knowledge_transition_start_date) : null,
          knowledge_transition_end_date: quote.knowledge_transition_end_date ? new Date(quote.knowledge_transition_end_date) : null,
          steady_state_start_date: quote.steady_state_start_date ? new Date(quote.steady_state_start_date) : null,
          steady_state_end_date: quote.steady_state_end_date ? new Date(quote.steady_state_end_date) : null,
          overall_duration_months: quote.overall_duration_months,
          market_id: quote.market_id,
          deal_discount_amount: quote.deal_discount_amount,
          deal_discount_percent: quote.deal_discount_percent,
          travel_percent: quote.travel_percent,
          training_percent: quote.training_percent,
          other_costs_percent: quote.other_costs_percent,
          infrastructure_percent: quote.infrastructure_percent,
          compliance_percent: quote.compliance_percent,
          licenses_percent: quote.licenses_percent,
        };
        
        console.log('useDealMasterData - Setting quote data:', loadedQuoteData);
        setQuoteData(loadedQuoteData);
      }

      // Load selected resource types
      const { data: resourceTypeData } = await supabase
        .from('QuoteResourceType')
        .select('resource_type_id')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);
      
      const loadedResourceTypes = resourceTypeData?.map(rt => rt.resource_type_id) || [];
      console.log('useDealMasterData - Setting resource types:', loadedResourceTypes);
      setSelectedResourceTypes(loadedResourceTypes);

      // Load selected geographies
      const { data: geographyData } = await supabase
        .from('QuoteGeography')
        .select('geography_id')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);
      
      const loadedGeographies = geographyData?.map(g => g.geography_id) || [];
      console.log('useDealMasterData - Setting geographies:', loadedGeographies);
      setSelectedGeographies(loadedGeographies);

      // Load service categories
      const { data: categoryData } = await supabase
        .from('QuoteServiceCategory')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName)
        .single();
      
      if (categoryData) {
        const loadedCategories = {
          level1: categoryData.category_level_1_id,
          level2: categoryData.category_level_2_id,
          level3: categoryData.category_level_3_id,
        };
        console.log('useDealMasterData - Setting categories:', loadedCategories);
        setSelectedCategories(loadedCategories);
      }

      // Load volume discounts
      const { data: volumeData } = await supabase
        .from('VolumeDiscount')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName)
        .order('range_start');
      
      const loadedVolumeDiscounts = volumeData || [];
      console.log('useDealMasterData - Setting volume discounts:', loadedVolumeDiscounts);
      setVolumeDiscounts(loadedVolumeDiscounts);

    } catch (error) {
      console.error('Error loading quote data:', error);
      toast({
        title: "Error",
        description: "Failed to load quote data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    quoteData,
    markets,
    resourceTypes,
    geographies,
    serviceCategories,
    selectedResourceTypes,
    selectedGeographies,
    selectedCategories,
    volumeDiscounts,
    loading,
    loadMasterData,
    loadQuoteData,
  };
};
