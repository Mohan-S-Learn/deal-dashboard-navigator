
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CostCategory } from '../../types';

export interface AddRevenueFormData {
  service_category_level_1_id: number | null;
  service_category_level_2_id: number | null;
  service_category_level_3_id: number | null;
  service_category_level_4_id: number | null;
  experience_years: number;
  cost_category_id: number | null;
  geography_id: number | null;
  benchmark_rate_usd_per_hour: number;
  cb_cost_usd_per_hour: number;
  margin_percent: number;
}

export const useAddRevenueForm = (costCategories: CostCategory[]) => {
  const [formData, setFormData] = useState<AddRevenueFormData>({
    service_category_level_1_id: null,
    service_category_level_2_id: null,
    service_category_level_3_id: null,
    service_category_level_4_id: null,
    experience_years: 1,
    cost_category_id: null,
    geography_id: null,
    benchmark_rate_usd_per_hour: 0,
    cb_cost_usd_per_hour: 0,
    margin_percent: 0,
  });

  // Auto-populate benchmark rates when service categories and resource skill change
  useEffect(() => {
    const fetchBenchmarkRates = async () => {
      if (!formData.service_category_level_4_id) {
        console.log('No resource skill selected, skipping benchmark rate fetch');
        return;
      }

      console.log('Fetching benchmark rates for:', {
        service_category_level_1_id: formData.service_category_level_1_id,
        service_category_level_2_id: formData.service_category_level_2_id,
        service_category_level_3_id: formData.service_category_level_3_id,
        service_category_level_4_id: formData.service_category_level_4_id,
        experience_years: formData.experience_years,
        geography_id: formData.geography_id
      });

      try {
        let query = supabase
          .from('BenchmarkRate')
          .select('*')
          .eq('service_category_level_4_id', formData.service_category_level_4_id)
          .eq('experience_years', formData.experience_years);

        if (formData.geography_id) {
          query = query.eq('geography_id', formData.geography_id);
        }

        if (formData.service_category_level_1_id) {
          query = query.eq('service_category_level_1_id', formData.service_category_level_1_id);
        }
        if (formData.service_category_level_2_id) {
          query = query.eq('service_category_level_2_id', formData.service_category_level_2_id);
        }
        if (formData.service_category_level_3_id) {
          query = query.eq('service_category_level_3_id', formData.service_category_level_3_id);
        }

        const { data: benchmarkRates, error } = await query;

        if (error) {
          console.error('Error fetching benchmark rates:', error);
          return;
        }

        console.log('Benchmark rate query result:', benchmarkRates);

        if (benchmarkRates && benchmarkRates.length > 0) {
          const rate = benchmarkRates[0];
          console.log('Auto-populating with rate:', rate);
          
          setFormData(prev => ({
            ...prev,
            benchmark_rate_usd_per_hour: rate.benchmark_rate_usd_per_hour || 0,
            cb_cost_usd_per_hour: rate.cb_cost_usd_per_hour || 0,
            margin_percent: rate.margin_percent || 0,
          }));
          
          console.log('Rates auto-populated successfully');
        } else {
          console.log('No matching benchmark rates found for the current selection');
          
          if (formData.geography_id) {
            console.log('Retrying without geography filter...');
            const { data: fallbackRates, error: fallbackError } = await supabase
              .from('BenchmarkRate')
              .select('*')
              .eq('service_category_level_4_id', formData.service_category_level_4_id)
              .eq('experience_years', formData.experience_years)
              .is('geography_id', null);

            if (!fallbackError && fallbackRates && fallbackRates.length > 0) {
              const rate = fallbackRates[0];
              console.log('Using fallback rate (no geography):', rate);
              
              setFormData(prev => ({
                ...prev,
                benchmark_rate_usd_per_hour: rate.benchmark_rate_usd_per_hour || 0,
                cb_cost_usd_per_hour: rate.cb_cost_usd_per_hour || 0,
                margin_percent: rate.margin_percent || 0,
              }));
            } else {
              console.log('No fallback rates found either');
            }
          }
        }
      } catch (error) {
        console.error('Error in fetchBenchmarkRates:', error);
      }
    };

    if (formData.service_category_level_4_id && formData.experience_years) {
      fetchBenchmarkRates();
    }
  }, [
    formData.service_category_level_4_id,
    formData.experience_years,
    formData.geography_id,
    formData.service_category_level_1_id,
    formData.service_category_level_2_id,
    formData.service_category_level_3_id
  ]);

  // Auto-set cost category when service category level 3 is selected
  useEffect(() => {
    if (formData.service_category_level_3_id) {
      const matchingCostCategory = costCategories.find(cc => 
        cc.service_category_level_3_id === formData.service_category_level_3_id
      );
      
      if (matchingCostCategory) {
        console.log('Auto-setting cost category to match service category level 3:', matchingCostCategory);
        setFormData(prev => ({
          ...prev,
          cost_category_id: matchingCostCategory.id
        }));
      }
    }
  }, [formData.service_category_level_3_id, costCategories]);

  const resetForm = () => {
    setFormData({
      service_category_level_1_id: null,
      service_category_level_2_id: null,
      service_category_level_3_id: null,
      service_category_level_4_id: null,
      experience_years: 1,
      cost_category_id: null,
      geography_id: null,
      benchmark_rate_usd_per_hour: 0,
      cb_cost_usd_per_hour: 0,
      margin_percent: 0,
    });
  };

  return { formData, setFormData, resetForm };
};
