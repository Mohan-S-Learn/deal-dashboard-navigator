
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
      console.log('=== LOADING MASTER DATA ===');
      
      const [marketsResult, resourceTypesResult, geographiesResult, categoriesResult] = await Promise.all([
        supabase.from('Market').select('*').order('name'),
        supabase.from('ResourceType').select('*').order('name'),
        supabase.from('Geography').select('*').order('country, city'),
        supabase.from('ServiceCategory').select('*').order('level, name')
      ]);

      console.log('Markets loaded:', marketsResult.data?.length || 0);
      console.log('Resource types loaded:', resourceTypesResult.data?.length || 0);
      console.log('Geographies loaded:', geographiesResult.data?.length || 0);
      console.log('Service categories loaded:', categoriesResult.data?.length || 0);

      setMarkets(marketsResult.data || []);
      setResourceTypes(resourceTypesResult.data || []);
      setGeographies(geographiesResult.data || []);
      setServiceCategories(categoriesResult.data || []);
      
      setMasterDataLoaded(true);
      console.log('Master data loading completed');
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
      console.log('=== LOADING QUOTE DATA ===');
      console.log('Deal ID:', dealId, 'Quote Name:', quoteName);
      
      // Load quote basic data
      console.log('Loading main quote data...');
      const { data: quoteResult, error: quoteError } = await supabase
        .from('Quotes')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName)
        .maybeSingle();

      if (quoteError) {
        console.error('Quote loading error:', quoteError);
        throw quoteError;
      }

      if (quoteResult) {
        console.log('Raw quote data from database:', quoteResult);
        
        const loadedQuoteData: QuoteData = {
          knowledge_transition_start_date: quoteResult.knowledge_transition_start_date ? new Date(quoteResult.knowledge_transition_start_date) : null,
          knowledge_transition_end_date: quoteResult.knowledge_transition_end_date ? new Date(quoteResult.knowledge_transition_end_date) : null,
          steady_state_start_date: quoteResult.steady_state_start_date ? new Date(quoteResult.steady_state_start_date) : null,
          steady_state_end_date: quoteResult.steady_state_end_date ? new Date(quoteResult.steady_state_end_date) : null,
          overall_duration_months: quoteResult.overall_duration_months,
          market_id: quoteResult.market_id,
          deal_discount_amount: quoteResult.deal_discount_amount,
          deal_discount_percent: quoteResult.deal_discount_percent,
          travel_percent: quoteResult.travel_percent,
          training_percent: quoteResult.training_percent,
          other_costs_percent: quoteResult.other_costs_percent,
          infrastructure_percent: quoteResult.infrastructure_percent,
          compliance_percent: quoteResult.compliance_percent,
          licenses_percent: quoteResult.licenses_percent,
        };
        
        console.log('Processed quote data:', loadedQuoteData);
        setQuoteData(loadedQuoteData);
      } else {
        console.log('No quote data found in database');
        setQuoteData(null);
      }

      // Load resource types
      console.log('Loading resource types...');
      const { data: resourceTypeResult, error: rtError } = await supabase
        .from('QuoteResourceType')
        .select('resource_type_id')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);

      if (rtError) {
        console.error('Resource type loading error:', rtError);
      } else {
        const loadedResourceTypes = resourceTypeResult?.map(rt => rt.resource_type_id) || [];
        console.log('Loaded resource types:', loadedResourceTypes);
        setSelectedResourceTypes(loadedResourceTypes);
      }

      // Load geographies
      console.log('Loading geographies...');
      const { data: geographyResult, error: geoError } = await supabase
        .from('QuoteGeography')
        .select('geography_id')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);

      if (geoError) {
        console.error('Geography loading error:', geoError);
      } else {
        const loadedGeographies = geographyResult?.map(g => g.geography_id) || [];
        console.log('Loaded geographies:', loadedGeographies);
        setSelectedGeographies(loadedGeographies);
      }

      // Load categories
      console.log('Loading categories...');
      const { data: categoryResult, error: catError } = await supabase
        .from('QuoteServiceCategory')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName)
        .maybeSingle();

      if (catError) {
        console.error('Category loading error:', catError);
      } else if (categoryResult) {
        const loadedCategories: SelectedCategories = {
          level1: categoryResult.category_level_1_id,
          level2: categoryResult.category_level_2_id,
          level3: categoryResult.category_level_3_id,
        };
        console.log('Loaded categories:', loadedCategories);
        setSelectedCategories(loadedCategories);
      } else {
        console.log('No categories found');
        setSelectedCategories(null);
      }

      // Load volume discounts
      console.log('Loading volume discounts...');
      const { data: volumeResult, error: volError } = await supabase
        .from('VolumeDiscount')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName)
        .order('range_start');

      if (volError) {
        console.error('Volume discount loading error:', volError);
      } else {
        const loadedVolumeDiscounts = volumeResult || [];
        console.log('Loaded volume discounts:', loadedVolumeDiscounts);
        setVolumeDiscounts(loadedVolumeDiscounts);
      }

      console.log('=== QUOTE DATA LOADING COMPLETED ===');

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

  // Load master data on mount
  useEffect(() => {
    console.log('useDealMasterData - Starting master data load');
    loadMasterData();
  }, [dealId, quoteName]);

  // Load quote data after master data is ready
  useEffect(() => {
    if (masterDataLoaded) {
      console.log('useDealMasterData - Master data ready, loading quote data');
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
