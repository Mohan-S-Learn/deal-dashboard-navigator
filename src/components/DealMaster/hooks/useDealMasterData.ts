
import { useState, useEffect } from 'react';
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
  const [markets, setMarkets] = useState<Market[]>([]);
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([]);
  const [geographies, setGeographies] = useState<Geography[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null);
  const [selectedResourceTypes, setSelectedResourceTypes] = useState<number[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<number[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<SelectedCategories | null>(null);
  const [volumeDiscounts, setVolumeDiscounts] = useState<VolumeDiscountRange[]>([]);
  const [loading, setLoading] = useState(true);
  const [masterDataLoaded, setMasterDataLoaded] = useState(false);

  const { toast } = useToast();

  const loadMasterData = async () => {
    try {
      console.log('useDealMasterData - Loading master data...');
      
      // Load all master data in parallel
      const [marketsResult, resourceTypesResult, geographiesResult, categoriesResult] = await Promise.all([
        supabase.from('Market').select('*').order('name'),
        supabase.from('ResourceType').select('*').order('name'),
        supabase.from('Geography').select('*').order('country, city'),
        supabase.from('ServiceCategory').select('*').order('level, name')
      ]);

      setMarkets(marketsResult.data || []);
      setResourceTypes(resourceTypesResult.data || []);
      setGeographies(geographiesResult.data || []);
      setServiceCategories(categoriesResult.data || []);
      
      console.log('useDealMasterData - Master data loaded successfully');
      setMasterDataLoaded(true);
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
      console.log('useDealMasterData - Loading quote data for:', { dealId, quoteName });
      
      // Load all quote-related data in parallel
      const [quoteResult, resourceTypeResult, geographyResult, categoryResult, volumeResult] = await Promise.all([
        supabase
          .from('Quotes')
          .select('*')
          .eq('Deal_Id', dealId)
          .eq('Quote_Name', quoteName)
          .maybeSingle(),
        
        supabase
          .from('QuoteResourceType')
          .select('resource_type_id')
          .eq('Deal_Id', dealId)
          .eq('Quote_Name', quoteName),
        
        supabase
          .from('QuoteGeography')
          .select('geography_id')
          .eq('Deal_Id', dealId)
          .eq('Quote_Name', quoteName),
        
        supabase
          .from('QuoteServiceCategory')
          .select('*')
          .eq('Deal_Id', dealId)
          .eq('Quote_Name', quoteName)
          .maybeSingle(),
        
        supabase
          .from('VolumeDiscount')
          .select('*')
          .eq('Deal_Id', dealId)
          .eq('Quote_Name', quoteName)
          .order('range_start')
      ]);

      // Process quote data
      if (quoteResult.data) {
        const loadedQuoteData: QuoteData = {
          knowledge_transition_start_date: quoteResult.data.knowledge_transition_start_date ? new Date(quoteResult.data.knowledge_transition_start_date) : null,
          knowledge_transition_end_date: quoteResult.data.knowledge_transition_end_date ? new Date(quoteResult.data.knowledge_transition_end_date) : null,
          steady_state_start_date: quoteResult.data.steady_state_start_date ? new Date(quoteResult.data.steady_state_start_date) : null,
          steady_state_end_date: quoteResult.data.steady_state_end_date ? new Date(quoteResult.data.steady_state_end_date) : null,
          overall_duration_months: quoteResult.data.overall_duration_months,
          market_id: quoteResult.data.market_id,
          deal_discount_amount: quoteResult.data.deal_discount_amount,
          deal_discount_percent: quoteResult.data.deal_discount_percent,
          travel_percent: quoteResult.data.travel_percent,
          training_percent: quoteResult.data.training_percent,
          other_costs_percent: quoteResult.data.other_costs_percent,
          infrastructure_percent: quoteResult.data.infrastructure_percent,
          compliance_percent: quoteResult.data.compliance_percent,
          licenses_percent: quoteResult.data.licenses_percent,
        };
        
        console.log('useDealMasterData - Successfully loaded quote data:', loadedQuoteData);
        setQuoteData(loadedQuoteData);
      } else {
        console.log('useDealMasterData - No quote found');
        setQuoteData(null);
      }

      // Process resource types
      const loadedResourceTypes = resourceTypeResult.data?.map(rt => rt.resource_type_id) || [];
      console.log('useDealMasterData - Loaded resource types:', loadedResourceTypes);
      setSelectedResourceTypes(loadedResourceTypes);

      // Process geographies
      const loadedGeographies = geographyResult.data?.map(g => g.geography_id) || [];
      console.log('useDealMasterData - Loaded geographies:', loadedGeographies);
      setSelectedGeographies(loadedGeographies);

      // Process categories
      if (categoryResult.data) {
        const loadedCategories: SelectedCategories = {
          level1: categoryResult.data.category_level_1_id,
          level2: categoryResult.data.category_level_2_id,
          level3: categoryResult.data.category_level_3_id,
        };
        console.log('useDealMasterData - Loaded categories:', loadedCategories);
        setSelectedCategories(loadedCategories);
      } else {
        console.log('useDealMasterData - No categories found');
        setSelectedCategories(null);
      }

      // Process volume discounts
      const loadedVolumeDiscounts = volumeResult.data || [];
      console.log('useDealMasterData - Loaded volume discounts:', loadedVolumeDiscounts);
      setVolumeDiscounts(loadedVolumeDiscounts);

      console.log('useDealMasterData - All quote data loaded successfully');

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

  // Load master data when component mounts
  useEffect(() => {
    loadMasterData();
  }, [dealId, quoteName]);

  // Load quote data after master data is loaded
  useEffect(() => {
    if (masterDataLoaded) {
      loadQuoteData();
    }
  }, [masterDataLoaded, dealId, quoteName]);

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
    masterDataLoaded,
    loadMasterData,
    loadQuoteData,
  };
};
