
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { QuoteRevenue, CostCategory, BenchmarkRate } from '../types';
import { ServiceCategory, Geography } from '../../DealMaster/types';

export const useRevenueData = (dealId: string, quoteName: string) => {
  const [revenueData, setRevenueData] = useState<QuoteRevenue[]>([]);
  const [costCategories, setCostCategories] = useState<CostCategory[]>([]);
  const [serviceCategories, setServiceCategories] = useState<ServiceCategory[]>([]);
  const [geographies, setGeographies] = useState<Geography[]>([]);
  const [selectedGeographies, setSelectedGeographies] = useState<number[]>([]);
  const [benchmarkRates, setBenchmarkRates] = useState<BenchmarkRate[]>([]);
  const [loading, setLoading] = useState(true);

  const { toast } = useToast();

  const loadData = async () => {
    try {
      setLoading(true);

      // Load CostCategories
      const { data: costCategoriesData, error: costCategoriesError } = await supabase
        .from('CostCategory')
        .select('*')
        .order('name');

      if (costCategoriesError) throw costCategoriesError;

      // Load ServiceCategories
      const { data: serviceCategoriesData, error: serviceCategoriesError } = await supabase
        .from('ServiceCategory')
        .select('*')
        .order('level', { ascending: true });

      if (serviceCategoriesError) throw serviceCategoriesError;

      // Load Geographies
      const { data: geographiesData, error: geographiesError } = await supabase
        .from('Geography')
        .select('*')
        .order('country', { ascending: true });

      if (geographiesError) throw geographiesError;

      // Load selected geographies for this quote
      const { data: selectedGeographiesData, error: selectedGeographiesError } = await supabase
        .from('QuoteGeography')
        .select('geography_id')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);

      if (selectedGeographiesError) throw selectedGeographiesError;

      // Load BenchmarkRates
      const { data: benchmarkRatesData, error: benchmarkRatesError } = await supabase
        .from('BenchmarkRate')
        .select('*');

      if (benchmarkRatesError) throw benchmarkRatesError;

      // Load Revenue data for this quote
      const { data: revenueDataResult, error: revenueError } = await supabase
        .from('QuoteRevenue')
        .select('*')
        .eq('Deal_Id', dealId)
        .eq('Quote_Name', quoteName);

      if (revenueError) throw revenueError;

      setCostCategories(costCategoriesData || []);
      setServiceCategories(serviceCategoriesData || []);
      setGeographies(geographiesData || []);
      setSelectedGeographies(selectedGeographiesData?.map(g => g.geography_id) || []);
      setBenchmarkRates(benchmarkRatesData || []);
      setRevenueData(revenueDataResult || []);

    } catch (error) {
      console.error('Error loading revenue data:', error);
      toast({
        title: "Error",
        description: "Failed to load revenue data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dealId, quoteName]);

  return {
    revenueData,
    setRevenueData,
    costCategories,
    serviceCategories,
    geographies,
    selectedGeographies,
    benchmarkRates,
    loading,
    loadData
  };
};
